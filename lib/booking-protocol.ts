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
export const publicBookingInput=z.discriminatedUnion('op',[
  z.object({op:z.literal('availability'),date:civilDate}).strict(),
  z.object({op:z.literal('submit'),submissionId:z.uuid(),token:receiptToken,slotToken:z.string().min(1).max(1024),firstName:personName,lastName:personName,phone,consent:z.literal(true),locale:bookingLocale}).strict(),
  z.object({op:z.literal('status'),token:receiptToken}).strict(),
  z.object({op:z.literal('cancel'),token:receiptToken}).strict(),
  z.object({op:z.literal('chat'),intent:chatIntent,locale:bookingLocale,date:civilDate.optional()}).strict().refine(input=>input.intent!=='availability'||input.date!==undefined),
]);
export type PublicBookingInput=z.infer<typeof publicBookingInput>;
export type ChatIntent=z.infer<typeof chatIntent>;
export type BookingLocale=z.infer<typeof bookingLocale>;
export const publicState=z.enum(['PENDING','CONFIRMED','REJECTED','CANCELLED','EXPIRED']);
export const slotSchema=z.object({startsAt:z.iso.datetime({offset:true}),endsAt:z.iso.datetime({offset:true}),token:z.string().max(1024)}).strict();
export const availabilitySchema=z.object({date:civilDate,timezone:z.literal('Africa/Algiers'),observedAt:z.iso.datetime({offset:true}),expiresAt:z.iso.datetime({offset:true}),slots:z.array(slotSchema).max(96)}).strict();
export const statusSchema=z.object({reference:z.uuid(),state:publicState,version:z.number().int().positive(),startsAt:z.iso.datetime({offset:true}).nullable(),endsAt:z.iso.datetime({offset:true}).nullable(),proposedStartsAt:z.iso.datetime({offset:true}).nullable(),expiresAt:z.iso.datetime({offset:true}),cancellationRequested:z.boolean()}).strict();
export type BookingStatus=z.infer<typeof statusSchema>;
export type Availability=z.infer<typeof availabilitySchema>;
export const errorCode=z.enum(['UNAVAILABLE','INVALID_INPUT','EXPIRED','NOT_FOUND','CONFLICT','CAPACITY','REPLAY']);
export const genericChatResult=z.object({code:z.enum(['AVAILABILITY','PENDING_GUIDANCE','PRIVACY_GUIDANCE']),aiAvailable:z.boolean(),availability:availabilitySchema.optional()}).strict();
export function genericChatPayload(intent:ChatIntent,locale:BookingLocale) {
  const checkedIntent=chatIntent.parse(intent);
  const checkedLocale=bookingLocale.parse(locale);
  return {topic:checkedIntent,language:checkedLocale,task:'Return only the approved generic guidance code. No dates, times, names or contact details.'};
}
export function sanitizePublicResult(input:PublicBookingInput,data:unknown) {
  return input.op==='availability'?availabilitySchema.parse(data):input.op==='chat'?genericChatResult.parse(data):statusSchema.parse(data);
}
