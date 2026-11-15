"use client";
import {useSyncExternalStore} from 'react';
import {useRouter} from 'next/navigation';
import {BookingFlow} from '@/components/booking/BookingFlow';
import {ReceiptTracking} from '@/components/booking/ReceiptTracking';
import {AppProvider} from '@/lib/app-context';
function subscribe(callback:()=>void){window.addEventListener('hashchange',callback);return()=>window.removeEventListener('hashchange',callback);}
function snapshot(){const hash=window.location.hash;return /^#receipt=[a-f0-9]{64}$/.test(hash)?hash.slice(9):hash.startsWith('#receipt=')?'invalid':'';}
export default function BookingPage(){const router=useRouter(),token=useSyncExternalStore(subscribe,snapshot,()=> '');return <AppProvider>{token?<ReceiptTracking key={token} token={token}/>:<BookingFlow isOpen onClose={()=>router.push('/')}/>}</AppProvider>;}
