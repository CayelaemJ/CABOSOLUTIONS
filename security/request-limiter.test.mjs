import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createRequestLimiter } from './request-limiter.mjs';
import {readFileSync} from 'node:fs';
test('protects a public form and resets at the window boundary', () => {
  let at = 0;
  const limiter = createRequestLimiter({now:()=>at});
  const headers = {};
  const request = {socket:{remoteAddress:'192.0.2.10'},headers:{}};
  const response = {setHeader:(k,v)=>{headers[k]=v}};
  assert.equal(limiter(request,response,'form',2,60000),true);
  assert.equal(limiter(request,response,'form',2,60000),true);
  assert.equal(limiter(request,response,'form',2,60000),false);
  assert.equal(headers['Retry-After'],'60');
  at=60000;
  assert.equal(limiter(request,response,'form',2,60000),true);
});

test('spoofed leftmost XFF values cannot bypass a trusted single proxy',()=>{
 const previous=process.env.TRUST_PROXY_HOPS;
 process.env.TRUST_PROXY_HOPS='1';
 try{
   const limiter=createRequestLimiter();
   const res={setHeader:()=>{}};
   const req=(header)=>({socket:{remoteAddress:'10.0.0.7'},headers:{'x-forwarded-for':header}});
   assert.equal(limiter(req('203.0.113.50, 198.51.100.8'),res,'api',1,60000),true);
   assert.equal(limiter(req('203.0.113.51, 198.51.100.8'),res,'api',1,60000),false);
 }finally{if(previous===undefined)delete process.env.TRUST_PROXY_HOPS;else process.env.TRUST_PROXY_HOPS=previous;}
});
test('invalid forwarded IP falls back to the remote socket',()=>{
 const previous=process.env.TRUST_PROXY_HOPS;
 process.env.TRUST_PROXY_HOPS='1';
 try{
   const limiter=createRequestLimiter(),res={setHeader:()=>{}};
   const req=(forwarded)=>({socket:{remoteAddress:'10.0.0.7'},headers:{'x-forwarded-for':forwarded}});
   assert.equal(limiter(req('spoofed.example'),res,'form',1,60000),true);
   assert.equal(limiter(req('also-not-an-ip'),res,'form',1,60000),false);
 }finally{if(previous===undefined)delete process.env.TRUST_PROXY_HOPS;else process.env.TRUST_PROXY_HOPS=previous;}
});

test('Zoho OAuth setup is disabled before password processing and no global lockout exists',()=>{
 const source=readFileSync(new URL('../server.mjs',import.meta.url),'utf8');
 const handler=source.indexOf('async function handleZohoSetup(req, res)');
 const disabled=source.indexOf("if (process.env.ZOHO_SETUP_ENABLED !== 'true')",handler);
 const credential=source.indexOf('const expected = process.env.ZOHO_SETUP_PASSWORD',handler);
 assert.ok(handler>=0&&disabled>handler&&credential>disabled);
 assert.doesNotMatch(source,/setupAttempts/);
 assert.match(source,/path === '\/api\/zoho\/setup' \? allowRequest\(req,res,'zoho-setup',6,15\*60_000\)/);
});
