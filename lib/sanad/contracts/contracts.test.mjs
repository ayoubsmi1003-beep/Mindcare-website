import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';

registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) return nextResolve(`${specifier}.ts`, context);
  return nextResolve(specifier, context);
} });
const { EventSchema, TreatmentSchema, PatientProviderSchema } = await import('./schemas.ts');
const { createReceiver, receiveEvent: receive, currentObject, reminderStatus, provisionSyntheticAccount: provision } = await import('./sync.ts');
const { scenarioReply, buildPatientContext, updateMemory } = await import('./provider.ts');

const now = '2026-11-14T10:00:00Z';

test('clinic reply authority belongs to the authenticated clinic and carries its message correlation',()=>{
  const input=event({objectId:'reply-a',object:{kind:'clinic-reply',replyTo:'message-a',text:'Synthetic reply',respondedAt:now}});
  assert.equal(EventSchema.safeParse(input).success,true);
  assert.equal(EventSchema.safeParse({...input,source:'sanad'}).success,false);
  assert.equal(EventSchema.safeParse({...input,object:{...input.object,replyTo:''}}).success,false);
});
const binding = { patientId: 'synthetic-patient-a', bindingId: 'binding-a' };
const receiveEvent = (state, input, scope = binding, sender = input.source) => receive(state, input, scope, sender);
const verifiedDoctor = { ...binding, authorizedBy: 'doctor-a', role: 'doctor' };
const provisionSyntheticAccount = (state, input, authority = verifiedDoctor) => provision(state, input, authority);
const treatment = { name: 'Produit fictif de démonstration', status: 'active', validFrom: '2026-11-01T00:00:00Z', validUntil: null,
  schedule: ['08:00'], asNeeded: false, remindersAuthorizedUntil: '2026-11-15T00:00:00Z' };
const event = (overrides = {}) => ({ schemaVersion: 1, eventId: 'event-1', ...binding,
  objectId: 'object-1', version: 1, effectiveAt: '2026-11-01T00:00:00Z',
  emittedAt: now, source: 'mindcare', correlationId: 'correlation-a', shareState: 'shared',
  object: { kind: 'treatment', ...treatment }, ...overrides });

test('authority and structured patient provider input reject clinical overwrites and Gemini', () => {
  assert.equal(EventSchema.safeParse(event({ source: 'sanad' })).success, false);
  assert.equal(EventSchema.safeParse(event({ schemaVersion: 2 })).success, false);
  assert.equal(PatientProviderSchema.safeParse({ provider: 'gemini' }).success, false);
  assert.equal(PatientProviderSchema.safeParse({ provider: 'local' }).success, false);
  assert.equal(PatientProviderSchema.safeParse({ provider: 'scenario' }).success, true);
});

test('treatment preserves explicit source medication, dose, route and instructions without deriving missing fields', () => {
  const prescription = { kind: 'treatment', ...treatment, dose: 'Sans dose réelle', route: 'Scénario uniquement', instructions: 'Exemple inerte : aucune consigne de prise réelle.' };
  assert.deepEqual(TreatmentSchema.parse(prescription), prescription);
  const minimal = TreatmentSchema.parse({ kind: 'treatment', ...treatment, name: 'Nouveau produit fictif' });
  assert.equal(Object.hasOwn(minimal, 'dose'), false);
  assert.equal(Object.hasOwn(minimal, 'route'), false);
  assert.equal(Object.hasOwn(minimal, 'instructions'), false);
  assert.deepEqual(minimal.schedule, ['08:00']);
  const { name, ...nameless } = prescription;
  assert.ok(name);
  assert.equal(TreatmentSchema.safeParse(nameless).success, false);
  assert.equal(TreatmentSchema.safeParse({ ...prescription, name: ' ' }).success, false);
  assert.equal(TreatmentSchema.safeParse({ ...prescription, dose: 2 }).success, false);
  assert.equal(TreatmentSchema.safeParse({ ...prescription, dose: '' }).success, false);
  const state = createReceiver(binding);
  receiveEvent(state, event({ object: prescription }));
  receiveEvent(state, event({ eventId: 'new-prescription', version: 2, object: { ...minimal, schedule: [] } }));
  const current = currentObject(state, 'treatment', 'object-1', now);
  assert.equal(current.version, 2);
  assert.equal(Object.hasOwn(current.object, 'dose'), false);
  assert.equal(reminderStatus(current, now), 'no-fixed-schedule');
});

