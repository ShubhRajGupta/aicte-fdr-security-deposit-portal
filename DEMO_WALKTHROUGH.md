# AICTE Security Deposit / FDR Portal (PSID 26265)
## Hackathon High-Fidelity Interactive Mock & Prototype Guide

This prototype implements the **AICTE Centralized Security Deposit / FDR Portal** designed for **SIH 2026 (PSID 26265)**. It fulfills every specification set forth in `.gsd/HACKATHON_PROTOTYPE.md`, `.gsd/SPEC.md`, and the Solution Blueprint.

---

### How to Run the Prototype Locally

The application is built with **React 18 + TypeScript + Vite** and uses a rich sovereign styling theme (Executive Government Navy with Indian Tricolor Saffron/Green sovereign accents).

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# Open in browser:
# http://localhost:3000
```

---

### Key Architectural Innovations Demonstrated

1. **Four-Tier Trust Level Architecture (AICTE Core Priority)**:
   - **L0 Submitted (Grey)**: Declared by institution, pending officer scrutiny.
   - **L1 Document-Checked (Amber)**: Officer verified scanned FDR against typed parameters and confirmed lien notation.
   - **L2 Bank-Confirmed (Green)**: Issuing bank independently confirmed lien marking and deposit balance with signed evidence.
   - **L-X Disputed / Open Query (Red)**: Active discrepancy flagged by deterministic rules engine (R1–R10) or officer.

2. **Innovation I2 — Risk-Ranked Officer Worklist with Explainable Scoring**:
   - Scores every case deterministically:
     $$\text{Score} = \text{Urgency (Maturity Proximity)} + \text{Amount Band} + \text{Discrepancy Severity} + \text{Bank Wait Time} + \text{Case Age}$$
   - Every row in the **Risk-Ranked Worklist** has an expandable score breakdown showing the exact points contribution.

3. **Innovation I6 — Maturity Forecast & Workload Heatmap**:
   - Monthly calendar distribution showing seasonal clustering during the annual AICTE approval window (May peak surge with 300% volume).

4. **Timeline Simulation Engine (Time-Travel)**:
   - Floating virtual calendar control in the header.
   - Jump to presets (Today, T-90 Days, T-30 Days, Matured, Overdue, or Custom Date).
   - Automatically triggers status transitions (`ACTIVE` $\rightarrow$ `EXPIRING` $\rightarrow$ `MATURED` $\rightarrow$ `OVERDUE`) and fires simulated multi-channel reminders (SMS, Email, In-App).

5. **Innovation I1 — Tamper-Evident QR-Verifiable NOC**:
   - Authentic Government of India / AICTE digital No Objection Certificate.
   - Scannable QR code generated in real time using the `qrcode` engine.
   - Live public verification page (`/#/public/noc/:code`) simulating smartphone scanner validation.

6. **Innovation I5 — Tamper-Evident Cryptographic Audit Explorer**:
   - Hash-chained immutable event ledger where:
     $$\text{Current Hash} = \text{SHA-256}(\text{Previous Hash} \parallel \text{Timestamp} \parallel \text{Actor} \parallel \text{Event Payload} \parallel \text{State Diff})$$
   - Includes a **"Verify Hash Chain Integrity"** engine that checks 100% cryptographic continuity from root genesis block to current state.

7. **Innovation I11 — Secure Bank Branch Confirmation Link**:
   - Simulates the direct one-time verification link for bank branch managers (SBI, PNB, Canara Bank, HDFC Bank) to confirm lien marking and elevate instruments to **L2**.

8. **Measurable Improvement & ROI Slide**:
   - Compares the baseline manual spreadsheet register against the FDR portal across 5 key dimensions with the mandatory simulated data disclaimer.

---

### The 8-Minute SIH Demo Script (1-Click Guided Flow)

Click the **"8-Min Demo Script"** button in the header at any time to launch the automated scenario runner:

1. **Scenario 1 — New Submission with Wrong Amount (Rule R1)**:
   - Loads FDR `#FDR/SBI/2026/89421`.
   - Rules engine flags Rule R1: Shortfall of ₹10,00,000 (Submitted ₹25L vs. Required ₹35L per APH 2024-27).
   - Names the field, displays required vs detected values, and blocks release.

2. **Scenario 2 — Officer Scrutiny Query & Institution Remedy**:
   - Switches to Institution view.
   - Reviews open query on amount shortfall.
   - Institution submits clarification and supplementary guarantee details $\rightarrow$ Query marked `RESOLVED`.

3. **Scenario 3 — Time-Travel to T-90 Days Before Maturity**:
   - Opens Time-Travel engine and jumps to `2027-01-20`.
   - Instrument `#44018` transitions to `EXPIRING`.
   - 3 automated alerts (SMS, Email, In-App) fire and populate the notification bell.

4. **Scenario 4 — Deposit Renewal with Zero Coverage Gap**:
   - Expiring deposit renewed into version 2.
   - Parent instrument marked as superseded; continuous statutory protection unbroken.

5. **Scenario 5 — Release Attempt Below L2 BLOCKED vs. L2 Approval**:
   - Release attempted on unconfirmed instrument $\rightarrow$ **BLOCKED BY SYSTEM** with security violation alert.
   - Approved only when verified at L2 or when Competent Authority enters a documented Exception Note.

6. **Scenario 6 — Live QR Scan & Audit Explorer Verification**:
   - Displays official AICTE digital NOC with live scannable QR code.
   - Opens Audit Explorer and executes **"Verify Hash Chain Integrity"** proving 0 tampered blocks.

---

### Persona Switcher

The top-right corner of the header contains an instant persona switcher:
- **🏛️ Dr. Vikram Seth**: Bureau Scrutiny Officer (Regulation Bureau, AICTE HQ)
- **🏢 Dr. Rajesh Sharma**: Authorized Signatory (Apex Institute of Technology, ID: 1-3829104)
- **🔍 Smt. Sunita Rao**: Regional Verifier (Northern Regional Office, Kanpur)
- **⚖️ Prof. Rajive Kumar**: Competent Authority (Member Secretary, AICTE)
- **🏦 Shri Alok Verma**: Bank Branch Manager (State Bank of India)
- **🛡️ Shri K. Ramanathan**: Independent Auditor (CERT-In / CAG Panel)
