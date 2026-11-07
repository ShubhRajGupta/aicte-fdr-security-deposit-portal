# AICTE Centralized Security Deposit & FDR Management Portal (PSID 26265)

> **Official Solution for Smart India Hackathon (SIH 2024 / 2026)**  
> **Problem Statement ID**: 26265  
> **Statutory Authority**: All India Council for Technical Education (AICTE), Ministry of Education, Government of India  
> **Mandate**: Approval Process Handbook (APH 2024-27 Clause 1.4 & Clause 1.5)

[![Deploy to GitHub Pages](https://github.com/ShubhRajGupta/aicte-fdr-security-deposit-portal/actions/workflows/deploy.yml/badge.svg)](https://github.com/ShubhRajGupta/aicte-fdr-security-deposit-portal/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=flat&logo=github)](https://shubhrajgupta.github.io/aicte-fdr-security-deposit-portal/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FShubhRajGupta%2Faicte-fdr-security-deposit-portal)
[![Compliance: GIGW 3.0](https://img.shields.io/badge/Compliance-GIGW_3.0-orange.svg)](https://www.meity.gov.in)
[![Security: NIST 800-63B](https://img.shields.io/badge/Security-NIST_800--63B-blue.svg)](https://pages.nist.gov/800-63-3/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌐 Live Deployments & Instant Access
- **Official Live Portal (GitHub Pages)**: [https://shubhrajgupta.github.io/aicte-fdr-security-deposit-portal/](https://shubhrajgupta.github.io/aicte-fdr-security-deposit-portal/)
- **Vercel 1-Click Import**: [Deploy on Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FShubhRajGupta%2Faicte-fdr-security-deposit-portal)
- **Interactive Evaluator Mode**: Direct access without mandatory login barriers. Evaluators can freely switch between 4 official personas (Technical Institution, AICTE Officer, Bank Manager, CAG Auditor) via 1-click pills.

---

## 🏛️ Executive Summary

The **AICTE Central Security Deposit & Fixed Deposit Receipt (FDR) Electronic Management System (e-FDR Portal)** replaces legacy paper fixed deposit receipts with an automated, cryptographically tamper-evident, multi-persona digital infrastructure. It safeguards over **₹3,400+ Crores** in institutional security deposits across **14,000+ AICTE-approved technical and polytechnic institutions** nationwide.

---

## 📁 Repository Directory Structure

```
aicte-fdr-security-deposit-portal/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Automated CI/CD pipeline for GitHub Pages
├── docs/                           # Organized Technical Documentation
│   ├── ENGINEERING_BLUEPRINT.md    # Full system architecture & design specification
│   ├── SOLUTION_PLAN.md            # Comprehensive SIH solution plan
│   ├── DEMO_WALKTHROUGH.md         # Step-by-step evaluator demonstration script
│   ├── PROJECT_RULES.md            # Engineering standards & compliance rules
│   ├── presentation/               # Official SIH presentation decks (.pptx & .pdf)
│   └── report/                     # Official project report (.pdf & LaTeX source)
├── public/
│   ├── assets/
│   │   ├── badges/                 # NIC, CERT-In, DigiLocker, GIGW 3.0, ISO 27001
│   │   ├── banks/                  # Scheduled bank official SVG logos (SBI, PNB, BoB, etc.)
│   │   ├── stamps/                 # AICTE Gold Seal, Red Lien, Blue CBS, Green NOC
│   │   ├── emblem-india.svg        # State Emblem of India
│   │   ├── aicte-logo.png          # Official AICTE crest
│   │   ├── digital-india.svg       # Digital India logo
│   │   ├── indian-parliament.jpg   # Parliament landmark photograph
│   │   ├── rashtrapati-bhavan.jpg  # Rashtrapati Bhavan photograph
│   │   └── india-gate.jpg          # India Gate photograph
├── server/                         # Express API backend & seed registry
├── src/                            # Clean React 18 + TypeScript source code
│   ├── components/                 # Modals, Dashboards, Worklists, Portals
│   ├── context/                    # AppContext global state & simulation engines
│   ├── data/                       # Seed institutions, instruments & APH directories
│   ├── services/                   # Hashing, rules engine, OCR & QR generators
│   └── types/                      # TypeScript definitions for statutory instruments
├── .gitignore                      # Strict exclusion rules for artifacts & caches
├── index.html                      # Single-page application root
├── package.json                    # Dependencies & build scripts
├── package-lock.json               # Locked dependency tree
├── tsconfig.json                   # TypeScript configuration
├── vercel.json                     # Vercel deployment routing
├── vite.config.ts                  # Vite bundler configuration
└── README.md                       # Repository documentation & guide
```

---

## 📚 Technical Documentation Index

| Document | Description | Format |
|---|---|---|
| [**Engineering Blueprint**](docs/ENGINEERING_BLUEPRINT.md) | Full technical architecture, database schemas, and cryptographic integrity design | Markdown |
| [**Solution Plan**](docs/SOLUTION_PLAN.md) | Problem breakdown, statutory constraints, and innovation pillars | Markdown |
| [**Demo Walkthrough**](docs/DEMO_WALKTHROUGH.md) | Step-by-step evaluation guide for judges across all 4 user roles | Markdown |
| [**Project Rules**](docs/PROJECT_RULES.md) | Development standards, Git hygiene, and GIGW 3.0 compliance rules | Markdown |
| [**Presentation Deck**](docs/presentation/NYAAS_SIH2026_Submission_6Slides.pdf) | Official 6-slide SIH evaluation presentation deck | PDF / PPTX |
| [**Statutory Report**](docs/report/AICTE_FDR_Portal_Report_PSID_26265.pdf) | Complete technical and regulatory report | PDF |

---

## 🔑 Core Innovations & Architecture

### 1. Multi-Persona Role-Based Access Control (RBAC)
- **Technical Institution Portal**: Security deposit lodgement wizard, query response, renewal wizard, and real-time compliance tracker.
- **Bureau Officer Dashboard**: High-level telemetry, portfolio risk breakdown, SLA alerts, and batch compliance audits.
- **Scrutiny & Case Workspace**: Side-by-side OCR and bank data discrepancy inspection, deterministic rule engine triggers (R1–R10), and trust level elevation (L0 to L2).
- **Scheduled Commercial Bank Portal**: Direct bank officer branch verification, Core Banking System (CBS) lien recording, and instant STP attestation.
- **CAG / Independent Auditor Portal**: Sovereign audit trail verification, SHA-256 cryptographic chain inspection, and tamper-simulation sandbox.

### 2. Statutory Trust Level Hierarchy (APH 2024-27 Clause 1.4)
- **L0 (Lodged / Self-Declared)**: Initial instrument and scan submission by college.
- **L1 (Officer Scrutinized)**: Regional / Bureau officer verification of parameters and AICTE joint lien clause.
- **L2 (Bank Confirmed)**: Direct branch Core Banking System (CBS) confirmation via secure attestation link. *(Mandatory prerequisite for deposit release)*.
- **L-X (Disputed / Frozen)**: Discrepancy detected (shortfall, duplicate instrument, or missing joint holder).

### 3. Cryptographic Tamper-Evident Audit Ledger
- Immutable SHA-256 Merkle hash continuity chaining for every state change and document upload.
- Simulation sandbox allowing evaluators to simulate data tampering and observe real-time cryptographic breach detection.

### 4. Interactive Simulation & Time Travel
- **Time Travel Engine**: Fast-forward calendar dates to test pre-expiry escalation cascades (T-90, T-60, T-30 days), automated maturity alerts, and zero-gap renewal chaining.
- **Rule Simulation Sandbox**: Run scenarios to observe how maturity discrepancies, insufficient deposit values, or missing joint liens are handled.

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Government of India (GoI) Design System, Tailwind-style utility classes, Responsive CSS
- **Icons & Graphics**: Lucide React, Canvas-Confetti, Official Government Vector SVGs
- **Security & Integrity**: Client-side SHA-256 cryptographic hashing, Session timeout guard, Step-up 2FA simulation
- **Deployment**: Automated GitHub Pages CI/CD pipeline

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Setup
```bash
# Clone the repository
git clone https://github.com/ShubhRajGupta/aicte-fdr-security-deposit-portal.git

# Navigate into project directory
cd aicte-fdr-security-deposit-portal

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 📜 Regulatory Mandate Compliance
Complies with All India Council for Technical Education **Approval Process Handbook (APH 2024-27)**:
- **Clause 1.4**: Security Deposit requirements for new/existing institutions, mandatory joint FDR in name of "Member Secretary, AICTE New Delhi".
- **Clause 1.5**: Lock-in tenure (8 or 10 years), roll-over rules, interest crediting norms, and encashment / release protocols.

---

Designed and engineered for **Smart India Hackathon (SIH)**.
