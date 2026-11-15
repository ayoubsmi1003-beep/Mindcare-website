import { z } from 'zod';

export const bookingLocale = z.enum(['fr','ar','en']);
export const chatIntent = z.enum(['availability','booking','privacy']);
export const civilDate = z.string().regex(/^20\d{2}-\d{2}-\d{2}$/).refine(value => {
  const parsed=new Date(value+'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10)===value;
});
export const receiptToken=z.string().regex(/^[a-f0-9]{64}$/);
const personName=z.string().trim().min(1).max(80).refine(value => !/[\u0000-\u001f\u007f]/.test(value));

export function phoneCanonical(value:string):string {
  if(!/^[+0-9 ()-]{9,24}$/.test(value)) throw new Error('INVALID_CONTACT');
  let digits=value.replace(/[ ()-]/g,'');
  if(/^0\d{9}$/.test(digits)) digits='+213'+digits.slice(1);
  if(!/^\+[1-9]\d{8,14}$/.test(digits)) throw new Error('INVALID_CONTACT');
  return digits;
}
const phone=z.string().refine(value=>{try{phoneCanonical(value);return true;}catch{return false;}}).transform(phoneCanonical);
export const legacyBookingInput=z.discriminatedUnion('op',[
  z.object({op:z.literal('availability'),date:civilDate}).strict(),
  z.object({op:z.literal('submit'),submissionId:z.uuid(),token:receiptToken,slotToken:z.string().min(1).max(1024),firstName:personName,lastName:personName,phone,consent:z.literal(true),locale:bookingLocale}).strict(),
  z.object({op:z.literal('status'),token:receiptToken}).strict(),
  z.object({op:z.literal('cancel'),token:receiptToken}).strict(),
  z.object({op:z.literal('chat'),intent:chatIntent,locale:bookingLocale,date:civilDate.optional()}).strict().refine(input=>input.intent!=='availability'||input.date!==undefined),
]);
export const preferredPeriod=z.enum(['morning','afternoon']);
export const preferredTime=z.string().regex(/^(?:0[89]|1[0-5]):[0-5][0-9]$/).refine(value=>value>='08:30'&&value<='15:30');
export const preferenceBookingInput=z.discriminatedUnion('op',[
  z.object({protocolVersion:z.literal(2),op:z.literal('submit'),submissionId:z.uuid(),token:receiptToken,preferredDay:civilDate,preferredPeriod,preferredTime:preferredTime.optional(),firstName:personName,lastName:personName,phone,consent:z.literal(true),whatsappConsent:z.boolean().default(false),locale:bookingLocale}).strict().refine(input=>input.preferredTime===undefined||(input.preferredTime<'12:00'?'morning':'afternoon')===input.preferredPeriod),
  z.object({protocolVersion:z.literal(2),op:z.literal('status'),token:receiptToken}).strict(),
  z.object({protocolVersion:z.literal(2),op:z.literal('cancel'),token:receiptToken}).strict(),
]);
export type PreferenceBookingInput=z.infer<typeof preferenceBookingInput>;
export const publicBookingInput=z.union([preferenceBookingInput,legacyBookingInput]);
export type PublicBookingInput=z.infer<typeof publicBookingInput>;
export function isPreferenceInput(input:PublicBookingInput):input is PreferenceBookingInput{return 'protocolVersion' in input&&input.protocolVersion===2;}
export type ChatIntent=z.infer<typeof chatIntent>;
export type BookingLocale=z.infer<typeof bookingLocale>;
export const publicState=z.enum(['PENDING','CONFIRMED','REJECTED','CANCELLED','EXPIRED']);
export const slotSchema=z.object({startsAt:z.iso.datetime({offset:true}),endsAt:z.iso.datetime({offset:true}),token:z.string().max(1024)}).strict();
export const availabilitySchema=z.object({date:civilDate,timezone:z.literal('Africa/Algiers'),observedAt:z.iso.datetime({offset:true}),expiresAt:z.iso.datetime({offset:true}),slots:z.array(slotSchema).max(96)}).strict();
export const statusSchema=z.object({reference:z.uuid(),state:publicState,version:z.number().int().positive(),startsAt:z.iso.datetime({offset:true}).nullable(),endsAt:z.iso.datetime({offset:true}).nullable(),proposedStartsAt:z.iso.datetime({offset:true}).nullable(),expiresAt:z.iso.datetime({offset:true}),cancellationRequested:z.boolean()}).strict();
export type BookingStatus=z.infer<typeof statusSchema>;
export type Availability=z.infer<typeof availabilitySchema>;
export const errorCode=z.enum(['UNAVAILABLE','INVALID_INPUT','EXPIRED','NOT_FOUND','CONFLICT','CAPACITY','REPLAY']);
export const preferenceStatusSchema=statusSchema.extend({preferredDay:civilDate.nullable(),preferredPeriod:preferredPeriod.nullable()}).strict();
export const deliverySchema=z.object({state:z.enum(['QUEUED','RECEIVED','FAILED','EXPIRED','WITHDRAWN']),acceptedAt:z.iso.datetime({offset:true}),expiresAt:z.iso.datetime({offset:true}),failure:errorCode.optional()}).strict();
export const preferenceReceiptSchema=z.object({submissionId:z.uuid(),delivery:deliverySchema,booking:preferenceStatusSchema.nullable()}).strict().refine(value=>value.delivery.state!=='QUEUED'||value.booking===null);
export type PreferenceReceipt=z.infer<typeof preferenceReceiptSchema>;
export const genericChatResult=z.object({code:z.enum(['AVAILABILITY','PENDING_GUIDANCE','PRIVACY_GUIDANCE']),aiAvailable:z.boolean(),availability:availabilitySchema.optional()}).strict();
export function genericChatPayload(intent:ChatIntent,locale:BookingLocale) {
  const checkedIntent=chatIntent.parse(intent);
  const checkedLocale=bookingLocale.parse(locale);
  return {topic:checkedIntent,language:checkedLocale,task:'Return only the approved generic guidance code. No dates, times, names or contact details.'};
}
export function sanitizePublicResult(input:PublicBookingInput,data:unknown) {
  if(isPreferenceInput(input))return preferenceReceiptSchema.parse(data);
  return input.op==='availability'?availabilitySchema.parse(data):input.op==='chat'?genericChatResult.parse(data):statusSchema.parse(data);
}
