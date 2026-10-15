import http from 'node:http';
import { randomBytes, createCipheriv, createDecipheriv, timingSafeEqual } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';

const port = Number(process.env.PORT || 3000);
const dist = resolve('dist');
const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: true } : undefined }) : null;
const mime = { '.html':'text/html; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon', '.woff2':'font/woff2' };
const json = (res,status,payload) => { res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(payload)); };
const readJson = async req => { let data=''; for await (const chunk of req) { data+=chunk; if (data.length>12000) throw new Error('Request too large'); } return JSON.parse(data); };
const schema = `CREATE TABLE IF NOT EXISTS cabo_enquiries (id BIGSERIAL PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), name TEXT NOT NULL, email TEXT NOT NULL, organisation TEXT, service TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
let ready = null;
async function db() { if (!pool) throw new Error('DATABASE_URL is not configured'); if (!ready) ready=pool.query(schema).catch(e=>{ready=null;throw e}); await ready; return pool; }
let zohoToken = null;
let zohoTokenExpires = 0;
async function zohoRequest(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(12000) });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.status?.code >= 400) throw new Error('Zoho API request failed: ' + (payload.status?.code || response.status));
  return payload;
}
async function getZohoAccessToken() {
  if (zohoToken && Date.now() < zohoTokenExpires) return zohoToken;
  const required = ['ZOHO_CLIENT_ID','ZOHO_CLIENT_SECRET'];
  if (required.some(name => !process.env[name])) throw new Error('Zoho OAuth credentials are not configured');
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN || await savedZohoRefreshToken();
  if (!refreshToken) throw new Error('Zoho refresh token not configured');
  const url = new URL('/oauth/v2/token', process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com');
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    refresh_token: refreshToken,
  });
  const response = await zohoRequest(url.toString(), { method: 'POST', body: params });
  if (!response.access_token) throw new Error('Zoho did not issue an access token');
  zohoToken = response.access_token;
  zohoTokenExpires = Date.now() + Math.max(60, (Number(response.expires_in) || 3600) - 120) * 1000;
  return zohoToken;
}
async function sendZohoMail(recipient, subject, content) {
  const accessToken = await getZohoAccessToken();
  const base = process.env.ZOHO_MAIL_API_URL || 'https://mail.zoho.com';
  const headers = { Authorization: 'Zoho-oauthtoken ' + accessToken, Accept: 'application/json' };
  let accountId = process.env.ZOHO_MAIL_ACCOUNT_ID;
  if (!accountId) {
    const accounts = await zohoRequest(base + '/api/accounts', { headers });
    const entry = accounts.data?.find(item =>
      item.primaryEmailAddress?.toLowerCase() === process.env.ZOHO_FROM_EMAIL?.toLowerCase() ||
      item.emailAddress?.toLowerCase() === process.env.ZOHO_FROM_EMAIL?.toLowerCase()
    );
    accountId = entry?.accountId;
    if (!accountId) throw new Error('Zoho sending account not found');
  }
  const data = await zohoRequest(base + '/api/accounts/' + encodeURIComponent(accountId) + '/messages', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromAddress: process.env.ZOHO_FROM_EMAIL,
      toAddress: recipient,
      subject,
      content,
      mailFormat: 'plaintext'
    })
  });
  console.info('Zoho HTTPS enquiry notification accepted');
  return data;
}
async function notify(enquiry) {
  const recipient = process.env.NOTIFY_EMAIL;
  const subject = 'New CABO Solutions enquiry';
  const text = `New enquiry
Name: ${enquiry.name}
Email: ${enquiry.email}
Organisation: ${enquiry.org}
Service: ${enquiry.service}