test('structured checkins carry optional patient observations with the persisted command vocabulary', () => {
  const body = { date: '2026-11-14', mood: 'mixed', anxiety: 'medium', sleepHours: 7.5, energy: 'low', effects: 'Ressenti entièrement fictif' };
  const input = event({ source: 'sanad', object: { kind: 'checkin', recordedAt: now, ...body } });
  assert.deepEqual(EventSchema.parse(input).object, input.object);
  assert.equal(EventSchema.safeParse({ ...input, object: { kind: 'checkin', recordedAt: now, date: body.date, mood: 'calm' } }).success, true);
  for (const object of [
    { kind: 'checkin', recordedAt: now, date: body.date },
    { ...input.object, sleepHours: 25 }, { ...input.object, mood: 'diagnosis' },
    { ...input.object, date: '2026-02-30' },
  ]) assert.equal(EventSchema.safeParse({ ...input, object }).success, false);
});

test('patient adherence mapping keeps forgotten distinct and never invents a scheduled time', () => {
  const body = { treatmentId: 'synthetic-treatment', status: 'forgotten', reason: 'Raison fictive' };
  const input = event({ source: 'sanad', object: { kind: 'adherence', treatmentObjectId: body.treatmentId, treatmentVersion: 3, declaration: body.status, reason: body.reason } });
  const parsed = EventSchema.parse(input);
  assert.equal(parsed.object.declaration, 'forgotten');
  assert.equal(Object.hasOwn(parsed.object, 'scheduledAt'), false);
  assert.equal(EventSchema.safeParse({ ...input, object: { ...input.object, treatmentVersion: 0 } }).success, false);
  assert.equal(EventSchema.safeParse({ ...input, object: { ...input.object, declaration: 'not-taken', scheduledAt: now } }).success, true);
});

test('appointment, prescribed goal and document metadata map explicit synthetic operator snapshots', () => {
  const operator = { startsAt: '2026-11-21T13:00:00Z', confirmedAt: now, location: 'Lieu fictif · démonstration', status: 'confirmed', shared: true, lastSyncedAt: now };
  const appointment = event({ lastSyncedAt: operator.lastSyncedAt, shareState: operator.shared ? 'shared' : 'revoked', object: {
    kind: 'appointment', startsAt: operator.startsAt, confirmedAt: operator.confirmedAt, location: operator.location, status: operator.status,
  } });
  assert.deepEqual(EventSchema.parse(appointment), appointment);
  assert.equal(EventSchema.safeParse({ ...appointment, object: { ...appointment.object, status: 'pending' } }).success, false);
  assert.equal(EventSchema.safeParse({ ...appointment, object: { ...appointment.object, startsAt: '2026-11-21T14:00:00' } }).success, false);
  const goal = event({ object: { kind: 'doctor-goal', title: 'Préparer une question fictive', status: 'active', targetDate: '2026-11-21', instructions: 'Exemple fictif' } });
  assert.deepEqual(EventSchema.parse(goal), goal);
  assert.equal(EventSchema.safeParse({ ...goal, source: 'sanad' }).success, false);
  const document = event({ object: { kind: 'shared-document', documentId: 'synthetic-document', title: 'Document fictif', mediaType: 'text/plain', fileName: 'sanad-demo.txt', sizeBytes: 128, publishedAt: now } });
  assert.deepEqual(EventSchema.parse(document), document);
  assert.equal(EventSchema.safeParse({ ...document, object: { ...document.object, sizeBytes: -1 } }).success, false);
  assert.equal(EventSchema.safeParse({ ...document, object: { ...document.object, url: 'https://public.invalid/document' } }).success, false);
});

test('binding comes from verified server scope, never browser arbitrary IDs', () => {
  assert.throws(() => receiveEvent(createReceiver(binding), event(), { ...binding, patientId: 'other' }));
  assert.throws(() => receiveEvent(createReceiver(binding), event({ patientId: 'other' }), binding));
});

