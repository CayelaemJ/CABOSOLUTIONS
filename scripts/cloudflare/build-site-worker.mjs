// Generated edge Worker only serves the compiled Vite public release.
// It intentionally cannot read Render's server secrets, admin routes or database.
import fs from 'node:fs';
import path from 'node:path';

const manifest=JSON.parse(fs.readFileSync('cloudflare-output/site-assets.json','utf8'));
if(manifest.format!=='cabo-cloudflare-gzip-static-assets-v1')throw new Error('Unrecognized asset format');
if(!manifest.assets?.['/index.html'])throw new Error('Missing entrypoint');

const worker=`// GENERATED from verified public assets. DO NOT manually edit this file.
const STATIC_ASSETS = ${JSON.stringify(manifest.assets)};
const RENDER_API_ORIGIN = 'https://cabo-solutions-site.onrender.com';
const STANDARD_SECURITY = {
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
};
const errorResponse=(status,message)=>new Response(JSON.stringify({error:message}),{
 status,headers:{...STANDARD_SECURITY,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}
});
function decode(base64) {
 const bin=atob(base64);
 const output=new Uint8Array(bin.length);
 for(let i=0;i<bin.length;i++)output[i]=bin.charCodeAt(i);
 return output;
}
async function assetResponse(request, path) {
 const asset=STATIC_ASSETS[path];
 if(!asset)return new Response('Not found',{status:404,headers:STANDARD_SECURITY});
 const headers={
   ...STANDARD_SECURITY,
   'Content-Type': asset.mime,
   'Cache-Control':path==='/index.html'?'public, max-age=60':path.startsWith('/assets/')?'public, max-age=31536000, immutable':'public, max-age=86400',
   'Vary':'Accept-Encoding'
 };
 const bytes=decode(asset.gzipBase64);
 if(request.headers.get('accept-encoding')?.includes('gzip')){
   headers['Content-Encoding']='gzip';
   return new Response(request.method==='HEAD'?null:bytes,{headers});
 }
 // Gracefully serve uncommon clients which don't accept gzip.
 const decompressed=new Response(bytes).body.pipeThrough(new DecompressionStream('gzip'));
 return new Response(request.method==='HEAD'?null:decompressed,{headers});
}
async function enquiryApi(request,path){
 if(path==='/api/health'&&request.method==='GET') {
   try {
     const r=await fetch(RENDER_API_ORIGIN+path,{redirect:'manual',cf:{cacheTtl:0}});
     if(r.status>=300&&r.status<400)return errorResponse(502,'Unexpected API redirect');
     return new Response(r.body,{status:r.status,headers:{...STANDARD_SECURITY,'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
   }catch{return errorResponse(502,'Existing API unavailable');}
 }
 if(path!=='/api/enquiries'||request.method!=='POST')return errorResponse(404,'Not found');
 if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return errorResponse(415,'Expected JSON');
 const declared=Number(request.headers.get('content-length')||0);
 if(!Number.isFinite(declared)||declared>32768)return errorResponse(413,'Request too large');
 try{
   const body=await request.arrayBuffer();
   if(body.byteLength>32768)return errorResponse(413,'Request too large');
   const upstream=await fetch(RENDER_API_ORIGIN+path,{
     method:'POST',body,redirect:'manual',headers:{'Content-Type':'application/json'},
     cf:{cacheTtl:0}
   });
   if(upstream.status>=300&&upstream.status<400)return errorResponse(502,'Unexpected API redirect');
   const headers={...STANDARD_SECURITY,'Cache-Control':'no-store','Content-Type':upstream.headers.get('content-type')||'application/json; charset=utf-8'};
   if(upstream.headers.get('retry-after'))headers['Retry-After']=upstream.headers.get('retry-after');
   return new Response(upstream.body,{status:upstream.status,headers});
 }catch{return errorResponse(502,'Enquiry service temporarily unavailable');}
}
export default {
 async fetch(request){
   const url=new URL(request.url);
   const path=url.pathname;
   if(path.startsWith('/api/'))return enquiryApi(request,path);
   if(!['GET','HEAD'].includes(request.method))return errorResponse(405,'Method not allowed');
   return assetResponse(request,path==='/'?'/index.html':path);
 }
};
`;
const output=path.resolve('cloudflare-output/cabo-site.worker.js');
fs.writeFileSync(output,worker);
console.log('Generated Cloudflare Worker from',Object.keys(manifest.assets).length,'assets. Bytes:',fs.statSync(output).size);
