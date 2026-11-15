import { randomBytes, scrypt as derive, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(derive);
const dummy = `scrypt$16384$${'0'.repeat(32)}$${'0'.repeat(128)}`;
export function normalizePhone(input) {
  if (typeof input !== 'string' || input.length > 40) return null;
  let phone = input.replace(/[\s()-]/g, '');
  if (phone.startsWith('00')) phone = `+${phone.slice(2)}`;
  if (/^0[567]\d{8}$/.test(phone)) phone = `+213${phone.slice(1)}`;
  return /^\+[1-9]\d{7,14}$/.test(phone) ? phone : null;
}
export async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 8 || password.length > 256) throw new Error('INVALID_INPUT');
  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$16384$${salt}$${key.toString('hex')}`;
}
export async function verifyPassword(password, hash) {
  const valid = typeof hash === 'string' && /^scrypt\$16384\$[a-f0-9]{32}\$[a-f0-9]{128}$/.test(hash);
  const [, , salt, expected] = (valid ? hash : dummy).split('$');
  const inputValid = typeof password === 'string' && password.length <= 256;
  const actual = await scrypt(inputValid ? password : '', salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return timingSafeEqual(actual, Buffer.from(expected, 'hex')) && valid && inputValid;
}
export const digest = value => createHash('sha256').update(value).digest('hex');
