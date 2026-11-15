'use client';

import {createContext, useContext, type ReactNode} from 'react';
import {type CopyKey, type Locale} from '@/lib/sanad/i18n';
export type Body = Record<string, unknown>;
export type SanadRecord = {id: string; kind: string; body: Body; version: number; createdAt: string; updatedAt: string};
export type Share = {id: string; recordId: string; recordVersion: number; sharedAt: string; revokedAt: string | null};
export type PatientState = {profile: {id: string; displayName: string; locale: Locale}; records: SanadRecord[]; shares: Share[]};
export type Screen = 'today' | 'followup' | 'chat' | 'resources' | 'space' | 'checkin' | 'treatment' | 'appointments' | 'messages' | 'help';
export type SanadContext = {
  state: PatientState; locale: Locale; setLocale: (locale: Locale) => void; t: (key: CopyKey) => string;
  go: (screen: Screen) => void; busy: boolean;
  save: (kind: string, body: Body, record?: SanadRecord) => Promise<SanadRecord | null>;
  command: (body: Body) => Promise<Body | null>;
  cancelCommand: () => void;
  password: (currentPassword: string, newPassword: string) => Promise<boolean>;
  signOut: () => Promise<void>; reload: () => Promise<void>;
};
export const Context = createContext<SanadContext | null>(null);
export function useSanad() { const context = useContext(Context); if (!context) throw new Error('Sanad context missing'); return context; }
export function str(body: Body, key: string): string { return typeof body[key] === 'string' ? body[key] as string : ''; }
export function num(body: Body, key: string): number | undefined { return typeof body[key] === 'number' ? body[key] as number : undefined; }
export function yes(body: Body, key: string): boolean { return body[key] === true; }
export function day() { return new Intl.DateTimeFormat('en-CA', {timeZone: 'Africa/Algiers', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date()); }
export function dateLabel(value: string, locale: Locale, full = false) {
  const date = new Date(value.length === 10 ? `${value}T12:00:00+01:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-DZ' : locale === 'en' ? 'en-GB' : 'fr-DZ', {timeZone: 'Africa/Algiers', ...(full ? {weekday: 'long' as const, day: 'numeric' as const, month: 'long' as const} : {day: 'numeric' as const, month: 'short' as const, year: 'numeric' as const})}).format(date);
}
export function useRecords(kind: string) { return useSanad().state.records.filter(record => record.kind === kind).sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)); }
export function Title({eyebrow, children, description}: {eyebrow?: string; children: ReactNode; description?: string}) { return <header className="sn-page-heading">{eyebrow && <span className="sn-eyebrow">{eyebrow}</span>}<h1>{children}</h1>{description && <p>{description}</p>}</header>; }
export function Field({label, children, optional}: {label: string; children: ReactNode; optional?: boolean}) { const {t,busy} = useSanad(); return <fieldset disabled={busy} style={{border:0,padding:0,margin:0,minWidth:0}}><label className="sn-field"><span>{label}{optional && <small>{t('optional')}</small>}</span>{children}</label></fieldset>; }
export function Submit({children,disabled=false}: {children?: ReactNode;disabled?:boolean}) { const {busy,t} = useSanad(); return <button className="sn-button" type="submit" disabled={busy||disabled}>{busy ? t('saving') : children || t('save')}</button>; }
export function Empty({children}: {children: ReactNode}) { return <p className="sn-empty">{children}</p>; }
export function Options({label, options, value, onChange}: {label: string; options: readonly {value: string; label: string; symbol?: string}[]; value: string; onChange: (value: string) => void}) {
  const {busy}=useSanad();
  return <fieldset className="sn-options" disabled={busy}><legend>{label}</legend><div>{options.map(option => <button type="button" aria-pressed={value === option.value} key={option.value} onClick={() => onChange(value === option.value ? '' : option.value)}>{option.symbol && <span aria-hidden="true">{option.symbol}</span>}{option.label}</button>)}</div></fieldset>;
}
export function ShareControl({record}: {record: SanadRecord}) {
  const {state,t,command,busy,locale,go} = useSanad();
  const share = state.shares.find(share => share.recordId === record.id && share.recordVersion === record.version && !share.revokedAt);
  const withdrawn=state.shares.some(item=>item.recordId===record.id&&item.recordVersion===record.version&&!!item.revokedAt);
  const olderShared=state.shares.some(share=>share.recordId===record.id&&share.recordVersion!==record.version&&!share.revokedAt);
  return <div className="sn-sharing"><span className={`sn-tag ${share ? 'sn-tag-green' : ''}`}>{t(share ? 'shared' : 'private')} · {t('version')} {record.version}</span>{share && <small>{t('sharedSince')} {dateLabel(share.sharedAt,locale)}</small>}<button type="button" className="sn-text-button" disabled={busy||(!share&&withdrawn)} onClick={() => command({action:'share',id:record.id,version:record.version,shared:!share})}>{t(share ? 'revoke' : 'share')}</button>{withdrawn&&!share&&<p>{t('revokedVersion')}</p>}<p>{t('shareExplanation')}</p>{olderShared&&<button type="button" className="sn-text-button" onClick={()=>go('space')}>{t('olderShared')}</button>}</div>;
}
