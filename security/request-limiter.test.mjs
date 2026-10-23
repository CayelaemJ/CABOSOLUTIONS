import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createRequestLimiter } from './request-limiter.mjs';
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
