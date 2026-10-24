---
project: AICTE Security Deposit / FDR Portal
psid: 26265
version: 1.0
date: 2026-10-24
---

# ROADMAP — AICTE Security Deposit / FDR Portal

## Delivery Timeline (38 Weeks)

```
Wk  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 ... 38
    |──Phase 0──|────Phase 1────|────Phase 2────|────Phase 3────|────Phase 4────|──5──|──6──────────|────────Phase 7───────────|
                                                                                  ↑ Phase 5 overlaps 4/6
    ⚠ Book audit slot ←(by Wk10)          ↑ Audit window (Wk21–25)
    ⚠ Seasonal freeze ←─────────────────────────────────────────(1 Mar – 31 Jul, no non-critical releases)
```

---

## Phase 0 — Discovery & Sign-off (Weeks 1–3)

**Goal:** Remove all unknowns before any production code is written.

**Must-haves:**
- Decisions D1–D5 confirmed in writing
- APH 2024-27 rules captured as structured data
- All current data sources inventoried and profiled
- Spikes S1–S8 started
- Security auditor booked (target: Weeks 21–25)

**Exit criteria:** Signed scope document; decision log complete; rule sheet reviewed by Bureau.

**Plans:**
- [Plan 0.1] Requirements & Rule Capture
- [Plan 0.2] Spike Execution (S1–S8)

---

## Phase 1 — Foundation (Weeks 4–7)

**Goal:** Everything else builds on this. Do first, never skip.

**Must-haves:**
- CI/CD pipeline fully operational (all stages green)
- All 10 roles can log in; sessions and step-up working
- Row-level security proven (Spike S1 closed: zero scope leaks)
- Audit chain writing events in same DB transaction
- Institution sync running (nightly file import)
- Baseline schema deployed with Flyway

**Exit criteria:** Demo — login by role, audit explorer shows events.

**Plans:**
- [Plan 1.1] Infrastructure & CI/CD Pipeline
- [Plan 1.2] Identity & Auth (Keycloak, BFF, OTP/TOTP)
- [Plan 1.3] Core Schema + RLS + Audit Chain
- [Plan 1.4] Institution Sync

---

## Phase 2 — Registry & Document Vault (Weeks 8–11)

**Goal:** Institution can submit an FDR end-to-end; document pipeline fully operational.

**Must-haves:**
- Instrument submission form with draft save and inline validation
- Rules R1–R5 evaluated on submission
- Document pipeline: quarantine → type check → ClamAV scan → hash → encrypt → vault
- Resumable uploads (Spike S3 closed)
- Search: any record found in < 2 s

**Exit criteria:** Demo — institution submits an FDR with a deliberate bad amount; R1 flagged; document uploaded and vaulted.

**Plans:**
- [Plan 2.1] Instrument Registry & Submission Form
- [Plan 2.2] Document Vault & Upload Pipeline
- [Plan 2.3] Search & Instrument List

---

## Phase 3 — Verification Engine & Timeline (Weeks 12–15)

**Goal:** The core value of the system. Rules, trust levels, timeline, and alerts all working.

**Must-haves:**
- All discrepancy rules R1–R10 evaluated and tested
- Trust levels L0 → L1 → L2 → L-X operating correctly
- Timeline engine: nightly pass in < 2 min for 100,000 instruments; no missed reminders after downtime; no duplicates on double-run
- Reminder alerts firing at all configured offsets
- Kill switch stops mass sends in < 60 s

**Exit criteria:** Demo — time-travel to T-90 days; reminders fire; discrepancy flagged; trust level changes tracked.

**Plans:**
- [Plan 3.1] Full Rule Engine (R1–R10) + Risk Scoring (I2)
- [Plan 3.2] Trust Level Management + Bank Confirmation Tracker
- [Plan 3.3] Timeline Engine (TDD — property tests + mutation score ≥ 80%)
- [Plan 3.4] Alert & Escalation Service

---

## Phase 4 — Cases, Release Workflow & NOC (Weeks 16–19)

**Goal:** Full release lifecycle with maker-checker; NOC with QR code verifiable.

**Must-haves:**
- Case FSM: scrutiny ↔ query ↔ resubmit → accepted; hold state with reason
- Renewal creates new instrument_version; old valid until new accepted (no coverage gap)
- Release case: 7-step flow; blocked below L2; CA step-up required
- NOC: QR code → public verification page (rate limited)
- Accounts ledger: principal + interest tracked separately; CSV export formula-safe
- Maker-checker enforced in code AND database constraint

**Exit criteria:** Demo — full release on seeded test data; NOC QR verified; audit explorer shows every step.

**Plans:**
- [Plan 4.1] Case & Query Workflow
- [Plan 4.2] Renewal Workflow
- [Plan 4.3] Release Workflow & NOC Generation
- [Plan 4.4] Approval Inbox & Step-up Authentication

