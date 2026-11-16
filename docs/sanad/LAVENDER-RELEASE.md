# MindCare Aftercare — Lavender

16 November 2026. Patient-only transformation of the existing persistent demonstration. Permanent address: [MindCare Aftercare](https://sanad-mindcare.vercel.app/). The existing project, owned Neon database, sole fictional profile, password and saved data are preserved. Production is **READY**, deployment `dpl_G2Kn4ZqhsnYLbBmMixbsNVyfQ3fX`, source `ab7cc9dcbaff18c31b3befcafe350c4dba57a723`; the permanent alias is verified. See [production-release.json](proofs/lavender/production-release.json).

## Experience

- Four tabs: Accueil, Parcours, Studio, Cabinet; quick-add sheet, profile settings, factual notices and urgent help. Screens and selected tools update the URL and respect browser Back. Dirty input is guarded; saved drafts resume from PostgreSQL.
- Compact lavender composition inspired by the approved first two references: original landscape illustrations, small healing-wave identity, translucent navigation and restrained interaction motion. No garden metaphor or 3D heart. Full light/night, FR/EN/AR, RTL, large text and reduced motion; consistent installed-app icon and generic offline screen.
- Optional three-step check-in, six emotional observations, sleep/context, factual 7/30/90-day charts and timeline. Emotion-only records appear as categorical points, without a fabricated numerical mood trend or health score.
- Searchable free/guided journal, revision-specific sharing and withdrawal, personal goals and activities. Thought record and weekly reflection support private drafts and completion; weekly reflection uses the existing weekly record. Both worksheets are demonstration content awaiting clinical review.
- Studio catalogue, favorites and real elapsed-time exercise pause/resume. Cabinet brings together synthetic appointments, selected-source preparation with preview, messages, documents and existing treatment declarations.
- Explicit demonstration privacy choices, optional reminders visible only inside the app, quiet hours in Algiers, owner-only JSON export and revocation of other sessions. The scenario conversation stays bounded and offers deterministic urgent guidance in the chosen language.

## Data and review

Migration `004_lavender.sql` is additive; applied migrations 001–003 remain unchanged. Isolated populated PostgreSQL tests verify upgrade, rollback, credentials, IDs, revisions, shares, ownership, private-kind grant denial and concurrent/versioned writes.

Before the permanent upgrade, a native Neon manual recovery snapshot was created and listed. Migration 004 then ran in one transaction with instance verification, table locks and equal before/after full-row fingerprints for environment, profiles, records, revisions and shares. One profile, 33 records, 47 revisions and four share records were preserved. No reset, reseed or password change occurred. See [database-upgrade.json](proofs/lavender/database-upgrade.json). The snapshot itself was not restored; populated-database recovery behavior was exercised only in the isolated tests.

Fresh independent review found four P2 issues: local-only tool selection, incomplete dirty-form coverage, a missing optional effects field and a UTC day comparison. All four were corrected. Root review added emotion-only chart coverage, corrected the repeated Arabic Cancel touch target and removed duplicate navigation/illustration from the active exercise screen. Regression checks observed the relevant failures before their fixes.

## Verification

Observed during release verification:

- **100/100 automated tests**, zero failures or skips, including real isolated PostgreSQL gates and populated upgrade tests.
- **One complete HTTP integration test** through the compiled Next server to a disposable PostgreSQL database: authentication, persistence/revisions, privacy, preparation, sessions and password revocation.
- **17/17 functional Chromium checks** through real UI → HTTP → PostgreSQL, including offline failure retention, drafts, selected-source preparation, sharing withdrawal, exercise resume, downloads, theme reload, export and revocation.
- Scoped ESLint, TypeScript and optimized Next build passed. `/sanad` is 48.7 kB, 208 kB first-load JavaScript in the observed local build. No dependencies added.
- **600/600 responsive cases**: 20 screens × five widths (360/390/430/768/1440) × three languages × two themes. No document/control overflow, unnamed fields, undersized targets, RTL mismatch, replacement characters or page errors. See [responsive-matrix.json](proofs/lavender/responsive-matrix.json). After the final exercise layout simplification, **30/30 additional cases** verify the changed screen in all width/language/theme combinations, including exactly one Back button; [follow-up proof](proofs/lavender/exercise-followup.json), [final live screen](proofs/lavender/screens/live-exercise-paused.png). Native progress color then received a single CSS accent rule, verified on production in light and night themes.
- **Four accessibility follow-ups** passed: 15 large-text views at 360 pixels, saved reduced motion after reload, keyboard focus containment/return, short chat viewport and actual offline navigation with three languages and functional exercise controls. The short chat viewport approximates a keyboard; it is not physical-device evidence. See [accessibility.json](proofs/lavender/accessibility.json).
- Production evidence is stored separately under [proofs/lavender](proofs/lavender). Screenshots are observations of those exact runs; old gallery images remain historical.

## Published acceptance and gallery

**17/17 real HTTPS UI workflows passed on the final source commit**, against the permanent database; nine additional live screens include the other exercise tools, favorites, scenario response and dirty-input dialog. No page exception or external model/provider request occurred. Root redirect, portal, original website and unauthenticated privacy boundary passed. The existing website's `/sanad` link also passed actual sign-in, account-state and sign-out checks.

The 40-second recording uses real time, includes the breathing animation and a saved session progressing from 20 to 26 seconds after a 6.5-second wait, and records no credential entry. Light/night progress accents were measured from the rendered controls. See [motion proof](proofs/lavender/production-motion.json).

Desktop delivery: `C:\Users\ABC Informatique\Desktop\MindCare Aftercare - Lavender - 2026-11-16\OPEN-GALLERY.html` contains **129 full-resolution PNG captures and one WebM walkthrough**. Search, group filters, image viewer, Escape, small-screen layout and video metadata/playback passed. All copied image SHA-256 values matched; no credentials, account exports or recovery files were included. The previous gallery remains untouched. See [gallery proof](proofs/lavender/desktop-gallery.json).

After the UI runs, Neon still had **one profile**, migration 004 with the expected checksum, 48 fictional records, 86 revisions and six share records. Increases from the preserved pre-upgrade counts are the recorded demonstration actions, not a reseed or new account.

## Limits

This is a permanent **fictional demonstration**, not a qualified clinical service. It does not activate real patients, send messages to the clinic, provide background push, run an external patient AI or connect the clinic application. The original Namecheap domain is outside this release; the permanent Vercel address is retained. No physical phone, screen-reader runtime or clinical-content validation is claimed.
