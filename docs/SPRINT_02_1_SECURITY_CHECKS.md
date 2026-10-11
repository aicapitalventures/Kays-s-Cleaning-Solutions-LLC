# Sprint 02.1 — Security & Staging Acceptance Evidence
**FOUNDER DRAFT — PENDING EXECUTION**
Systems Architecture & Development: Elijah L. Cooley | Divinityx Enterprises, LLC.

## Code issues for remediation
- Existing app defaults disabled intake, and production intake requires explicit release flag.
- Existing owner auth uses a single password; MFA/IdP is not built into the app. Place Cloudflare Access before **all** routes for staging; do not assume owner password alone is adequate.
- Rate limiting is in-process and keyed on socket address; Cloudflare Tunnel may cause traffic to share proxy address. Do not claim it protects against public abuse.
- HTTPS is checked as an origin config value, not independently proven TLS. Edge origin protection and bypass testing required.
- Cookie Secure flag depends on NODE_ENV=production; do not use development mode for web staging.
- SQLite WAL mode must be backed up via coherent snapshots, not just copying a live DB file.
- Email outbox is not a scheduled reliable worker; provider credentials and webhook/delivery evidence are missing.
- Security hardening should include consistent server-side limits, durable auth throttles, hardened session cookie lifecycle, owner identity, audit logs and privacy/retention before exposing customer data.

## Tests
Local 9/9 previously passed on source v1.1. Github Actions check via PR-specific workflow query returned no runs for the queried commits; cannot infer push CI status. **No remote staging/UAT tests have been executed.**

## Founder signoff needed
- [ ] Authorized hosting payer and account
- [ ] Chosen staging hostname/domain and DNS owner
- [ ] Named Kayla/tester authentication identities with MFA
- [ ] Max monthly hosting spend authorized
- [ ] Deployment account with scoped private repository access
- [ ] Remote persistent storage provisioned
- [ ] Backups and successful restore witnessed
- [ ] CI run and safe synthetic UAT witnessed
- [ ] Consent to proceed beyond private staging obtained (separate decision)
