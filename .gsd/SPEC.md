---
project: AICTE Security Deposit / FDR Portal
psid: 26265
version: 1.0
date: 2026-10-24
status: approved
---

# SPEC — AICTE Security Deposit / FDR Portal

## 1. Mission

Give AICTE one trustworthy, always-current picture of every security deposit and FDR held against institutions. Give institutions a simple, clear path to comply. No deposit lapses unnoticed. No release is approved on unverified paper. No officer chases a spreadsheet.

---

## 2. Problem Statement (PSID 26265)

AICTE Regulation Bureau manages security deposits (FDRs, bank guarantees, online payments, RTGS) submitted by institutions as part of the approval process. Currently managed through fragmented spreadsheets and paper registers across regional offices. Key gaps:

- No single source of truth for deposit status
- No automated maturity tracking or renewal reminders
- No distinction between institution-submitted data and independently bank-confirmed data
- Manual, error-prone verification processes
- No auditable trail for release decisions

---

## 3. Non-Negotiables (Hard Constraints)

1. All production data, backups, logs, and monitoring stay **in India**
2. No release of a deposit without **maker-checker** and a named competent authority
3. Every state change writes an audit event **in the same database transaction**
4. Rules (amounts, validity, deadlines) are **versioned data** — never hard-coded
5. Institution-submitted data is **never shown as verified** until a human or bank evidence record confirms it
6. Money uses **exact decimal types** (NUMERIC 18,2); dates use calendar dates in Asia/Kolkata, never floating point
7. The system keeps working when **SMS, email, bank, and OCR services are down**
8. **No custom cryptography**, no custom login, no home-grown file parsers
9. **Security audit** by an approved auditor before go-live, with fixes verified
10. Every release is **reproducible, scanned, and reversible**
11. **Nothing is hard-deleted** — corrections create new versions
12. **WCAG 2.1 AA** and bilingual labels (English + Hindi) are release criteria

---

## 4. Architecture Decision Records (Locked)

| ID | Decision | Rationale |
|----|----------|-----------|
| ADR-1 | Modular monolith | One deployable; modules are seams for future split |
| ADR-2 | PostgreSQL as single system of record with RLS | Row-level security, JSONB, full-text; no licence cost |
| ADR-3 | Three trust levels; manual-with-evidence bank confirmation | No universal FDR electronic verification channel exists |
| ADR-4 | Rules stored as versioned data by APH edition | Never hard-code; simulation before activation |
| ADR-5 | Self-hosted Keycloak | SSO, OTP/TOTP, audit events; data stays in India |
| ADR-6 | Deterministic rules, no ML in v1 | No labelled data; must be auditable |
| ADR-7 | JDK 25 LTS + Spring Boot 4.x (fallback: JDK 21 + SB 3.5) | Support horizon; Keycloak targets latest LTS |
| ADR-8 | Row-level security as defence in depth | Never remove; test at DB level |
| ADR-9 | Outbox + Quartz instead of Kafka | No extra broker; at-least-once with idempotent handlers |
| ADR-10 | BFF with cookie sessions; tokens never in browser storage | Prevents XSS token theft |
| ADR-11 | Object store chosen by host; MinIO only after licence review | AGPL licence risk; prefer host S3 |
| ADR-12 | Explainable weighted scoring for worklist | No hidden model; score breakdown visible |
| ADR-13 | Bank link = provisional L2 until officer cross-check | Bank adoption uncertain; pilot first |
| ADR-14 | Standalone portal with read-only sync (default) | Limits risk to live approval system |

---

## 5. System Modules

| Module | Owns | Key Rule |
|--------|------|----------|
| `identity` | Users, roles, step-up auth | Never roll custom crypto |
| `institution` | Institution mirror, entity history | Sync from AICTE master; no re-keying |
| `registry` | Instruments, versions, ledger lines | New version on renewal; history never overwritten |
| `rules` | APH rule sets, simulation, evaluation | Versioned by APH edition; simulation before activation |
| `vault` | Documents, scanning, hashing, OCR assist | Quarantine → scan → hash → vault; fail-closed |
| `verification` | Discrepancy checks R1–R10, trust levels L0/L1/L2 | Bank evidence required for L2 |
| `timeline` | Dates, status transitions, next-action dates | Calendar maths in Asia/Kolkata; idempotent nightly run |
| `casework` | Scrutiny, queries, renewal, release, holds | Maker-checker on all money-related transitions |
| `notify` | Alerts, digests, templates, providers | Unique ledger key; kill switch; dry-run mode |
| `reporting` | Views, scheduled reports, exports | Reads replica; neutralise formula injection |
| `audit` | Hash-chained events, evidence packs | Written in same DB txn; tamper-evident; external checkpoint |

---

## 6. Trust Levels (Core AICTE Priority)

| Level | Meaning | Who Sets It | UI Badge |
|-------|---------|------------|----------|
| L0 Submitted | Institution says so | Institution | Grey: Unverified |
| L1 Document-checked | Officer verified scan vs. typed data | Regional/Bureau officer | Amber |
| L2 Bank-confirmed | Bank confirmed via authorised channel with evidence | Verifier + evidence record | Green |
| L-X Disputed | Open discrepancy | Rule engine or officer | Red |

