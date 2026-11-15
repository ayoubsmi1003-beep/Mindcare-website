# Sanad — Glass redesign

15 November 2026. User explicitly replaces Jardin and authorizes autonomous complete redesign, production delivery and domain repair without questions.

Design read: a multilingual patient product with an immersive premium glass language; native CSS materials and existing Motion, not an agency landing page. DESIGN_VARIANCE 7 / MOTION_INTENSITY 7 / VISUAL_DENSITY 4.

Direction: graphite canvas, silver typography, ice-blue light, refractive architectural glass sculpture, floating five-tab dock, oversized editorial headings. Stable opaque reading surfaces beneath fine glass navigation. No garden art, plants, purple mesh, invented charts, scroll hijacking or decorative loading delays. Existing self-hosted Jakarta and Arabic fonts. Preserve all five tabs and all modules.

Alternatives considered: bright translucent glass (less depth), noisy WebGL spectacle (battery/accessibility cost), smoked glass with isolated pointer-responsive CSS sculpture (chosen). Existing Motion handles spring navigation and entry; CSS owns materials. Keyboard, RTL, reduced motion/transparency and touch fallbacks remain first-class.

Implementation plan
1. Replace SanadApp presentation, scoped CSS and introduce isolated GlassSculpture motion leaf; leave server/API/data behavior intact.
2. Replace illustration imagery and plant glyphs across resources/chat/tracking; restyle offline shell/icons/manifest and invalidate only old public asset cache.
3. Run existing UI/command/SW tests, typecheck/lint/build. Inspect real browser FR/AR/EN at 360/390/430/768/1440, functional saves, motion/touch/keyboard/reduced-motion and screenshots/video. Iterate visual issues.
4. Commit/push and publish same existing Vercel project; run authenticated HTTPS smoke with sole test account, preserve Neon state.
5. Recheck authoritative DNS, Vercel domain attachment/certificate/redirect and Namecheap evidence. Apply smallest authorized fix, no purchase/upgrade; verify HTTPS for apex/www. Report actual external blocker if registrar action cannot be performed.

Scope files: app/sanad/sanad.css; components/sanad/{SanadApp,GlassSculpture,Resources,Spaces,Tracking}; lib/sanad/i18n/index.ts; public/sanad offline/manifest/icons/sw; design proof and release docs. No DB migration, clinical checkout edit or public-site redesign.

Stop condition: published new design works and domain issue resolved or precisely evidenced as requiring unavailable owner capability. Do not describe an unfixed domain as repaired.

Implementation evidence\n- 195 real browser cases PASS: 13 screens x 3 languages x 5 widths, no horizontal overflow, labelled fields and RTL. Check-in saved to the same permanent Neon account and retrieved after reload.\n- Pointer-responsive glass, spring dock, screen entrances and working exercise timer recorded in proofs/glass/sanad-glass-motion.webm. No garden network requests; public cache v2 contains five static resources only.\n- Live reduced-motion change: RED reproduced a nonzero main translation, GREEN returned transform:none. Preference now subscribes to matchMedia changes; skip-link has a sticky-header offset.\n- 19 existing UI/command/SW tests passed; added public-cache migration test observed RED then GREEN (3/3 SW). Typecheck, targeted lint and optimized build PASS; Sanad first load 178 kB, using existing Motion dependency.\n- Source review performed independently for visual modules and accessibility; both identified issues corrected. Four garden/night binaries removed, no database/API/clinical changes.\n- Physical devices and assistive screen-reader runtime are not verified; the short chat viewport is a keyboard approximation.\n