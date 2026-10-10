"use client";
import {useRouter} from 'next/navigation';
import {BookingFlow} from '@/components/booking/BookingFlow';
import {AppProvider} from '@/lib/app-context';
export default function BookingPage(){const router=useRouter();return <AppProvider><BookingFlow isOpen onClose={()=>router.push('/')}/></AppProvider>;}
