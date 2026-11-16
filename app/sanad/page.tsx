import type {Metadata,Viewport} from 'next';
import {cookies} from 'next/headers';
import {SanadApp} from '@/components/sanad/SanadApp';
import './sanad.css';

export const metadata: Metadata = {title: 'Sanad · Espace patient', robots: {index: false, follow: false}, manifest:'/sanad/manifest.webmanifest', icons:{icon:'/sanad/icon.svg',apple:'/sanad/icon.svg'}};
export default async function SanadPage() {
  const value=(await cookies()).get('sanad_appearance')?.value;
  return <SanadApp initialAppearance={value==='light'?'light':'night'}/>;
}

export async function generateViewport():Promise<Viewport> {
  const value=(await cookies()).get('sanad_appearance')?.value;
  return {themeColor:value==='light'?'#f6f4ef':'#090c12',colorScheme:value==='light'?'light':'dark'};
}
