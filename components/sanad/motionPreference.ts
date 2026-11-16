'use client';

import {useSyncExternalStore} from 'react';

function subscribeMotion(change:()=>void) {
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change',change);
  return ()=>media.removeEventListener('change',change);
}
export function useMotionPreference() {
  return useSyncExternalStore(subscribeMotion,()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,()=>true);
}
