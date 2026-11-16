// Operator-only forward upgrade; never provisions, seeds or resets accounts.
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
export async function upgradeSanad(client, instance) {
  const sql=(await readFile(new URL('../db/sanad/004_lavender.sql',import.meta.url),'utf8')).replace(/^\uFEFF/,'').replace(/\r\n/g,'\n');
  const checksum=createHash('sha256').update(sql).digest('hex');
  await client.query('begin');
  try {
    await client.query("select pg_advisory_xact_lock(hashtextextended('sanad-schema-upgrade',0))");
    await client.query('select sanad.assert_environment($1)',[instance]);
    const baseline=await client.query("select to_regprocedure('sanad.operator_reply(uuid,uuid,uuid,uuid,text)') is not null as ready");
    if(!baseline.rows[0].ready) throw new Error('CONFLICT');
    await client.query('set local role sanad_owner');
    await client.query("create table if not exists sanad.schema_migrations(version integer primary key,checksum text not null check(checksum ~ '^[a-f0-9]{64}$'),applied_at timestamptz not null default now())");
    await client.query('revoke all on sanad.schema_migrations from public,sanad_runtime');
    const prior=await client.query('select checksum from sanad.schema_migrations where version=4');
    if(prior.rows.length) {
      if(prior.rows[0].checksum!==checksum) throw new Error('CONFLICT');
    } else {
      await client.query(sql);
      await client.query('set local role sanad_owner');
      await client.query('insert into sanad.schema_migrations(version,checksum) values(4,$1)',[checksum]);
    }
    await client.query('reset role');
    await client.query('commit');
    return {version:4,checksum};
  } catch(error) {
    await client.query('rollback');
    throw error;
  }
}
