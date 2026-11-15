import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CommandSchema, SignInSchema } from './commands.ts';
import { readJson, requireSameOrigin } from './request.ts';

const key = 'a5afefb1-f6d4-4c7e-b4fb-99efe8fe0c77';
const save = (kind, body, extra = {}) => ({ action: 'save', kind, body, idempotencyKey: key, ...extra });
test('patient commands refuse authority, identities, conversation injection and invalid dates', () => {
  for (const command of [save('treatment', {}), save('conversation', {messages: []}), save('journal', {situation:'a',emotion:'b',need:'c',helped:'d'}, {patientId:key}), save('checkin',{date:'2026-02-30'}), {action:'chat',text:'hi',provider:'gemini',idempotencyKey:key}]) {
    assert.equal(CommandSchema.safeParse(command).success, false);
  }
  assert.equal(CommandSchema.safeParse(save('checkin',{date:'2026-11-14',mood:'calm'})).success,true);
  assert.equal(CommandSchema.safeParse(save('checkin',{date:'2026-11-14'})).success,false);
  assert.equal(CommandSchema.safeParse(save('goal',{title:'Walk',origin:'doctor',completed:false})).success,false);
  assert.equal(CommandSchema.safeParse(save('adherence',{treatmentId:key,status:'taken'})).success,false);
  assert.equal(CommandSchema.safeParse(save('adherence',{treatmentId:key,treatmentVersion:1,status:'taken'})).success,true);
});
test('corrections require a version, sharing names one revision, passwords stay bounded', () => {
  assert.equal(CommandSchema.safeParse(save('adverse',{text:'test'},{id:key})).success,false);
  assert.equal(CommandSchema.safeParse(save('adverse',{text:'test'},{id:key,expectedVersion:1})).success,true);
  assert.equal(CommandSchema.safeParse({action:'share',id:key,shared:true,idempotencyKey:key}).success,false);
  assert.equal(SignInSchema.safeParse({phone:'+44 7700 900001',password:'01011990'}).success,true);
  assert.equal(SignInSchema.safeParse({phone:'+44 7700 900001',password:'x'.repeat(257)}).success,false);
});
test('mutations require exact origin and JSON is bounded by actual bytes', async () => {
  const request = (origin, body, type='application/json') => new Request('https://demo.example/api/sanad/command',{method:'POST',headers:{origin,'content-type':type},body});
  assert.doesNotThrow(()=>requireSameOrigin(request('https://demo.example','{}')));
  assert.throws(()=>requireSameOrigin(request('https://evil.example','{}')),/FORBIDDEN/);
  assert.throws(()=>requireSameOrigin(new Request('https://demo.example',{method:'POST'})),/FORBIDDEN/);
  await assert.rejects(readJson(request('https://demo.example','{"text":"ééé"}'),12),/INVALID_INPUT/);
  await assert.rejects(readJson(request('https://demo.example','{}','text/plain')),/INVALID_INPUT/);
  await assert.rejects(readJson(request('https://demo.example','{')),/INVALID_INPUT/);
  assert.deepEqual(await readJson(request('https://demo.example','{}')),{});
});
test('Next local URL normalization accepts the exact loopback Host only in development',()=>{
  const local=new Request('http://localhost:43862/api/sanad/sign-in',{method:'POST',headers:{host:'127.0.0.1:43862',origin:'http://127.0.0.1:43862'}});
  assert.doesNotThrow(()=>requireSameOrigin(local,true));
  assert.throws(()=>requireSameOrigin(local,false),/FORBIDDEN/);
  const spoof=new Request('http://localhost:43862/api/sanad/sign-in',{method:'POST',headers:{host:'evil.example',origin:'http://127.0.0.1:43862'}});
  assert.throws(()=>requireSameOrigin(spoof,true),/FORBIDDEN/);
});
