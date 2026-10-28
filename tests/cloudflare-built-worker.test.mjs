import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';

const worker = (await import('../cloudflare-output/cabo-site.worker.js')).default;
const assets = JSON.parse(fs.readFileSync('cloudflare-output/site-assets.json', 'utf8')).assets;
const url = path => 'https://cabo-site-self-contained.example.test' + path;

test('root is genuine Vite-built HTML, no Render fetch, and no public indexing', async () => {
  const old=globalThis.fetch;
  globalThis.fetch=()=>{throw new Error('Static assets must never call Render');};
  try {
    const r=await worker.fetch(new Request(url('/'), {headers:{'Accept-Encoding':'gzip'}}));
    assert.equal(r.status,200);
    assert.equal(r.headers.get('content-encoding'),null);
    assert.match(r.headers.get('x-robots-tag'),/noindex/);
    const html=await r.text();
    assert.match(html,/CABO Solutions/);
    assert.match(html,/\/assets\/index-/);
    const script=Object.keys(assets).find(x=>x.endsWith('.js'));
    const s=await worker.fetch(new Request(url(script), {headers:{'Accept-Encoding':'gzip'}}));
    assert.equal(s.status,200);
    assert.match(s.headers.get('content-type'),/javascript/);
    assert.equal(s.headers.get('content-encoding'),null);
    assert.ok((await s.text()).length>10000);
  } finally {globalThis.fetch=old;}
});

test('unsupported paths never reveal private APIs, even with unusual methods', async () => {
  for(const p of ['/api/admin/enquiries','/zoho-setup','/random','/assets/../../secret']) {
    const r=await worker.fetch(new Request(url(p)));
    assert.equal(r.status,404,p);
  }
  const post=await worker.fetch(new Request(url('/'),{method:'POST'}));
  assert.equal(post.status,405);
});

test('public enquiry uses only fixed origin, excludes cookies/auth and remains uncached', async () => {
  const old=globalThis.fetch;
  let upstream;
  globalThis.fetch=async (url,init)=>{
    upstream={url,init};
    return Response.json({reference:'SYNTHETIC'}, {status:201});
  };
  try{
    const r=await worker.fetch(new Request(url('/api/enquiries'),{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Cookie':'should-not-forward',
        'Authorization':'Bearer should-not-forward'
      },
      body:JSON.stringify({name:'Synthetic Demo',email:'synthetic@example.test'})
    }));
    assert.equal(r.status,201);
    assert.equal(upstream.url,'https://cabo-solutions-site.onrender.com/api/enquiries');
    assert.equal(upstream.init.headers.Authorization,undefined);
    assert.equal(upstream.init.headers.Cookie,undefined);
    assert.equal(r.headers.get('cache-control'),'no-store');
  }finally{globalThis.fetch=old;}
});

test('public enquiry rejects non-JSON and oversized bodies without network', async()=>{
  const old=globalThis.fetch;
  globalThis.fetch=()=>{throw new Error('Unexpected network call');};
  try{
    let r=await worker.fetch(new Request(url('/api/enquiries'),{method:'POST',body:'bad',headers:{'Content-Type':'text/plain'}}));
    assert.equal(r.status,415);
    r=await worker.fetch(new Request(url('/api/enquiries'),{method:'POST',body:'x'.repeat(33000),headers:{'Content-Type':'application/json'}}));
    assert.equal(r.status,413);
  }finally{globalThis.fetch=old;}
});
