import type {Metadata,Viewport} from 'next';
import {cookies} from 'next/headers';
import {SanadApp} from '@/components/sanad/SanadApp';
import './sanad.css';

export const metadata: Metadata = {title: 'MindCare Aftercare · Votre espace personnel', robots: {index: false, follow: false}, manifest:'/sanad/manifest.webmanifest', icons:{icon:'/sanad/icon.svg',apple:'/sanad/icon.svg'}};
export default async function SanadPage() {
  const value=(await cookies()).get('sanad_appearance')?.value;
  return <SanadApp initialAppearance={value==='night'?'night':'light'}/>;
}

export async function generateViewport():Promise<Viewport> {
  const value=(await cookies()).get('sanad_appearance')?.value;
  return {themeColor:value==='night'?'#12111c':'#f7f5ff',colorScheme:value==='night'?'dark':'light'};
}
