import test from 'node:test';
import assert from 'node:assert/strict';
import {weekFacts, nextStep} from './insights.ts';

const today = '2026-03-01';
const saved = '2026-03-01T10:00:00Z';
const record = (kind, body, id = kind, extra = {}) => ({id, kind, body, version: 1, createdAt: saved, updatedAt: saved, ...extra});
const checkin = (body = {date: today, mood: 'calm'}, id = 'checkin', extra = {}) => record('checkin', body, id, extra);
const doneToday = checkin();
const appointment = (body = {}, extra = {}) => record('appointment', {shared: true, status: 'confirmed', date: '2026-03-07', ...body}, 'appointment', extra);
const progress = (body = {}, id = 'progress', extra = {}) => record('exerciseProgress', {resourceId: 'breathing', seconds: 30, completed: false, ...body}, id, extra);
const pause = {kind: 'pause', screen: 'resources'};

test('week is seven actual calendar dates across leap days and year boundaries', () => {
  assert.deepEqual(weekFacts([], '2024-03-01').days, ['2024-02-24', '2024-02-25', '2024-02-26', '2024-02-27', '2024-02-28', '2024-02-29', '2024-03-01']);
  assert.deepEqual(weekFacts([], '2026-01-02').days, ['2025-12-27', '2025-12-28', '2025-12-29', '2025-12-30', '2025-12-31', '2026-01-01', '2026-01-02']);
  assert.deepEqual(weekFacts([], today), {
    days: ['2026-02-23', '2026-02-24', '2026-02-25', '2026-02-26', '2026-02-27', '2026-02-28', '2026-03-01'],
    observations: [], recordedDays: 0, sleepSamples: 0, averageSleep: null, pendingRequests: 0,
  });
});

test('only calendar-valid checkin dates within the inclusive window count', () => {
  const records = ['2026-02-22', '2026-02-23', '2026-02-28', today, '2026-03-02', '2026-02-30', '2026-2-28', '2026-03-01T12:00:00Z', 'not-a-date'].map((date, i) => checkin({date, mood: 'mixed'}, String(i)));
  records.push(record('journal', {date: today, mood: 'calm'}));
  assert.deepEqual(weekFacts(records, today).observations, [{date: '2026-02-23', mood: 'mixed'}, {date: '2026-02-28', mood: 'mixed'}, {date: today, mood: 'mixed'}]);
  assert.equal(weekFacts(records, today).recordedDays, 3);
});

test('latest correction replaces the whole observation without restoring missing sleep', () => {
  const old = checkin({date: today, mood: 'difficult', sleepHours: 8}, 'old', {updatedAt: '2026-03-01T08:00:00Z'});
  const correction = checkin({date: today, mood: 'mixed'}, 'corrected');
  const records = [old, checkin({date: '2026-02-28', sleepHours: 0}, 'zero'), checkin({date: '2026-02-27', sleepHours: 7}, 'seven'), correction];
  const facts = weekFacts(records, today);
  assert.deepEqual(facts.observations, [{date: '2026-02-27', sleepHours: 7}, {date: '2026-02-28', sleepHours: 0}, {date: today, mood: 'mixed'}]);
  assert.equal(facts.recordedDays, 3);
  assert.equal(facts.sleepSamples, 2);
  assert.equal(facts.averageSleep, 3.5);
  assert.deepEqual(weekFacts([...records].reverse(), today), facts);
});

test('equal instants use version and id for stable corrections independent of input order', () => {
  const records = [checkin({date: today, sleepHours: 9}, 'a', {version: 2}), checkin({date: today, sleepHours: 8}, 'z', {version: 1}), checkin({date: today, sleepHours: 0}, 'b', {version: 2, updatedAt: '2026-03-01T11:00:00+01:00'})];
  assert.deepEqual(weekFacts(records, today).observations, [{date: today, sleepHours: 0}]);
  assert.deepEqual(weekFacts([...records].reverse(), today), weekFacts(records, today));
});

test('a record corrected onto a different date is counted once', () => {
  const old = checkin({date: '2026-02-28', sleepHours: 8}, 'same', {updatedAt: '2026-03-01T08:00:00Z'});
  const newer = checkin({date: today, sleepHours: 0}, 'same', {version: 2});
  assert.deepEqual(weekFacts([newer, old, newer], today).observations, [{date: today, sleepHours: 0}]);
});

