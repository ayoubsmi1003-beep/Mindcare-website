import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url),root=path.resolve(import.meta.dirname,'..'),cache=new Map();
function load(file){
 file=path.resolve(root,file);if(!path.extname(file))file+=fs.existsSync(file+'.tsx')?'.tsx':'.ts';
 if(cache.has(file))return cache.get(file);
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const loaded={exports:{}};cache.set(file,loaded.exports);
 const local=(id)=>id.startsWith('@/')?load(id.slice(2)):id.startsWith('.')?load(path.relative(root,path.resolve(path.dirname(file),id))):require(id);
 new Function('require','module','exports',code)(local,loaded,loaded.exports);return loaded.exports;
}
const {AppProvider}=load('lib/app-context.tsx');
const render=(component,props)=>renderToStaticMarkup(React.createElement(AppProvider,null,React.createElement(component,props)));
test('current time cards retain 15:30 and clearly describe a preference',()=>{
 const {StepSlot}=load('components/booking/StepSlot.tsx');
 const html=render(StepSlot,{selectedDate:'',selectedTime:'',onSelectSlot(){}});
 assert.match(html,/>15:30<\/button>/);assert.match(html,/horaire préféré/);assert.match(html,/appelle pour confirmer/);assert.match(html,/grid-cols-3 sm:grid-cols-5/);assert.doesNotMatch(html,/créneaux libres/);
});
test('queued receipt cannot display booked, promised messages or calendar download',()=>{
 const {BookingSuccess}=load('components/booking/BookingSuccess.tsx');
 const receipt={submissionId:'68d21960-f801-4f49-95b8-8f702a119bfd',delivery:{state:'QUEUED',acceptedAt:'2030-01-01T00:00:00Z',expiresAt:'2030-01-04T00:00:00Z'},booking:null};
 const html=render(BookingSuccess,{confirmation:{referenceId:receipt.submissionId,patientName:'Test Name',patientPhone:'+213555555555',motif:'local only',date:'2030-01-02',time:'15:30',receipt},onClose(){},onRefresh(){},isRefreshing:false,token:'a'.repeat(64)});
 assert.match(html,/Demande en file d’attente/);assert.match(html,/ne confirme aucun créneau/);assert.match(html,/Actualiser la demande/);assert.match(html,new RegExp('/booking#receipt='+'a'.repeat(64)));assert.doesNotMatch(html,/booking\?receipt/);assert.doesNotMatch(html,/C&#x27;est confirmé|a bien été enregistré|STATUS:CONFIRMED|\.ics/);assert.match(html,/bg-\[#FCFAF6\]/);
});
