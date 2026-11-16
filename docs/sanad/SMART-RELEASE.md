# Sanad — healing, appearance and personal tools

User steering, 16 November 2026: deliver Aftercare on a new permanent Vercel hostname; improve the interface again, add night/light modes, replace the 3D lens with a healing-related interaction and add useful smart features. Continue autonomously. The original Namecheap domain is not represented as repaired.

Delivery address: https://sanad-mindcare.vercel.app. This verified project domain belongs to the existing mindcare-website project and follows its production deployment. Its root redirects to /sanad; the original website remains available. The same permanent Neon database and sole fictional account are retained.

Implementation plan and boundaries:

1. Replace the decorative 3D lens with a voluntary 30-second heart/wave breathing pause. Actual start/pause/resume/end, finite completion, hidden-page pause and reduced-motion support; no automatic storage or medical monitoring.
2. Add complete pearl light and graphite night materials. A cookie stores only the closed appearance enum; the server reads only this preference so reloads start in the selected mode. No patient content is stored in the browser.
3. Add an explainable next action from saved owner records, seven-day factual observations without imputation or scores, and a private downloadable recap excluding journal, conversation, memory and effects text. No AI/provider call or clinic transport.
4. Resume unfinished saved exercises from their elapsed time and update the same record revision. Keep existing timers, patient-controlled sharing and all modules.
5. Verify helper edge cases, UI/privacy/resumption tests, types/lint/build; inspect light/night, FR/AR/EN, phone/tablet/desktop, keyboard, theme persistence, real saved exercise resume and actual recap export. Deploy and verify root redirect, HTTPS, login and persistence on the new hostname.

Files: scoped Sanad CSS; HealingPresence/AppearanceControl/SmartCompanion/motionPreference; SanadApp/core/Resources; insights helpers and tests; centralized translations; server page preference; hostname-specific root redirect; source provenance and release evidence. No database migration, clinical checkout edits, new users, paid services or new dependency.

The Namecheap delegation remains a separately documented registrar issue. The new Vercel hostname provides the requested usable Aftercare address without changing those DNS/mail/TXT records.

## Verified implementation — 16 November 2026

PASS: 38 targeted tests (15 UI, 16 insights, four commands, three service worker), zero skips; TypeScript noEmit; targeted ESLint; optimized production build. Sanad is server rendered for the validated appearance cookie: 18.8 kB route, 181 kB first-load JavaScript. No new dependency.

PASS: final compiled browser matrix, 390/390 cases across 13 screens, FR/AR/EN, five widths (360, 390, 430, 768, 1440) and two appearances. Sixteen short chat viewport cases and eight focused geometry cases pass. Login form precedes the breathing art on mobile; phase text has 36–43 px clearance from the heart. Client and server theme-color match the selected palette. [Matrix](proofs/smart/matrix-report.json), [summary](proofs/smart/summary.json), [focused checks](proofs/smart/focused-report.json).

PASS: ten functional checks against the compiled app and permanent synthetic Neon database, without mocked API responses. Theme persists through server HTML and reload. The 30-second breathing pause stops finitely (accelerated browser clock), supports pause/resume/end and live reduced motion. Actual exercise progress saves and resumes the same ID with an incremented revision. The real downloaded recap matches saved counts and excludes eight existing private strings. Browser localStorage is empty and the service worker caches only five public assets. Three additional real-clock visible checks pass. [Functional proof](proofs/smart/functional-proof.json), [visible proof](proofs/smart/visible-proof.json).

Production publication and live-host acceptance are the remaining release steps at this source checkpoint. Physical phones, native mobile keyboard, real screen reader and closed-app push are not checked. A real model and clinic connection are not enabled; this remains the single fictional account with permanent storage.

## Published and accepted over HTTPS

Production deployment dpl_Ea9sbmvnk1HngFfH1pMEmF2NsWyS, source 4173cd282a9b1e5ab60bb6b68c7e5dcaa013e36d: READY. Native alias lookup confirms the permanent project domain https://sanad-mindcare.vercel.app points to this exact deployment. Its root returns 307 to /sanad; the portal returns 200 with private no-store. The existing website root still returns 200. No temporary access link, security bypass or paid service was used.

Live Chromium acceptance: **11/11 PASS**, real wall clock, against Vercel and the permanent synthetic database. See [production proof](proofs/smart/production/production-proof.json) and [deployment/database identity](proofs/smart/production/deployment.json). Theme persistence, secure session, saved exercise resumption, actual recap download/privacy and logout are verified. The motion recording contains no credential entry: [theme and healing interaction](proofs/smart/production/sanad-healing-motion.webm).

The test access file outside the repository now points to the new address; the phone and strong password are preserved. The database has one total and one active fictional profile. The original Namecheap domain remains unrepaired because no authenticated registrar session is available; the requested new Vercel address is operational independently.
