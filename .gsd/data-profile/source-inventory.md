# Data Source Profile & Ingestion Inventory

## 1. Overview
Inventory of institutional data, legacy fixed deposit records, and external reference streams required for operation of the AICTE FDR / Security Deposit Management System (PSID 26265).

---

## 2. Source Streams

| Source System | Type | Estimated Volume | Refresh Cadence | Integration Mode | Quality Status |
|---|---|---|---|---|---|
| **AICTE Approval Master** | Relational / Oracle DB extract | ~13,500 active institutions | Nightly at 02:00 IST | Secure SFTP / JSON file drop | High: Standard AICTE Permanent IDs |
| **Regional Legacy FDR Registers** | Excel (.xlsx), CSV, physical logbooks | ~45,000 historic instruments | One-time progressive migration | ETL ingestion batch + manual scrutiny | Medium-Low: Missing IFSCs, date format discrepancies |
| **RBI Scheduled Commercial Banks Directory** | Master reference dataset | ~150 scheduled banks / ~160,000 branches | Monthly sync | REST API / NEFT/RTGS IFSC DB | High: Authoritative RBI financial master |
| **NeSL / SFMS Electronic Guarantees** | Structured XML / ISO 20022 messages | Anticipated ~4,000 p.a. | Real-time webhook / poll | API Gateway (e-BG adapter) | Pristine: Cryptographically signed |
| **Public Verification Registry** | Public read-only projection | All released and active NOCs | Immediate on state transition | Database read-replica / Redis cache | Pristine: Signed SHA-256 hashes |

---

## 3. Data Cleansing & Reconciliation Rules
1. **Institution Permanent ID Normalization**: All IDs mapped to canonical regex `^[1-9]-[0-9]{7,10}$`.
2. **Bank IFSC Resolution**: Cross-referenced against RBI master; obsolete IFSCs flagged for branch code migration.
3. **Date Resolution**: Calendar dates normalized to `YYYY-MM-DD` in `Asia/Kolkata` time zone.
4. **Currency Normalization**: Exact 2-decimal representation using `NUMERIC(18,2)` to prevent floating point inaccuracies.
