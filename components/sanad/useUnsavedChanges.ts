'use client';
import {useEffect,useId} from 'react';
export function useUnsavedChanges(dirty:boolean){
 const source=useId();
 useEffect(()=>{if(typeof window==='undefined')return;window.dispatchEvent(new CustomEvent('sanad-dirty',{detail:{source,dirty}}));return()=>{window.dispatchEvent(new CustomEvent('sanad-dirty',{detail:{source,dirty:false}}));};},[dirty,source]);
}
