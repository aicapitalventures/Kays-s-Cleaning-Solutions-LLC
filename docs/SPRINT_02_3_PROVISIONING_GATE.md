# KCS Sprint 02.3 — Provisioning and UAT Gate
**Status:** FOUNDER DRAFT — BLOCKED: HOSTING CONNECTION, ACCOUNT/BUDGET AUTHORIZATION AND STAGING DOMAIN
**Date:** 2026-10-11
**Systems Architecture & Development:** Elijah L. Cooley | Divinityx Enterprises, LLC.

## Verified this execution
- Private repository `aicapitalventures/Kays-s-Cleaning-Solutions-LLC` exists with `main` and earlier Sprint 02.2 source/hardening report.
- GitHub Actions commit-workflow lookup returned empty workflow_runs; the endpoint is PR-filtered and does **not** establish push-workflow status. Verify results in repository Actions tab.
- DigitalOcean connector was discovered and suggested for user installation; it is **not connected**, and its advertised capability concerns a remote Codex workspace, not a guaranteed production hosting workflow.
- No authenticated Cloudflare administration connection was identified.
- No user confirmation of authorized DigitalOcean organization/account, payer, monthly spending cap, hostname, DNS rights or approved tester identities exists in this session.
- **No server, domain, tunnel, Access policy, SSL certificate, backup, restore test, or staging endpoint was created or verified. No charge was made.**

## Deployment gating sequence
1. Confirm payer, legal custody, maximum monthly cost, DigitalOcean account/org, domain/zone administrator, Kayla's MFA identity and technical administrator.
2. Before purchase, check up-to-date Basic Droplet/backups pricing and available region; choose durable filesystem and resource minimum based on Node/SQLite load.
3. Provision the VM, firewall and hardened nonroot service account; install Node >=22.13 and exact Git commit; `npm test` and record CI commit/results.
4. Configure Access-protected Cloudflare Tunnel for **all routes**, with allowlist and MFA; ensure no bypass direct origin exposure.
5. Provision persistent volume, `NODE_ENV=production`, `HOST=127.0.0.1`, `KCS_STAGING=true`, `INTAKE_ENABLED=false`, `KCS_RELEASE_APPROVED=false`, exact HTTPS `PUBLIC_ORIGIN`; secure secrets. Never store credentials in Git.
6. Install SQLite-consistent encrypted off-host backups and perform a restore drill. VM snapshots alone are insufficient.
7. Verify URL TLS, denied and allowed Access users, unauthenticated CRM rejection, auth/CSRF/logout, off-origin rejection, disabled intake, server restart, backups, and synthetic offline tests.
8. Complete Kayla UAT checklist in `docs/SPRINT_02_KAYLA_UAT.md` using fabricated records, recording reviewer, build SHA and evidence.
9. Keep all live intake, billing, advertising, dispatch and booking OFF pending independent business/legal/security release.

## Known unclosed risks
Single-factor app owner credential behind required MFA gate; local-memory rate limits and proxy/IP behavior; incomplete privacy/retention and notification retry/delivery proof; no observed Actions success. Security is not established by local tests alone.

## Governance
Kayla Trautvetter: intended operator; proposed 80% equity. Divinityx Enterprises, LLC: proposed 20%; all unverified and unexecuted. Development attribution is not legal chain-of-title evidence.
