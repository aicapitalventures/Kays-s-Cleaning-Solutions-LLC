# KCS Sprint 02 — Private Staging Architecture v1.0
**Status:** FOUNDER DRAFT — PREPARED, NOT DEPLOYED
**Systems Architecture & Development:** Elijah L. Cooley | Divinityx Enterprises, LLC.
**Intended operator:** Kayla Trautvetter. Equity proposal: 80% Kayla / 20% Divinityx; not signed or issued.

## Decision
For current low-volume development, retain Node.js 22 + SQLite on **single-instance, persistent-disk hosting**. Do not deploy SQLite to an ephemeral/serverless runtime. Avoid needless Postgres migration until need is demonstrated.

## Suggested deployment arrangement (not provisioned)
- Private HTTPS staging hostname on a low-cost VPS or persistent-volume platform with explicit preview access restriction at the reverse-proxy/identity edge, **before** requests reach Node.
- One Node process; durable volume (e.g. /var/lib/kcs-staging/), SQLite file owner-readable only. Never check database into Git.
- TLS termination and HSTS on HTTPS proxy. Set PUBLIC_ORIGIN to exactly the HTTPS hostname, and NODE_ENV=production.
- Bind Node to loopback or private network behind proxy; firewall the application port. Expose only port 443.
- Secrets injected from the hosting provider vault; no .env or credentials committed. Rotate after any exposure.
- External encrypted daily SQLite backups, WAL-consistent snapshots (SQLite backup API or sqlite backup command), retention and monthly restore drill. Test retention/deletion and alert on failed backups.
- Provider monitoring for health, disk, process restarts, email queue failures, invalid login volume; audit log without recording full customer payloads.
- Staging owner login protected by edge SSO with MFA. Existing application password is insufficient alone. Add proper identity auth before live customers.

## Flags — locked
NODE_ENV=production
PUBLIC_ORIGIN=https://<private staging hostname>
INTAKE_ENABLED=false
KCS_RELEASE_APPROVED=false
Use only synthetic records created by local integration tests until an explicitly authenticated test-only staging intake pathway is implemented and approved. Never put real prospect information in staging.

## Security findings
**Critical launch blockers:** no edge MFA/SSO, production provider, backups/restore evidence, durable shared rate limiter, audited privacy notice/retention, incident plan, workforce/insurance/legal readiness.
**Known product limitations:** in-memory per-process rate limiter, opportunistic email retry, single shared password, no owner password reset, no job or quote implementation. All are unsuitable as sole controls for public customer intake.
**Authorization:** the app's owner endpoints require session and CSRF for mutation; tests cover basic boundaries but do not constitute a penetration test.
**Code review flags:** inspect static-salt password derivation on each login and trusted proxy/origin handling before exposing to untrusted traffic. Rate limits must work consistently across instances.

## Deployment acceptance evidence required
1. Host, provider pricing, billing owner and deployment permissions documented.
2. HTTPS URL verified; edge login enforces MFA and blocks unauthenticated page/API access.
3. Session/auth checks pass behind proxy; unsafe HTTP blocked; no public DB/process port.
4. Persistent volume survives restart; backups succeed; full restore tested.
5. Actions CI pass for deployed commit; synthetic lifecycle tests in gated environment.
6. Owner sign-off recorded separately from legal production launch approval.

**Release stance:** Private staging with all live intake disabled. No public advertising, bookings, dispatch or payments.
