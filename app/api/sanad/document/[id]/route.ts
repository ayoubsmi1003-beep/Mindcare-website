import { NextRequest } from 'next/server';
import { document } from '@/lib/sanad/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}) { return document(request,(await params).id); }
