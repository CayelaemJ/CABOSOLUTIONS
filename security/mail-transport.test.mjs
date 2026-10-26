import test from 'node:test';
import assert from 'node:assert/strict';
import nodemailer from 'nodemailer';

test('supported Nodemailer transport still sends an in-memory message without network', async ()=>{
 const transport=nodemailer.createTransport({streamTransport:true,buffer:true,newline:'unix'});
 try {
  const info=await transport.sendMail({
   from:'no-reply@example.invalid',to:'recipient@example.invalid',
   subject:'CABO internal transport compatibility',
   text:'No real notification or credentials'
  });
  assert.ok(Buffer.isBuffer(info.message));
  assert.match(info.message.toString(),/CABO internal transport compatibility/);
 } finally {transport.close();}
});
