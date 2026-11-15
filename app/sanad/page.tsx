import type {Metadata} from 'next';
import {SanadApp} from '@/components/sanad/SanadApp';
import './sanad.css';

export const metadata: Metadata = {title: 'Sanad · Espace patient', robots: {index: false, follow: false}, manifest:'/sanad/manifest.webmanifest', icons:{icon:'/sanad/icon.svg',apple:'/sanad/icon.svg'}};
export default function SanadPage() { return <SanadApp />; }