test('invalid optional values stay absent and never become zero or a sleep sample', () => {
  const values = [NaN, Infinity, -1, 24.1, '7', null, undefined];
  const records = values.map((sleepHours, i) => checkin({date: `2026-02-${23 + i}`, sleepHours, mood: 'PRIVATE_SENTINEL', energy: false, anxiety: 'severe'}, String(i)));
  records[6].body.date = today;
  const facts = weekFacts(records, today);
  assert.equal(facts.recordedDays, 7);
  assert.equal(facts.sleepSamples, 0);
  assert.equal(facts.averageSleep, null);
  assert.ok(facts.observations.every(value => Object.keys(value).join() === 'date'));
  assert.deepEqual(weekFacts([checkin({date: today, mood: 'difficult', anxiety: 'high', energy: 'low', sleepHours: 24})], today).observations, [{date: today, mood: 'difficult', anxiety: 'high', sleepHours: 24, energy: 'low'}]);
});

test('pending requests are current unique records and future-created requests are excluded', () => {
  const pending = record('request', {status: 'pending', text: 'PRIVATE_SENTINEL'}, 'same');
  const resolved = record('request', {status: 'resolved'}, 'same', {version: 2, updatedAt: '2026-03-01T12:00:00Z'});
  const records = [pending, resolved, record('request', {status: 'pending'}, 'open'), record('request', {status: 'pending'}, 'open'), record('message', {status: 'pending'}), record('request', {status: 'pending'}, 'future', {createdAt: '2026-03-02T00:00:00+01:00'})];
  assert.equal(weekFacts(records, today).pendingRequests, 1);
  assert.equal(weekFacts([...records].reverse(), today).pendingRequests, 1);
});

test('future or invalid saved metadata cannot appear as existing facts', () => {
  for (const extra of [{createdAt: '2026-03-02T00:00:00+01:00'}, {updatedAt: '2026-03-02T00:00:00+01:00'}, {updatedAt: 'bad'}, {createdAt: '2026-02-30T10:00:00Z'}]) {
    assert.equal(weekFacts([checkin(undefined, 'future', extra)], today).recordedDays, 0);
  }
  assert.equal(weekFacts([checkin(undefined, 'late', {createdAt: '2026-03-01T23:59:59+01:00', updatedAt: '2026-03-01T23:59:59+01:00'})], today).recordedDays, 1);
});

test('facts never return private text, effects, identity, conversations, memory or treatments', () => {
  const records = ['journal', 'conversation', 'memory', 'treatment', 'identity', 'request'].map(kind => record(kind, {date: today, text: 'PRIVATE_SENTINEL', effects: 'PRIVATE_SENTINEL', status: 'revoked'}, kind));
  records.push(checkin({date: today, effects: 'PRIVATE_SENTINEL'}));
  assert.deepEqual(weekFacts(records, today).observations, [{date: today}]);
  assert.equal(JSON.stringify(weekFacts(records, today)).includes('PRIVATE_SENTINEL'), false);
  assert.deepEqual(nextStep(records, today), pause);
});

test('next step priority is checkin, preparation, unfinished session, personal activity, pause', () => {
  const records = [appointment(), progress(), record('goal', {title: 'PRIVATE_SENTINEL', origin: 'personal', completed: false})];
  assert.deepEqual(nextStep(records, today), {kind: 'checkin', screen: 'checkin'});
  records.push(doneToday);
  assert.deepEqual(nextStep(records, today), {kind: 'prepare', screen: 'appointments'});
  records.push(record('preparation', {questions: 'A saved question'}));
  assert.deepEqual(nextStep(records, today), {kind: 'continue', screen: 'resources', resourceId: 'breathing'});
  records.splice(1, 1);
  assert.deepEqual(nextStep(records, today), {kind: 'activity', screen: 'followup'});
  records.splice(1, 1);
  assert.deepEqual(nextStep(records, today), pause);
});

test('only explicit confirmed shared appointments in the next seven calendar dates suggest preparation', () => {
  for (const body of [{shared: false}, {shared: undefined}, {shared: 'true'}, {status: 'cancelled'}, {status: 'declined'}, {date: '2026-02-28'}, {date: '2026-03-08'}, {date: '2026-02-30'}, {date: undefined, schedule: ['08:00']}, {startsAt: 'invalid'}]) {
    assert.deepEqual(nextStep([doneToday, appointment(body)], today), pause, JSON.stringify(body));
  }
  for (const body of [{date: today}, {date: '2026-03-07'}, {date: undefined, startsAt: '2026-02-28T23:30:00Z'}]) {
    assert.deepEqual(nextStep([doneToday, appointment(body)], today), {kind: 'prepare', screen: 'appointments'});
  }
  assert.deepEqual(nextStep([doneToday, appointment({startsAt: '2026-03-07T23:30:00Z'})], today), pause);
});

