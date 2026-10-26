import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {readBoundedJson} from './request-body.mjs';

test('parses split valid JSON without corrupting multibyte characters',async()=>{
 const bytes=Buffer.from(JSON.stringify({name:'Bokamoso · Gaborone'}));
 const result=await readBoundedJson(Readable.from([bytes.subarray(0,17),bytes.subarray(17,18),bytes.subarray(18)]));
 assert.equal(result.name,'Bokamoso · Gaborone');
});
test('limits UTF-8 bytes rather than only JavaScript string length',async()=>{
 const oversized=JSON.stringify({note:'é'.repeat(6500)});
 await assert.rejects(()=>readBoundedJson(Readable.from([Buffer.from(oversized)])),/Request too large/);
});
test('accepts exact byte limit and rejects the following byte',async()=>{
 const input=JSON.stringify({note:'a'.repeat(20)});
 assert.deepEqual(await readBoundedJson(Readable.from([Buffer.from(input)]),Buffer.byteLength(input)),{note:'a'.repeat(20)});
 await assert.rejects(()=>readBoundedJson(Readable.from([Buffer.from(input)]),Buffer.byteLength(input)-1),/Request too large/);
});
test('rejects malformed JSON without returning a parsed object',async()=>{
 await assert.rejects(()=>readBoundedJson(Readable.from(['{not json}'])),SyntaxError);
});
