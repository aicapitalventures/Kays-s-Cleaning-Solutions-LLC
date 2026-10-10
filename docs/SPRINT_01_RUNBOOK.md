# KCS Sprint 01 — Deployment & Security Runbook
**Status: FOUNDER DRAFT — Local development only. Not authorized for real intake.**
**Systems Architecture & Development:** Elijah L. Cooley | Divinityx Enterprises, LLC.

## Run locally
Node.js 22.13+ is required for built-in node:sqlite. Copy `.env.example` into local environment variables (do not commit secrets); use 32+ random characters for `SESSION_SECRET` and strong unique `OWNER_PASSWORD` (12+ characters). For example export vars from your shell, then `npm test` and `npm start`. Open `http://localhost:3000` and `/owner`. No external packages required.

## Features built
- Responsive customer-facing service/inquiry page, explicitly pre-launch.
- POST `/api/inquiries` with server validation, consent acknowledgment, honeypot and basic IP rate limiting; **disabled by default**.
- SQLite persistent leads with original marketing attribution.
- Owner password login, HttpOnly SameSite session cookie, server-persisted session, CSRF-token-protected owner mutations, lead statuses and notes, restricted reads.
- Optional Resend email notification via server credential, with persistent outbox state/attempt count; manual owner retry for pending work. Only non-sensitive metadata in notification.
- Health endpoint reports intake and notification configuration; service categories prepared for later quote construction.

## Production blockers / limitations
- LLC formation, Kayla agreement, insurance, worker classification, staffing and legal website copy must be verified.
- Must deploy behind HTTPS with reverse-proxy security hardening, backups, database encryption at rest, restricted file permissions, uptime monitoring, log redaction and secret rotation.
- Rate limiter is memory-local and not distributed; replace with durable shared rate limiting and verified CAPTCHA/turnstile before production.
- Owner access is single-password only; implement stronger identity provider/MFA, password reset and security event logging before collecting real customer data.
- SQLite on ephemeral/serverless filesystems loses records; use persistent hosting volume or migrate to managed Postgres. Configure deletion/retention, consent ledger, customer notice, opt-out and privacy policy with counsel.
- Outbox notification sends opportunistically on intake or manual owner retry. Add scheduled worker for guaranteed retries, monitoring, and delivery confirmation. Resend 2xx denotes provider acceptance, not inbox delivery.
- No actual quote calculation, booking, cleaner assignment, payment processing, or published website. No production domain or integrations verified.
- Runtime needs threat review, browser E2E and deployment verification before live traffic.

## Verified local tests
`npm test` validates validation, consent, password verification and HMAC comparison. Full browser/integration tests are an outstanding gate.

## Attribution & equity
Kayla Trautvetter intended manager; 80% Kayla / 20% Divinityx proposed, NOT agreed or executed. No IP transfer implied by source attribution.

## Sprint 01 v1.1 verification and distribution
- New integration checks cover disabled intake, unauthorized reads, a sample consented lead, UTM source/campaign persistence, owner password rejection/acceptance, CSRF enforcement, note/status update, pending outbox, logout and wrong-origin rejection.
- Node tests must be run with `npm test`; the source archive is not itself deployed.
- Production requires an HTTPS `PUBLIC_ORIGIN`, and production intake also requires `KCS_RELEASE_APPROVED=true` in addition to `INTAKE_ENABLED=true`; both are OFF by default. These guards are not a substitute for legal, insurance, staff and security approvals.
- `NODE_ENV=production` must not be used for public testing until behind trusted HTTPS, persistent secured storage, backup and rate limiting. This is a single-process prototype with no MFA.
- Deployment templates and production credentials have not been provisioned. Private staging may use synthetic data only.

## Exact source integration without replacing governance files
Download `kcs-sprint01-source-v1.1.zip` and extract its `kcs-sprint01/` contents. In a checked-out copy of `aicapitalventures/Kays-s-Cleaning-Solutions-LLC` on the latest `main`, copy these paths **into the repository root**, preserving existing `docs/` governance records, `README.md`, and root `index.html`. New paths: `server/`, `public/`, `tests/`, `package.json`, `.env.example`, `.gitignore`, and `docs/SPRINT_01_RUNBOOK.md`. Check differences before staging, run tests, commit, push and verify the live repo. Do not push `.env` or `*.sqlite`. The root `index.html` is the prior prototype; the running Node server uses `public/index.html`.
