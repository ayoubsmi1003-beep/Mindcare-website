import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url),root=path.resolve(import.meta.dirname,'..'),cache=new Map();
function load(file){
 file=path.resolve(root,file);if(cache.has(file))return cache.get(file);
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 const mod={exports:{}};cache.set(file,mod.exports);
 const local=(id)=>id.startsWith('@/')?load(id.slice(2)+'.ts'):id.startsWith('.')?load(path.relative(root,path.resolve(path.dirname(file),id))+'.ts'):require(id);
 new Function('require','module','exports',code)(local,mod,mod.exports);return mod.exports;
}
const {preferenceBookingInput}=load('lib/booking-protocol.ts');
const {generateSlotsForDate}=load('lib/availability.ts');
test('15:30 is offered; Monday and Friday remain closed; no invented occupancy',()=>{
 const {slots}=generateSlotsForDate('2030-01-02');assert.equal(slots.length,15);assert.equal(slots[0].time,'08:30');assert.equal(slots.at(-1).time,'15:30');assert.equal(slots.every(s=>s.available),true);
 assert.equal(generateSlotsForDate('2030-01-07').isClosed,true);assert.equal(generateSlotsForDate('2030-01-04').isClosed,true);
 assert.equal(generateSlotsForDate('2020-01-01').slots.some(s=>s.available),false);
});
test('the actual submission maps full name/phone and drops motif and notes',()=>{
 const {bookingSubmission}=load('lib/booking-form.ts');
 const form={motif:'private medical reason',notes:'private health notes',patientName:'  Nadia   Ben Ali ',patientPhone:'0554 81 39 11',selectedDate:'2030-01-02',selectedTime:'15:30',consent:true,forWhom:'mon enfant',firstTime:true};
 const id={submissionId:'68d21960-f801-4f49-95b8-8f702a119bfd',token:'a'.repeat(64)};
 const result=bookingSubmission(form,id,'fr');assert.equal(result.firstName,'Nadia');assert.equal(result.lastName,'Ben Ali');assert.equal(result.phone,'+213554813911');assert.equal(result.preferredTime,'15:30');assert.equal(result.preferredPeriod,'afternoon');assert.equal('motif' in result,false);assert.equal('notes' in result,false);assert.equal('forWhom' in result,false);
 assert.equal(preferenceBookingInput.safeParse(result).success,true);
 assert.throws(()=>bookingSubmission({...form,patientName:'Nadia'},id,'fr'));
 assert.throws(()=>bookingSubmission({...form,patientPhone:'nonsense999999'},id,'fr'));
 assert.throws(()=>bookingSubmission({...form,consent:false},id,'fr'));
});
