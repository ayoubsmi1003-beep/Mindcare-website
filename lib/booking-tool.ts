import { Type, type FunctionDeclaration } from '@google/genai';
import { z } from 'zod';
import { generateSlotsForDate } from './availability';
import { civilDate } from './booking-protocol';
export const BOOKING_FUNCTION_DECLARATIONS:FunctionDeclaration[]=[
 {name:'check_availability',description:'List offered time preferences, never actual availability.',parameters:{type:Type.OBJECT,properties:{date:{type:Type.STRING,description:'YYYY-MM-DD'}},required:['date']}},
 {name:'propose_booking',description:'Prepare a form draft; never create or confirm an appointment.',parameters:{type:Type.OBJECT,properties:{date:{type:Type.STRING},time:{type:Type.STRING},forWhom:{type:Type.STRING,enum:['moi','mon enfant','un proche']},firstTime:{type:Type.BOOLEAN}},required:['date','time']}},
];
export function checkAvailabilityHandler(date:unknown){
 const parsed=civilDate.safeParse(date);
 if(!parsed.success)return {isClosed:true,offeredPreferences:[],pending:true};
 const {slots,isClosed}=generateSlotsForDate(parsed.data);
 return {date:parsed.data,isClosed,offeredPreferences:slots.filter(s=>s.available).map(s=>s.time),pending:true};
}
const proposal=z.object({date:civilDate,time:z.string().regex(/^(?:0[89]|1[0-5]):(?:00|30)$/),forWhom:z.enum(['moi','mon enfant','un proche']).optional(),firstTime:z.boolean().optional()});
export function proposeBookingHandler(value:unknown){
 const parsed=proposal.safeParse(value);if(!parsed.success)return null;
 const {date,time}=parsed.data;
 if(!generateSlotsForDate(date).slots.some(s=>s.time===time&&s.available))return null;
 return {details:parsed.data,pending:true};
}
