import { z } from 'zod';
import { BindingSchema, IdSchema, ScenarioResponseSchema, type Binding, type ScenarioResponse } from './schemas';

export type ScenarioOptions = { signal?: AbortSignal; locale?: 'fr' | 'ar' | 'en'; timeoutMs?: number; quotaRemaining?: number; available?: boolean };
export interface ScenarioProvider { reply(text: string, options?: ScenarioOptions): Promise<ScenarioResponse> }

const replies = {
  fr: 'Démonstration scénarisée : je peux vous aider à préparer vos mots pour votre prochain échange. Que souhaitez-vous exprimer aujourd’hui ?',
  ar: 'محادثة تجريبية مكتوبة مسبقًا: يمكنني مساعدتك في ترتيب كلماتك للقاء القادم. ما الذي تريد التعبير عنه اليوم؟',
  en: 'Scripted demonstration: I can help you find words for your next conversation. What would you like to express today?',
};

const urgentReplies = {
  fr: 'Message de sécurité prédéfini : si vous êtes en danger immédiat ou pensez vous faire du mal, contactez les urgences locales ou rendez-vous aux urgences les plus proches. Si possible, restez avec une personne de confiance et éloignez-vous de ce qui pourrait vous blesser. Cette démonstration ne surveille pas les messages et ne contacte pas les secours.',
  en: 'Preset safety message: if you are in immediate danger or thinking of harming yourself, contact local emergency services or go to the nearest emergency department. If possible, stay with someone you trust and move away from anything you could use to hurt yourself. This demonstration does not monitor messages or contact emergency services.',
  ar: 'رسالة سلامة محددة مسبقًا: إذا كنت في خطر فوري أو تفكر في إيذاء نفسك، اتصل بخدمات الطوارئ المحلية أو اذهب إلى أقرب قسم للطوارئ. إن أمكن، ابق مع شخص تثق به وابتعد عما قد يؤذيك. هذا العرض التجريبي لا يراقب الرسائل ولا يتصل بخدمات الطوارئ.',
};
// Keyword routing is only a deterministic help shortcut; it never establishes safety or scores risk.
const urgentWording = /suicid|kill\s+myself|hurt\s+myself|harm\s+myself|end\s+my\s+life|want\s+to\s+die|me\s+tuer|me\s+faire\s+du\s+mal|veux\s+mourir|danger\s+imm[eé]diat|immediate\s+danger|انتحار|أقتل\s+نفسي|اقتل\s+نفسي|إيذاء\s+نفسي|ايذاء\s+نفسي|أريد\s+الموت|اريد\s+الموت|خطر\s+فوري/iu;

export async function scenarioReply(text: string, options: ScenarioOptions = {}): Promise<ScenarioResponse> {
  z.string().trim().min(1).max(12000).parse(text);
  if (options.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  if (options.available === false) throw new Error('provider-unavailable');
  if ((options.quotaRemaining ?? 1) <= 0) throw new Error('quota-exceeded');
  if ((options.timeoutMs ?? 5000) <= 0) throw new Error('provider-timeout');
  await Promise.resolve();
  if (options.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  return ScenarioResponseSchema.parse({ text: (urgentWording.test(text.normalize('NFKC')) ? urgentReplies : replies)[options.locale ?? 'fr'], scenario: true, origin: 'scripted-demo' });
}

const SourceSchema = BindingSchema.extend({
  sourceId: IdSchema, revision: z.number().int().positive(), currentRevision: z.number().int().positive(),
  audience: z.enum(['patient', 'patient-private', 'clinician-private']), revoked: z.boolean(), text: z.string().max(12000),
}).strict();
const GrantSchema = z.object({ sourceId: IdSchema, revision: z.number().int().positive(), revoked: z.boolean(), purpose: z.literal('patient-ai') }).strict();
const MemorySchema = z.object({ enabled: z.boolean(), items: z.array(z.object({ id: IdSchema, text: z.string().min(1).max(1000),
  derivedFrom: z.array(z.object({ sourceId: IdSchema, revision: z.number().int().positive() }).strict()).optional(),
}).strict()).max(50) }).strict();
export type PatientMemory = z.infer<typeof MemorySchema>;
export type ContextInput = { binding: Binding; sources: z.infer<typeof SourceSchema>[]; grants: z.infer<typeof GrantSchema>[]; memory: PatientMemory };

/** Inputs are loaded server-side. A text summary cannot grant access to its own provenance. */
export function buildPatientContext(input: ContextInput) {
  const binding = BindingSchema.parse(input.binding);
  const sources = z.array(SourceSchema).parse(input.sources);
  const grants = z.array(GrantSchema).parse(input.grants);
  const memory = MemorySchema.parse(input.memory);
  const allowed = sources.filter(source => source.patientId === binding.patientId && source.bindingId === binding.bindingId
    && source.audience === 'patient' && !source.revoked && source.revision === source.currentRevision
    && grants.some(grant => grant.sourceId === source.sourceId && grant.revision === source.revision && !grant.revoked)
    && !grants.some(grant => grant.sourceId === source.sourceId && grant.revision === source.revision && grant.revoked));
  const items = memory.enabled ? memory.items.filter(item => !item.derivedFrom || item.derivedFrom.every(ref => allowed.some(source => source.sourceId === ref.sourceId && source.revision === ref.revision))) : [];
  return { sources: allowed, preferences: items };
}

export function updateMemory(input: PatientMemory, change: { action: 'disable' } | { action: 'enable' } | { action: 'delete'; id: string } | { action: 'correct'; id: string; text: string }): PatientMemory {
  const memory = MemorySchema.parse(input);
  if (change.action === 'disable' || change.action === 'enable') return { ...memory, enabled: change.action === 'enable' };
  if (!memory.items.some(item => item.id === change.id)) throw new Error('memory-not-found');
  if (change.action === 'delete') return { ...memory, items: memory.items.filter(item => item.id !== change.id) };
  return MemorySchema.parse({ ...memory, items: memory.items.map(item => item.id === change.id ? { ...item, text: change.text } : item) });
}
