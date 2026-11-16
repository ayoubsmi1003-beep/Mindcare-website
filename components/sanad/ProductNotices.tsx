'use client';
import {ArrowRight,Bell,CalendarDays,Check,MessageCircle,ClipboardCheck} from 'lucide-react';
import {buildNotices} from '@/lib/sanad/notices';
import {productText} from '@/lib/sanad/i18n/product';
import {day,dateLabel,useSanad} from './core';
export function ProductNotices(){
 const {state,locale,save,busy,go}=useSanad(),p=(key:Parameters<typeof productText>[1])=>productText(locale,key);
 const preferences=state.records.find(r=>r.kind==='preferences'),body=preferences?.body||{};
 const time=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:'Africa/Algiers'}).format(new Date());
 const notices=buildNotices(state.records,day(),time,body),read=Array.isArray(body.readNoticeKeys)?body.readNoticeKeys:[];
 const titles={appointment:'noticeAppointment',message:'noticeMessage',activity:'noticeActivity',checkin:'noticeCheckin'} as const;
 const icons={appointment:CalendarDays,message:MessageCircle,activity:Check,checkin:ClipboardCheck};
 return <section className="mc-notices"><header className="sn-page-heading"><span className="sn-eyebrow">MindCare Aftercare</span><h1>{p('noticeTitle')}</h1><p>{p('noticeBody')}</p></header>{notices.length===0?<div className="mc-illustrated-empty"><Bell size={42}/><p>{p('noticeEmpty')}</p></div>:<div className="mc-notice-list">{notices.map(notice=>{const Icon=icons[notice.kind],seen=read.includes(notice.key);return <article key={notice.key} data-read={seen}><span className="mc-stat-icon"><Icon size={22}/></span><div><h2>{p(titles[notice.kind])}</h2><time>{dateLabel(notice.date,locale)}</time><div className="sn-actions"><button type="button" className="sn-text-button" onClick={()=>go(notice.screen)}>{p('open')}<ArrowRight size={16}/></button><button type="button" className="sn-text-button" disabled={busy||seen} onClick={()=>save('preferences',{...body,readNoticeKeys:[...new Set([...read.filter((key):key is string=>typeof key==='string'),notice.key])].slice(-200)},preferences)}>{p(seen?'read':'markRead')}</button></div></div></article>;})}</div>}</section>;
}
