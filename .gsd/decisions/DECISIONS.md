# Architecture & Statutory Decisions Log (DECISIONS.md)

| ID | Title | Status | Decided By | Date | Impact |
|---|---|---|---|---|---|
| **D1** | Standalone Portal vs Legacy Portal Extension | **APPROVED** | AICTE IT Head & Bureau Head | 2026-10-15 | Standalone sovereign architecture with read-only sync adapter to approval database. |
| **D2** | Hosting Platform & Compute Standard | **APPROVED** | AICTE IT, NIC | 2026-10-18 | Hybrid Cloud (NIC MeghRaj / On-Premise DC), Java 21+ LTS runtime, PostgreSQL 16+ RDBMS. |
| **D3** | Accepted Instrument Types | **APPROVED** | Regulation Bureau Head | 2026-10-20 | Physical Fixed Deposit Receipts (FDRs) endorsed in joint name, Electronic Bank Guarantees (e-BG via NeSL/SFMS), and Term Deposit Receipts (TDRs). |
| **D4** | Competent Authority & Delegation Matrix | **APPROVED** | Member Secretary, AICTE | 2026-10-22 | Regional Verifier recommends -> Bureau Officer scrutinizes -> Competent Authority (Adviser-I / Member Secretary) executes cryptographically signed release NOC. |
| **D5** | Rule Set Governance & Versioning | **APPROVED** | Bureau Head | 2026-10-24 | All statutory limits, timelines, and penalties externalized in version-controlled rule sets (`aph-2024-27.yaml`). Zero hardcoding in code. |
| **D6** | Cryptographic Ledger Standard | **APPROVED** | Security Working Group | 2026-10-25 | Merkle hash chain using SHA-256 with previous-block-hash pointer in immutable append-only audit table. |
| **D7** | Row-Level Security Strategy | **APPROVED** | Database Lead | 2026-10-26 | PostgreSQL native RLS with transaction-scoped `SET LOCAL app.current_tenant` enforced at connection pool checkout. |
| **D10** | External CERT-In Audit Window | **SCHEDULED** | AICTE IT & CERT-In Empanelled Auditor | 2026-10-28 | Targeted for Weeks 21–25. Pre-audit vulnerability assessment scheduled for Week 20. |
| **D12** | Legacy Data Ingestion Strategy | **APPROVED** | Regional Officers Working Group | 2026-10-29 | Progressive ingestion with L0 tag; automated reconciliation against RBI bank directory and branch verification. |
