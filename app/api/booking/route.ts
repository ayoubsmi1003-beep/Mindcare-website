import {handlePublicBooking} from '@/lib/booking-http';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
export async function POST(request:Request){return handlePublicBooking(request);}
