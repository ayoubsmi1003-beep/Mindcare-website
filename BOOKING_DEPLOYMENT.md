# Clinic-hosted booking deployment

> Superseded topology: the user approved the full Vercel site and a free temporary encrypted Upstash relay. Use `MINDCARE_BOOKING_HOSTING_MODE=vercel`, `MINDCARE_CLOUD_RELAY_APPROVED=1`, the production bridge Secret and Marketplace Redis credentials. The doctor PC polls outbound; no public PC domain or inbound ports are needed. See the paired doctor delivery `docs/vercel-booking-deployment.md` for current configuration, expiry, free quota and installation steps. Clinic-edge mode below remains available for backward compatibility.

Approved option A: this booking website runs on a dedicated clinic-owned physical server in Algeria. No cloud booking database/queue, doctor API exposure or website Gemini credential. A cloud marketing brochure may link to this server's `/booking` page. Do not enable public booking until the operator verifies actual residency, domain TLS, firewall separation, logs and local backups.

Build with existing dependencies (`npm run build`). Deploy source, node_modules, public and `.next` together. Configure server environment using `.env.example`, then run:

```sh
node --env-file=.env scripts/serve-clinic-edge.mjs
```

The launcher terminates HTTPS, requires the configured Host, replaces spoofed client-IP headers from its real TLS socket and imposes connection/body/rate/deadline bounds. Default bind is loopback; choose the intended public edge interface explicitly. Run **one process**, supervised. Do not use a cloud CDN, persistent request queue, body logging or the generated standalone server as the public entrypoint. Provision the certificate/private key locally and leave TLS verification enabled. No certificate is supplied with this repository.

The private doctor application requires the paired migrations 147–152 and outbound booking worker. Its existing Gemini key stays in its own server environment. Set the identical random bridge secret on the edge and doctor worker; configure its SHA256 hash through the existing authenticated owner configure_public_booking RPC. Owner configuration enables the assigned practitioner, working hours/dates, expiry and optional generic Gemini. The doctor connects **outbound** to `/api/clinic-bridge`; never expose private staff RPC or PostgreSQL.

Public booking/chat only use narrow same-origin JSON POST operations in `lib/booking-protocol.ts`. Chat has guided buttons, never raw patient messages. Current availability comes from the doctor's local SQL. A received request is PENDING until staff call/review and confirm atomically in the existing Agenda. Confirmed cancellation remains a request until staff cancel. Neither offline state nor provider failure implies confirmation. No cloud buffering exists.

Session storage contains only a random receipt capability and submission UUID, never contacts. Keep that receipt private. Lost/expired receipt recovery is by telephone. An uncertain delivery must retain the original submission; after reload, repeated clinic NOT_FOUND checks beyond the server deadline permit starting again. No automatic patient merging or phone-only lookup.

Production transport regression: on Windows, after build, `node scripts/test-clinic-edge-tls.mjs` uses an ephemeral synthetic certificate and real TLS sockets without modifying a certificate store. Evidence is in `tls-evidence.json`. This tests transport, not actual public hosting residency or a production certificate.

The doctor delivery document `docs/public-booking-delivery.md` contains the full contracts, migration impacts, security controls, scoped file list, test evidence and remaining operator steps. Production deployment, actual data migration and packaged Electron acceptance require those checks; they were not performed by this local implementation.