test('dedupe survives serialization; old treatment cannot resurrect a stop or pause', () => {
  const state = createReceiver(binding);
  assert.equal(receiveEvent(state, event(), binding).status, 'applied');
  assert.equal(receiveEvent(state, event(), binding).status, 'duplicate');
  const stopped = event({ eventId: 'event-3', version: 3, object: { kind: 'treatment', ...treatment, status: 'stopped' } });
  receiveEvent(state, stopped, binding);
  const restarted = JSON.parse(JSON.stringify(state));
  assert.equal(receiveEvent(restarted, stopped, binding).status, 'duplicate');
  assert.equal(receiveEvent(restarted, event({ eventId: 'event-2', version: 2 }), binding).status, 'stale');
  assert.equal(currentObject(restarted, 'treatment', 'object-1', now).object.status, 'stopped');
  receiveEvent(restarted, event({ eventId: 'event-4', version: 4, object: { kind: 'treatment', ...treatment, status: 'paused' } }), binding);
  assert.equal(reminderStatus(currentObject(restarted, 'treatment', 'object-1', now), now), 'inactive');
  assert.throws(() => receiveEvent(restarted, event({ eventId: 'event-4', version: 4 }), binding));
});

test('a scheduled future stop takes effect on its date; version collision is rejected', () => {
  const state = createReceiver(binding);
  receiveEvent(state, event(), binding);
  receiveEvent(state, event({ eventId: 'future-stop', version: 2, effectiveAt: '2026-11-16T00:00:00Z', object: { kind: 'treatment', ...treatment, status: 'stopped' } }), binding);
  assert.equal(currentObject(state, 'treatment', 'object-1', now).object.status, 'active');
  assert.equal(currentObject(state, 'treatment', 'object-1', '2026-11-17T00:00:00Z').object.status, 'stopped');
  assert.throws(() => receiveEvent(state, event({ eventId: 'collision', version: 2 }), binding));
});

test('an active treatment arriving after its future stop retains the effective timeline after restart', () => {
  const state = createReceiver(binding);
  receiveEvent(state, event({ eventId: 'future-stop', version: 2, effectiveAt: '2026-11-16T00:00:00Z', object: { kind: 'treatment', ...treatment, status: 'stopped' } }));
  assert.equal(receiveEvent(state, event()).status, 'stale');
  const restarted = JSON.parse(JSON.stringify(state));
  assert.equal(currentObject(restarted, 'treatment', 'object-1', now)?.object.status, 'active');
  assert.equal(reminderStatus(currentObject(restarted, 'treatment', 'object-1', now), now), 'eligible');
  assert.equal(currentObject(restarted, 'treatment', 'object-1', '2026-11-17T00:00:00Z')?.object.status, 'stopped');
});

test('a future authority revocation preserves the active period in either arrival order', () => {
  const shared = event();
  const revoked = event({ eventId: 'future-revocation', version: 2, effectiveAt: '2026-11-16T00:00:00Z', shareState: 'revoked' });
  for (const ordered of [[shared, revoked], [revoked, shared]]) {
    const state = createReceiver(binding);
    for (const item of ordered) receiveEvent(state, item);
    const restarted = JSON.parse(JSON.stringify(state));
    assert.equal(currentObject(restarted, 'treatment', 'object-1', now)?.version, 1);
    assert.equal(reminderStatus(currentObject(restarted, 'treatment', 'object-1', now), now), 'eligible');
    assert.equal(currentObject(restarted, 'treatment', 'object-1', revoked.effectiveAt), null);
    assert.equal(currentObject(restarted, 'treatment', 'object-1', '2026-11-17T00:00:00Z'), null);
  }
});

test('sender authority is independent of the event claim and required even on replay', () => {
  const state = createReceiver(binding);
  assert.throws(() => receive(state, event(), binding), /sender|authority|Invalid/);
  assert.throws(() => receive(state, event(), binding, 'sanad'), /sender|authority/);
  assert.equal(state.seen.length, 0);
  receive(state, event(), binding, 'mindcare');
  assert.throws(() => receive(state, event(), binding, 'sanad'), /sender|authority/);
});

