#!/usr/bin/env python3
"""Generate high-resolution, sovereign-themed diagrams for SIH 2026 slides.
Uses Playwright with Edge in headless mode to render HTML/CSS/SVG into 300-DPI-equivalent PNGs.
"""

import os
import asyncio
from playwright.async_api import async_playwright

OUT_DIR = "ppt_docs/assets"
os.makedirs(OUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. Slide 2: Proposed Solution Workflow & Operating Mechanism
# -------------------------------------------------------------
HTML_SOLUTION_FLOW = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
  body { background: #FFFFFF; width: 1100px; height: 680px; padding: 20px; color: #1E293B; }
  
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #003366; padding-bottom: 10px; margin-bottom: 16px; }
  .header-title { font-size: 20px; font-weight: bold; color: #003366; }
  .header-badge { background: #F1F5F9; border: 1px solid #CBD5E1; color: #003366; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; }
  
  .pipeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; position: relative; margin-bottom: 20px; }
  
  .step-card {
    background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 14px;
    display: flex; flex-direction: column; justify-content: space-between; position: relative;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  }
  .step-card.active { border-color: #0284C7; background: #F0F9FF; }
  
  .step-num {
    display: inline-block; width: 26px; height: 26px; background: #003366; color: #FFF;
    border-radius: 50%; text-align: center; line-height: 26px; font-size: 13px; font-weight: bold; margin-bottom: 8px;
  }
  .step-title { font-size: 13.5px; font-weight: bold; color: #0F172A; margin-bottom: 8px; min-height: 34px; line-height: 1.25; }
  .step-desc { font-size: 11px; color: #334155; line-height: 1.4; margin-bottom: 10px; flex-grow: 1; }
  .step-tags { display: flex; flex-wrap: wrap; gap: 4px; }
  .tag { background: #E2E8F0; color: #0F172A; font-size: 9.5px; font-weight: bold; padding: 2px 6px; border-radius: 3px; }
  .tag.blue { background: #DBEAFE; color: #1E40AF; }
  .tag.green { background: #DCFCE7; color: #166534; }
  .tag.amber { background: #FEF3C7; color: #92400E; }
  .tag.red { background: #FEE2E2; color: #991B1B; }
  
  /* Connector Arrows */
  .arrow {
    position: absolute; top: 40%; right: -12px; width: 10px; height: 10px;
    border-top: 2.5px solid #0284C7; border-right: 2.5px solid #0284C7;
    transform: rotate(45deg); z-index: 10;
  }
  
  /* State Machine Box */
  .state-machine-box {
    background: #FFFFFF; border: 1.5px solid #003366; border-radius: 8px; padding: 14px 18px;
    margin-bottom: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  }
  .sm-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .sm-title { font-size: 13.5px; font-weight: bold; color: #003366; }
  .sm-rule { font-size: 11px; color: #DC2626; font-weight: bold; }
  
  .states-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .state-node {
    border-radius: 6px; padding: 10px; text-align: center; border: 1.5px solid;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .state-node.l0 { background: #F1F5F9; border-color: #94A3B8; }
  .state-node.l1 { background: #FFFBEB; border-color: #F59E0B; }
  .state-node.l2 { background: #ECFDF5; border-color: #10B981; }
  .state-node.lx { background: #FEF2F2; border-color: #EF4444; }
  
  .state-badge { font-size: 12px; font-weight: bold; padding: 2px 8px; border-radius: 4px; margin-bottom: 4px; }
  .l0 .state-badge { background: #64748B; color: #FFF; }
  .l1 .state-badge { background: #D97706; color: #FFF; }
  .l2 .state-badge { background: #059669; color: #FFF; }
  .lx .state-badge { background: #DC2626; color: #FFF; }
  
  .state-desc { font-size: 10px; color: #334155; line-height: 1.3; }
  
  /* Bottom Highlights */
  .diff-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .diff-item {
    background: #F8FAFC; border-left: 3.5px solid #003366; padding: 8px 12px; border-radius: 0 4px 4px 0;
  }
  .diff-title { font-size: 11px; font-weight: bold; color: #003366; margin-bottom: 2px; }
  .diff-desc { font-size: 10px; color: #475569; line-height: 1.3; }
</style>
</head>
<body>
  <div class="header">
    <div class="header-title">NYAAS REGULATORY ESCROW & VERIFICATION MECHANISM</div>
    <div class="header-badge">APH 2024-27 CLAUSE 7.51 COMPLIANT</div>
  </div>
  
  <div class="pipeline">
    <div class="step-card">
      <div class="step-num">1</div>
      <div class="step-title">Statutory Deposit Intake</div>
      <div class="step-desc">
        AICTE Approval API auto-computes required FDR amount from approved intake. Institution uploads FDR scan & typed metadata.
      </div>
      <div class="step-tags">
        <span class="tag blue">APH Table 1.4</span>
        <span class="tag">Auto-Intake</span>
      </div>
      <div class="arrow"></div>
    </div>
    
    <div class="step-card active">
      <div class="step-num">2</div>
      <div class="step-title">Deterministic Scrutiny Engine</div>
      <div class="step-desc">
        Automated validation evaluates 10 strict statutory rules (R1-R10) within 3 seconds: shortfall, joint lien, maturity & IFSC checks.
      </div>
      <div class="step-tags">
        <span class="tag amber">10 Rules (R1-R10)</span>
        <span class="tag blue">Sub-3s Check</span>
      </div>
      <div class="arrow"></div>
    </div>
    
    <div class="step-card">
      <div class="step-num">3</div>
      <div class="step-title">Four-Tier Trust Ladder</div>
      <div class="step-desc">
        Progressive verification climbs through explicit state gates: Document Scrutiny (L1) to Independent Bank Branch Attestation (L2).
      </div>
      <div class="step-tags">
        <span class="tag green">L0 → L1 → L2</span>
        <span class="tag red">L-X Disputed</span>
      </div>
      <div class="arrow"></div>
    </div>
    
    <div class="step-card">
      <div class="step-num">4</div>
      <div class="step-title">Cryptographic Release Gate</div>
      <div class="step-desc">
        Release/NOC is mathematically locked below L2. CA Class 3 DSC signs discharge; dynamic QR certificate issued & SHA-256 chained.
      </div>
      <div class="step-tags">
        <span class="tag green">QR Discharge NOC</span>
        <span class="tag blue">SHA-256 Ledger</span>
      </div>
    </div>
  </div>
  
  <div class="state-machine-box">
    <div class="sm-header">
      <div class="sm-title">THE FOUR-TIER TRUST STATE MACHINE (GOVERNING PROTOCOL)</div>
      <div class="sm-rule">CRITICAL RULE: RELEASE FORBIDDEN ON ANYTHING BELOW L2</div>
    </div>
    <div class="states-grid">
      <div class="state-node l0">
        <div class="state-badge">L0 : SUBMITTED</div>
        <div class="state-desc">Untrusted self-declaration. Uploaded scan awaiting officer scrutiny.</div>
      </div>
      <div class="state-node l1">
        <div class="state-badge">L1 : DOC-CHECKED</div>
        <div class="state-desc">AICTE Scrutiny Officer verified scan against metadata & guidelines.</div>
      </div>
      <div class="state-node l2">
        <div class="state-badge">L2 : BANK-VERIFIED</div>
        <div class="state-desc">Issuing bank confirmed AICTE lien & active deposit via secure token.</div>
      </div>
      <div class="state-node lx">
        <div class="state-badge">L-X : DISPUTED</div>
        <div class="state-desc">Discrepancy flagged. Automatic query raised with 15-day statutory SLA.</div>
      </div>
    </div>
  </div>
  
  <div class="diff-grid">
    <div class="diff-item">
      <div class="diff-title">Zero Lien Leakage</div>
      <div class="diff-desc">Hard cryptographic lock prevents release without independent commercial bank lien confirmation.</div>
    </div>
    <div class="diff-item">
      <div class="diff-title">Exchequer Interest Ring-Fencing</div>
      <div class="diff-desc">Principal locked to AICTE; accrued interest audited separately per APH Clause 7.51.</div>
    </div>
    <div class="diff-item">
      <div class="diff-title">Dynamic JSONB Rulesets</div>
      <div class="diff-desc">Deposit norms updated without code redeployment as APH handbooks evolve yearly.</div>
    </div>
  </div>
</body>
</html>
"""

# -------------------------------------------------------------
# 2. Slide 3: Clean Sovereign System Architecture Diagram
# -------------------------------------------------------------
HTML_ARCHITECTURE = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
  body { background: #FFFFFF; width: 1100px; height: 740px; padding: 18px; color: #1E293B; }
  
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #003366; padding-bottom: 8px; margin-bottom: 12px; }
  .header-title { font-size: 19px; font-weight: bold; color: #003366; }
  .header-standards { font-size: 10.5px; color: #475569; font-weight: bold; }
  
  .tier-container { display: flex; flex-direction: column; gap: 9px; }
  
  .tier-box {
    border: 1.5px solid #CBD5E1; border-radius: 6px; padding: 8px 12px; background: #F8FAFC;
    position: relative;
  }
  .tier-box.accent-blue { border-color: #0284C7; background: #F0F9FF; }
  .tier-box.accent-navy { border-color: #003366; background: #FAFAFA; }
  .tier-box.accent-green { border-color: #10B981; background: #F0FDF4; }
  
  .tier-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .tier-name { font-size: 11px; font-weight: bold; color: #003366; text-transform: uppercase; letter-spacing: 0.5px; }
  .tier-note { font-size: 9.5px; color: #64748B; font-weight: bold; }
  
  .cards-row { display: grid; gap: 8px; }
  .cols-4 { grid-template-columns: repeat(4, 1fr); }
  .cols-5 { grid-template-columns: repeat(5, 1fr); }
  .cols-2 { grid-template-columns: 1fr 1fr; }
  
  .subcard {
    background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 5px; padding: 7px 9px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  }
  .subcard-title { font-size: 11px; font-weight: bold; color: #0F172A; margin-bottom: 3px; }
  .subcard-desc { font-size: 9.5px; color: #475569; line-height: 1.3; }
  
  .arrow-down {
    text-align: center; font-size: 12px; color: #0284C7; font-weight: bold; line-height: 1; margin: -3px 0;
  }
  
  .footer-specs {
    margin-top: 10px; display: flex; justify-content: space-between; align-items: center;
    background: #003366; color: #FFFFFF; padding: 6px 12px; border-radius: 4px; font-size: 10px; font-weight: bold;
  }
</style>
</head>
<body>
  <div class="header">
    <div class="header-title">NYAAS END-TO-END SOVEREIGN SYSTEM ARCHITECTURE</div>
    <div class="header-standards">CERT-In 2022 • GIGW 3.0 • DPDP Rules 2025 • MeitY Empanelled Cloud</div>
  </div>
  
  <div class="tier-container">
    <!-- Tier 1 -->
    <div class="tier-box">
      <div class="tier-header">
        <div class="tier-name">Tier 1: Access Channels & Stakeholder Portals</div>
        <div class="tier-note">Multi-Tenant Role-Based Access Control</div>
      </div>
      <div class="cards-row cols-4">
        <div class="subcard">
          <div class="subcard-title">Technical Institutions</div>
          <div class="subcard-desc">FDR scan upload, intake auto-calculator, status tracker & query replies.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">AICTE Regional Bureau</div>
          <div class="subcard-desc">Risk-ranked scrutiny queue, OCR verification, discrepancy manager.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">Commercial Bank Branches</div>
          <div class="subcard-desc">Secure tokenized link & SFMS receiver to attest lien & current balance.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">Public & Regulators</div>
          <div class="subcard-desc">Dynamic QR-code verifier for instant cryptographic NOC validation.</div>
        </div>
      </div>
    </div>
    
    <div class="arrow-down">▼ TLS 1.3 / mTLS Encrypted Ingress</div>
    
    <!-- Tier 2 -->
    <div class="tier-box accent-blue">
      <div class="tier-header">
        <div class="tier-name">Tier 2: Sovereign Edge & Security Perimeter</div>
        <div class="tier-note">Zero-Trust Gateway & Pre-Storage Scanning</div>
      </div>
      <div class="cards-row cols-4">
        <div class="subcard">
          <div class="subcard-title">ModSecurity WAF & Rate Limiter</div>
          <div class="subcard-desc">OWASP Core Rule Set protects against DDoS, SQLi & May peak traffic surge.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">Keycloak OIDC / SSO Broker</div>
          <div class="subcard-desc">Jan Parichay & e-Pramaan integration, Step-up 2FA for approvers.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">ClamAV Malware Quarantine</div>
          <div class="subcard-desc">Stream-based antivirus sandbox before files touch storage or database.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">Class 3 DSC Signer</div>
          <div class="subcard-desc">Hardware crypto-token driver for digital signing of discharge certificates.</div>
        </div>
      </div>
    </div>
    
    <div class="arrow-down">▼ Internal Authenticated RPC</div>
    
    <!-- Tier 3 -->
    <div class="tier-box accent-navy">
      <div class="tier-header">
        <div class="tier-name">Tier 3: Core Application Modular Monolith (Spring Boot 3 / Java 21)</div>
        <div class="tier-note">Deterministic Business Logic & Lifecycle State Machine</div>
      </div>
      <div class="cards-row cols-5">
        <div class="subcard">
          <div class="subcard-title">Scrutiny Rules Engine</div>
          <div class="subcard-desc">Evaluates R1-R10 from versioned JSONB rulesets against typed FDR.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">Document Vault</div>
          <div class="subcard-desc">AES-256 envelope encryption with KMS key rotation per regional office.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">Instrument Registry</div>
          <div class="subcard-desc">Immutable lifecycle tracking: deposit, renewal, lien status & release.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">Quartz Timeline Engine</div>
          <div class="subcard-desc">Clustered scheduler runs T-90/60/30 escalation ladder without drift.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">SHA-256 Audit Trail</div>
          <div class="subcard-desc">Tamper-evident chained hash ledger; zero blockchain overhead.</div>
        </div>
      </div>
    </div>
    
    <div class="arrow-down">▼ Encrypted Storage Connections</div>
    
    <!-- Tier 4 -->
    <div class="tier-box accent-green">
      <div class="tier-header">
        <div class="tier-name">Tier 4: Sovereign Persistence & Cloud Storage</div>
        <div class="tier-note">MeitY Empanelled Indian Cloud Data Residency</div>
      </div>
      <div class="cards-row cols-2">
        <div class="subcard">
          <div class="subcard-title">PostgreSQL 16 (Relational System of Record)</div>
          <div class="subcard-desc">Row-Level Security (RLS) strictly isolates regional bureau records; JSONB for dynamic rule schemas; automated WAL archiving.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">Encrypted Object Store (MinIO / S3 Sovereign)</div>
          <div class="subcard-desc">WORM (Write Once, Read Many) bucket policy prevents tampering with uploaded bank FDR scans and issued discharge certificates.</div>
        </div>
      </div>
    </div>
    
    <div class="arrow-down">▼ Standardized Sovereign Connectors</div>
    
    <!-- Tier 5 -->
    <div class="tier-box">
      <div class="tier-header">
        <div class="tier-name">Tier 5: External Sovereign Ecosystem Adapters</div>
        <div class="tier-note">Interoperability with National Systems</div>
      </div>
      <div class="cards-row cols-4">
        <div class="subcard">
          <div class="subcard-title">AICTE Approval Portal</div>
          <div class="subcard-desc">Nightly batch sync of sanctioned programmes & intake.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">SFMS / NeSL Gateway</div>
          <div class="subcard-desc">MT760 & MT760COV messages for structured bank guarantees.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">NIC SMS / Email Gateway</div>
          <div class="subcard-desc">Multi-channel escalation alerts for renewal & discrepancy SLAs.</div>
        </div>
        <div class="subcard">
          <div class="subcard-title">RBI IFSC Reference API</div>
          <div class="subcard-desc">Validates authorized commercial branch IFSC & bank clearing status.</div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="footer-specs">
    <span>Data Path: Browser (TLS 1.3) → ModSecurity WAF → Spring Boot Core (ClamAV & RLS) → PostgreSQL 16 → Quartz Queue</span>
    <span>Zero-Trust Architecture • Sovereign Data Residency</span>
  </div>
</body>
</html>
"""

# -------------------------------------------------------------
# 3. Slide 4: Phased Roadmap & Maturity Stepper
# -------------------------------------------------------------
HTML_ROADMAP = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
  body { background: #FFFFFF; width: 650px; height: 680px; padding: 18px; color: #1E293B; }
  
  .header { border-bottom: 2px solid #003366; padding-bottom: 8px; margin-bottom: 16px; }
  .header-title { font-size: 16px; font-weight: bold; color: #003366; }
  .header-sub { font-size: 10px; color: #475569; }
  
  .stepper { display: flex; flex-direction: column; gap: 14px; position: relative; }
  
  .phase-card {
    border-radius: 8px; border: 1.5px solid; padding: 12px 14px; position: relative;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  }
  .phase-1 { background: #F0FDF4; border-color: #10B981; }
  .phase-2 { background: #F0F9FF; border-color: #0284C7; }
  .phase-3 { background: #F8FAFC; border-color: #003366; }
  
  .phase-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .phase-tag { font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 12px; }
  .phase-1 .phase-tag { background: #10B981; color: #FFF; }
  .phase-2 .phase-tag { background: #0284C7; color: #FFF; }
  .phase-3 .phase-tag { background: #003366; color: #FFF; }
  
  .phase-time { font-size: 10px; color: #64748B; font-weight: bold; }
  .phase-name { font-size: 13px; font-weight: bold; color: #0F172A; margin-bottom: 6px; }
  
  .items-list { list-style: none; display: flex; flex-direction: column; gap: 4px; margin-bottom: 8px; }
  .items-list li { font-size: 10.5px; color: #334155; line-height: 1.35; padding-left: 12px; position: relative; }
  .items-list li::before { content: "•"; position: absolute; left: 0; color: #003366; font-weight: bold; }
  
  .gate-box { background: rgba(255,255,255,0.85); border: 1px dashed; border-radius: 4px; padding: 6px 10px; }
  .phase-1 .gate-box { border-color: #10B981; }
  .phase-2 .gate-box { border-color: #0284C7; }
  .phase-3 .gate-box { border-color: #003366; }
  
  .gate-label { font-size: 9.5px; font-weight: bold; }
  .phase-1 .gate-label { color: #166534; }
  .phase-2 .gate-label { color: #1E40AF; }
  .phase-3 .gate-label { color: #003366; }
  .gate-text { font-size: 9.5px; color: #334155; }
</style>
</head>
<body>
  <div class="header">
    <div class="header-title">PHASED ROADMAP & MATURITY GATES [6]</div>
    <div class="header-sub">Empirical Progression from Tested Prototype to Sovereign Rollout</div>
  </div>
  
  <div class="stepper">
    <!-- Phase 1 -->
    <div class="phase-card phase-1">
      <div class="phase-top">
        <span class="phase-tag">PHASE 1 : WORKING PROTOTYPE</span>
        <span class="phase-time">COMPLETED & DEMONSTRATED TODAY [2]</span>
      </div>
      <div class="phase-name">Interactive Scrutiny Portal & Algorithmic Engine</div>
      <ul class="items-list">
        <li>Fully functional React 18 UI with 10 deterministic discrepancy rules (R1-R10).</li>
        <li>Time-travel calendar simulator for multi-stage expiry escalation (T-90 to T-1).</li>
        <li>Dynamic cryptographic QR-coded discharge NOC generation & verification.</li>
        <li>Interactive SHA-256 tamper-evident audit explorer with injected attack detection.</li>
      </ul>
      <div class="gate-box">
        <span class="gate-label">Maturity Gate Passed: </span>
        <span class="gate-text">Zero compilation errors; deterministic evaluation verified across 10 sample cases.</span>
      </div>
    </div>
    
    <!-- Phase 2 -->
    <div class="phase-card phase-2">
      <div class="phase-top">
        <span class="phase-tag">PHASE 2 : SIH GRAND FINALE PACKAGING</span>
        <span class="phase-time">OCTOBER – NOVEMBER 2026</span>
      </div>
      <div class="phase-name">Production Hardening & Sovereign Adapters</div>
      <ul class="items-list">
        <li>Spring Boot 3 / Java 21 backend service packaging with Keycloak SSO.</li>
        <li>Containerized ClamAV stream scanner in pre-storage upload pipeline.</li>
        <li>Mock SFMS MT760/MT760COV financial message gateway for bank guarantees.</li>
        <li>Row-Level Security (RLS) enforcement across AICTE Regional Bureau offices.</li>
      </ul>
      <div class="gate-box">
        <span class="gate-label">Maturity Gate Target: </span>
        <span class="gate-text">Passes 50 concurrent simulated submissions with zero deadlocks & sub-3s response.</span>
      </div>
    </div>
    
    <!-- Phase 3 -->
    <div class="phase-card phase-3">
      <div class="phase-top">
        <span class="phase-tag">PHASE 3 : NIC & AICTE PILOT DEPLOYMENT</span>
        <span class="phase-time">Q1 2027 (PILOT ROLLOUT)</span>
      </div>
      <div class="phase-name">MeitY Cloud Rollout & Compliance Certification</div>
      <ul class="items-list">
        <li>Mandatory CERT-In Safe-to-Host vulnerability audit by empanelled agency [3].</li>
        <li>Production staging on NIC / MeitY-empanelled sovereign cloud infrastructure.</li>
        <li>Pilot launch in Western & Northern Regional Offices covering 2,000+ colleges.</li>
        <li>Full GIGW 3.0 bilingual accessibility & STQC security compliance sign-off.</li>
      </ul>
      <div class="gate-box">
        <span class="gate-label">Maturity Gate Target: </span>
        <span class="gate-text">Official STQC cyber audit clearance & AICTE Regulation Bureau user sign-off.</span>
      </div>
    </div>
  </div>
</body>
</html>
"""

# -------------------------------------------------------------
# 4. Slide 5: Visual ROI & Impact Stat Cards
# -------------------------------------------------------------
HTML_ROI_METRICS = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }
  body { background: #FFFFFF; width: 850px; height: 180px; padding: 12px; color: #1E293B; }
  
  .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  
  .metric-card {
    background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 12px;
    display: flex; flex-direction: column; justify-content: center; position: relative;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  }
  .metric-card.blue { border-color: #0284C7; background: #F0F9FF; }
  .metric-card.green { border-color: #10B981; background: #ECFDF5; }
  .metric-card.amber { border-color: #D97706; background: #FFFBEB; }
  
  .metric-num { font-size: 28px; font-weight: bold; line-height: 1; margin-bottom: 4px; }
  .blue .metric-num { color: #0284C7; }
  .green .metric-num { color: #059669; }
  .amber .metric-num { color: #D97706; }
  
  .metric-label { font-size: 11px; font-weight: bold; color: #0F172A; margin-bottom: 2px; }
  .metric-sub { font-size: 9.5px; color: #475569; line-height: 1.3; }
</style>
</head>
<body>
  <div class="metrics-grid">
    <div class="metric-card blue">
      <div class="metric-num">-92%</div>
      <div class="metric-label">Verification Turnaround</div>
      <div class="metric-sub">Slashed from 18-24 days to under 48 hours via automated pre-scrutiny & bank token link.</div>
    </div>
    
    <div class="metric-card green">
      <div class="metric-num">100%</div>
      <div class="metric-label">Lien Fraud Prevention</div>
      <div class="metric-sub">Deposit release strictly forbidden without Level-2 independent commercial bank confirmation.</div>
    </div>
    
    <div class="metric-card amber">
      <div class="metric-num">99%</div>
      <div class="metric-label">Audit Effort Saved</div>
      <div class="metric-sub">Instant cryptographic proof via chained SHA-256 ledger replaces weeks of manual file retrieval.</div>
    </div>
  </div>
</body>
</html>
"""

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

async def generate_all():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        
        # 1. Solution Flow Diagram (Slide 2)
        page1 = await browser.new_page(viewport={"width": 1100, "height": 680}, device_scale_factor=2)
        await page1.set_content(HTML_SOLUTION_FLOW)
        p1_path = os.path.join(OUT_DIR, "diagram_solution_flow.png")
        await page1.screenshot(path=p1_path)
        print(f"Generated: {p1_path}")
        await page1.close()
        
        # 2. System Architecture Diagram (Slide 3)
        page2 = await browser.new_page(viewport={"width": 1100, "height": 740}, device_scale_factor=2)
        await page2.set_content(HTML_ARCHITECTURE)
        p2_path = os.path.join(OUT_DIR, "diagram_system_architecture_clean.png")
        await page2.screenshot(path=p2_path)
        print(f"Generated: {p2_path}")
        await page2.close()
        
        # 3. Phased Roadmap Diagram (Slide 4)
        page3 = await browser.new_page(viewport={"width": 650, "height": 680}, device_scale_factor=2)
        await page3.set_content(HTML_ROADMAP)
        p3_path = os.path.join(OUT_DIR, "diagram_roadmap_stepper.png")
        await page3.screenshot(path=p3_path)
        print(f"Generated: {p3_path}")
        await page3.close()
        
        # 4. ROI Metrics Banner (Slide 5)
        page4 = await browser.new_page(viewport={"width": 850, "height": 180}, device_scale_factor=2)
        await page4.set_content(HTML_ROI_METRICS)
        p4_path = os.path.join(OUT_DIR, "diagram_roi_metrics.png")
        await page4.screenshot(path=p4_path)
        print(f"Generated: {p4_path}")
        await page4.close()
        
        await browser.close()
        print("All diagrams generated successfully!")

if __name__ == "__main__":
    asyncio.run(generate_all())
