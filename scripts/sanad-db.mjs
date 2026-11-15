// Operator only: never imported by a public route, never reads .env files.
import pg from 'pg';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { hashPassword, normalizePhone } from '../lib/sanad/server/crypto.mjs';

const command = process.argv[2];
let client;
try {
  const instance = process.env.SANAD_DEMO_INSTANCE_ID;
  if (process.env.SANAD_MODE !== 'synthetic' || process.env.VERCEL_ENV === 'production' || !instance || !process.argv.includes('--synthetic')) throw new Error('UNAVAILABLE');
  const url = new URL(process.env.SANAD_ADMIN_DATABASE_URL ?? '');
  if (!/^\/sanad_[\w-]+$/.test(url.pathname) || !['postgres:','postgresql:'].includes(url.protocol)) throw new Error('UNAVAILABLE');
  client = new pg.Client({connectionString:url.toString(),connectionTimeoutMillis:5000,statement_timeout:15000});
  await client.connect();
  if (command === 'migrate') {
    const password = process.env.SANAD_RUNTIME_PASSWORD;
    if (!password || password.length<24) throw new Error('INVALID_INPUT');
    const existing = await client.query("select exists(select 1 from information_schema.schemata where schema_name='sanad') as present");
    if (existing.rows[0].present) throw new Error('CONFLICT');
    const relations = await client.query("select count(*)::int as n from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname not in ('pg_catalog','information_schema') and n.nspname not like 'pg_toast%' and c.relkind in ('r','p')");
    if (relations.rows[0].n !== 0) throw new Error('FORBIDDEN');
    for(const file of ['001_synthetic.sql','002_function_privileges.sql','003_clinic_replies.sql'])
      await client.query(await readFile(new URL(`../db/sanad/${file}`, import.meta.url),'utf8'));
    await client.query('insert into sanad.environment(id,instance_id,mode) values(true,$1,$2)',[instance,'synthetic']);
    // Identifier is fixed; PostgreSQL cannot bind a role password as a query parameter.
    await client.query(`alter role sanad_runtime login password '${password.replaceAll("'","''")}'`);
  } else {
    await client.query('select sanad.assert_environment($1)',[instance]);
    if (command === 'seed') {
      const profiles = [['+447700900001','Lina fictive','fr','01011990']];
      if(process.argv.includes('--test-fixtures')) {
        if(!['127.0.0.1','localhost'].includes(url.hostname)) throw new Error('FORBIDDEN');
        profiles.push(['+447700900002','Samir fictif','ar','02021992'],['+447700900003','Nour fictive · adolescent','en','03032012']);
      }
      await client.query('begin');
      for (const [phone,name,locale,dob] of profiles) {
        const result = await client.query('select sanad.operator_provision($1,$2,$3,$4,$5,$6) as id',[instance,phone,name,locale,await hashPassword(dob),'operator-verified-fictional-identity-and-demo-consent']);
        const id = result.rows[0].id;
        const now = new Date();
        const appointmentDate = new Date(now.getTime()+7*86400000);
        appointmentDate.setUTCHours(13,0,0,0); // 14:00 Africa/Algiers.
        const future = appointmentDate.toISOString();
        const rows = [
          ['treatment',{name:'Produit fictif de démonstration',sourceVersion:1,lastSyncedAt:now.toISOString(),status:'active',shared:true,dose:'Sans dose réelle',route:'Scénario uniquement',schedule:[],asNeeded:true,validFrom:now.toISOString(),validUntil:null,remindersAuthorizedUntil:null,instructions:'Exemple inerte : aucune consigne de prise réelle.'}],
          ['appointment',{startsAt:future,date:future.slice(0,10),startTime:'14:00',lastSyncedAt:now.toISOString(),status:'confirmed',shared:true,location:'Lieu fictif · démonstration',confirmedAt:now.toISOString()}],
          ['prescribedGoal',{title:'Préparer une question pour le prochain rendez-vous fictif',shared:true,status:'active'}],
          ['document',{title:'Bienvenue dans la démonstration Sanad',contentKey:'welcome',shared:true}],
        ];
        for(const [kind,body] of rows) await client.query('select sanad.operator_receive($1,$2,$3,$4,1,$5)',[instance,id,randomUUID(),kind,body]);
      }
      await client.query('commit');
    } else {
      let raw='';
      for await (const chunk of process.stdin) {
        raw+=chunk.toString();
        if(Buffer.byteLength(raw)>131072) throw new Error('INVALID_INPUT');
      }
      const input = JSON.parse(raw);
      if (input.synthetic !== true || input.identityVerified !== true || input.consentVerified !== true) throw new Error('INVALID_INPUT');
      if (command === 'provision') {
        const phone=normalizePhone(input.phone);
        if (!phone || !/^\+447700900\d{3}$/.test(phone) || !validDob(input.initialDob)) throw new Error('INVALID_INPUT');
        await client.query('select sanad.operator_provision($1,$2,$3,$4,$5,$6)',[instance,phone,input.displayName,input.locale,await hashPassword(input.initialDob),'operator-verified-fictional-identity-and-demo-consent']);
      } else if(command === 'reset') {
        if (!validDob(input.initialDob)) throw new Error('INVALID_INPUT');
        await client.query('select sanad.operator_reset($1,$2,$3,$4)',[instance,input.profileId,await hashPassword(input.initialDob),'operator-identity-and-consent-reverified']);
      } else if(command === 'receive') {
        await client.query('select sanad.operator_receive($1,$2,$3,$4,$5,$6)',[instance,input.profileId,input.id,input.kind,input.version,input.body]);
      } else if(command === 'reply') {
        await client.query('select sanad.operator_reply($1,$2,$3,$4,$5)',[instance,input.profileId,input.messageId,input.id,input.text]);
      } else throw new Error('INVALID_INPUT');
    }
  }
  console.log('PASS: isolated synthetic operator operation completed');
} catch(error) {
  if(client) await client.query('rollback').catch(()=>{});
  const code = ['INVALID_INPUT','CONFLICT','FORBIDDEN','UNAVAILABLE'].includes(error.message) ? error.message : 'UNAVAILABLE';
  console.error(`FAIL: ${code}`);
  process.exitCode=1;
} finally { await client?.end(); }

function validDob(value) {
  if(typeof value!=='string' || !/^\d{8}$/.test(value)) return false;
  const day=Number(value.slice(0,2)),month=Number(value.slice(2,4)),year=Number(value.slice(4));
  const date=new Date(Date.UTC(year,month-1,day));
  return year>=1900 && date.getUTCFullYear()===year && date.getUTCMonth()===month-1 && date.getUTCDate()===day;
}
