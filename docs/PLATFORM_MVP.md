# Platform MVP & Technical Architecture v1.0 — FOUNDER DRAFT
Systems Architecture & Development: Elijah L. Cooley | Divinityx Enterprises, LLC.
AICV credited only on subsequently verified AI/automation modules.

## MVP
1. Responsive public website with truthful pre-launch messaging.
2. Server-side validated inquiry API with bot resistance, rate limits, privacy consent and persistent storage.
3. Authenticated Kayla-only lead CRM and source attribution.
4. Reviewed estimate engine with configurable services, labor time, supplies, travel and target contribution.
5. Availability and conflict-checked cleaner dispatch; role-separated workforce access.
6. Job checklists, incident/QA workflows, hosted invoicing/payment and reports.

## Proposed stack, not implemented
React/TypeScript front-end; managed PostgreSQL/auth backend (e.g., Supabase); email notification provider; PCI-compliant hosted payments (e.g., Stripe). Keep credentials server-side and prevent sensitive cross-tenant access using server rules and row-level authorization. Avoid unnecessary personal/sensitive data, audit changes, verify webhooks and build export/backup.

## Data entities
customers, properties, leads, quotes, quote_items, services, workers, availability, jobs, assignments, job_checklists, incidents, invoices, payment_events, consent_records, audit_events.

## Status
Static HTML prototype ≠ functioning lead intake, booking, payments, CRM or dispatch. Production release requires end-to-end tests of capture, access control, alerts, approval and payment reconciliation.
