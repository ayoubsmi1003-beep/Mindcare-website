import { z } from 'zod';

export const IdSchema = z.string().trim().min(1).max(160);
export const DateSchema = z.iso.datetime({ offset: true });
export const BindingSchema = z.object({ patientId: IdSchema, bindingId: IdSchema }).strict();
export type Binding = z.infer<typeof BindingSchema>;
const text = z.string().min(1).max(12000);
const explicitText = z.string().trim().min(1).max(12000);
const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);

export const TreatmentSchema = z.object({
  kind: z.literal('treatment'), status: z.enum(['active', 'paused', 'stopped']),
  name: explicitText.max(300), dose: explicitText.max(1000).optional(), route: explicitText.max(300).optional(), instructions: explicitText.optional(),
  validFrom: DateSchema, validUntil: DateSchema.nullable(),
  schedule: z.array(time).max(24), asNeeded: z.boolean(),
  remindersAuthorizedUntil: DateSchema.nullable(),
}).strict().refine(value => !value.validUntil || Date.parse(value.validUntil) > Date.parse(value.validFrom), 'Invalid validity interval');

export const CheckinSchema = z.object({
  kind: z.literal('checkin'), recordedAt: DateSchema, date: z.iso.date(),
  mood: z.enum(['difficult', 'mixed', 'calm']).optional(), anxiety: z.enum(['low', 'medium', 'high']).optional(),
  sleepHours: z.number().min(0).max(24).optional(), energy: z.enum(['low', 'medium', 'high']).optional(),
  effects: z.string().trim().max(6000).optional(),
}).strict().refine(value => [value.mood, value.anxiety, value.sleepHours, value.energy, value.effects].some(item => item !== undefined && item !== ''), 'At least one observation is required');

const ObjectSchema = z.discriminatedUnion('kind', [
  TreatmentSchema,
  z.object({ kind: z.literal('identity'), displayName: text }).strict(),
  z.object({ kind: z.literal('appointment'), confirmedAt: DateSchema, startsAt: DateSchema, status: z.enum(['confirmed', 'cancelled']), location: text.optional() }).strict(),
  z.object({ kind: z.literal('instruction'), text }).strict(),
  z.object({ kind: z.literal('doctor-goal'), title: text.max(200), status: z.enum(['active', 'completed', 'withdrawn']), targetDate: z.iso.date().optional(), instructions: text.optional() }).strict(),
  z.object({ kind: z.literal('shared-document'), documentId: IdSchema, title: text, mediaType: z.string().regex(/^[\w.+-]+\/[\w.+-]+$/).optional(),
    fileName: z.string().min(1).max(255).regex(/^[^/\\\r\n]+$/).optional(), sizeBytes: z.number().int().nonnegative().safe().optional(), publishedAt: DateSchema.optional() }).strict(),
  CheckinSchema,
  z.object({ kind: z.literal('adherence'), treatmentObjectId: IdSchema, treatmentVersion: z.number().int().positive(), scheduledAt: DateSchema.optional(), declaration: z.enum(['taken', 'forgotten', 'not-taken', 'unknown']), reason: text.optional() }).strict(),
  z.object({ kind: z.literal('effect'), recordedAt: DateSchema, text }).strict(),
  z.object({ kind: z.literal('message'), text }).strict(),
  z.object({ kind: z.literal('request'), requestType: z.enum(['appointment', 'renewal', 'administrative', 'effect']), text, status: z.literal('pending') }).strict(),
  z.object({ kind: z.literal('journal'), revision: z.number().int().positive(), text: text.optional() }).strict(),
  z.object({ kind: z.literal('conversation'), revision: z.number().int().positive(), text: text.optional() }).strict(),
]);

const mindcareKinds = new Set(['identity', 'treatment', 'appointment', 'instruction', 'doctor-goal', 'shared-document']);
export const EventSchema = z.object({
  schemaVersion: z.literal(1), eventId: IdSchema, patientId: IdSchema, bindingId: IdSchema,
  objectId: IdSchema, version: z.number().int().positive(), effectiveAt: DateSchema,
  emittedAt: DateSchema, lastSyncedAt: DateSchema.optional(), source: z.enum(['mindcare', 'sanad']),
  correlationId: IdSchema, shareState: z.enum(['shared', 'revoked']), object: ObjectSchema,
}).strict().superRefine((event, ctx) => {
  if (mindcareKinds.has(event.object.kind) !== (event.source === 'mindcare')) {
    ctx.addIssue({ code: 'custom', message: 'Wrong source authority', path: ['source'] });
  }
  if (event.object.kind === 'journal' || event.object.kind === 'conversation') {
    if ((event.shareState === 'shared') !== (event.object.text !== undefined)) {
      ctx.addIssue({ code: 'custom', message: 'Only an explicitly shared revision carries content', path: ['object', 'text'] });
    }
  }
});
export type SyncEvent = z.infer<typeof EventSchema>;

export const AckSchema = z.object({
  schemaVersion: z.literal(1), eventId: IdSchema, correlationId: IdSchema,
  status: z.enum(['applied', 'duplicate', 'stale']), technicalOnly: z.literal(true),
}).strict();

export const ProvisionSchema = z.object({
  schemaVersion: z.literal(1), operationId: IdSchema, patientId: IdSchema, bindingId: IdSchema,
  authorizedBy: IdSchema, role: z.literal('doctor'), synthetic: z.literal(true), identityVerified: z.literal(true),
  consent: z.object({ portal: z.literal(true), at: DateSchema }).strict(),
  phoneStatus: z.literal('unique-test'),
}).strict();
export type ProvisionInput = z.infer<typeof ProvisionSchema>;

export const PatientProviderSchema = z.object({ provider: z.literal('scenario') }).strict();
export const ScenarioResponseSchema = z.object({ text, scenario: z.literal(true), origin: z.literal('scripted-demo') }).strict();
export type ScenarioResponse = z.infer<typeof ScenarioResponseSchema>;