test('revocation removes content and delayed old shares do not resurrect it', () => {
  const state = createReceiver(binding);
  const shared = event({ source: 'sanad', object: { kind: 'journal', revision: 1, text: 'explicitly shared' } });
  receiveEvent(state, shared, binding);
  receiveEvent(state, event({ eventId: 'revoke-2', source: 'sanad', version: 2, shareState: 'revoked', object: { kind: 'journal', revision: 1 } }), binding);
  assert.equal(currentObject(state, 'journal', 'object-1', now), null);
  assert.equal(JSON.stringify(state).includes('explicitly shared'), false);
  assert.throws(() => receiveEvent(state, { ...shared, eventId: 'delayed' }, binding), /object-version-conflict|revision-revoked/);
  assert.equal(currentObject(state, 'journal', 'object-1', now), null);
  assert.equal(EventSchema.safeParse({ ...shared, shareState: 'private' }).success, false);
  assert.equal(EventSchema.safeParse({ ...shared, shareState: 'revoked' }).success, false);
});

test('a delayed revocation purges only its exact revision and prevents resurrection after restart', () => {
  const state = createReceiver(binding);
  const shared = event({ source: 'sanad', version: 1, object: { kind: 'journal', revision: 1, text: 'REVOKED_REVISION_SENTINEL' } });
  receiveEvent(state, shared);
  receiveEvent(state, { ...shared, eventId: 'repeat-share', version: 3 });
  receiveEvent(state, { ...shared, eventId: 'new-revision', version: 4, object: { kind: 'journal', revision: 2, text: 'new explicitly shared revision' } });
  const revoke = { ...shared, eventId: 'delayed-revocation', version: 2, shareState: 'revoked', object: { kind: 'journal', revision: 1 } };
  assert.equal(receiveEvent(state, revoke).status, 'applied');
  assert.equal(JSON.stringify(state).includes('REVOKED_REVISION_SENTINEL'), false);
  assert.equal(currentObject(state, 'journal', 'object-1', now)?.object.text, 'new explicitly shared revision');
  const restarted = JSON.parse(JSON.stringify(state));
  assert.equal(receiveEvent(restarted, revoke).status, 'duplicate');
  assert.throws(() => receiveEvent(restarted, { ...shared, eventId: 'resurrect', version: 5 }), /revision-revoked/);
});

test('a delayed revocation removes a current same-revision share even when no earlier share arrived', () => {
  const state = createReceiver(binding);
  const shared = event({ source: 'sanad', version: 3, object: { kind: 'conversation', revision: 1, text: 'DELAYED_REVOKED_SENTINEL' } });
  receiveEvent(state, shared);
  receiveEvent(state, { ...shared, eventId: 'old-revoke', version: 2, shareState: 'revoked', object: { kind: 'conversation', revision: 1 } });
  assert.equal(currentObject(state, 'conversation', 'object-1', now), null);
  assert.equal(JSON.stringify(state).includes('DELAYED_REVOKED_SENTINEL'), false);
});

test('revision content is immutable across object versions and survives receiver serialization', () => {
  const state = createReceiver(binding);
  const shared = event({ source: 'sanad', object: { kind: 'journal', revision: 1, text: 'immutable revision' } });
  receiveEvent(state, shared);
  const restarted = JSON.parse(JSON.stringify(state));
  assert.throws(() => receiveEvent(restarted, { ...shared, eventId: 'changed', version: 2, object: { ...shared.object, text: 'silently edited' } }), /revision-content-conflict/);
  assert.equal(receiveEvent(restarted, { ...shared, eventId: 'unchanged', version: 2 }).status, 'applied');
  assert.equal(receiveEvent(restarted, { ...shared, eventId: 'new', version: 3, object: { ...shared.object, revision: 2, text: 'explicitly shared edit' } }).status, 'applied');
});

