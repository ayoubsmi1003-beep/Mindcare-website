import { preferenceBookingInput } from './booking-protocol';
import { generateSlotsForDate } from './availability';
import type { BookingFormState } from './types';
export function bookingSubmission(form:BookingFormState,identity:{submissionId:string;token:string},locale:'fr'|'ar'|'en'){
 const names=form.patientName.trim().split(/\s+/);
 if(names.length<2||!generateSlotsForDate(form.selectedDate).slots.some(s=>s.time===form.selectedTime&&s.available))throw new Error('INVALID_INPUT');
 return preferenceBookingInput.parse({protocolVersion:2,op:'submit',...identity,firstName:names[0],lastName:names.slice(1).join(' '),phone:form.patientPhone,consent:form.consent,whatsappConsent:false,locale,preferredDay:form.selectedDate,preferredPeriod:form.selectedTime<'12:00'?'morning':'afternoon',preferredTime:form.selectedTime});
}
