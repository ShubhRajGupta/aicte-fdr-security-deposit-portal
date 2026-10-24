---
phase: hackathon
plan: 0
wave: 1
depends_on: []
autonomous: true
type: prototype

must_haves:
  truths:
    - "All 6 demo scenarios work end-to-end with seeded data"
    - "Three trust levels (L0/L1/L2) are visually distinct"
    - "Time-travel control allows jumping to any date"
    - "Risk-ranked worklist shows score breakdown"
    - "NOC is QR-verifiable"
    - "Audit explorer shows every step with hash"
    - "Measurable improvement slide uses simulated data (stated clearly)"
  artifacts:
    - "Working prototype covering the 6 SIH demo scenarios"
    - "Demo script (8 minutes)"
    - "Measurable improvement slides with simulated numbers"
---

# SIH 2026 Hackathon Prototype Plan

*Build order: so something credible exists at every checkpoint. Leave out real bank integration, DSC signing, and migration.*

---

## 8-Minute Demo Script

1. **New submission with deliberate wrong amount** → R1 flagged automatically (system detects, names the field, shows required amount)
2. **Officer raises a query** → institution receives it with named field and fix required; replies
3. **Time-travel to T-90 days before maturity** → reminders fire automatically; officer sees the expiring case
4. **Renewal submitted** → new instrument_version created; old version marked as superseded (no coverage gap in the record)
5. **Release attempted below L2** → **BLOCKED** by the system; competent authority approves with a recorded exception note
6. **NOC verified by QR code** → auditor and judge can verify; audit explorer shows every step with hash chain

---

## Prototype Build Order

### Step 1 — Data Model + Seeded Data (Foundation)

Output: PostgreSQL schema with seeded institutions, instruments at all trust levels, deliberately bad records.

Seed data to prepare:
- 5 institutions (3 private, 1 government exempt, 1 in merger)
- 10 instruments (2 per major scenario)
  - 1 with wrong amount (R1)
  - 1 with duplicate FDR number (R4)
  - 1 approaching maturity in 90 days
  - 1 overdue (maturity past, no renewal)
  - 1 at L2 (bank-confirmed) ready for release
  - 1 on hold (external NOC pending)
- 3 officers (regional verifier, bureau officer, competent authority)
- 1 institution clerk + 1 institution signatory

Trust levels seeded: 3 instruments at L0, 3 at L1, 2 at L2, 2 at L-X.

---

### Step 2 — Institution Submission + Upload + Rules R1–R5

Output: Working submission form; upload; rule evaluation; receipt.

Minimum viable:
- Multi-step form with IFSC lookup
- Resumable upload (single file, PDF only for prototype)
- Rules R1, R2, R3, R4, R5 evaluated on submission
- Discrepancy badge shown immediately
- Receipt page with reference number
- Draft save (localStorage is acceptable for prototype only)

Simplifications (acceptable for prototype):
- No ClamAV (show "scan queued" badge)
- No encryption (prototype data is synthetic only)
- OTP simulated (any 6-digit code accepted)

---

### Step 3 — Timeline Engine with Time-Travel Control

Output: A time-travel slider that lets judges jump to any date and see the system's response.

Implementation:
- A hidden admin panel with a date picker: "Simulate date: [date]"
- When a date is set: the timeline engine runs for that date and the UI reflects the new statuses
- Status transitions visible: ACTIVE → EXPIRING → RENEWAL_PENDING → MATURED
- Reminder simulation: a "reminders that would be sent" panel appears (no real SMS/email)

Demo moment: jump to maturity_date - 90 → instrument turns EXPIRING; reminder queue shows 3 upcoming reminders.

---

### Step 4 — Officer Queue + Risk Score Breakdown + Case Workspace

Output: The I2 innovation (risk-ranked worklist) fully visible.

Officer queue:
- Filterable list sorted by risk score (descending)
- Each row shows: institution name, FDR number (last 4 digits), maturity date, trust level badge, risk score
- Click → open case workspace

Risk score breakdown (visible per case):
- Urgency: X points (days to maturity, steeper inside 30 days)
- Amount band: Y points
- Discrepancy severity: Z points
- Bank wait time: W points
- Case age: V points
- Total: X+Y+Z+W+V (shown as a bar chart)

Case workspace (split-screen):
- Left: document viewer (PDF viewer or image)
- Right: typed instrument data + rule flags + history timeline
- Actions: Accept (→ L1), Raise query, Request bank confirmation, Escalate

---

### Step 5 — Release Case + Maker-Checker + NOC with QR + Audit Explorer

Output: The full release lifecycle visible; I1 (QR NOC) and I5 (audit chain) demonstrated.

Release case:
- Institution submits release request with reason + affidavit
- Eligibility checklist shown (is L2? no active holds? maturity reached?)
- Regional verifier reviews → bureau scrutinises → competent authority sees decision card
- Decision card shows: instrument summary, trust level, evidence level, any exceptions
- For the demo: one release attempted at L1 → blocked with clear message
- Competent authority approves at L2 with an exception note → NOC generated

NOC:
- PDF with QR code
- QR links to: /public/noc/{code} → shows: NOC number, institution name, instrument last 4 digits, date issued, status (Valid)
- In the demo: scan the QR with a phone → page loads → "Valid NOC" confirmed

Audit explorer:
- Searchable list of all events for the instrument
- Each event: who, what, before/after (collapsed), timestamp, hash
- "Verify chain" button → confirms chain is intact
- For the demo: show every step from submission to NOC issuance

---

### Step 6 — Dashboard with Maturity Forecast

Output: The I6 innovation (maturity heatmap) demonstrated.

Bureau dashboard:
- Summary cards: Active, Expiring (< 90 days), Overdue, Renewed, Released, Pending verification
- Maturity forecast heatmap (calendar view): shows concentration of maturities by month
- Demo moment: the heatmap shows a peak in May (seeded to align with the AICTE peak season)

---

## Measurable Improvement Slide

> "The following numbers are from simulated data (10 institutions, 20 instruments). They demonstrate how the system would perform at scale."

| Improvement | Baseline (spreadsheet) | With Portal |
|-------------|------------------------|-------------|
| Record accuracy | 3 of 10 seeded error records found manually | 10 of 10 flagged automatically (R1–R5) |
| Time to find a case | 45 seconds (simulated spreadsheet search) | < 2 seconds (search by FDR number) |
| Timely renewal monitoring | 0 of 3 expiring instruments had reminders | 3 of 3 reminders fired on schedule (simulated) |
| Officer effort per case | 12 clicks (simulated manual process) | 5 clicks (queue → review → decide) |
| Cases with named owner + due date | 40% (simulated) | 100% (system assigns on submission) |

---

## What Is Deliberately Left Out (For Clarity)

- Real bank integration (use manual evidence upload)
- DSC signing (use OTP)
- Real ClamAV (show "scan queued" badge)
- Data migration (use seeded synthetic data only)
- Real SMS/email (show in-app only)
- SFMS/NeSL bank guarantee integration
- DigiLocker / eSign
- OCR (mention as v2)
- Horizontal scaling / Kubernetes

State these omissions clearly in the demo. They are not missing — they are explicitly deferred to production phases.

---

## Demo Environment Checklist

- [ ] Synthetic data seeded and verified before demo
- [ ] Time-travel control hidden by default; accessible via /admin/time-travel
- [ ] QR code for the demo NOC leads to a live URL on demo day
- [ ] Demo script rehearsed at least 3 times
- [ ] Backup: screenshots of every step in case of network failure
- [ ] Measurable improvement slide has the "simulated data" disclaimer visible