test('reminder validity uses explicit clinical lease, not elapsed last sync time', () => {
  const e = event({ lastSyncedAt: '2025-01-01T00:00:00Z' });
  assert.equal(reminderStatus(e, now), 'eligible');
  assert.equal(reminderStatus({ ...e, object: { ...e.object, remindersAuthorizedUntil: null } }, now), 'authorization-required');
  assert.equal(reminderStatus(e, '2026-11-15T00:00:00Z'), 'authorization-expired');
  assert.equal(reminderStatus({ ...e, object: { ...e.object, validUntil: now } }, now), 'outside-validity');
  assert.equal(reminderStatus({ ...e, object: { ...e.object, asNeeded: true } }, now), 'no-fixed-schedule');
  assert.equal(reminderStatus({ ...e, object: { ...e.object, schedule: [] } }, now), 'no-fixed-schedule');
  assert.equal(reminderStatus({ ...e, shareState: 'revoked' }, now), 'not-shared');
  assert.equal(TreatmentSchema.safeParse({ kind: 'treatment', ...treatment, schedule: ['25:00'] }).success, false);
});

test('one-button provisioning is doctor-authorized, consented, idempotent and audited without phone identity', () => {
  const state = { accounts: [], operations: [], audit: [] };
  const input = { schemaVersion: 1, operationId: 'provision-1', ...binding, authorizedBy: 'doctor-a',
    role: 'doctor', synthetic: true, identityVerified: true, consent: { portal: true, at: now }, phoneStatus: 'unique-test' };
  assert.equal(provisionSyntheticAccount(state, input).status, 'created');
  assert.equal(provisionSyntheticAccount(state, input).status, 'duplicate');
  assert.equal(state.accounts.length, 1);
  assert.equal(state.audit.length, 1);
  assert.throws(() => provisionSyntheticAccount(state, { ...input, role: 'assistant' }));
  assert.throws(() => provisionSyntheticAccount(state, { ...input, phoneStatus: 'shared' }));
  assert.throws(() => provisionSyntheticAccount(state, { ...input, patientId: 'other' }));
  assert.throws(() => provisionSyntheticAccount(state, { ...input, operationId: 'new', consent: { portal: false, at: now } }));
});

test('an already-existing provisioning result reserves the operation ID and authenticated scope', () => {
  const state = { accounts: [{ ...binding }], operations: [], audit: [] };
  const input = { schemaVersion: 1, operationId: 'already-exists', ...binding, authorizedBy: 'doctor-a',
    role: 'doctor', synthetic: true, identityVerified: true, consent: { portal: true, at: now }, phoneStatus: 'unique-test' };
  assert.equal(provisionSyntheticAccount(state, input).status, 'already-exists');
  assert.equal(provisionSyntheticAccount(state, input).status, 'duplicate');
  const otherBinding = { patientId: 'synthetic-patient-b', bindingId: 'binding-b' };
  assert.throws(() => provisionSyntheticAccount(state, { ...input, ...otherBinding }, { ...verifiedDoctor, ...otherBinding }), /operation-id-conflict/);
  assert.equal(state.accounts.length, 1);
  assert.throws(() => provision(state, { ...input, operationId: 'unverified' }), /Invalid|authority/);
  assert.throws(() => provisionSyntheticAccount(state, { ...input, operationId: 'wrong-doctor' }, { ...verifiedDoctor, authorizedBy: 'doctor-b' }), /authority/);
  assert.throws(() => provisionSyntheticAccount(state, { ...input, operationId: 'wrong-patient' }, { ...verifiedDoctor, ...otherBinding }), /binding|authority/);
});