---

## Phase 5 — Dashboards & Reports (Weeks 18–20)

**Goal:** Bureau can see everything at a glance; reports run on schedule.

**Must-haves:**
- Dashboard counts reconcile exactly with underlying records
- Materialised views refresh without slowing officers
- All 4 scheduled reports running (pending verifications, upcoming maturities, missing docs, intervention cases)
- Rule simulation UI: draft → simulate → diff review → approve → activate
- Audit explorer: search by entity/actor/time; export evidence pack

**Exit criteria:** Demo — Bureau reviews real-looking data on dashboard; maturity forecast heatmap visible.

**Plans:**
- [Plan 5.1] Dashboard & Materialised Views
- [Plan 5.2] Reports & Rule Management UI

---

## Phase 6 — Hardening (Weeks 20–25)

**Goal:** Audit cleared, load tested, DR proven, accessibility certified.

**Must-haves:**
- k6 load test: p95 < 2 s, errors < 0.1%, no queue backlog > 5 min under 2,000 concurrent users for 60 min with 3x spike
- Internal pentest (Week 20): no open high findings
- Independent CERT-In audit cleared with certificate (Weeks 21–25)
- DR failover proven: RPO ≤ 15 min, RTO ≤ 4 h
- WCAG 2.1 AA: zero critical issues; screen-reader user completes J1 unaided
- All 14 runbooks written and walked through
- SBOM (CycloneDX) + VEX notes generated for release candidate
- DPDP: data map complete, breach runbook exercised

**Exit criteria:** Audit clearance certificate; load test report; DR drill report; accessibility report — all signed.

**Plans:**
- [Plan 6.1] Performance & Load Testing
- [Plan 6.2] Security Audit & Penetration Test
- [Plan 6.3] DR Drill + Accessibility + SBOM

---

## Phase 7 — Pilot, Migration & Rollout (Weeks 26–38)

**Goal:** Go-live with migrated data; phased rollout across all regions; handover complete.

**Must-haves:**
- Data migration: all records loaded as L0 with source tag; reconciliation counts/values match by region + bank (signed by Bureau)
- At least 3 full migration rehearsals on staging
- One-region pilot: 6–8 weeks running parallel with old process; zero data-loss incidents
- Training complete: role-based sessions + printed one-page guide for institutions
- Handover package: source code, IaC, SBOM, architecture doc, API spec, data dictionary, rule book, security pack, 14 runbooks, test pack, admin credentials (sealed)
- Warranty agreement signed (6 months defect fixes)
- Old registers retired only after one full reminder cycle runs correctly

**Exit criteria:** Go-live review signed by AICTE; handover checklist fully ticked.

**Plans:**
- [Plan 7.1] Data Migration (profile → clean → load → reconcile → rehearse → cutover)
- [Plan 7.2] Region Pilot + Hypercare
- [Plan 7.3] Phased Rollout & Handover

---

## Innovation Rollout Schedule

| Innovation | Phase |
|-----------|-------|
| I1 QR-verifiable NOC | Phase 4 |
| I2 Risk-ranked worklist with score breakdown | Phase 3 |
| I3 Rule simulation sandbox | Phase 5 |
| I4 As-of reconstruction | Phase 2 (immutable versions) |
| I5 Tamper-evident hash-chained audit | Phase 1 |
| I6 Maturity forecast & workload heatmap | Phase 5 |
| I7 Data-quality score + canonical bank names | Phase 2 |
| I8 Signed releases with SBOM + VEX | Phase 6 |
| I9 Synthetic officer canary | Phase 7 |
| I10 Game days before peak season | Yearly (after go-live) |
| I11 Bank confirmation link (v1.5 pilot, 2–3 banks) | Post go-live |
| I12 Live deposit-status API for approval portal | Post go-live |
| I13 OCR + layout assist | v2 |
| I14 DigiLocker + eSign | v2 |

---

## Seasonal Freeze

> ⚠ **1 March – 31 July (AICTE peak season):** Only critical fixes released.
> Each critical fix requires a second approver.
> A readiness review runs every February before the freeze.
> Phase 7 rollout must complete before or after this window.

---

## Team

| Role | Count |
|------|-------|
| AICTE product owner | 1 |
| AICTE IT liaison | 1 |
| Business analyst | 1 |
| Tech lead / architect | 1 |
| Backend engineers | 3 |
| Frontend engineers | 2 |
| QA lead + tester | 2 |
| DevOps + security engineer | 1–2 |
| UX designer | 0.5 |
| Delivery manager | 1 |

**Estimate:** 90–130 person-months over ~9 months + 20% contingency (before AICTE-side effort and audit fees). Replace after Phase 0.
