import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../lib/public-chat.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const loadedModule={exports:{}};
new Function('module','exports',compiled)(loadedModule,loadedModule.exports);
const {normalizePublicChat,allowChatRequest,conversationBookingDraft}=loadedModule.exports;
test('personal and clinical messages cannot become model content',()=>{
 for(const text of ['Je m’appelle Nadia, quels sont les horaires ?', 'Mon téléphone 0554813911', 'Je prends sertraline', 'My email is a@b.com', 'عندي اكتئاب', 'Je suis anxieuse']) assert.equal(normalizePublicChat(text).kind,'private');
});
test('free text becomes public topics with validated scheduling fields only',()=>{
 const result=normalizePublicChat('Bonjour je souhaite réserver pour mon enfant le 2026-10-14 à 09:30');
 assert.equal(result.kind,'public');
 assert.equal(result.topic,'booking');
 assert.equal(result.draft.date,'2026-10-14');
 assert.equal(result.draft.time,'09:30');
 assert.equal(result.draft.forWhom,'mon enfant');
 assert.equal(result.modelText.includes('Bonjour'),false);
 assert.equal(normalizePublicChat('2026-99-99').kind,'unknown');
});
test('same origin and capacity checks fail closed',()=>{
 const req=(origin)=>new Request('https://www.mindcare-centre.com/api/chat',{method:'POST',headers:{origin,host:'www.mindcare-centre.com','content-type':'application/json'}});
 assert.equal(allowChatRequest(req('https://evil.example'),new Map(),0,'https://www.mindcare-centre.com'),403);
 const rates=new Map(); for(let i=0;i<20;i++) assert.equal(allowChatRequest(req('https://www.mindcare-centre.com'),rates,0,'https://www.mindcare-centre.com'),0);
 assert.equal(allowChatRequest(req('https://www.mindcare-centre.com'),rates,0,'https://www.mindcare-centre.com'),429);
});
test('public questions work in French, Arabic, Darija and English',()=>{
 for(const [text,topic] of [['Quels sont vos horaires ?','hours'],['What are your opening hours?','hours'],['ما هي أوقات العمل؟','hours'],['وقتاش تفتحو؟','hours'],['ch7al les tarifs?','price'],['Is the first visit confidential?','privacy'],['وين راهي العيادة؟','location']])assert.equal(normalizePublicChat(text).topic,topic);
});
test('validated booking preferences carry across turns but unrelated topics reset scope',()=>{
 const draft=conversationBookingDraft(['Réserver pour mon enfant le 2030-01-02, première visite'],'09:30');
 assert.deepEqual(draft,{date:'2030-01-02',forWhom:'mon enfant',firstTime:true,time:'09:30'});
 assert.deepEqual(conversationBookingDraft(['Réserver le 2030-01-02','Quels tarifs ?'],'09:30'),{time:'09:30'});
});
