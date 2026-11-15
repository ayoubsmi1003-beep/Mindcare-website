import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone, hashPassword, verifyPassword } from './crypto.mjs';
test('phone normalization preserves fictional and Algerian identities without merging distinct phones',()=>{
  assert.equal(normalizePhone('+44 7700 900001'),'+447700900001');
  assert.equal(normalizePhone('00213 555 123 456'),'+213555123456');
  assert.equal(normalizePhone('0555 123 456'),'+213555123456');
  assert.equal(normalizePhone('+44 (7700) 900002'),'+447700900002');
  assert.equal(normalizePhone(''),null);
  assert.equal(normalizePhone('phone'),null);
});
test('passwords use distinct salts, verify only the correct secret, and malformed hashes fail',async()=>{
  const one=await hashPassword('synthetic-password-1');
  const two=await hashPassword('synthetic-password-1');
  assert.notEqual(one,two);
  assert.equal(await verifyPassword('synthetic-password-1',one),true);
  assert.equal(await verifyPassword('incorrect',one),false);
  assert.equal(await verifyPassword('incorrect',null),false);
  await assert.rejects(hashPassword('short'),/INVALID_INPUT/);
});
