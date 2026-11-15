'use client';

import {useRef,useSyncExternalStore} from 'react';
import {motion,useAnimationFrame,useInView,useMotionValue,useSpring} from 'motion/react';

function subscribeMotion(change:()=>void) {
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change',change);
  return ()=>media.removeEventListener('change',change);
}
export function useMotionPreference() {
  return useSyncExternalStore(subscribeMotion,()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,()=>true);
}

/** A CSS glass study: no canvas, external assets, device sensors or patient input. */
export function GlassSculpture() {
  const element=useRef<HTMLDivElement>(null);
  const visible=useInView(element);
  const reduced=useMotionPreference();
  const x=useMotionValue(17),y=useMotionValue(-28),float=useMotionValue(0);
  const rotateX=useSpring(x,{stiffness:65,damping:22});
  const rotateY=useSpring(y,{stiffness:65,damping:22});
  useAnimationFrame(time=>{
    if(visible&&!reduced&&!document.hidden)float.set(Math.sin(time/2400)*9);
  });
  return <div ref={element} className="sn-sculpture" aria-hidden="true"
    onPointerMove={event=>{
      if(reduced||event.pointerType!=='mouse')return;
      const rect=event.currentTarget.getBoundingClientRect();
      x.set(17+(event.clientY-rect.top-rect.height/2)/24);
      y.set(-28+(event.clientX-rect.left-rect.width/2)/18);
    }} onPointerLeave={()=>{x.set(17);y.set(-28);}}>
    <span className="sn-sculpture-line"/><span className="sn-sculpture-line"/>
    <motion.div className="sn-lens-body" style={reduced?undefined:{rotateX,rotateY,rotateZ:-30,y:float}}>
      <span className="sn-lens"/><span className="sn-lens"/><span className="sn-lens"/>
    </motion.div>
  </div>;
}
