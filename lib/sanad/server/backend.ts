import pg from 'pg';
import { randomBytes } from 'node:crypto';
import { digest, hashPassword, normalizePhone, verifyPassword } from './crypto.mjs';

export type Profile = { id: string; displayName: string; locale: 'fr' | 'ar' | 'en' };
export type RecordRow = { id: string; kind: string; body: Record<string, unknown>; version: number; createdAt: string; updatedAt: string };
export type ShareRow = { id: string; recordId: string; recordVersion: number; sharedAt: string; revokedAt: string | null };
export type SaveInput = { kind: string; id?: string; expectedVersion?: number; idempotencyKey: string; body: unknown };
let pool: pg.Pool | undefined;
let poolUrl: string | undefined;
const codes = new Set(['UNAUTHENTICATED','CONFLICT','INVALID_INPUT','UNAVAILABLE','FORBIDDEN','RATE_LIMITED']);
function config() {
  const url = process.env.SANAD_DATABASE_URL;
  const instance = process.env.SANAD_DEMO_INSTANCE_ID;
  if (process.env.VERCEL_ENV === 'production' || process.env.SANAD_MODE !== 'synthetic' || !url || !instance || !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(instance)) throw new Error('UNAVAILABLE');
  try {
    const parsed = new URL(url);
    if (!['postgresql:','postgres:'].includes(parsed.protocol) || !/^\/sanad_[\w-]+$/.test(parsed.pathname) || decodeURIComponent(parsed.username) !== 'sanad_runtime') throw new Error();
  } catch { throw new Error('UNAVAILABLE'); }
  if (poolUrl && poolUrl !== url) throw new Error('UNAVAILABLE');
  if (!pool) {
    pool = new pg.Pool({ connectionString: url, max: 5, connectionTimeoutMillis: 5000, idleTimeoutMillis: 10000, statement_timeout: 10000 });
    pool.on('error', () => { /* Connection failures are returned as constant UNAVAILABLE codes. */ });
    poolUrl = url;
  }
  return { instance, pool };
}
async function gate<T>(name: string, args: unknown[] = []): Promise<T> {
  try {
    const { instance, pool } = config();
    const client = await pool.connect();
    try {
      const role = await client.query("select r.rolsuper,r.rolbypassrls,(pg_has_role(current_user,'sanad_owner','MEMBER') or exists(select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='sanad' and c.relowner=r.oid)) as owner,exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='sanad' and p.proname like 'operator_%' and has_function_privilege(current_user,p.oid,'EXECUTE')) as operator from pg_roles r where r.rolname=current_user");
      if (!role.rows[0] || role.rows[0].rolsuper || role.rows[0].rolbypassrls || role.rows[0].owner || role.rows[0].operator) throw new Error('UNAVAILABLE');
      const params = [instance, ...args];
      const result = await client.query(`select sanad.${name}(${params.map((_, i) => `$${i + 1}`).join(',')}) as value`, params);
      return result.rows[0].value as T;
    } finally { client.release(); }
  } catch (error) {
    const e = error as { message?: string; code?: string };
    if (e.message && codes.has(e.message)) throw new Error(e.message);
    if (e.code === '22P02' || e.code === '23514') throw new Error('INVALID_INPUT');
    if (e.code === '23505' || e.code === '40P01' || e.code === '40001') throw new Error('CONFLICT');
    throw new Error('UNAVAILABLE');
  }
}
const tokenHash = (token: string) => digest(typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : 'invalid');
export async function assertEnvironment(): Promise<void> { await gate('assert_environment'); }
export async function signIn(phone: string, password: string, ip: string): Promise<{ token: string; expiresAt: string }> {
  const normalized = normalizePhone(phone) ?? 'invalid';
  const candidate = await gate<{ id: string; hash: string; revision: number; limited?: boolean } | null>('auth_candidate', [normalized, digest(typeof ip === 'string' ? ip.slice(0, 200) : 'unknown')]);
  const valid = await verifyPassword(password, candidate?.hash);
  if (candidate?.limited) throw new Error('RATE_LIMITED');
  if (!valid || !candidate) throw new Error('UNAUTHENTICATED');
  const token = randomBytes(32).toString('base64url');
  const expires = await gate<Date>('auth_session', [candidate.id, candidate.revision, digest(token)]);
  return { token, expiresAt: new Date(expires).toISOString() };
}
export async function resolveSession(token: string): Promise<Profile | null> {
  try { return await gate<Profile>('resolve_session', [tokenHash(token)]); }
  catch (e) { if ((e as Error).message === 'UNAUTHENTICATED') return null; throw e; }
}
export async function signOut(token: string): Promise<void> { await gate('sign_out', [tokenHash(token)]); }
export async function changePassword(token: string, currentPassword: string, newPassword: string): Promise<void> {
  const candidate = await gate<{ hash: string; revision: number; limited?: boolean }>('password_candidate', [tokenHash(token)]);
  const valid = await verifyPassword(currentPassword, candidate.hash);
  if(candidate.limited) throw new Error('RATE_LIMITED');
  if (!valid) throw new Error('UNAUTHENTICATED');
  const hash = await hashPassword(newPassword);
  await gate('change_password', [tokenHash(token), candidate.revision, hash]);
}
export async function getState(token: string): Promise<{ profile: Profile; records: RecordRow[]; shares: ShareRow[] }> { return gate('get_state', [tokenHash(token)]); }
export async function getReceipt(token: string, idempotencyKey: string): Promise<RecordRow | null> { return gate('get_receipt', [tokenHash(token), idempotencyKey]); }
export async function saveRecord(token: string, input: SaveInput): Promise<RecordRow> {
  return gate('save_record', [tokenHash(token), input.kind, input.id ?? null, input.expectedVersion ?? null, input.idempotencyKey, JSON.stringify(input.body)]);
}
export async function setShare(token: string, input: { id: string; version: number; shared: boolean; idempotencyKey: string }): Promise<ShareRow> {
  return gate('set_share', [tokenHash(token), input.id, input.version, input.shared, input.idempotencyKey]);
}
export async function closeDatabase(): Promise<void> { await pool?.end(); pool = undefined; poolUrl = undefined; }
