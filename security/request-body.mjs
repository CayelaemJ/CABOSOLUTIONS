/** Parse bounded JSON input without allocating a joined untrusted body first. */
export async function readBoundedJson(stream, maxBytes = 12000) {
 let size=0;
 const buffers=[];
 for await (const part of stream) {
  const chunk=Buffer.isBuffer(part)?part:Buffer.from(part);
  size+=chunk.byteLength;
  if(size>maxBytes)throw new Error('Request too large');
  buffers.push(chunk);
 }
 return JSON.parse(Buffer.concat(buffers,size).toString('utf8'));
}
