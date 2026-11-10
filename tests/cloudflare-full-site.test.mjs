import test from 'node:test';
import assert from 'node:assert/strict';
import {canServeCaboSite} from '../cloudflare/full-site/gate.mjs';
const env={CABO_SITE_BACKEND_ENABLED:'true',CABO_SITE_CANONICAL_HOST:'cabo.example.org',
 CABO_SITE:{getByName(){}},CABO_SITE_DATABASE_URL:'synthetic',CABO_SITE_ADMIN_API_TOKEN:'synthetic',
 CABO_SITE_RATE_LIMIT_TESTED:'true',CABO_SITE_NOTIFICATION_TESTED:'true'};
test('full CABO site requires DB, admin protection and tested notifications',()=>{
 assert.equal(canServeCaboSite(env,'cabo.example.org').ready,true);
 for(const k of ['CABO_SITE_BACKEND_ENABLED','CABO_SITE_DATABASE_URL','CABO_SITE_ADMIN_API_TOKEN','CABO_SITE_RATE_LIMIT_TESTED','CABO_SITE_NOTIFICATION_TESTED']){
  assert.equal(canServeCaboSite({...env,[k]:''},'cabo.example.org').ready,false,k);
 }
});
test('site hostname and container are exact and fail closed',()=>{
 assert.equal(canServeCaboSite(env,'other.example.org').ready,false);
 assert.equal(canServeCaboSite({...env,CABO_SITE:null},'cabo.example.org').ready,false);
 assert.equal(canServeCaboSite({},'cabo.example.org').ready,false);
});
