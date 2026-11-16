import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import test from 'node:test';

test('real PostgreSQL gates enforce authentication, ownership, revisions and sharing', async (t) => {
  const { default: pg } = await import('pg');
  const name = `sanad-test-${randomUUID()}`;
  const password = randomUUID();
  const instance = randomUUID();
  const docker = (...args) => execFileSync('docker', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  let admin;
  let api;
  try {
    docker('run', '--detach', '--name', name, '--env', `POSTGRES_PASSWORD=${password}`, '--env', 'POSTGRES_DB=sanad_test', '--publish', '127.0.0.1::5432', 'postgres:16-alpine');
    const port = docker('port', name, '5432/tcp').split(':').at(-1);
    for (let i = 0; i < 60; i++) {
      try { docker('exec', name, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres'); break; } catch { await new Promise(r => setTimeout(r, 250)); }
    }
    admin = new pg.Client({ connectionString: `postgresql://postgres:${password}@127.0.0.1:${port}/sanad_test` });
    await admin.connect();
    await admin.query(await readFile(new URL('../../../db/sanad/001_synthetic.sql', import.meta.url), 'utf8'));
    await admin.query(await readFile(new URL('../../../db/sanad/002_function_privileges.sql', import.meta.url), 'utf8'));
    await admin.query(await readFile(new URL('../../../db/sanad/003_clinic_replies.sql', import.meta.url), 'utf8'));
    await admin.query('insert into sanad.environment(id,instance_id,mode) values (true,$1,$2)', [instance, 'synthetic']);
    await admin.query(`alter role sanad_runtime login password '${password}'`);
    process.env.SANAD_DATABASE_URL = `postgresql://sanad_runtime:${password}@127.0.0.1:${port}/sanad_test`;
    process.env.SANAD_DEMO_INSTANCE_ID = instance;
    process.env.SANAD_MODE = 'synthetic';
    delete process.env.VERCEL_ENV;
    api = await import('./backend.ts');
    const { hashPassword } = await import('./crypto.mjs');
    const account = async (phone, display, dob) => {
      const result = await admin.query('select sanad.operator_provision($1,$2,$3,$4,$5,$6) as id', [instance, phone, display, 'fr', await hashPassword(dob), 'synthetic-test-identity-and-consent']);
      return result.rows[0].id;
    };
    await api.assertEnvironment();
    await t.test('runtime cannot execute operator or internal functions through PUBLIC grants',async()=>{
      const permissions=await admin.query("select has_function_privilege('sanad_runtime','sanad.operator_provision(uuid,text,text,text,text,text)','EXECUTE') as provision,has_function_privilege('sanad_runtime','sanad.operator_reset(uuid,uuid,text,text)','EXECUTE') as reset,has_function_privilege('sanad_runtime','sanad.operator_receive(uuid,uuid,uuid,text,integer,jsonb)','EXECUTE') as receive");
      assert.deepEqual(permissions.rows[0],{provision:false,reset:false,receive:false});
      const runtime=new pg.Client({connectionString:process.env.SANAD_DATABASE_URL});
      await runtime.connect();
      try{await assert.rejects(runtime.query('select sanad.operator_reset($1,$2,$3,$4)',[instance,randomUUID(),'invalid','synthetic-test-identity-and-consent']),error=>error.code==='42501');}
      finally{await runtime.end();}
      await admin.query('grant execute on function sanad.operator_reset(uuid,uuid,text,text) to sanad_runtime');
      try{await assert.rejects(api.assertEnvironment(),/UNAVAILABLE/);}
      finally{await admin.query('revoke execute on function sanad.operator_reset(uuid,uuid,text,text) from sanad_runtime');}
    });
    const alice = await account('+447700900001', 'Alice fictive', '01011990');
    await account('+447700900002', 'Samir fictif', '02021992');
    await assert.rejects(account('+447700900001', 'Duplicate', '01011990'));
    await assert.rejects(account('+213555555555', 'Non-fiction phone', '01011990'));
    await assert.rejects(api.signIn('+447700900001', 'wrong', '127.0.0.1'), /UNAUTHENTICATED/);
    await assert.rejects(api.signIn('+447700900099', 'wrong', '127.0.0.1'), /UNAUTHENTICATED/);
    const a = await api.signIn('+44 7700 900001', '01011990', '127.0.0.1');
    const b = await api.signIn('+447700900002', '02021992', '127.0.0.1');
    assert.equal((await api.resolveSession(a.token)).id, alice);
    const input = { kind: 'journal', idempotencyKey: randomUUID(), body: { format:'free',status:'saved',text: 'Private synthetic text' } };
    const first = await api.saveRecord(a.token, input);
    assert.equal((await api.saveRecord(a.token, input)).id, first.id);
    assert.equal((await api.getReceipt(a.token,input.idempotencyKey)).id,first.id);
    assert.equal(await api.getReceipt(b.token,input.idempotencyKey),null);
    assert.equal((await api.getState(b.token)).records.length, 0);
    await assert.rejects(api.saveRecord(b.token, { ...input, id: first.id, expectedVersion: 1, idempotencyKey: randomUUID() }), /FORBIDDEN/);
    await assert.rejects(api.saveRecord(a.token, { ...input, kind: 'treatment', idempotencyKey: randomUUID() }), /FORBIDDEN/);
    const shared = await api.setShare(a.token, { id: first.id, version: 1, shared: true, idempotencyKey: randomUUID() });
    assert.equal(shared.recordVersion, 1);
    const correction = { ...input, id: first.id, expectedVersion: 1, idempotencyKey: randomUUID(), body: { format:'free',status:'saved',text: 'Correction' } };
    const concurrent = await Promise.allSettled([api.saveRecord(a.token, correction), api.saveRecord(a.token, { ...correction, idempotencyKey: randomUUID() })]);
    assert.equal(concurrent.filter(r => r.status === 'fulfilled').length, 1);
    assert.match(concurrent.find(r => r.status === 'rejected').reason.message, /CONFLICT/);
    const state = await api.getState(a.token);
    assert.equal(state.records[0].version, 2);
    assert.equal(state.shares.filter(s => s.revokedAt === null && s.recordVersion === 2).length, 0);
    await api.setShare(a.token, { id: first.id, version: 1, shared: false, idempotencyKey: randomUUID() });
    await assert.rejects(api.setShare(a.token, { id: first.id, version: 1, shared: true, idempotencyKey: randomUUID() }), /CONFLICT/);
    const retryKey = randomUUID();
    const retries = await Promise.all(Array.from({ length: 3 }, () => api.saveRecord(a.token, { ...input, idempotencyKey: retryKey })));
    assert.equal(new Set(retries.map(r => r.id)).size, 1);
    await assert.rejects(api.saveRecord(a.token, { ...input, idempotencyKey: retryKey, body: { format:'free',status:'saved',text: 'Mismatch' } }), /CONFLICT/);
    await t.test('populated forward upgrade preserves identities, credentials, revisions, shares and sessions',async()=>{
      const snapshot=async()=> (await admin.query("select jsonb_build_object('profiles',(select jsonb_agg(to_jsonb(p) order by p.id) from sanad.profiles p),'records',(select jsonb_agg(to_jsonb(r) order by r.id) from sanad.records r),'revisions',(select jsonb_agg(to_jsonb(r) order by r.record_id,r.version) from sanad.revisions r),'shares',(select jsonb_agg(to_jsonb(s) order by s.id) from sanad.shares s),'sessions',(select jsonb_agg(to_jsonb(s) order by s.token_hash) from sanad.sessions s)) as value")).rows[0].value;
      const legacy=await api.saveRecord(a.token,{kind:'checkin',body:{date:'2026-11-16',mood:'calm'},idempotencyKey:randomUUID()});
      const grant={id:legacy.id,version:1,shared:true,idempotencyKey:randomUUID()};
      await api.setShare(a.token,grant);
      const before=await snapshot();
      const {upgradeSanad}=await import('../../../scripts/sanad-upgrade.mjs');
      await admin.query('create function sanad.validate_lavender_body(text,jsonb) returns void language sql as $$ select null::void $$');
      await assert.rejects(upgradeSanad(admin,instance),/already exists/);
      assert.equal((await admin.query("select to_regclass('sanad.schema_migrations') as ledger")).rows[0].ledger,null);
      assert.deepEqual(await snapshot(),before);
      await admin.query('drop function sanad.validate_lavender_body(text,jsonb)');
      await upgradeSanad(admin,instance);
      await upgradeSanad(admin,instance);
      assert.deepEqual(await snapshot(),before);
      const checksum=(await admin.query('select checksum from sanad.schema_migrations where version=4')).rows[0].checksum;
      await admin.query("update sanad.schema_migrations set checksum=repeat('0',64) where version=4");
      await assert.rejects(upgradeSanad(admin,instance),/CONFLICT/);
      await admin.query('update sanad.schema_migrations set checksum=$1 where version=4',[checksum]);
      await assert.rejects(api.setShare(a.token,grant),/FORBIDDEN/);
      await assert.rejects(api.setShare(a.token,{...grant,idempotencyKey:randomUUID()}),/FORBIDDEN/);
      assert.ok((await api.setShare(a.token,{...grant,shared:false,idempotencyKey:randomUUID()})).revokedAt);
      await assert.rejects(upgradeSanad(admin,randomUUID()),/UNAVAILABLE/);
      assert.equal((await api.getState(a.token)).sessionSummary.activeCount,1);
      const other=await api.signIn('+447700900001','01011990','session-test');
      const key=randomUUID();
      const result=await api.revokeOtherSessions(a.token,key);
      assert.deepEqual(result,{ok:true,revokedCount:1});
      assert.deepEqual(await api.revokeOtherSessions(a.token,key),result);
      assert.equal(await api.resolveSession(other.token),null);
      assert.equal((await api.resolveSession(a.token)).id,alice);
      assert.ok(await api.resolveSession(b.token));
    });
    await api.changePassword(a.token, '01011990', 'A-new-demo-password-42');
    assert.equal(await api.resolveSession(a.token), null);
    await assert.rejects(api.signIn('+447700900001', '01011990', 'new-ip'), /UNAUTHENTICATED/);
    const next = await api.signIn('+447700900001', 'A-new-demo-password-42', 'new-ip');
    assert.equal((await api.getState(next.token)).records.length, 3);
    await api.signOut(next.token);
    assert.equal(await api.resolveSession(next.token), null);
    const resetSession = await api.signIn('+447700900001', 'A-new-demo-password-42', 'reset-ip');
    await admin.query('select sanad.operator_reset($1,$2,$3,$4)', [instance, alice, await hashPassword('01011990'), 'identity-reverified-synthetic']);
    assert.equal(await api.resolveSession(resetSession.token), null);
    const secretRows = await admin.query('select token_hash from sanad.sessions');
    assert.ok(secretRows.rows.every(r => r.token_hash !== a.token && r.token_hash.length === 64));
    const history = await admin.query('select count(*)::int as n from sanad.revisions where record_id=$1', [first.id]);
    assert.equal(history.rows[0].n, 2);
    const sourceId=randomUUID();
    const snapshot={status:'active',shared:true,validFrom:'2026-01-01T00:00:00Z',validUntil:null,remindersAuthorizedUntil:'2027-01-01T00:00:00Z'};
    const receive=(version,body)=>admin.query('select sanad.operator_receive($1,$2,$3,$4,$5,$6) as value',[instance,alice,sourceId,'treatment',version,body]);
    await receive(1,snapshot);
    await receive(1,snapshot);
    await assert.rejects(receive(1,{...snapshot,status:'stopped'}),/CONFLICT/);
    const fresh=await api.signIn('+447700900001','01011990','source-ip');
    const declaration={kind:'adherence',idempotencyKey:randomUUID(),body:{treatmentId:sourceId,treatmentVersion:1,status:'taken',scheduledAt:'2026-11-15T08:00:00Z'}};
    await assert.rejects(api.saveRecord(b.token,declaration),/FORBIDDEN/);
    await api.saveRecord(fresh.token,declaration);
    await receive(3,{...snapshot,status:'stopped'});
    await assert.rejects(receive(2,snapshot),/CONFLICT/);
    await assert.rejects(api.saveRecord(fresh.token,{...declaration,idempotencyKey:randomUUID()}),/CONFLICT/);
    assert.equal((await api.saveRecord(fresh.token,declaration)).version,1);
    const inbound=(id,version,body,kind='treatment')=>admin.query('select sanad.operator_receive($1,$2,$3,$4,$5,$6) as value',[instance,alice,id,kind,version,body]);
    const report=(id,body={})=>({kind:'adherence',idempotencyKey:randomUUID(),body:{treatmentId:id,treatmentVersion:1,status:'taken',...body}});
    await t.test('operator replies are durable, patient-scoped, replay-safe and unavailable to the web role',async()=>{
      const message=await api.saveRecord(fresh.token,{kind:'message',idempotencyKey:randomUUID(),body:{category:'administrative',text:'Synthetic question',status:'sent',simulation:true}});
      const replyId=randomUUID();
      const reply=()=>admin.query('select sanad.operator_reply($1,$2,$3,$4,$5) as value',[instance,alice,message.id,replyId,'Synthetic operator response']);
      const firstReply=(await reply()).rows[0].value;
      assert.deepEqual((await reply()).rows[0].value,firstReply);
      assert.equal(firstReply.body.simulation,true);
      assert.equal(firstReply.body.replyTo,message.id);
      assert.ok((await api.getState(fresh.token)).records.some(row=>row.id===replyId));
      assert.ok(!(await api.getState(b.token)).records.some(row=>row.id===replyId));
      await assert.rejects(api.saveRecord(fresh.token,{kind:'message',id:message.id,expectedVersion:1,idempotencyKey:randomUUID(),body:{...message.body,text:'Changed after receipt'}}),/FORBIDDEN/);
      await assert.rejects(api.saveRecord(fresh.token,{kind:'clinicMessage',idempotencyKey:randomUUID(),body:firstReply.body}),/FORBIDDEN/);
      await assert.rejects(admin.query('select sanad.operator_reply($1,$2,$3,$4,$5)',[instance,alice,message.id,replyId,'Changed response']),/CONFLICT/);
      const permission=await admin.query("select has_function_privilege('sanad_runtime','sanad.operator_reply(uuid,uuid,uuid,uuid,text)','EXECUTE') as allowed");
      assert.equal(permission.rows[0].allowed,false);
      const other=(await api.resolveSession(b.token)).id;
      await assert.rejects(admin.query('select sanad.operator_reply($1,$2,$3,$4,$5)',[instance,other,message.id,randomUUID(),'Wrong patient']),/FORBIDDEN/);
    });
    await t.test('unshared authority payloads never leave get_state',async()=>{
      for(const kind of ['treatment','appointment','document','prescribedGoal']) {
        const id=randomUUID();
        await inbound(id,1,{...snapshot,shared:false,secretSentinel:'HIDDEN-AUTHORITY-SENTINEL'},kind);
      }
      assert.ok(!JSON.stringify(await api.getState(fresh.token)).includes('HIDDEN-AUTHORITY-SENTINEL'));
    });
    await t.test('manual scheduled declarations do not require push authorization',async()=>{
      const id=randomUUID();
      await inbound(id,1,{...snapshot,remindersAuthorizedUntil:null});
      const record=await api.saveRecord(fresh.token,report(id,{scheduledAt:'2026-11-15T08:00:00Z'}));
      assert.equal(record.body.treatmentVersion,1);
      await assert.rejects(api.saveRecord(fresh.token,report(id,{scheduledAt:'2025-12-31T08:00:00Z'})),/CONFLICT/);
      await inbound(id,2,{...snapshot,remindersAuthorizedUntil:null,validUntil:'2026-11-16T00:00:00Z'});
      await assert.rejects(api.saveRecord(fresh.token,report(id,{treatmentVersion:2,scheduledAt:'2026-11-17T08:00:00Z'})),/CONFLICT/);
    });
    await t.test('historical corrections remain possible after source stop and revocation',async()=>{
      const id=randomUUID();
      await inbound(id,1,snapshot);
      const initial=await api.saveRecord(fresh.token,report(id));
      await inbound(id,2,{...snapshot,status:'stopped',shared:false});
      const corrected=await api.saveRecord(fresh.token,{kind:'adherence',id:initial.id,expectedVersion:1,idempotencyKey:randomUUID(),body:{...initial.body,status:'forgotten',reason:'Correction historique fictive'}});
      assert.equal(corrected.version,2);
      assert.equal(corrected.body.treatmentVersion,1);
      await assert.rejects(api.saveRecord(fresh.token,report(id,{treatmentVersion:2})),/CONFLICT/);
    });
    await t.test('declarations pin verified source revision and corrections cannot retarget it',async()=>{
      const id=randomUUID(),other=randomUUID();
      await inbound(id,1,snapshot);
      await inbound(other,1,snapshot);
      await assert.rejects(api.saveRecord(fresh.token,report(id,{treatmentVersion:99})),/CONFLICT/);
      const missing=report(id); delete missing.body.treatmentVersion;
      await assert.rejects(api.saveRecord(fresh.token,missing),/INVALID_INPUT/);
      const initial=await api.saveRecord(fresh.token,report(id,{scheduledAt:'2026-11-15T08:00:00Z'}));
      for(const change of [{treatmentId:other},{treatmentVersion:2},{scheduledAt:'2026-11-15T09:00:00Z'}]) {
        await assert.rejects(api.saveRecord(fresh.token,{kind:'adherence',id:initial.id,expectedVersion:1,idempotencyKey:randomUUID(),body:{...initial.body,...change}}),/CONFLICT/);
      }
      await inbound(id,2,snapshot);
      await assert.rejects(api.saveRecord(fresh.token,report(id)),/CONFLICT/);
    });
    await api.saveRecord(fresh.token,{kind:'preferences',idempotencyKey:randomUUID(),body:{displayName:'Nom fictif choisi',locale:'ar'}});
    const updatedProfile=(await api.getState(fresh.token)).profile;
    assert.equal(updatedProfile.locale,'ar');
    assert.equal(updatedProfile.displayName,'Nom fictif choisi');
    await t.test('new private records, SQL validation, appointment binding and metadata preservation',async()=>{
      const save=(kind,body,extra={})=>api.saveRecord(fresh.token,{kind,body,idempotencyKey:randomUUID(),...extra});
      const thought=await save('thoughtRecord',{templateVersion:1,status:'draft',situation:'Today',thought:'',emotion:'',response:''});
      const consent=await save('consent',{purpose:'privacy-notice',noticeVersion:1,accepted:true});
      assert.ok(consent.body.recordedAt);
      for(const row of [thought,consent]) await assert.rejects(api.setShare(fresh.token,{id:row.id,version:1,shared:true,idempotencyKey:randomUUID()}),/FORBIDDEN/);
      for(const [kind,body] of [['thoughtRecord',{templateVersion:1,status:'completed',situation:'x',thought:'',emotion:'',response:''}],['consent',{purpose:'privacy-notice',noticeVersion:1,accepted:true,recordedAt:'forged'}],['preferences',{reminderDays:[0]}],['checkin',{date:'2026-11-16',contextTags:[]}],['checkin',{date:'2026-02-30',emotion:'sad'}],['journal',{format:'free',status:'saved',text:'',admin:true}]]) await assert.rejects(save(kind,body),/INVALID_INPUT/);
      const appointment=randomUUID();
      await inbound(appointment,1,{shared:true,status:'confirmed',startsAt:'2026-12-01T12:00:00Z'},'appointment');
      const body={questions:'Ask about sleep',appointmentId:appointment,appointmentVersion:1,selectedSources:[{recordId:thought.id,version:1}]};
      const prep=await save('preparation',body);
      const updated=await save('preparation',{questions:'Updated question'},{id:prep.id,expectedVersion:1});
      assert.equal(updated.body.appointmentId,appointment);
      assert.deepEqual(updated.body.selectedSources,body.selectedSources);
      await assert.rejects(api.saveRecord(b.token,{kind:'preparation',body,idempotencyKey:randomUUID()}),/FORBIDDEN/);
      await assert.rejects(save('preparation',{...body,selectedSources:[{recordId:thought.id,version:99}]}),/CONFLICT/);
      await inbound(appointment,2,{shared:true,status:'confirmed',startsAt:'2026-12-02T12:00:00Z'},'appointment');
      await assert.rejects(save('preparation',body),/CONFLICT/);
      const pref=await save('preferences',{motion:'reduced',readNoticeKeys:['welcome']});
      assert.equal((await save('preferences',{locale:'en'},{id:pref.id,expectedVersion:1})).body.motion,'reduced');
      const permissions=await admin.query("select has_function_privilege('sanad_runtime','sanad.validate_lavender_body(text,jsonb)','EXECUTE') as validator,has_table_privilege('sanad_runtime','sanad.schema_migrations','SELECT') as ledger");
      assert.deepEqual(permissions.rows[0],{validator:false,ledger:false});
    });
    const audit = await admin.query('select * from sanad.audit');
    assert.ok(!JSON.stringify(audit.rows).includes('Private synthetic text'));
    for (let i = 0; i < 10; i++) await api.signIn('+447700900098', 'wrong', 'limited-ip').catch(() => {});
    await assert.rejects(api.signIn('+447700900098', 'wrong', 'limited-ip'), /RATE_LIMITED/);
    const pool = new pg.Client({ connectionString: process.env.SANAD_DATABASE_URL });
    await pool.connect();
    try { await assert.rejects(pool.query('select * from sanad.records'), /permission denied/); }
    finally { await pool.end(); }
    await admin.query('create database sanad_seed');
    const operatorEnv={...process.env,SANAD_ADMIN_DATABASE_URL:`postgresql://postgres:${password}@127.0.0.1:${port}/sanad_seed`,SANAD_RUNTIME_PASSWORD:password};
    for(const operation of ['migrate','seed']) {
      const output=execFileSync(process.execPath,['scripts/sanad-db.mjs',operation,'--synthetic'],{encoding:'utf8',env:operatorEnv,stdio:['ignore','pipe','pipe']});
      assert.match(output,/PASS/);
    }
    const seeded=new pg.Client({connectionString:operatorEnv.SANAD_ADMIN_DATABASE_URL});
    await seeded.connect();
    try {
      const count=await seeded.query('select (select count(*)::int from sanad.profiles) as profiles,(select count(*)::int from sanad.records) as records');
      assert.deepEqual(count.rows[0],{profiles:1,records:4});
      const documents=await seeded.query("select body from sanad.records where kind='document'");
      assert.ok(documents.rows.every(r=>r.body.contentKey==='welcome' && r.body.shared===true));
    } finally { await seeded.end(); }
    process.env.SANAD_DEMO_INSTANCE_ID = randomUUID();
    await assert.rejects(api.assertEnvironment(), /UNAVAILABLE/);
    process.env.SANAD_DEMO_INSTANCE_ID = instance;
    process.env.VERCEL_ENV = 'production';
    await assert.rejects(api.assertEnvironment(), /UNAVAILABLE/);
    process.env.SANAD_PUBLISH_FICTIONAL_TEST = 'true';
    await api.assertEnvironment();
    process.env.SANAD_DEMO_INSTANCE_ID = randomUUID();
    await assert.rejects(api.assertEnvironment(), /UNAVAILABLE/);
    process.env.SANAD_DEMO_INSTANCE_ID = instance;
    delete process.env.SANAD_PUBLISH_FICTIONAL_TEST;
    await api.closeDatabase();
  } finally {
    await api?.closeDatabase();
    if (admin) await admin.end();
    docker('rm', '--force', name);
  }
});
