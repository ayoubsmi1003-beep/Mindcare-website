"use client";
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {AppProvider} from '@/lib/app-context';
import {ChatDrawer} from '@/components/chat/ChatDrawer';
import {BookingFlow} from '@/components/booking/BookingFlow';
import type {BookingDraft} from '@/lib/public-chat';
function ChatPageContent(){
 const router=useRouter();
 const [bookingOpen,setBookingOpen]=useState(false);
 const [draft,setDraft]=useState<BookingDraft>();
 return <>
  <ChatDrawer isOpen={!bookingOpen} onClose={()=>router.push('/')} onOpenBooking={value=>{setDraft(value);setBookingOpen(true);}}/>
  <BookingFlow key={JSON.stringify(draft??null)} isOpen={bookingOpen} onClose={()=>setBookingOpen(false)} initialDraft={draft}/>
 </>;
}
export default function ChatPage(){return <AppProvider><ChatPageContent/></AppProvider>;}