**Release cannot proceed below L2** unless Competent Authority records a documented exception.

---

## 7. Discrepancy Rules (v1)

| Code | Rule |
|------|------|
| R1 | Amount differs from required under applicable APH |
| R2 | Beneficiary or lien not in favour of AICTE |
| R3 | Issue date, maturity date, or tenor inconsistent |
| R4 | Same FDR number + bank already exists under another institution |
| R5 | IFSC does not match bank name or branch |
| R6 | Depositor name does not match trust/society/company on approval record |
| R7 | Remaining validity shorter than required period |
| R8 | Required affidavit or document missing |
| R9 | OCR values differ from typed values beyond tolerance |
| R10 | File anomalies: unreadable, altered metadata, duplicate hash |

---

## 8. Instrument Lifecycle

```
Draft → Submitted → Under scrutiny ⇄ Query raised / Resubmitted
→ Accepted (Active) → Expiring → Renewal pending
→ Renewed (new version) or Replaced → ...
→ Matured → Release requested → Release under review (or On hold)
→ NOC issued → Released → Closed

Side exits: Rejected | Invoked (AICTE encashes under penal provisions)
```

---

## 9. Core User Journeys

- **J1** Institution submits new deposit (15 min target end-to-end)
- **J2** Officer clears a case (5 min target per case)
- **J3** Renewal with version chaining (no coverage gap)
- **J4** Release (request → eligibility → verify → approve → NOC → accounts → closure)

---

## 10. Non-Functional Targets

| Attribute | Target |
|-----------|--------|
| Institutions | ~10,000 |
| Concurrent users | 500 normal; 2,000 peak (Mar–Jul) |
| Availability | 99.5% monthly |
| Response time | p95 page load < 2 s; search < 2 s; 10 MB upload < 30 s on 2 Mbps |
| Recovery | RPO 15 min (WAL archiving); RTO 4 hours |
| Retention | 8 years documents; 1 year minimum logs; DPDP-compliant |
| Accessibility | WCAG 2.1 AA |
| Frontend budget | Initial JS ≤ 250 KB gzip; LCP ≤ 2.5 s on slow 4G |

---

## 11. Tech Stack

| Layer | Choice | Fallback |
|-------|--------|----------|
| Language | JDK 25 LTS | JDK 21 (host cannot run 25) |
| Framework | Spring Boot 4.x | Spring Boot 3.5 |
| Frontend | React + TypeScript, Vite | — |
| Database | PostgreSQL 18.x | PostgreSQL 17.x |
| Identity | Keycloak (latest stable) | — |
| Object store | Host S3-compatible | MinIO (after licence review) |
| Jobs | Quartz JDBC clustered + outbox | — |
| Virus scan | ClamAV (fail-closed) | Commercial AV |
| OCR | Tesseract (offline, suggestion only) | — |
| Proxy/WAF | Nginx + ModSecurity + OWASP rules | Host WAF |
| Observability | Prometheus + Grafana + Loki (India only) | OpenSearch |
| Secrets | HashiCorp Vault / HSM KMS | — |
| CI/CD | GitLab CI / Jenkins | — |
| IaC | Terraform / Ansible | — |

---

## 12. Regulatory Compliance

| Standard | Gate |
|----------|------|
| GIGW 3.0 (security audit clearance) | Go-live blocked without clearance certificate |
| CERT-In Directions 2022 | 6-h incident reporting; 180-day logs in India; NTP sync |
| CERT-In SBOM Guidelines v2.0 (Jul 2025) | SBOM + VEX per release |
| DPDP Act 2023 / Rules 2025 | Build to covered standard; data map + breach runbook before May 2027 |
| MeitY cloud empanelment | Provider empanelment proof if cloud-hosted |
| OWASP ASVS Level 2 | Checklist per release |
| NIST SP 800-63B | Keycloak password/auth policy |
| WCAG 2.1 AA | axe-core CI + manual screen-reader per release |

---

## 13. Open Decisions (Must Resolve in Phase 0)

| # | Decision | Deadline | Default |
|---|----------|----------|---------|
| D1 | Standalone vs. extend existing portal | Week 2 | Standalone + read-only sync |
| D2 | Hosting platform | Week 2 | Empanelled cloud in India |
| D3 | Accepted instruments | Week 3 | FDR + BG + online + RTGS |
| D4 | Competent authority + delegation matrix | Week 3 | Bureau head → Adviser |
| D5 | Rule owner for APH rule sets | Week 3 | Named Deputy Director + Legal review |
| D6 | Bank confirmation method per bank | Week 6 | Manual-with-evidence |
| D7 | Document + log retention periods | Week 6 | 8 years docs; 1 year min logs |
| D8 | SMS + email gateways | Week 6 | In-app inbox until provided |
| D9 | DPDP exemption stance | Week 8 | Build to covered standard |
| D10 | Security auditor + audit window | Week 10 | Book Weeks 21–25 |
| D11 | Acceptance committee for UAT | Week 12 | Bureau head + 2 Regional officers |
| D12 | Data migration sources + sign-off owner | Week 4 | All current registers; Bureau sign-off |
