# Independent Sanad UI review — 2026-11-15

PASS: 195 rendered cases: Today, messages, followup/trends, journal, weekly, checkin, treatment, chat, resources, exercise, settings, appointments and help; each at 360, 390, 430, 768 and 1440 CSS pixels in French, Arabic and English. Own isolated Chromium browser session with fictional Samir. No clinical account or clinic service accessed.

PASS: No horizontal document overflow or elements extending beyond viewport in these cases. All rendered inputs/selects/textareas had programmatically associated labels. Navigation focused main, resource detail focused its heading. Arabic used RTL; phone/time fields retained LTR. Visual screenshots reviewed for mobile French/Arabic, English login and home, tablet French and desktop Arabic.

PASS: Keyboard Tab from login phone to password showed a 3px focus outline in all three languages. Mobile header remained sticky at y=0 after scrolling. Reduced-motion active exercise computed animation:none and transition:0s. At 390x420 with chat textarea focused, its bounds were y246..315, above bottom navigation y341..420.

FIXED/PASS: app/sanad/sanad.css formerly hid header help below 376px, forcing access through the bottom of Mon espace. Removed only `.sn-help-button{display:none}` from that breakpoint. After verification at 360 FR/AR/EN: help visible at44x44, real click opens Help, no overlap between brand/actions, document width360. After captures: ui-review-help-fixed-fr-360.png, ui-review-help-fixed-ar-360.png, ui-review-help-fixed-en-360.png; metrics ui-review-help-fixed.json.

MINOR/REMAINING: At360 the native select slightly crops French/English selected-language text because of the existing max-width81px rule (app/sanad/sanad.css <=375 breakpoint). No viewport overflow; full option labels remain available in the selector. Left outside the requested single help fix.

Console: matrix had no pageerror. The only console error was expected401 from unauthenticated initial state. Initial dev-mode Next badge intercepted the first navigation button centre; matrix used a real click at the top interior of the same button, without force. Production browser verification should exclude the dev indicator. Earlier hot reload/restart temporarily delayed navigation/sign-in; those were retried before the complete successful matrix.

Read-only matrix recorded exactly one non-GET request: synthetic sign-in. No record command, message send, favourite, sharing, settings save or password change. Exercise start for reduced-motion check did not persist progress. The later help retest made another synthetic sign-in and no patient record mutations.

NOT RUN: physical iOS/Android, real virtual keyboard, assistive screen reader, production deployment and production service-worker lifecycle. The420px viewport is a keyboard approximation. Checkbox scanner20px hits were wrapped in larger clickable labels, not treated as defects.

Artifacts: ui-review-report.json, ui-review-keyboard.json, ui-review-help-fixed.json, and ui-review-*.png. No source files changed except the single CSS removal requested after review.