test('preparation requires saved nonempty questions; summary alone does not suppress it', () => {
  for (const body of [{questions: ''}, {questions: '  \n'}, {summary: 'PRIVATE_SENTINEL'}, {questions: false}]) {
    assert.deepEqual(nextStep([doneToday, appointment(), record('preparation', body)], today), {kind: 'prepare', screen: 'appointments'});
  }
  assert.deepEqual(nextStep([doneToday, appointment(), record('preparation', {questions: 'PRIVATE_SENTINEL'})], today), pause);
});

test('latest valid unfinished saved exercise is stable and returns only its resource id', () => {
  const records = [doneToday, progress({resourceId: 'breathing'}, 'early', {updatedAt: '2026-03-01T08:00:00Z'}), progress({resourceId: 'grounding'}, 'later'), progress({resourceId: 'sleep', completed: true}, 'finished', {updatedAt: '2026-03-01T12:00:00Z'})];
  const expected = {kind: 'continue', screen: 'resources', resourceId: 'grounding'};
  assert.deepEqual(nextStep(records, today), expected);
  assert.deepEqual(nextStep([...records].reverse(), today), expected);
  for (const [resourceId, duration] of [['breathing', 180], ['grounding', 120], ['sleep', 180], ['prepare', 120]]) {
    assert.deepEqual(nextStep([doneToday, progress({resourceId, seconds: duration - 1})], today), {kind: 'continue', screen: 'resources', resourceId});
    assert.deepEqual(nextStep([doneToday, progress({resourceId, seconds: duration})], today), pause);
  }
});

test('completed, empty, invalid or out of bounds exercise progress is not resumed', () => {
  for (const body of [{completed: true}, {completed: undefined}, {completed: 'false'}, {seconds: 0}, {seconds: -1}, {seconds: 181}, {seconds: NaN}, {seconds: Infinity}, {seconds: '10'}, {seconds: 0.5}, {resourceId: 'unknown'}, {resourceId: 'constructor'}, {resourceId: '__proto__'}]) {
    assert.deepEqual(nextStep([doneToday, progress(body)], today), pause, JSON.stringify(body));
  }
  const old = progress({}, 'same', {updatedAt: '2026-03-01T08:00:00Z'});
  assert.deepEqual(nextStep([doneToday, old, progress({completed: true}, 'same', {version: 2})], today), pause);
});

test('personal incomplete goals and due planned or deferred activities are the only activity prompts', () => {
  for (const item of [record('goal', {origin: 'personal', completed: false}), record('activity', {origin: 'personal', status: 'planned', date: today}), record('activity', {origin: 'personal', status: 'deferred', date: '2026-02-01'})]) {
    assert.deepEqual(nextStep([doneToday, item], today), {kind: 'activity', screen: 'followup'});
  }
  for (const item of [record('goal', {origin: 'doctor', completed: false}), record('goal', {origin: 'personal', completed: true}), record('goal', {origin: 'personal'}), record('prescribedGoal', {completed: false}), record('activity', {origin: 'personal', status: 'completed', date: today}), record('activity', {origin: 'personal', status: 'planned', date: '2026-03-02'}), record('activity', {origin: 'personal', status: 'planned', date: '2026-02-30'}), record('activity', {origin: 'doctor', status: 'planned', date: today})]) {
    assert.deepEqual(nextStep([doneToday, item], today), pause);
  }
});

test('helpers require a valid explicit today and leave authorized input unchanged', () => {
  for (const value of ['2026-02-30', '2026-3-01', '', 'today']) {
    assert.throws(() => weekFacts([], value), RangeError);
    assert.throws(() => nextStep([], value), RangeError);
  }
  const records = [Object.freeze({...doneToday, body: Object.freeze({...doneToday.body})}), Object.freeze({...progress(), body: Object.freeze({...progress().body})})];
  Object.freeze(records);
  const before = JSON.stringify(records);
  weekFacts(records, today);
  nextStep(records, today);
  assert.equal(JSON.stringify(records), before);
});
