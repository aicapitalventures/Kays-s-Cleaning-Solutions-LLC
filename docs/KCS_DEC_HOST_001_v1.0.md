# Hosting Decision — KCS-DEC-HOST-001-v1.0
**Date:** 2026-10-11
**Status:** FOUNDER-AUTHORIZED PLANNING DECISION; BILLABLE RESOURCE CREATION NOT AUTHORIZED.
**Systems Architecture & Development:** Elijah L. Cooley | Divinityx Enterprises, LLC.

## Recorded decisions
- New DigitalOcean account; no existing connected billing account or provisioner verified.
- Maximum intended infrastructure spending ceiling: **USD $10 per month**.
- No payment or billable service has been explicitly approved yet; request exact action and charge first.
- Private staging only; Cloudflare Access and MFA before reachability; no live customer intake, bookings, payments, dispatch or advertising.
- Keep default `HOST=127.0.0.1`, `KCS_STAGING=true`, `INTAKE_ENABLED=false`, `KCS_RELEASE_APPROVED=false`.

## Price assumptions, verified from provider public pages on 2026-10-11
DigitalOcean 1 GiB Basic Droplet USD $6/month; optional weekly VM backups +20% = USD $1.20/month. Cloudflare Zero Trust Access Free $0 for eligible teams up to 50 users. Estimated subtotal $7.20/month before taxes, domains, external database backups and extras.
References:
https://www.digitalocean.com/pricing/droplets
https://docs.digitalocean.com/products/backups/details/pricing/
https://www.cloudflare.com/plans/zero-trust-services/
DigitalOcean billing/payment setup: https://docs.digitalocean.com/platform/billing/manage-payment-methods/

## Guardrails
- $10 is a founder budget limit, not proof of a DigitalOcean platform-enforced hard cap.
- Estimate operational backup storage, alerts and taxes BEFORE provisioning; obtain further approval if projected costs exceed cap.
- Use business-authorized account and ownership, least privilege and MFA.
- No staging URL, remote CI successful run or UAT is verified.

## Open Founder/Operator actions
1. Create DigitalOcean account and select its account owner. Do not share password, credit card or keys in project.
2. Confirm billing details and any verification deposit without initiating unapproved spending.
3. Confirm preferred domain/DNS owner and staging reviewer email identities (privately).
4. Confirm the actual proposed Droplet + backup checkout price before the billable action.
5. Connect an appropriate provider management tool if it actually supports required operations, or delegate provisioning via a secure operator.

## Legal/IP
Kayla Trautvetter intended managing member; proposed 80% interest. Divinityx Enterprises LLC proposed 20%. Neither executed; no legal formation/transfer established. Development attribution does not prove rights.
