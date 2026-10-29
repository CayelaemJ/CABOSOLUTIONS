import {Container} from "@cloudflare/containers";
import {env as bindings} from "cloudflare:workers";
import {canServeCaboSite} from "./gate.mjs";
// CABO Solutions corporate site: original Node server + enquiry form/admin API.
export class CaboSiteContainer extends Container {
 defaultPort=3000;
 sleepAfter="20m";
 envVars={
  PORT:"3000",NODE_ENV:"production",
  DATABASE_URL:bindings.CABO_SITE_DATABASE_URL,
  ADMIN_API_TOKEN:bindings.CABO_SITE_ADMIN_API_TOKEN,
  RESEND_API_KEY:bindings.CABO_SITE_RESEND_API_KEY,
  MAIL_FROM:bindings.CABO_SITE_MAIL_FROM,
  NOTIFY_EMAIL:bindings.CABO_SITE_NOTIFY_EMAIL,
  PGSSLMODE:"require",
  CABO_DISABLE_RUNTIME_DDL:"true",
  ZOHO_SETUP_ENABLED:"false"
 };
}
export default {async fetch(request,env){
 const path=new URL(request.url);
 const gate=canServeCaboSite(env,path.hostname);
 if(path.pathname==="/__migration/status")
  return new Response(JSON.stringify({product:"CABO Solutions",backendReady:gate.ready,
    environment:"cloudflare-candidate"}),{headers:{"Cache-Control":"no-store","Content-Type":"application/json"}});
 if(!gate.ready)return new Response(JSON.stringify({error:"Full CABO Solutions API is not enabled"}),{status:503,headers:{"Cache-Control":"no-store","Content-Type":"application/json"}});
 try{return await env.CABO_SITE.getByName("main-site").fetch(request);}
 catch{return new Response(JSON.stringify({error:"Site temporarily unavailable"}),{status:503,headers:{"Cache-Control":"no-store","Content-Type":"application/json"}});
 }
}};
