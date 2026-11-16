// Input records already belong to the server-authorized owner; this is not an access gate.
export type InsightRecord = {id: string; kind: string; body: Record<string, unknown>; version: number; createdAt: string; updatedAt: string};
export type ResourceId = 'breathing' | 'grounding' | 'sleep' | 'prepare';
export type Observation = {date: string; mood?: 'difficult' | 'mixed' | 'calm'; anxiety?: 'low' | 'medium' | 'high'; sleepHours?: number; energy?: 'low' | 'medium' | 'high'};
export type WeekFacts = {days: string[]; observations: Observation[]; recordedDays: number; sleepSamples: number; averageSleep: number | null; pendingRequests: number};
export type NextStep =
  | {kind: 'checkin'; screen: 'checkin'}
  | {kind: 'prepare'; screen: 'appointments'}
  | {kind: 'continue'; screen: 'resources'; resourceId: ResourceId}
  | {kind: 'activity'; screen: 'followup'}
  | {kind: 'pause'; screen: 'resources'};

const durations: Record<ResourceId, number> = {breathing: 180, grounding: 120, sleep: 180, prepare: 120};
const algiers = new Intl.DateTimeFormat('en-CA', {timeZone: 'Africa/Algiers', year: 'numeric', month: '2-digit', day: '2-digit'});
function isDay(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
function requireDay(today: string) {
  if (!isDay(today)) throw new RangeError('Expected an ISO calendar date');
}
function offsetDay(date: string, offset: number) {
  return new Date(Date.parse(`${date}T12:00:00Z`) + offset * 86400000).toISOString().slice(0, 10);
}
function timestamp(value: string) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(value) || !isDay(value.slice(0, 10))) return NaN;
  return Date.parse(value);
}
function compare(a: InsightRecord, b: InsightRecord) {
  return timestamp(a.updatedAt) - timestamp(b.updatedAt) || a.version - b.version || (a.id > b.id ? 1 : a.id < b.id ? -1 : 0);
}
function currentRecords(records: readonly InsightRecord[], today: string) {
  const byId = new Map<string, InsightRecord>();
  for (const record of records) {
    if (!Number.isFinite(timestamp(record.createdAt)) || !Number.isFinite(timestamp(record.updatedAt)) || !Number.isInteger(record.version) || record.version < 1) continue;
    const previous = byId.get(record.id);
    if (!previous || compare(record, previous) > 0) byId.set(record.id, record);
  }
  return [...byId.values()].filter(record => algiers.format(timestamp(record.createdAt)) <= today && algiers.format(timestamp(record.updatedAt)) <= today).sort((a, b) => compare(b, a));
}

export function weekFacts(records: readonly InsightRecord[], today: string): WeekFacts {
  requireDay(today);
  const days = Array.from({length: 7}, (_, index) => offsetDay(today, index - 6));
  const rows = currentRecords(records, today);
  const byDate = new Map<string, InsightRecord>();
  for (const record of rows) {
    const date = record.body.date;
    if (record.kind === 'checkin' && isDay(date) && date >= days[0] && date <= today && !byDate.has(date)) byDate.set(date, record);
  }
  const observations = days.flatMap(date => {
    const record = byDate.get(date);
    if (!record) return [];
    const {mood, anxiety, sleepHours, energy} = record.body;
    const observation: Observation = {date};
    if (mood === 'difficult' || mood === 'mixed' || mood === 'calm') observation.mood = mood;
    if (anxiety === 'low' || anxiety === 'medium' || anxiety === 'high') observation.anxiety = anxiety;
    if (typeof sleepHours === 'number' && Number.isFinite(sleepHours) && sleepHours >= 0 && sleepHours <= 24) observation.sleepHours = sleepHours;
    if (energy === 'low' || energy === 'medium' || energy === 'high') observation.energy = energy;
    return [observation];
  });
  const sleep = observations.flatMap(value => value.sleepHours === undefined ? [] : [value.sleepHours]);
  return {days, observations, recordedDays: observations.length, sleepSamples: sleep.length, averageSleep: sleep.length ? sleep.reduce((sum, value) => sum + value, 0) / sleep.length : null, pendingRequests: rows.filter(record => record.kind === 'request' && record.body.status === 'pending').length};
}

export function nextStep(records: readonly InsightRecord[], today: string): NextStep {
  requireDay(today);
  const rows = currentRecords(records, today);
  if (!rows.some(record => record.kind === 'checkin' && record.body.date === today)) return {kind: 'checkin', screen: 'checkin'};
  const upcoming = rows.filter(record => {
    if (record.kind !== 'appointment' || record.body.shared !== true || record.body.status !== 'confirmed') return false;
    const {startsAt, date} = record.body;
    const time = typeof startsAt === 'string' ? timestamp(startsAt) : NaN;
    const appointmentDay = startsAt !== undefined ? Number.isFinite(time) ? algiers.format(time) : null : isDay(date) ? date : null;
    return appointmentDay !== null && appointmentDay >= today && appointmentDay <= offsetDay(today, 6);
  });
  const unprepared = upcoming.some(appointment => !rows.some(record => record.kind === 'preparation' && record.body.appointmentId === appointment.id && record.body.appointmentVersion === appointment.version && typeof record.body.questions === 'string' && record.body.questions.trim().length > 0));
  if (unprepared) return {kind: 'prepare', screen: 'appointments'};
  for (const record of rows) {
    const {resourceId, seconds, completed} = record.body;
    if (record.kind === 'exerciseProgress' && completed === false && typeof resourceId === 'string' && Object.hasOwn(durations, resourceId) && typeof seconds === 'number' && Number.isInteger(seconds) && seconds > 0 && seconds < durations[resourceId as ResourceId]) return {kind: 'continue', screen: 'resources', resourceId: resourceId as ResourceId};
  }
  const activity = rows.some(record => record.body.origin === 'personal' && (record.kind === 'goal' && record.body.completed === false || record.kind === 'activity' && (record.body.status === 'planned' || record.body.status === 'deferred') && isDay(record.body.date) && record.body.date <= today));
  return activity ? {kind: 'activity', screen: 'followup'} : {kind: 'pause', screen: 'resources'};
}
