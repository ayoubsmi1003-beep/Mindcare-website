import { createHash } from 'node:crypto';
import { AckSchema, BindingSchema, EventSchema, ProvisionSchema, type Binding, type ProvisionInput, type SyncEvent } from './schemas';

export type ReceiverState = {
  binding: Binding;
  seen: { eventId: string; digest: string }[];
  versions: { key: string; version: number; digest: string }[];
  objects: SyncEvent[];
  revokedRevisions: string[];
  revisionDigests: { key: string; digest: string }[];
};
const keyOf = (event: SyncEvent) => JSON.stringify([event.object.kind, event.objectId]);
const revisionKey = (event: SyncEvent) => 'revision' in event.object ? JSON.stringify([keyOf(event), event.object.revision]) : null;
const digestOf = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const sameBinding = (a: Binding, b: Binding) => a.patientId === b.patientId && a.bindingId === b.bindingId;

export function createReceiver(binding: Binding): ReceiverState {
  return { binding: BindingSchema.parse(binding), seen: [], versions: [], objects: [], revokedRevisions: [], revisionDigests: [] };
}

/** Pure synthetic receiver. Scope and sender come from authenticated transport, never the event. */
export function receiveEvent(state: ReceiverState, input: unknown, verifiedBinding: Binding, verifiedSender: SyncEvent['source']) {
  const event = EventSchema.parse(input);
  if (event.source !== EventSchema.shape.source.parse(verifiedSender)) throw new Error('sender-authority-mismatch');
  if (!sameBinding(state.binding, BindingSchema.parse(verifiedBinding)) || !sameBinding(event, verifiedBinding)) throw new Error('binding-mismatch');
  const digest = digestOf(event);
  const seen = state.seen.find(item => item.eventId === event.eventId);
  const ack = (status: 'applied' | 'duplicate' | 'stale') => AckSchema.parse({ schemaVersion: 1, eventId: event.eventId, correlationId: event.correlationId, status, technicalOnly: true });
  if (seen) {
    if (seen.digest !== digest) throw new Error('event-id-conflict');
    return ack('duplicate');
  }
  const key = keyOf(event);
  const versions = state.versions.filter(item => item.key === key);
  if (versions.some(item => item.version === event.version)) throw new Error('object-version-conflict');
  const revision = revisionKey(event);
  if (revision && event.shareState === 'shared' && state.revokedRevisions.includes(revision)) throw new Error('revision-revoked');
  const contentDigest = revision && event.shareState === 'shared' ? digestOf(event.object) : null;
  const previousContent = state.revisionDigests.find(item => item.key === revision);
  if (previousContent && contentDigest && previousContent.digest !== contentDigest) throw new Error('revision-content-conflict');
  state.seen.push({ eventId: event.eventId, digest });
  state.versions.push({ key, version: event.version, digest });
  if (revision && contentDigest && !previousContent) state.revisionDigests.push({ key: revision, digest: contentDigest });
  if (event.shareState === 'revoked') {
    if (revision) {
      if (!state.revokedRevisions.includes(revision)) state.revokedRevisions.push(revision);
      state.objects = state.objects.filter(item => revisionKey(item) !== revision);
      return ack('applied');
    }
    // Authority revocations take effect on their date; retain the earlier timeline.
  }
  state.objects.push(event);
  return ack(versions.some(item => item.version > event.version) ? 'stale' : 'applied');
}

export function currentObject(state: ReceiverState, kind: SyncEvent['object']['kind'], objectId: string, now: string): SyncEvent | null {
  const at = Date.parse(now);
  if (!Number.isFinite(at)) throw new Error('invalid-time');
  const object = state.objects.filter(item => item.object.kind === kind && item.objectId === objectId && Date.parse(item.effectiveAt) <= at)
    .sort((a, b) => b.version - a.version)[0];
  return object?.shareState === 'shared' ? object : null;
}

export function reminderStatus(event: SyncEvent | null, now: string) {
  if (!event || event.shareState !== 'shared') return 'not-shared';
  if (event.object.kind !== 'treatment') return 'not-treatment';
  const value = event.object;
  const at = Date.parse(now);
  if (!Number.isFinite(at)) throw new Error('invalid-time');
  if (value.status !== 'active') return 'inactive';
  if (Date.parse(event.effectiveAt) > at || Date.parse(value.validFrom) > at || (value.validUntil && Date.parse(value.validUntil) <= at)) return 'outside-validity';
  if (value.asNeeded || value.schedule.length === 0) return 'no-fixed-schedule';
  if (!value.remindersAuthorizedUntil) return 'authorization-required';
  if (Date.parse(value.remindersAuthorizedUntil) <= at) return 'authorization-expired';
  return 'eligible';
}

export type ProvisionState = {
  accounts: { patientId: string; bindingId: string }[];
  operations: { operationId: string; digest: string; binding: Binding }[];
  audit: { operationId: string; authorizedBy: string; patientId: string; consentAt: string; action: 'synthetic-account-created' | 'synthetic-account-already-exists' }[];
};
export type ProvisionAuthority = Pick<ProvisionInput, 'patientId' | 'bindingId' | 'authorizedBy' | 'role'>;
const ProvisionAuthoritySchema = ProvisionSchema.pick({ patientId: true, bindingId: true, authorizedBy: true, role: true });

/** Developer fixture only; no credentials, clinical access, message delivery or real account creation. */
export function provisionSyntheticAccount(state: ProvisionState, input: ProvisionInput, verifiedAuthority: ProvisionAuthority) {
  const request = ProvisionSchema.parse(input);
  const authority = ProvisionAuthoritySchema.parse(verifiedAuthority);
  if (!sameBinding(request, authority) || request.authorizedBy !== authority.authorizedBy) throw new Error('provision-authority-mismatch');
  const digest = digestOf(request);
  const previous = state.operations.find(item => item.operationId === request.operationId);
  if (previous) {
    if (previous.digest !== digest) throw new Error('operation-id-conflict');
    return { status: 'duplicate' as const, binding: previous.binding };
  }
  const binding = BindingSchema.parse({ patientId: request.patientId, bindingId: request.bindingId });
  const account = state.accounts.find(item => item.patientId === binding.patientId || item.bindingId === binding.bindingId);
  if (account && !sameBinding(account, binding)) throw new Error('ambiguous-binding');
  state.operations.push({ operationId: request.operationId, digest, binding });
  state.audit.push({ operationId: request.operationId, authorizedBy: request.authorizedBy, patientId: request.patientId, consentAt: request.consent.at,
    action: account ? 'synthetic-account-already-exists' : 'synthetic-account-created' });
  if (account) return { status: 'already-exists' as const, binding };
  state.accounts.push(binding);
  return { status: 'created' as const, binding };
}
