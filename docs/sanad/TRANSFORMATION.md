# MindCare Aftercare — approved transformation

User approved implementation on 16 November 2026. Source baseline 4e67683; branch codex/aftercare-lavender. Read the supplied product brief and inline approved plan as the intent. This file locks shared interfaces and records execution progress.

## Delivery and boundaries
- Patient app only. Same project, permanent sanad-mindcare.vercel.app, same Neon database, account/password and records. No clinical checkout edits, real patients, new permanent DB, actual cabinet transport, external AI, background push or destructive retention changes.
- Images 1–2 govern lavender design; 6 emotion controls; 4 forms/scheduling; 3 exercise composition; 5 factual arcs only. Mobile compact, original meaningful SVGs, full light/night, FR/AR/EN. No 3D heart or garden metaphor.
- Four tabs Home/Journey/Studio/Cabinet plus quick add, profile settings. URL view/section state, accessible drawers, browser Back and safe-area/keyboard handling.
- Retain API/SQL authorization, session hashing, ownership/RLS, optimistic versions and idempotence. Never print secrets or read .env. All business writes through gates.

## Shared interfaces (authoritative for this implementation)
Existing useSanad/core context remains; root owns core.tsx and SanadApp.tsx. go(Screen) remains and gains 'journal'|'weekly'|'thought'|'notifications'. openResource(ResourceId) unchanged; ResourceId remains four timed exercises only. Feature components may use contextual section props for URL navigation. Root will add optional sessionSummary to PatientState: {activeCount:number;otherCount:number;currentExpiresAt:string}.

All translations stay in lib/sanad/i18n. Feature owners create their OWN dictionary modules with a typed helper and FR/EN/AR values; do not concurrently edit index.ts. Reuse existing t for existing keys. All new CSS is root-owned; use existing sn-* semantic classes and mc-* classes listed by feature owner. Existing controls Field/Submit/Options/ShareControl continue working.

### Bodies accepted by existing save endpoint (strict, additive)
- checkin: all existing fields retained; optional emotion: happy|calm|excited|tired|sad|anxious; intensity integer1..5; stress low|medium|high; sleepQuality poor|fair|restful; contextTags array of work|family|health|social|rest|other (max6); note string. At least one actual observation; daily date remains explicit. No draft write over submitted checkin during steps.
- journal: existing four-field guided shape retained. New guided format:'guided', status:'draft'|'saved', situation/emotion/need/helped. New format:'free', text:string, status:'draft'|'saved'. At least one meaningful value for save.
- thoughtRecord: {templateVersion:1,status:'draft'|'completed',situation:string,thought:string,emotion:string,response:string,intensity?:integer1..5}. At least one nonempty field for draft; completion requires situation and thought. Private only.
- weeklyReview: existing {week,helped,nextStep} plus optional difficult:string,status:'draft'|'completed',templateVersion:1. At least helped or nextStep or difficult. Reuse same weekly record, never duplicate a weekly worksheet kind. Legacy missing status displayed as recorded, not invented completion.
- preparation: existing questions,summary plus optional appointmentId UUID,appointmentVersion positive int,selectedSources:[{recordId UUID,version positive int}] max20. Pair id/version required together. Verify owner/shared confirmed current appointment and source revisions. Legacy unlinked preparations remain general notes; missing fields on legacy updates preserve existing added metadata.
- preferences: existing keys plus onboardingVersion:1, reminderDays integerISO weekdays1..7[], readNoticeKeys string[] max200, motion:'system'|'reduced', textSize:'standard'|'large'. Optional reminders default off.
- consent: {purpose:'privacy-notice'|'in-app-reminders',noticeVersion:1,accepted:boolean}. Timestamp server-only, revisions/audit retained. These are demo acknowledgement choices, not qualified clinical consent.
- chat command gains optional locale fr|ar|en and preserves scenario-only boundary; deterministic urgent guidance, not risk scoring.
- new command {action:'revokeOtherSessions',idempotencyKey:UUID}, return {ok:true,revokedCount:number}. Same origin/session checks and server gate. Keep current session usable, no session secrets in response.

### Database upgrade
New forward migration004 only. Existing001–003 immutable. Add private kinds and validating gates, metadata preservation, appointment binding, session summary/revocation and SQL grant allowlist journal/conversation only (legacy owner revocation still allowed). Runner must upgrade an initialized populated synthetic DB transactionally/idempotently without seed/reset and verify marker/checksum. Fresh installs include004. Test upgrade preserves credentials, IDs, revisions and shares. Do not apply to permanent Neon until isolated tests pass and recovery copy is secured privately.

## Component ownership
- Root: SanadApp/core, CSS, page/metadata, product dictionaries, shared illustration/shell/home/onboarding/notifications, integration and UI tests, browser proofs, deployment.
- Backend worker: commands/http/server, migration004 and upgrade runner, insights appointment matching, provider emergency guidance, backend/command/integration tests. No UI/CSS/i18n index edits. No live DB or deploy actions.
- Journey worker: new CheckinFlow.tsx, Journey.tsx, lib/sanad/journey.ts helpers and tests, i18n/journey.ts. Export CheckinFlow and Journey({section?:'overview'|'journal'|'week',onSectionChange?}). Keep Treatment in Tracking.tsx unchanged. Journal search/freewriting/draft/share; factual7/30/90-day charts/timeline; goals/activity workflows. Weekly reflection link calls go('weekly'). No CSS/core edits.
- Studio/Care worker: Studio.tsx and CareSpaces.tsx plus i18n/studio.ts and i18n/care.ts. Studio({initialResource?:ResourceId,worksheet?:'thought'|'weekly'}), Cabinet({section?:'appointments'|'messages'|'documents'|'treatment',onSectionChange?}), PatientSettings(), PatientHelp(). May reuse Treatment/Chat from old files. Appointments bound preparation and patient-selected source preview. Worksheets private drafts/resume. Settings export/session/reminder/accessibility. No CSS/core/backend edits.

## Design tokens and states
Light #F7F5FF/#252039/#6C5CE7; night #12111C/#1D1B2A/#B8A4FF. Primary hero dark-violet gradient supports white text with measured AA contrast. 20px mobile margins, 24px feature radius,16px input radius,44px targets. Headings28–32px mobile, body15–16px, labels13px+. Existing self-hosted fonts; Motion already installed. Motion160/220/280ms, no ambient animation running by default. Generic skeleton/empty/error/offline/unauthorized and save retry states required. No new dependency.

## Execution ledger
- [x] Baseline audited;62 non-DB tests passed during planning. Clean source and branch verified before work.
- [x] Database/API backward-compatible implementation and isolated upgrade/isolation tests.
- [x] Checkin, journey, journal and program implementation/tests.
- [x] Studio/worksheets, cabinet, settings and help implementation/tests.
- [x] Shell, home, onboarding, notifications and reference-led visual system.
- [x] Integrated types/lint/test/build; fresh review and corrections.
- [ ] Recovery copy + permanent upgrade, exact-commit production publication, real HTTPS verification.
- [ ] Fresh reference comparison/screenshots and Desktop gallery; final evidence and clean Git.

Verification: actual primary flows through API to PostgreSQL and reload. Test missing/legacy data, invalid inputs, revoked shares, direct private-kind grants, conflicts/retries, changed appointments, Algiers midnight, responsive360/390/430/768/1440, three languages/two themes, keyboard/focus, reduced motion, physical devices only if accessible. No silent skips. Keep previous Desktop gallery untouched.
