// Produce a portable, cryptographically checked asset bundle of the Vite build.
// The file contains only browser-published bytes. NEVER include server secrets,
// source maps, or files outside dist/. Keep as a staging artifact until reviewed.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';

const root=path.resolve('dist');
const out=path.resolve('cloudflare-output/site-assets.json');
const mime={
  '.html':'text/html; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.webmanifest':'application/manifest+json',
  '.svg':'image/svg+xml',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.webp':'image/webp',
  '.woff2':'font/woff2',
  '.ico':'image/x-icon',
};
const entries={};
let total=0;
function visit(dir) {
  for(const name of fs.readdirSync(dir).sort()) {
    const abs=path.join(dir,name);
    const info=fs.lstatSync(abs);
    if(info.isSymbolicLink())throw new Error('Symlink forbidden in deployment: '+name);
    if(info.isDirectory()){visit(abs);continue;}
    if(!info.isFile())throw new Error('Unexpected build file: '+name);
    const relative=path.relative(root,abs).split(path.sep).join('/');
    if(relative.startsWith('../')||relative.includes('..')||relative.startsWith('.'))throw new Error('Unsafe asset path');
    if(relative.endsWith('.map'))throw new Error('Source maps prohibited in public Worker bundle');
    const extension=path.extname(relative).toLowerCase();
    const type=mime[extension];
    if(!type)throw new Error('Unreviewed asset MIME type: '+relative);
    const raw=fs.readFileSync(abs);
    total+=raw.length;
    const compressed=zlib.gzipSync(raw,{level:9});
    entries['/'+relative]={
      mime:type,bytes:raw.length,
      sha256:crypto.createHash('sha256').update(raw).digest('hex'),
      gzipBase64:compressed.toString('base64'),
    };
  }
}
visit(root);
if(!entries['/index.html']||!Object.keys(entries).some(p=>p.endsWith('.js')))throw new Error('Incomplete Vite build');
if(total>3_000_000)throw new Error('Reject oversized Worker bundle');
const bundle={
  format:'cabo-cloudflare-gzip-static-assets-v1',
  sourceCommit:process.env.GITHUB_SHA||'local',
  generatedAt:new Date().toISOString(),
  assets:entries
};
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,JSON.stringify(bundle));
console.log('Prepared',Object.keys(entries).length,'static assets; raw bytes',total,'manifest bytes',fs.statSync(out).size);
