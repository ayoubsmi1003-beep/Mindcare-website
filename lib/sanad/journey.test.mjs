import test from 'node:test';
import assert from 'node:assert/strict';
import {journeyDays, dailyCheckins, journalMatches, hasCheckinObservation, journalHasContent, algiersDay} from './journey.ts';

const record = (id, body, extra = {}) => ({id, kind:'checkin', body, version:1, createdAt:'2026-01-01T10:00:00Z', updatedAt:'2026-01-02T10:00:00Z', ...extra});
test('calendar windows include leap days and Algiers midnight', () => {
  assert.deepEqual(journeyDays('2024-03-01',7), ['2024-02-24','2024-02-25','2024-02-26','2024-02-27','2024-02-28','2024-02-29','2024-03-01']);
  assert.equal(journeyDays('2026-01-01',90).length,90);
  assert.throws(()=>journeyDays('2026-02-30',7),RangeError);
  assert.equal(algiersDay('2026-11-15T23:30:00Z'),'2026-11-16');
});
test('latest whole record wins per ID and date, deterministically, leaving real gaps', () => {
  const old=record('a',{date:'2026-01-01',sleepHours:8});
  const moved=record('a',{date:'2026-01-02',mood:'mixed'},{version:2});
  const correction=record('b',{date:'2026-01-02',sleepHours:0},{version:3});
  const invalid=record('c',{date:'2026-02-30',mood:'calm'});
  const future=record('d',{date:'2026-01-03',mood:'calm'});
  const rows=dailyCheckins([old,moved,correction,invalid,future],'2026-01-02',7);
  assert.equal(rows.length,7);
  assert.equal(rows[5].record,undefined);
  assert.equal(rows[6].record.id,'b');
  assert.equal(rows[6].record.body.mood,undefined);
  assert.deepEqual(dailyCheckins([future,invalid,correction,moved,old],'2026-01-02',7),rows);
});
test('check-in requires a meaningful observation but accepts zero reported sleep', () => {
  for(const body of [{date:'2026-01-02'},{contextTags:[]},{note:'   '},{sleepHours:NaN},{sleepHours:-1},{intensity:8}]) assert.equal(hasCheckinObservation(body),false);
  for(const body of [{sleepHours:0},{emotion:'sad'},{note:'moment'},{contextTags:['rest']}])assert.equal(hasCheckinObservation(body),true);
});
test('invalid timestamp calendar dates never become timeline facts',()=>{
  const invalid=record('invalid',{date:'2026-03-02',sleepHours:8},{createdAt:'2026-02-30T10:00:00Z',updatedAt:'2026-02-30T10:00:00Z'});
  assert.equal(algiersDay('2026-02-30T10:00:00Z'),'');
  assert.ok(dailyCheckins([invalid],'2026-03-02',7).every(row=>!row.record));
});
test('journal search covers legacy and free entries and inclusive Algiers dates', () => {
  const entry=record('j',{situation:'Une promenade',helped:'Le calme'},{kind:'journal',createdAt:'2026-01-01T23:30:00Z'});
  assert.equal(journalMatches(entry,'CALME','2026-01-02','2026-01-02'),true);
  assert.equal(journalMatches(entry,'','2026-01-03',''),false);
  assert.equal(journalMatches({...entry,body:{text:'Écriture libre'}},'libre','',''),true);
  assert.equal(journalHasContent({format:'free',text:' '}),false);
  assert.equal(journalHasContent({format:'guided',need:'repos'}),true);
});
