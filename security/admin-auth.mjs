import {createHash,timingSafeEqual} from "node:crypto";

/** Validate a server-configured bearer secret without value-dependent string comparison. */
export function matchesAdminBearer(header,configuredToken){
  if(typeof configuredToken!=="string"||configuredToken.length===0||
     typeof header!=="string"||!header.startsWith("Bearer "))return false;
  const presented=header.slice(7);
  if(!presented||presented.includes(",")||presented.includes("\n")||presented.includes("\r"))return false;
  const actual=createHash("sha256").update(presented,"utf8").digest();
  const expected=createHash("sha256").update(configuredToken,"utf8").digest();
  return timingSafeEqual(actual,expected);
}
