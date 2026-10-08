import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { Pool } from 'pg';

const port = Number(process.env.PORT || 3000);
const dist = resolve('dist');
const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined }) : null;
const mime = { '.html':'text/html; charset=utf-8', '.js':'application/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.ico':'image/x-icon', '.woff2':'font/woff2' };
const json = (res,status,payload) => { res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(payload)); };
const readJson = async req => { let data=''; for await (const chunk of req) { data+=chunk; if (data.length>12000) throw new Error('Request too large'); } return JSON.parse(data); };
const schema = `CREATE TABLE IF NOT EXISTS cabo_enquiries (id BIGSERIAL PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), name TEXT NOT NULL, email TEXT NOT NULL, organisation TEXT, service TEXT NOT NULL, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
let ready = null;
async function db() { if (!pool) throw new Error('DATABASE_URL is not configured'); if (!ready) ready=pool.query(schema).catch(e=>{ready=null;throw e}); await ready; return pool; }
async function notify(enquiry) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL || !process.env.MAIL_FROM) return 'not_configured';
  const body = {from:process.env.MAIL_FROM,to:[process.env.NOTIFY_EMAIL],subject:'New CABO Solutions enquiry',text:`New enquiry\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nOrganisation: ${enquiry.org}\nService: ${enquiry.service}\n\n${enquiry.message}`};
  const response = await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!response.ok) throw new Error('Notification provider returned '+response.status);
  return 'sent';
}
async function api(req,res,path) {
  if (path==='/api/health' && req.method==='GET') return json(res,200,{status:'ok',databaseConfigured:!!pool});
  if (path==='/api/enquiries' && req.method==='POST') {
    let payload; try {payload=await readJson(req);} catch {return json(res,400,{error:'Invalid request body'});}
    const {name,email,org='',service,message,website=''}=payload || {};
    if(website) return json(res,200,{received:true});
    if(typeof name!=='string'||name.trim().length<2||name.length>120||typeof email!=='string'||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof org!=='string'||org.length>200||typeof service!=='string'||!service.trim()||service.length>160||typeof message!=='string'||message.trim().length<10||message.length>5000) return json(res,422,{error:'Please complete all required fields with valid information.'});
    if(!pool) return json(res,503,{error:'Enquiries are temporarily unavailable. Please email hello@cabosolutions.co.za.'});
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
  if(req.method!=='GET'&&req.method!=='HEAD')return json(res,405,{error:'Method not allowed'});
  if(path.includes('\0')||path.split('/').includes('..'))return json(res,400,{error:'Bad path'});
  let file=resolve(dist,'.'+path); if(!file.startsWith(dist+sep)&&file!==dist)return json(res,403,{error:'Forbidden'});
  try{if(!(await stat(file)).isFile())file=resolve(dist,'index.html');}catch{file=resolve(dist,'index.html');}
  try {const body=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':file.endsWith('index.html')?'no-cache':'public, max-age=3600'});res.end(req.method==='HEAD'?undefined:body);}
  catch{json(res,503,{error:'Site build not available'});}
}).listen(port,'0.0.0.0',()=>console.log('CABO site listening on '+port));
