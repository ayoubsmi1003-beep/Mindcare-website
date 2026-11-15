import { z } from 'zod';

const text = z.string().trim().max(6000);
const nonempty = text.min(1);
const uuid = z.uuid();
const date = z.iso.date();
const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);
const resourceId = z.enum(['breathing', 'grounding', 'sleep', 'prepare']);
const bodies = {
  checkin: z.object({date, mood:z.enum(['difficult','mixed','calm']).optional(), anxiety:z.enum(['low','medium','high']).optional(),sleepHours:z.number().min(0).max(24).optional(),energy:z.enum(['low','medium','high']).optional(),effects:text.optional()}).strict().refine(value=>Object.keys(value).some(key=>key!=='date' && value[key as keyof typeof value]!==undefined && value[key as keyof typeof value]!=='')),
  adherence: z.object({treatmentId:uuid,treatmentVersion:z.number().int().positive(),scheduledAt:z.iso.datetime({offset:true}).optional(),status:z.enum(['taken','forgotten','not_taken']),reason:text.optional()}).strict(),
  adverse:z.object({text:nonempty,treatmentId:uuid.optional()}).strict(),
  journal:z.object({situation:text,emotion:text,need:text,helped:text}).strict().refine(value=>Object.values(value).some(Boolean)),
  goal:z.object({title:nonempty.max(200),origin:z.literal('personal'),targetDate:date.optional(),completed:z.boolean()}).strict(),
  activity:z.object({title:nonempty.max(200),date,status:z.enum(['planned','completed','deferred']),origin:z.literal('personal')}).strict(),
  weeklyReview:z.object({week:date,helped:text,nextStep:text}).strict().refine(value=>Boolean(value.helped||value.nextStep)),
  preparation:z.object({questions:nonempty,summary:text.optional()}).strict(),
  message:z.object({category:z.enum(['renewal','appointment','effect','administrative']),text:nonempty,status:z.enum(['draft','sent']),simulation:z.literal(true)}).strict(),
  request:z.object({category:z.enum(['renewal','appointment']),text:nonempty,status:z.literal('pending'),simulation:z.literal(true)}).strict(),
  favorite:z.object({resourceId,active:z.boolean()}).strict(),
  exerciseProgress:z.object({resourceId,seconds:z.number().int().min(0).max(7200),completed:z.boolean()}).strict(),
  preferences:z.object({displayName:nonempty.max(80).optional(),locale:z.enum(['fr','ar','en']).optional(),notifications:z.boolean().optional(),quietStart:time.optional(),quietEnd:time.optional(),memoryEnabled:z.boolean().optional(),closeScreenSafeText:z.literal(true).optional()}).strict(),
  memory:z.object({text:text.max(1000),enabled:z.boolean(),deleted:z.boolean().optional()}).strict(),
};
const version = z.number().int().positive().max(2147483647);
const saveOptions = Object.entries(bodies).map(([kind,body])=>z.object({action:z.literal('save'),kind:z.literal(kind),id:uuid.optional(),expectedVersion:version.optional(),idempotencyKey:uuid,body}).strict().refine(value=>Boolean(value.id)===Boolean(value.expectedVersion)));
export const CommandSchema = z.union([
  ...saveOptions,
  z.object({action:z.literal('share'),id:uuid,version,shared:z.boolean(),idempotencyKey:uuid}).strict(),
  z.object({action:z.literal('chat'),text:nonempty.max(4000),conversationId:uuid.optional(),idempotencyKey:uuid}).strict(),
]);
export const SignInSchema = z.object({phone:z.string().trim().min(6).max(40),password:z.string().min(1).max(256)}).strict();
export const PasswordSchema = z.object({currentPassword:z.string().min(1).max(256),newPassword:z.string().min(8).max(256)}).strict();
export type Command = z.infer<typeof CommandSchema>;
