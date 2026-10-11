# KCS Sprint 02.1 — Staging Hosting Decision v1.0
**FOUNDER DRAFT — NOT DEPLOYED — 2026-10-11**
Systems Architecture & Development: Elijah L. Cooley | Divinityx Enterprises, LLC.
Kayla Trautvetter: intended owner/operator. Equity **proposed**, unexecuted: 80% Kayla / 20% Divinityx.

## Selection
Recommend DigitalOcean Basic Droplet 1 GiB / 1 vCPU / 25 GiB SSD (advertised $6/month as researched October 2026), Ubuntu LTS, Node.js 22+, single process, SQLite on local persistent filesystem, encrypted VM backups (weekly option +20% = $1.20/month, or daily +30% = $1.80/month), and Cloudflare Tunnel + Cloudflare Access Free for small teams up to 50 users, enforcing MFA with an allowlist. Estimated VM + weekly infrastructure backup: $7.20/month before applicable tax, domain, any object backup storage, email, and ancillary charges. **Actual purchase cost and account eligibility not verified.**
Source: https://www.digitalocean.com/pricing/droplets
Source: https://docs.digitalocean.com/products/backups/details/pricing/
Source: https://www.cloudflare.com/plans/
Source: https://developers.cloudflare.com/cloudflare-one/access-controls/policies/mfa-requirements/

## Alternatives
Render: paid web runtime starts around $7/month + $0.25/GB/month for persistence; origin exposure and Access isolation require additional review; Render free runtime is ephemeral, so unsuitable for SQLite persistence.
DigitalOcean 2 GiB VM: $12/month before backups and other charges if load or reliability requires it.
Cloud VM operations demand timely patching and secure system administration. If that is not available, prefer managed hosting despite a greater monthly fee.

## Required staging topology
Browser -> Cloudflare Access (permitted identities, MFA) -> HTTPS hostname -> Cloudflare Tunnel -> loopback Node service :3000 -> local SQLite database.
Do not create a public origin A record routing around Access. Keep host inbound ports default denied except operator-approved SSH path (prefer Cloudflare-managed SSH).
Run Node as an unprivileged service user. Root-owned /etc/kcs/staging.env permissions 0640 or stricter, not in Git.
DB and SQLite WAL/SHM files under /var/lib/kcs/ with restrictive permissions; exclude actual data from repository.
Use Cloudflare Access policy tied to Kayla's and approved tester identities; restrict all application paths including /api/*; test denied user access.
Set PUBLIC_ORIGIN to final exact https:// staging hostname. NODE_ENV=production. INTAKE_ENABLED=false. KCS_RELEASE_APPROVED=false.
Never enable synthetic test intake through a publicly reachable route. Synthetic CRUD flow may be tested privately using localhost with disposable test database and staging instance stopped; avoid toggling the live stage flags.

## Deploy instructions — only after provider access/approval
1. Founder authorizes account, monthly ceiling, staging domain, named identities and environment administrator.
2. Create Basic Droplet with SSH key, firewall, weekly/daily backup; configure auto security updates and non-root deploy account.
3. Configure Cloudflare zone and Tunnel with Access allowlist **before** publishing its hostname; enforce MFA; validate Access service tokens at origin or Tunnel to prevent bypass.
4. Install Node.js 22+ and Git; clone PRIVATE GitHub repo using scoped deploy key; verify `npm test`.
5. Secure service env; run Node under systemd with Restart=on-failure, ProtectSystem=strict, ReadWritePaths=/var/lib/kcs, NoNewPrivileges=true, PrivateTmp=true, User=kcs, Group=kcs. Adapt configuration as required.
6. Set DATABASE_PATH=/var/lib/kcs/leads.sqlite and lock ownership. Verify restart retains synthetic data.
7. Configure WAL-consistent SQLite backup using SQLite backup API/CLI to encrypted separate storage. System image backups are NOT a substitute for database-consistent, off-host backups. Test restore and log/alert results.
8. Test MFA deny/allow, HTTPS, blocked origin bypass, auth and CSRF, incorrect cookies, expiry, and synthetic owner review.
9. Keep intake disabled; record actual staging URL, bill, installed commit and test evidence separately.

## Known security blockers
Application uses a single owner password, in-memory rate limit, lacks independent MFA, has opportunistic notification retry and needs privacy/retention review. Edge Access is mandatory for private staging. No payment processing or live customer intake. Don't claim production ready.

## Release decision
**STAGING PACKAGE PREPARED / HOSTING NOT AUTHORIZED OR PROVISIONED.**
