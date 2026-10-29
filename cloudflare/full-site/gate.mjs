export function canServeCaboSite(env,host){
 const failed=[];
 if(env.CABO_SITE_BACKEND_ENABLED!=="true")failed.push("backend");
 if(!env.CABO_SITE_CANONICAL_HOST||host!==env.CABO_SITE_CANONICAL_HOST)failed.push("host");
 if(!env.CABO_SITE?.getByName)failed.push("container");
 if(!env.CABO_SITE_DATABASE_URL)failed.push("database");
 if(!env.CABO_SITE_ADMIN_API_TOKEN)failed.push("admin-secret");
 if(env.CABO_SITE_RATE_LIMIT_TESTED!=="true")failed.push("rate-limit");
 if(env.CABO_SITE_NOTIFICATION_TESTED!=="true")failed.push("notification");
 return {ready:failed.length===0,failed};
}