test('context filters other patients, private clinician notes, revoked/current revisions and disabled memory', () => {
  const sources = [
    { ...binding, sourceId: 'a', revision: 1, currentRevision: 2, audience: 'patient', revoked: false, text: 'OLD_PRIVATE_SENTINEL' },
    { ...binding, sourceId: 'b', revision: 1, currentRevision: 1, audience: 'clinician-private', revoked: false, text: 'DOCTOR_PRIVATE_SENTINEL' },
    { ...binding, sourceId: 'c', revision: 1, currentRevision: 1, audience: 'patient', revoked: true, text: 'REVOKED_SENTINEL' },
    { ...binding, patientId: 'other', sourceId: 'd', revision: 1, currentRevision: 1, audience: 'patient', revoked: false, text: 'OTHER_PATIENT_SENTINEL' },
    { ...binding, sourceId: 'e', revision: 2, currentRevision: 2, audience: 'patient', revoked: false, text: 'allowed instruction' },
    { ...binding, sourceId: 'f', revision: 1, currentRevision: 1, audience: 'patient-private', revoked: false, text: 'NEW_PRIVATE_REVISION_SENTINEL' },
  ];
  const grants = sources.map(s => ({ sourceId: s.sourceId, revision: s.revision, revoked: false, purpose: 'patient-ai' }));
  const context = buildPatientContext({ binding, sources, grants, memory: { enabled: false, items: [{ id: 'memory-1', text: 'DISABLED_MEMORY_SENTINEL' }] } });
  assert.deepEqual(context.sources.map(s => s.text), ['allowed instruction']);
  assert.equal(JSON.stringify(context).includes('SENTINEL'), false);
  const memory = { enabled: true, items: [{ id: 'preference-a', text: 'short replies' }] };
  assert.deepEqual(updateMemory(memory, { action: 'correct', id: 'preference-a', text: 'longer replies' }).items, [{ id: 'preference-a', text: 'longer replies' }]);
  assert.equal(updateMemory(memory, { action: 'disable' }).items.length, 1);
  assert.equal(updateMemory(memory, { action: 'delete', id: 'preference-a' }).items.length, 0);
});

test('context and derived memory require the exact current grant and lose access after its revocation', () => {
  const source = { ...binding, sourceId: 'shared-entry', revision: 2, currentRevision: 2, audience: 'patient', revoked: false, text: 'SHARED_SOURCE_SENTINEL' };
  const grant = { sourceId: source.sourceId, revision: 2, revoked: false, purpose: 'patient-ai' };
  const memory = { enabled: true, items: [
    { id: 'preference', text: 'short replies' },
    { id: 'derived', text: 'DERIVED_SENTINEL', derivedFrom: [{ sourceId: source.sourceId, revision: 2 }] },
  ] };
  const context = grants => buildPatientContext({ binding, sources: [source], grants, memory });
  assert.equal(context([grant]).sources.length, 1);
  assert.equal(context([grant]).preferences.length, 2);
  for (const grants of [[], [{ ...grant, revision: 1 }], [{ ...grant, revoked: true }], [grant, { ...grant, revoked: true }]]) {
    const result = context(grants);
    assert.equal(result.sources.length, 0);
    assert.deepEqual(result.preferences, [memory.items[0]]);
    assert.equal(JSON.stringify(result).includes('SENTINEL'), false);
  }
});

test('scenario output is identifiable; unavailable/quota/abort/timeout fail without network calls', async t => {
  let networkCalls = 0;
  t.mock.method(globalThis, 'fetch', async () => { networkCalls++; throw new Error('unexpected-network'); });
  for (const locale of ['fr', 'ar', 'en']) {
    const result = await scenarioReply('hello', { locale });
    assert.equal(result.scenario, true);
    assert.equal(result.origin, 'scripted-demo');
    assert.ok(result.text.length > 0);
  }
  await assert.rejects(scenarioReply('hello', { available: false }), { message: 'provider-unavailable' });
  await assert.rejects(scenarioReply('hello', { quotaRemaining: 0 }), { message: 'quota-exceeded' });
  const controller = new AbortController(); controller.abort();
  await assert.rejects(scenarioReply('hello', { signal: controller.signal }), { name: 'AbortError' });
  await assert.rejects(scenarioReply('hello', { timeoutMs: 0 }), { message: 'provider-timeout' });
  assert.equal(networkCalls, 0);
});

test('urgent wording receives deterministic localized immediate-help guidance',async()=>{
  for(const [locale,text,expected] of [['fr','Je veux me suicider',/urgence/],['en','I want to kill myself',/emergency/],['ar','أريد الانتحار',/الطوارئ/]]) {
    const answer=await scenarioReply(text,{locale});
    assert.match(answer.text,expected);
    assert.equal(answer.scenario,true);
    assert.equal(answer.origin,'scripted-demo');
  }
});
