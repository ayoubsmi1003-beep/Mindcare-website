'use client';
import {useEffect,useId,useRef,type ReactNode} from 'react';
import {X} from 'lucide-react';
import {productText} from '@/lib/sanad/i18n/product';
import type {Locale} from '@/lib/sanad/i18n';
export function ProductDialog({title,locale,onClose,children,wide=false}:{title:string;locale:Locale;onClose:()=>void;children:ReactNode;wide?:boolean}){
 const element=useRef<HTMLDivElement>(null),close=useRef(onClose),id=useId();
 useEffect(()=>{close.current=onClose;},[onClose]);
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  const dialog=element.current;dialog?.querySelector<HTMLElement>('h2')?.focus({preventScroll:true});
  function key(event:KeyboardEvent){
   if(event.key==='Escape'){event.preventDefault();close.current();return;}
   if(event.key!=='Tab'||!dialog)return;
   const controls=[...dialog.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(e=>e.getClientRects().length);
   const first=controls[0],last=controls.at(-1);if(!first){event.preventDefault();return;}
   if(event.shiftKey&&(document.activeElement===first||!controls.includes(document.activeElement as HTMLElement))){event.preventDefault();last?.focus();}else if(!event.shiftKey&&(document.activeElement===last||!controls.includes(document.activeElement as HTMLElement))){event.preventDefault();first.focus();}
  }
  document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus({preventScroll:true});};
 },[]);
 return <div className="mc-dialog-scrim" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div ref={element} className={`mc-dialog ${wide?'mc-dialog-wide':''}`} role="dialog" aria-modal="true" aria-labelledby={id}><header><h2 id={id} tabIndex={-1}>{title}</h2><button type="button" className="sn-icon-button" onClick={onClose} aria-label={productText(locale,'close')}><X size={22}/></button></header><div className="mc-dialog-body">{children}</div></div></div>;
}