${enquiry.message}`;
  if (!recipient) {
    console.warn('Enquiry notification recipient is not configured');
    return 'not_configured';
  }
  if (process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_FROM_EMAIL) {
    await sendZohoMail(recipient, subject, text);
    return 'sent';
  }
  // Prefer CABO's existing authenticated Zoho mailbox to avoid requiring a second sending domain.
  if (process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.SMTP_HOST) {
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      connectionTimeout: 12000,
      greetingTimeout: 12000,
      socketTimeout: 15000,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipient,
      replyTo: enquiry.email,
      subject,
      text,
    });
    console.info('Enquiry notification accepted by SMTP server');
    return 'sent';
  }
  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM) {
    console.warn('Enquiry email notification is not configured; enquiry is saved without email alert');
    return 'not_configured';
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.MAIL_FROM, to: [recipient], subject, text }),
  });
  if (!response.ok) throw new Error('Notification provider returned ' + response.status);
  return 'sent';
}


// Encrypted persistent OAuth token; never store the refresh token in plaintext or send it to the browser.
const zohoTokenSchema = 'CREATE TABLE IF NOT EXISTS cabo_oauth_tokens (provider TEXT PRIMARY KEY, token_encrypted TEXT NOT NULL, updated_at TIMESTAMPTZ DEFAULT NOW())';
function tokenKey() {
  const raw = process.env.ZOHO_TOKEN_ENCRYPTION_KEY;
  if (!raw || !/^[a-f0-9]{64}$/i.test(raw)) throw new Error('OAuth encryption key missing');
  return Buffer.from(raw, 'hex');
}
function encryptToken(value) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', tokenKey(), iv);
  const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), data].map(part => part.toString('base64')).join('.');
}
function decryptToken(value) {
  const [iv, tag, data] = value.split('.').map(part => Buffer.from(part, 'base64'));
  if (iv.length !== 12 || tag.length !== 16) throw new Error('Invalid encrypted token');
  const cipher = createDecipheriv('aes-256-gcm', tokenKey(), iv, { authTagLength: 16 });
  cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(data), cipher.final()]).toString('utf8');
}
async function savedZohoRefreshToken() {
  const connection = await db();
  await connection.query(zohoTokenSchema);
  const result = await connection.query("SELECT token_encrypted FROM cabo_oauth_tokens WHERE provider='zoho' LIMIT 1");
  return result.rows.length ? decryptToken(result.rows[0].token_encrypted) : null;
}
let setupAttempts = [];
async function handleZohoSetup(req, res) {
  const now = Date.now();
  setupAttempts = setupAttempts.filter(time => now - time < 15 * 60 * 1000);
  if (setupAttempts.length >= 5) return json(res,429,{error:'Too many attempts. Please retry later.'});
  let payload;
  try { payload = await readJson(req); } catch { return json(res,400,{error:'Invalid request'}); }
  const expected = process.env.ZOHO_SETUP_PASSWORD || '';
  const actual = typeof payload?.password === 'string' ? payload.password : '';
  const a = Buffer.from(expected); const b = Buffer.from(actual);
  if (!expected || a.length !== b.length || !timingSafeEqual(a,b)) {
    setupAttempts.push(now);
    return json(res,401,{error:'Invalid setup password'});
  }
  if (!process.env.ZOHO_SETUP_ENABLED || process.env.ZOHO_SETUP_ENABLED !== 'true') return json(res,403,{error:'Setup disabled'});
  if (!/^[a-zA-Z0-9._-]{15,250}$/.test(payload?.code || '')) return json(res,422,{error:'Invalid authorisation code'});
  try {
    const body = new URLSearchParams({
      grant_type:'authorization_code',
      client_id:process.env.ZOHO_CLIENT_ID,
      client_secret:process.env.ZOHO_CLIENT_SECRET,
      code:payload.code
    });
    const response = await fetch(new URL('/oauth/v2/token', process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com'), {
      method:'POST', body, signal:AbortSignal.timeout(12000)
    });
    const data = await response.json();
    if (!response.ok || !data.refresh_token) {
      console.error('Zoho code exchange failed:',data.error || response.status);
      return json(res,400,{error:'Zoho rejected the code. Generate a fresh code with the required scopes.'});
    }
    const connection = await db();
    await connection.query(zohoTokenSchema);
    await connection.query("INSERT INTO cabo_oauth_tokens (provider,token_encrypted) VALUES ('zoho',$1) ON CONFLICT (provider) DO UPDATE SET token_encrypted=$1,updated_at=NOW()",[encryptToken(data.refresh_token)]);
    zohoToken = null; zohoTokenExpires = 0;
    console.info('Zoho OAuth refresh token stored encrypted');
    return json(res,200,{configured:true});
  } catch(err) {
    console.error('Zoho setup failed:',err.message);
    return json(res,503,{error:'Unable to complete setup; check Railway logs'});
  }
}
const setupPage = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CABO Zoho Setup</title><style>body{font:16px system-ui;background:#101316;color:#f5f2ed;max-width:480px;margin:12vh auto;padding:22px}input,button{box-sizing:border-box;display:block;width:100%;padding:15px;margin:12px 0;border-radius:8px;border:1px solid #888;background:#24292e;color:white}button{background:#a96b4a;border:0;font-weight:bold}p{line-height:1.5}</style><h1>CABO Zoho setup</h1><p>Generate a fresh code in Zoho Self Client with the ZohoMail.messages.CREATE and ZohoMail.accounts.READ scopes, then paste it below. The code is exchanged privately and the refresh token is encrypted in PostgreSQL.</p><form id="f"><label>Setup password<input type="password" name="password" required autocomplete="off"></label><label>Fresh authorisation code<input type="text" name="code" required autocomplete="off"></label><button>Connect Zoho</button></form><p id="msg" role="status"></p><script>document.getElementById('f').onsubmit=async e=>{e.preventDefault();const f=e.target,b=f.querySelector('button');b.disabled=true;document.getElementById('msg').textContent='Connecting…';try{const r=await fetch('/api/zoho/setup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(f)))});const d=await r.json();document.getElementById('msg').textContent=r.ok?'Zoho connected. You may close this page.':(d.error||'Setup failed');if(r.ok)f.reset()}catch{document.getElementById('msg').textContent='Network error'}finally{b.disabled=false}}</script></html>`;

