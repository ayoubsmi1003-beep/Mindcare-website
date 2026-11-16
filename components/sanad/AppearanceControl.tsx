'use client';

import {Moon,Sun} from 'lucide-react';
import {translate,type Locale} from '@/lib/sanad/i18n';

export function AppearanceControl({appearance,onChange,locale}:{appearance:'light'|'night';onChange:(next:'light'|'night')=>void;locale:Locale}) {
  const night=appearance==='night';
  return <button type="button" className="sn-icon-button sn-appearance" aria-label={translate(locale,'switchNight')} aria-pressed={night} title={translate(locale,night?'switchLight':'switchNight')} onClick={()=>onChange(night?'light':'night')}>{night?<Moon size={19} aria-hidden="true"/>:<Sun size={19} aria-hidden="true"/>}</button>;
}
