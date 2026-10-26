import {test} from "node:test";
import assert from "node:assert/strict";
import {matchesAdminBearer} from "./admin-auth.mjs";

test("only an exact configured admin bearer token is accepted",()=>{
  const secret="demo-security-test-only-token-12345";
  assert.equal(matchesAdminBearer("Bearer "+secret,secret),true);
  assert.equal(matchesAdminBearer("Bearer "+secret+"x",secret),false);
  assert.equal(matchesAdminBearer("Bearer "+secret.slice(0,-1),secret),false);
  assert.equal(matchesAdminBearer("Basic "+secret,secret),false);
  assert.equal(matchesAdminBearer(undefined,secret),false);
});
test("unconfigured tokens fail closed",()=>{
  assert.equal(matchesAdminBearer("Bearer token",""),false);
  assert.equal(matchesAdminBearer("Bearer token",undefined),false);
  assert.equal(matchesAdminBearer("Bearer ", "token"),false);
});
test("malformed multiple Authorization values are rejected",()=>{
  assert.equal(matchesAdminBearer("Bearer token, other","token"),false);
  assert.equal(matchesAdminBearer("Bearer token\r","token"),false);
});