async function api(req,res,path) {
  if (path==='/api/zoho/setup' && req.method==='POST') return handleZohoSetup(req,res);
  if (path==='/api/health' && req.method==='GET') return json(res,200,{status:'ok',databaseConfigured:!!pool});
  if (path==='/api/enquiries' && req.method==='POST') {
    let payload; try {payload=await readJson(req);} catch {return json(res,400,{error:'Invalid request body'});}
    const {name,email,org='',service,message,website=''}=payload || {};
    if(website) return json(res,200,{received:true});
    if(typeof name!=='string'||name.trim().length<2||name.length>120||typeof email!=='string'||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof org!=='string'||org.length>200||typeof service!=='string'||!service.trim()||service.length>160||typeof message!=='string'||message.trim().length<10||message.length>5000) return json(res,422,{error:'Please complete all required fields with valid information.'});
    if(!pool) return json(res,503,{error:'Enquiries are temporarily unavailable. Please email cayelaem@cabosolutionsza.cloud-ip.cc.'});
    const enquiry={name:name.trim(),email:email.trim(),org:org.trim(),service:service.trim(),message:message.trim()};
    try {
      const client=await db();
      const result=await client.query('INSERT INTO cabo_enquiries (name,email,organisation,service,message) VALUES ($1,$2,$3,$4,$5) RETURNING id',[enquiry.name,enquiry.email,enquiry.org,enquiry.service,enquiry.message]);
      try {await notify(enquiry);} catch(err) {console.error('Enquiry saved, notification failed:',err.message);}
      return json(res,201,{received:true,reference:String(result.rows[0].id)});
    } catch(err) {console.error('Enquiry storage unavailable:',err.message);return json(res,503,{error:'Unable to save enquiry at present. Please contact us by email.'});}
  }
  if(path==='/api/admin/enquiries' && req.method==='GET') {
    const token=req.headers.authorization?.replace(/^Bearer /,'');
    if(!process.env.ADMIN_API_TOKEN || token!==process.env.ADMIN_API_TOKEN) return json(res,401,{error:'Unauthorized'});
    try {const result=await (await db()).query('SELECT id,created_at,name,email,organisation,service,message,status,updated_at FROM cabo_enquiries ORDER BY created_at DESC LIMIT 200');return json(res,200,{enquiries:result.rows});}
    catch {return json(res,503,{error:'Enquiry database unavailable'});}
  }
  if(path.startsWith('/api/admin/enquiries/') && req.method==='PATCH') {
    const token=req.headers.authorization?.replace(/^Bearer /,'');
    if(!process.env.ADMIN_API_TOKEN || token!==process.env.ADMIN_API_TOKEN) return json(res,401,{error:'Unauthorized'});
    const id=path.split('/').pop();
    let body;try{body=await readJson(req);}catch{return json(res,400,{error:'Invalid request'});}
    if(!/^\d+$/.test(id)||!['new','contacted','in_progress','closed'].includes(body?.status))return json(res,422,{error:'Invalid status'});
    try{const result=await(await db()).query('UPDATE cabo_enquiries SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING id,status',[body.status,id]);return result.rowCount?json(res,200,result.rows[0]):json(res,404,{error:'Not found'});}catch{return json(res,503,{error:'Database unavailable'});}
  }
  json(res,404,{error:'Not found'});
}
http.createServer(async(req,res)=>{
  let path;try{path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return json(res,400,{error:'Bad URL'});}
  if(path.startsWith('/api/')) return api(req,res,path);
  if(path==='/zoho-setup' && req.method==='GET') { if(process.env.ZOHO_SETUP_ENABLED!=='true') return json(res,404,{error:'Not found'});res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; form-action 'self'"});return res.end(setupPage); }
  if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Method not allowed'});
  if(path.includes('\0')||path.split('/').includes('..'))return json(res,400,{error:'Bad path'});
  let file=resolve(dist,'.'+path); if(!file.startsWith(dist+sep)&&file!==dist)return json(res,403,{error:'Forbidden'});
  try { if (!(await stat(file)).isFile()) file = resolve(dist, 'index.html'); } catch { if (extname(path)) return json(res,404,{error:'Asset not found'}); file=resolve(dist,'index.html'); }
  try {const body=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':file.endsWith('index.html')?'no-cache':'public, max-age=3600','Vary':'Accept-Encoding'});res.end(req.method==='HEAD'?undefined:body);}
  catch{json(res,503,{error:'Site build not available'});}
}).listen(port,'0.0.0.0',()=>console.log('CABO site listening on '+port));
