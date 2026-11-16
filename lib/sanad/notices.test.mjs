import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildNotices,isQuiet} from './notices.ts';
const record=(id,kind,body)=>({id,kind,body,version:1,createdAt:'2026-11-16T07:00:00Z',updatedAt:'2026-11-16T07:00:00Z'});
test('quiet hours support crossing midnight and disabled windows',()=>{assert.equal(isQuiet('23:00','22:00','08:00'),true);assert.equal(isQuiet('07:59','22:00','08:00'),true);assert.equal(isQuiet('08:00','22:00','08:00'),false);assert.equal(isQuiet('12:00','08:00','08:00'),false);});
test('notices are factual and never copy private prose or invent medication reminders',()=>{
 const rows=[record('j','journal',{situation:'SECRET'}),record('m','clinicMessage',{text:'SECRET'}),record('a','appointment',{date:'2026-11-18',startTime:'14:00',shared:true,status:'confirmed'}),record('t','treatment',{name:'SECRET',asNeeded:true,status:'active',shared:true})];
 const notices=buildNotices(rows,'2026-11-16','09:00',{});assert.equal(notices.length,2);assert.doesNotMatch(JSON.stringify(notices),/SECRET/);assert.ok(notices.every(n=>n.screen==='appointments'||n.screen==='messages'));
});
test('optional daily checkin reminder respects consent, quiet hours, chosen days and existing checkin',()=>{
 const preferences={notifications:true,reminderDays:[1],quietStart:'22:00',quietEnd:'08:00'};
 const consent=record('consent','consent',{purpose:'in-app-reminders',accepted:true});
 assert.equal(buildNotices([consent],'2026-11-16','09:00',preferences).length,1);
 assert.equal(buildNotices([],'2026-11-16','07:00',preferences).length,0);
 assert.equal(buildNotices([],'2026-11-17','09:00',preferences).length,0);
 assert.equal(buildNotices([record('c','checkin',{date:'2026-11-16',sleepHours:0})],'2026-11-16','09:00',preferences).length,0);
 assert.equal(buildNotices([],'2026-11-16','09:00',{}).length,0);
 assert.equal(buildNotices([],'2026-11-16','09:00',preferences).length,0);
 assert.equal(buildNotices([{...consent,body:{...consent.body,accepted:false}}],'2026-11-16','09:00',preferences).length,0);
});
