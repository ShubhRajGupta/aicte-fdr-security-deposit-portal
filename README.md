# AICTE Centralized Security Deposit & FDR Management Portal (PSID 26265)

> **Official Solution for Smart India Hackathon (SIH 2024 / 2026)**  
> **Problem Statement ID**: 26265  
> **Statutory Authority**: All India Council for Technical Education (AICTE), Ministry of Education, Government of India  
> **Regulation**: Approval Process Handbook (APH 2024-27 Clause 1.4 & Clause 1.5)

[![Deploy to GitHub Pages](https://github.com/ShubhRajGupta/aicte-fdr-security-deposit-portal/actions/workflows/deploy.yml/badge.svg)](https://github.com/ShubhRajGupta/aicte-fdr-security-deposit-portal/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=flat&logo=github)](https://shubhrajgupta.github.io/aicte-fdr-security-deposit-portal/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌐 Live Deployment
**URL**: [https://shubhrajgupta.github.io/aicte-fdr-security-deposit-portal/](https://shubhrajgupta.github.io/aicte-fdr-security-deposit-portal/)

---

## 🏛️ Executive Summary

The **AICTE Central Security Deposit & Fixed Deposit Receipt (FDR) Electronic Management System (e-FDR Portal)** replaces legacy paper/physical fixed deposit receipts with an automated, cryptographically tamper-evident, multi-persona digital infrastructure. It manages over ₹3,400+ Crores in institutional security deposits across thousands of AICTE-approved technical and polytechnic institutions nationwide.

---

## 🔑 Key Features & Architecture

### 1. Multi-Persona Role-Based Access Control (RBAC)
- **Institution Portal**: Security deposit lifecycle submission, queries response, renewal wizard, release applications, and real-time compliance tracker.
- **Bureau Officer Dashboard**: High-level telemetry, portfolio risk breakdown, SLA alerts, batch compliance audits.
- **Scrutiny & Case Workspace**: Side-by-side OCR and bank data discrepancy inspection, rule engine triggers, trust level assignment (L0 to L3).
- **Scheduled Commercial Bank Portal**: Direct bank officer branch verification, lien endorsement, confirmation reference logging.
- **CAG / Independent Auditor Portal**: Sovereign audit trail verification, SHA-256 cryptographic chain inspection, tamper detection sandbox.

### 2. Trust Level Hierarchy
- **L0 (Unverified / Self-Claimed)**: Initial document and deposit receipt submission.
- **L1 (Branch Confirmed)**: Branch manager verification of lien endorsement in favour of AICTE.
- **L2 (CBS / SFMS Verified)**: Direct core banking or SFMS messaging integration with partner scheduled banks.
- **L3 (Central Repository)**: Tamper-proof, cryptographically signed central deposit registry.

### 3. Cryptographic Tamper-Evident Audit Ledger
- SHA-256 chained hash ledger for every administrative and financial action.
- Built-in simulation sandbox allowing evaluators to simulate data tampering and verify instant cryptographic chain breach detection and self-healing.

### 4. Interactive Simulation & Time Travel
- **Time Travel Engine**: Fast-forward to test 90-day, 60-day, and 30-day pre-expiry escalation cascades, automated maturity alerts, and auto-renewal triggers.
- **Rule Simulation Sandbox**: Run scenarios to observe how maturity discrepancies, insufficient deposit values, or missing joint liens are handled.

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Modern Government of India (GoI) Design System, Tailwind-style utility classes, Responsive CSS
- **Icons & Graphics**: Lucide React, Canvas-Confetti, SVG Icons
- **Security & Integrity**: Client-side SHA-256 cryptographic hashing, Session timeout guard, Step-up 2FA simulation
- **Deployment**: GitHub Pages via automated GitHub Actions CI/CD pipeline

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

### Build for Production
```bash
npm run build
```

---

## 📜 Regulation Compliance
Complies with AICTE Approval Process Handbook (APH 2024-27):
- **Clause 1.4**: Security Deposit requirements for new/existing institutions, joint FDR in favor of Regional Officer & Institution.
- **Clause 1.5**: Tenure (8 or 10 years), roll-over rules, interest crediting norms, and encashment / release protocols.

---

Designed and engineered for **Smart India Hackathon (SIH)**.
