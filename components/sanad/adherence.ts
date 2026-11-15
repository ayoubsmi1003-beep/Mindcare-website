import type {Body, SanadRecord} from './core';

export type AdherenceStatus = 'taken' | 'forgotten' | 'not_taken';

export function adherenceBody(treatment: Pick<SanadRecord, 'id' | 'version'>, status: AdherenceStatus, reason: string, scheduledAt?: string, existing?: SanadRecord): Body {
  if (existing) return {...existing.body, status, reason};
  return {treatmentId: treatment.id, treatmentVersion: treatment.version, status, reason, ...(scheduledAt ? {scheduledAt} : {})};
}
