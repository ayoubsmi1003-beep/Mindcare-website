"use client";
import {useRouter} from 'next/navigation';
import {ChatDrawer} from '@/components/chat/ChatDrawer';
import {AppProvider} from '@/lib/app-context';
export default function ChatPage(){const router=useRouter();return <AppProvider><ChatDrawer isOpen onClose={()=>router.push('/')} onOpenBooking={()=>router.push('/booking')}/></AppProvider>;}
