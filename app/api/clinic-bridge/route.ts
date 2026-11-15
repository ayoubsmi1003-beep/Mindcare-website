import {handleClinicBridge} from '@/lib/booking-http';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function POST(request:Request){return handleClinicBridge(request);}
