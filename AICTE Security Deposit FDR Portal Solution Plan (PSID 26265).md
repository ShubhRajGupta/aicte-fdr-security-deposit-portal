# AICTE Security Deposit / FDR Portal: Solution Plan

*PSID 26265 · AICTE Regulation Bureau · Planning document v1.0 · 24 Oct 2026 · Planning only, no code*

## 1. Executive summary

Build one secure, India-hosted portal that is the single source of truth for every security deposit and FDR AICTE holds against an institution. Three ideas drive the whole design:

1. **Trust levels, not a yes/no flag.** Every instrument carries a verification level: *Submitted* (institution says so), then *Document-checked* (an officer reviewed the scan), then *Bank-confirmed* (the issuing bank confirmed through an authorised channel). The problem statement flags this as an AICTE priority, so it sits at the centre of the data model.
2. **Dates drive everything.** A versioned rules-and-timeline engine computes validity, maturity, renewal and escalation dates and fires reminders. Officers work from queues, not spreadsheets.
3. **Boring, auditable technology.** A modular monolith on Java 21 / Spring Boot with PostgreSQL, hosted at NIC or a MeitY-empanelled cloud in India, security-audited before go-live. No blockchain, no microservices, no AI in version 1.

**Honest limits of this plan.** AICTE does not publish its internal servers, network or bank-integration setup, so Section 4 separates *verified* from *assumed* and Section 15 lists what must be confirmed with AICTE IT. Also, I found no public, standard bank-to-beneficiary electronic verification channel for plain FDRs (one exists for bank guarantees, see 3.1). The design therefore treats bank confirmation as a pluggable, partly manual step.

## 2. What was asked, and what mattered most

### 2.1 Priority ladder (from the comments on the problem statement)

| Rank | Priority | Source |
| --- | --- | --- |
| Ultimate | An efficient, transparent, accountable digital mechanism that minimises delay and complies with regulations and financial procedures | Final paragraph |
| AICTE 1 | Transparent tracking across the full lifecycle, adhering to AICTE requirements and authorised financial procedures | Description |
| AICTE 2 | Secure, centralised portal for the Regulation Bureau and authorised stakeholders | Detailed description |
| AICTE (data) | Institution-wise and instrument-wise records with reference no., bank, amount, issue and maturity dates, status, documents | Detailed description |
| AICTE (trust) | Distinguish institution-submitted information from independently bank-confirmed information | Detailed description |
| Client features 1 to 9 | See traceability table below | Comments |

### 2.2 Requirement traceability

| # | Client feature | Module | Acceptance test |
| --- | --- | --- | --- |
| 1 | Digital submission and storage of FDR documents | Document Vault | Institution uploads FDR scan and affidavit; file is virus-scanned, hashed, encrypted, retrievable by authorised roles only |
| 2 | Verification and discrepancy flagging | Verification Engine | Seeded bad records (wrong amount, duplicate FDR number, wrong beneficiary) are each flagged with the correct rule code |
| 3 | Maturity and validity tracking | Timeline Engine | Status moves to Expiring, Matured or Overdue on the correct day without manual action |
| 4 | Configurable reminders, overdue flagging | Alert Service | Reminders at configured offsets reach institution and officer; overdue cases escalate on schedule |
| 5 | Release, discharge and refund tracking | Release Workflow | A release case runs request, scrutiny, approval, NOC, closure with every step logged |
| 6 | Dashboard (active, expiring, matured, renewed, released, pending) | Dashboard | Counts reconcile exactly with the underlying records |
| 7 | Search, document history, scrutiny notes, permitted edits | Case Workspace | Any record is found by FDR number, institution ID or bank in under 2 seconds; history shows every version |
| 8 | Automated reports | Reporting | Scheduled reports of pending verifications, upcoming maturities, missing documents, intervention cases |
| 9 | Role-based access, encryption, audit trail | Security Core | Penetration test finds no privilege escalation; audit log is tamper-evident |
| PS 10 | Integration with existing systems and bank services | Integration Layer | Institution master synced from the AICTE portal; no re-keying of institution data |

## 3. Ground reality: how this works today

### 3.1 Verified facts and what each means for the design

| Fact (public source) | Design consequence |
| --- | --- |
| Security deposit is part of the approval process: new institutions pay or create it; existing institutions in operation for more than five years need none, per the APH 2024-25 FAQ (Table 1.4). Earlier handbooks used 10 years. | Rules must be **versioned by APH edition and academic year**. Never hard-code thresholds. |
| Government institutions do not pay a security deposit. | Institution type drives applicability. |
| New-institution deposits could be paid online through the institution login (statuses such as Deposit Requested and Deposit Received appear in the AICTE guide). | The portal must read or receive these statuses from the existing approval system, not duplicate them. |
| Release of an FDR/RTGS deposit is applied for on the AICTE portal with a request letter, an affidavit, and a copy of the FDR. A Regional Office verifies and forwards to the bureau; AICTE then issues a NOC (APH 2022-23, clause 7.51). | The release workflow is **maker, Regional Office verifier, bureau, competent authority, NOC**. Clause numbers may differ in APH 2024-27 and must be re-checked. |
| Release is withheld if the institution has an unresolved embezzlement matter with government bodies or banks, and special rules apply to progressive closure and mergers (APH 2022-23, 7.51). | Release cases need a **Hold** state with reason and an external-NOC dependency. |
| In a past release exercise (2010-11 institutions) AICTE required the **interest portion** to be refunded to AICTE's bank account, and banks' slow encashment delayed cases. | Track principal and interest separately; track bank encashment status; expect bank latency. |
| Approval cycles have hard dates, for example deposit deadlines of 31 May and 31 July in one handbook edition; release processing was deferred until approval work finished. | Load is seasonal. Plan peak capacity from March to July. |
| Indian bank guarantees are advised through SFMS (message types 760 / 760COV), and an e-BG repository exists at NeSL. | If AICTE accepts BGs, verification can use the SFMS copy or NeSL. For FDRs, assume **no equivalent channel** until a bank or AICTE confirms one. |

**Production Reality Check.** The most common failure of portals like this is encoding one year's handbook rules into code. When the next APH changes the deposit rule, an unversioned rules table forces a redeploy and breaks old cases.

### 3.2 Real scenarios the system must handle

| Scenario | What really happens | System behaviour |
| --- | --- | --- |
| Institution uploads a blurred or edited FDR scan | Officer cannot read it, or it has been altered | Quality check at upload, mandatory fields typed in separately, OCR cross-check, officer query workflow |
| Same FDR number appears under two institutions | Possible fraud or data-entry error | Hard duplicate rule, case blocked from acceptance until cleared |
| FDR is not lien-marked or not in AICTE's favour | Instrument exists but gives AICTE no security | Beneficiary and lien fields are mandatory; mismatch raises a discrepancy |
| FDR auto-renews at the bank with a new number or date | Records go stale | Renewal creates a new *version* linked to the old one, not an overwrite |
| Bank merges or changes IFSC | Old bank details become invalid | Validate against the RBI IFSC list and keep history of bank names |
| Trust or society renames itself | Depositor name no longer matches approval record | Entity-name history; officer-confirmed alias |
| FDR matures during the approval window | Institution loses security cover mid-cycle | Alert at T-90 and T-60, escalation if no renewal submitted |
| Institution closes or merges | Deposit release rules change | Closure and merger flags on the institution record feed release eligibility |
| Bank is slow or unresponsive | Verification stalls for weeks | Bank-confirmation request has its own SLA clock and reminder |
| Officer on leave or transferred | Cases sit unattended | Queue ownership by role and region, with reassignment and delegation logs |
| Interest accrues during deposit | Principal and interest are treated differently on release | Separate ledger lines for principal, interest, TDS if any |
| Peak submission week | Hundreds of uploads in days | Async virus scan and OCR via queue; uploads never block on processing |

### 3.3 Not publicly known (do not assume)

AICTE's data-centre location, server specification, database vendor, existing portal technology, the bank accounts and banking partners used for deposits, whether a legacy FDR register exists in Excel or a database, and the approved financial procedure for refunds. These are listed as questions in Section 15.

## 4. Hardware and environment

Status key: **V** = verified in public sources, **A** = assumption to confirm with AICTE IT.

| Layer | Likely reality | Status | Plan |
| --- | --- | --- | --- |
| Hosting | Government applications are commonly hosted at NIC data centres, NIC cloud, or MeitY-empanelled cloud service providers; empanelment requires audited controls and data residing in India | V (pattern), A (AICTE choice) | Design for 2 to 4 virtual machines or a small Kubernetes cluster, in India, with a separate DR site |
| Compute | Virtual machines, not bare metal; sizing set by the host | A | Start at 4 vCPU / 16 GB for app, 8 vCPU / 32 GB for database, scale after load test |
| Storage | Object or block storage with provider-managed redundancy | A | S3-compatible object store for documents; database on SSD volumes; budget about 1 to 2 TB for the first 5 years |
| Official workstations | Windows desktops on government network, Chrome / Edge / Firefox, scanners at registry | A | Support the last two versions of the three main browsers; no plugins; works on 1366x768 screens |
| Digital signature tokens | Government officers in India widely use Class 3 DSC USB tokens for signing | A | Signing step uses a vendor-neutral browser signing utility; password plus OTP login works without it |
| Document scanners | Registry and Regional Offices scan hard copies | A | Accept PDF and JPEG/PNG up to 10 MB per file; recommend 200 dpi, black and white PDF |
| Institutions' side | Mixed internet quality, many users on mobile or shared PCs | A | Light pages, resumable uploads, mobile-friendly forms |
| Email and SMS | NIC provides gov.in email and SMS gateways for government departments | A | Notification service has pluggable providers; in-app inbox as fallback |
| Bank side | SFMS for guarantees; most FDR confirmation today is by letter or email from the branch | V (SFMS), A (FDR) | Manual-with-evidence confirmation first; integrate where a bank offers an API |

**Production Reality Check.** Government VMs often have no outbound internet. Every external call (SMS, email, bank check, IFSC list) must work through an approved gateway, have a timeout and a fallback, and the system must still function when all of them are down.

## 5. Safety protocols, security and compliance

| Control area | Requirement | Source | How the design meets it |
| --- | --- | --- | --- |
| Security audit before go-live | Application must be security audited and cleared (a safe-to-host certificate) by NIC, STQC, or a CERT-In empanelled auditor before production hosting | GIGW 3.0, guideline 5.3.1 | Budget 4 to 6 weeks and one re-test cycle; staging URL kept frozen for the auditor |
| Data residency | Government data on empanelled cloud must stay in India | MeitY empanelment terms | All production, DR and backup in India; no foreign SaaS for documents, logs or monitoring |
| Incident reporting | Report specified cyber incidents to CERT-In within 6 hours | CERT-In Directions, 2022 | Incident runbook with named owner and 6-hour clock; breach reports to the Data Protection Board run on a parallel clock |
| Log retention | ICT logs kept for a rolling 180 days within India; clocks synced to NIC or NPL time | CERT-In Directions, 2022 | Central log store with 180-day minimum (plan 1 year, to align with DPDP rules); NTP from NIC or NPL |
| Personal data law | DPDP Rules 2025 notified 13 Nov 2025; the substantive duties apply from about 13 May 2027; minimum safeguards include encryption, access control, backups, and log retention of at least one year | DPDP Rules 2025 | Build to the 2027 standard now. Whether AICTE benefits from a State exemption is a legal question; do not rely on it |
| Accessibility and usability | Government sites follow GIGW 3.0, which builds on WCAG | GIGW 3.0 | WCAG 2.1 AA checks in CI; bilingual (English and Hindi) labels |
| Financial procedure | Release or refund only as authorised by the competent authority under AICTE financial rules | Problem statement | Maker-checker with a named competent authority; no single user can create and approve a payout |
| Authentic records | Evidence that a document existed, unaltered, at a time | Good practice | SHA-256 hash at upload, hash-chained audit log, no hard deletes |

### 5.1 Security design, concretely

1. **Authentication.** Keycloak with username and password plus TOTP or OTP; lockout after 5 failed attempts; officer sessions time out after 15 minutes idle; optional DSC-based approval step for release.
2. **Authorisation.** Role-based access plus row-level scoping (a Regional Office officer sees only their region; an institution sees only its own records), enforced in PostgreSQL row-level security as well as in code.
3. **Encryption.** TLS 1.2 or higher in transit; AES-256 at rest for documents using envelope encryption with keys in a key vault or HSM; database volume encryption.
4. **Uploads.** Allow-listed types, magic-byte check, size cap, ClamAV scan, files stored outside the web root and served only through short-lived signed links.
5. **Application security.** OWASP ASVS Level 2 as the checklist; CSRF protection, strict CORS to the portal origin, CSP headers, parameterised queries only, rate limiting on login and upload.
6. **Audit.** Append-only events (who, what, before, after, IP, time); each row stores the hash of the previous row; daily checkpoint hash is exported to a separate location.
7. **Admin separation.** System administrators manage servers but cannot read documents or approve cases.
8. **Secrets.** No secrets in source or images; injected from a vault at deploy time.

## 6. Solution architecture

### 6.1 Principles

Modular monolith first (one deployable, clear internal modules). Database is the source of truth; rules are data, not code; every external dependency is optional at runtime; every state change is an audited event.

### 6.2 Logical view

```
  Institutions (browser)      Regional Offices / Bureau (browser)      Auditors (read-only)
          |                              |                                   |
          +-------------- HTTPS ---------+-----------------------------------+
                                  |
                    [ Reverse proxy + WAF + rate limits ]
                                  |
                    [ Keycloak: login, roles, OTP/TOTP ]
                                  |
  +---------------------------------------------------------------------------+
  |                 PORTAL APPLICATION  (Spring Boot, modular)                |
  |  Instrument Registry | Document Vault | Verification Engine | Case Workflow |
  |  Timeline Engine     | Alert Service  | Reporting           | Audit Service |
  +---------------------------------------------------------------------------+
       |             |               |                 |                |
  PostgreSQL     Object store    Job queue       Search index      Log store
  (system of     (documents,     (scan, OCR,     (PostgreSQL       (180-day+
   record, RLS)   encrypted)      alerts)         full text)        retention)
       |
  [ Integration layer: each adapter has timeout, retry, circuit breaker, fallback ]
     - AICTE institution master / approval status (read-only sync)
     - SMS and email gateway (NIC or approved provider)
     - RBI IFSC reference data (periodic file import)
     - Bank confirmation (manual evidence now; SFMS / NeSL / bank API where available)
```

### 6.3 Module responsibilities

| Module | Responsibility | Key rule |
| --- | --- | --- |
| Instrument Registry | Institution-wise and instrument-wise records, versions, ledger lines | A renewal creates a new version; history is never overwritten |
| Document Vault | Upload, scan, hash, encrypt, serve | Every document is linked to a version and a submitter |
| Verification Engine | Runs discrepancy rules; manages the three trust levels | Only an officer action or a recorded bank evidence can raise the level |
| Timeline Engine | Computes expiry, maturity and deadline dates from the rule set in force | Runs nightly and on every change; idempotent |
| Alert Service | Reminders, escalation ladder, digest emails | A reminder is sent once per rule per case; failures are retried and visible |
| Case Workflow | Scrutiny, queries, renewal, release, hold, closure | Maker-checker on every money-related transition |
| Reporting | Dashboards and scheduled reports | Reads from a replica or materialised views, never slows down officers |
| Audit Service | Tamper-evident event log | Written in the same transaction as the change |

### 6.4 The trust model (core AICTE priority)

| Level | Meaning | Who or what can set it | Shown to officers as |
| --- | --- | --- | --- |
| L0 Submitted | Data typed or uploaded by the institution | Institution | Grey badge: unverified |
| L1 Document-checked | Officer compared typed data with the document and found no discrepancy | Regional Office or Bureau officer | Amber badge |
| L2 Bank-confirmed | Issuing bank confirmed number, amount, dates, beneficiary and lien through an authorised channel; evidence attached | Verifier role, with evidence file or integration record | Green badge |
| L-X Disputed | Discrepancy open | Rule engine or officer | Red badge |

Release cannot be approved on anything below L2 unless a competent authority records a documented exception.

### 6.5 Instrument lifecycle

`Draft` → `Submitted` → `Under scrutiny` ⇄ `Query raised / Resubmitted` → `Accepted (Active)` → `Expiring` → `Renewal pending` → `Renewed` (new version) or `Replaced` → ... → `Matured` → `Release requested` → `Release under review` (or `On hold`) → `NOC issued` → `Released` → `Closed`. Side exits: `Rejected`, `Invoked` (if AICTE encashes under penal provisions).

### 6.6 Verification ladder

1. Automatic rules on submission (below).
2. Officer document check (L1).
3. Bank confirmation: officer sends a confirmation request from the portal (templated letter or email to the issuing branch, with the instrument details); the bank's reply is uploaded as evidence and the clock is tracked (L2).
4. Where a bank offers an API, or for bank guarantees through SFMS or NeSL, the adapter records the response automatically.

Discrepancy rules in version 1:

| Code | Rule |
| --- | --- |
| R1 | Amount differs from amount required (sum over approved programmes) under the applicable APH |
| R2 | Beneficiary or lien not in favour of AICTE |
| R3 | Issue date, maturity date or tenor inconsistent |
| R4 | Same FDR number and bank already exists under another institution |
| R5 | IFSC does not match bank name or branch |
| R6 | Depositor name does not match the trust, society or company on the approval record |
| R7 | Remaining validity is shorter than the required period |
| R8 | Required affidavit or document missing |
| R9 | OCR values differ from typed values beyond tolerance |
| R10 | File anomalies: unreadable, altered metadata, duplicate hash |

**Production Reality Check.** OCR on photographed bank documents is unreliable. Use it only to raise flags for a human, never to auto-accept or auto-reject.

## 7. Technology stack

Pin exact versions at build time, prefer current long-term-support releases, and skip any release younger than two weeks.

| Layer | Choice | Why | Alternative considered |
| --- | --- | --- | --- |
| Language / framework | Java 21 LTS, Spring Boot 3.x | Dominant in Indian government and bank IT; large talent pool; mature security and scheduling libraries | Django (faster to start, weaker fit for long-lived government teams) |
| Database | PostgreSQL 16 or 17 | Row-level security, JSONB, full-text search, strong audit tooling, no licence cost | Oracle (licence cost), MySQL (weaker RLS) |
| Connection pooling | HikariCP in app; PgBouncer if connections exceed 200 | Predictable behaviour under peak | None |
| Migrations | Flyway | Versioned, reviewable schema changes | Liquibase |
| Jobs and scheduling | Quartz with JDBC job store, plus a database-backed queue | Survives restarts, no extra broker to run | Kafka or RabbitMQ (excess for this volume) |
| Object storage | MinIO (S3 API) on-premise, or the provider's S3-compatible store | Same code in either environment; keeps data in India | Files in database (does not scale) |
| Identity | Keycloak (current stable) | SSO, OTP/TOTP, roles, audit events, self-hosted | Custom login (never roll your own) |
| Frontend | React with TypeScript, Vite build | Accessible component ecosystem, easy hiring | Server-rendered Thymeleaf (simpler, less interactive) |
| UI accessibility | Component library with WCAG support, axe-core in CI | GIGW expectations | None |
| File safety | ClamAV | Open source, scriptable | Commercial AV if the host mandates one |
| OCR (assist only) | Tesseract | Free, offline | Cloud OCR (violates data residency) |
| Document generation | OpenPDF or JasperReports; Apache POI for Excel | Reports and letters | None |
| Reverse proxy / WAF | Nginx with ModSecurity and OWASP rules, or the host's WAF | Standard | Host-provided WAF if mandated |
| Containers | Docker; Kubernetes only if the host provides it, otherwise systemd or Compose on 2 VMs | Match the real hosting | Always-on Kubernetes (adds ops load) |
| Observability | Prometheus, Grafana, Loki or OpenSearch (self-hosted, in India) | Metrics, dashboards, logs | SaaS monitoring (residency risk) |
| CI/CD | GitLab CI or Jenkins with SonarQube, OWASP Dependency-Check, Trivy | Catches code and dependency flaws pre-audit | None |
| Testing | JUnit 5, Testcontainers, Playwright, k6, OWASP ZAP | Unit to load to security | None |
| Notifications | SMTP and SMS adapters behind one interface | Provider can change | Direct hard-coded gateway |

**Deliberately not in version 1:** blockchain, microservices, a machine-learning fraud model, mobile apps, a document-management product. Each adds cost and audit surface without helping the stated goals.

**Production Reality Check.** Quartz and scheduled jobs run twice if two app nodes start the same trigger without a cluster lock. Use Quartz clustering with the JDBC store and make every job idempotent.

## 8. Detailed design

### 8.1 Core data model

| Table | Key fields |
| --- | --- |
| institution | aicte\_id, name, type (government, private), region, status, founded\_year, closure\_flag, merger\_ref |
| entity | trust / society / company name, registration no., name history |
| instrument | institution\_id, type (FDR, BG, online payment, RTGS), current\_version\_id |
| instrument\_version | number, bank, branch, ifsc, amount\_principal, issue\_date, maturity\_date, interest\_terms, beneficiary, lien\_flag, trust\_level, valid\_from, supersedes\_id |
| document | version\_id, type, storage\_key, sha256, size, scanned\_ok, uploaded\_by, uploaded\_at |
| verification | version\_id, rule\_code or channel, result, evidence\_doc\_id, by\_user, at |
| case | type (scrutiny, renewal, release, hold), state, opened\_by, owner\_role, due\_at |
| case\_event | case\_id, from\_state, to\_state, actor, note, at |
| rule\_set | aph\_edition, effective\_from, effective\_to, parameters (JSON), approved\_by |
| alert\_rule / alert | offsets, audience, channel; sent\_at, status, retries |
| audit\_event | actor, action, entity, before, after, ip, at, prev\_hash, hash |
| user\_role | user\_id, role, region\_scope |

Indexes on instrument number plus bank (unique per version), maturity\_date, institution\_id, case state plus owner role, and a GIN index for search.

### 8.2 Reminder and escalation schedule (configurable, defaults)

| When | Who is told | Channel |
| --- | --- | --- |
| 90, 60, 30 days before maturity or expiry | Institution authorised signatory; Regional Office desk | Email, in-app |
| 15, 7, 1 days before | Institution (email and SMS); Regional Office officer | Email, SMS, in-app |
| 1 day overdue | Regional Office officer, Bureau desk | Email, in-app |
| 7 days overdue | Regional Officer | Email |
| 15 days overdue | Bureau section head | Email, dashboard flag |
| 30 days overdue | Competent authority; case marked Intervention | Email, report |

A daily digest replaces per-case emails for officers to avoid alert fatigue.

### 8.3 Release workflow

1. Institution submits request, affidavit and instrument copy (maker).
2. System checks eligibility from the rule set (closure, merger, maturity, no hold) and shows a checklist.
3. Regional Office verifies documents; Bureau scrutinises; queries loop back to the institution with a due date.
4. Verifier confirms L2 bank confirmation and the principal and interest split.
5. Competent authority approves (checker, a different user from every earlier step).
6. NOC generated with a QR code that points to a public verification page, then signed.
7. Accounts team records refund or discharge instruction and the bank's completion evidence.
8. Case closes; instrument status becomes Released; all documents are retained per the retention schedule.

### 8.4 Role matrix

| Capability | Institution | Regional verifier | Bureau officer | Competent authority | Accounts | Auditor | System admin |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Submit and view own instruments | Yes |  |  |  |  |  |  |
| Verify documents |  | Yes | Yes |  |  |  |  |
| Record bank confirmation |  | Yes | Yes |  |  |  |  |
| Approve release |  |  |  | Yes |  |  |  |
| Record refund payment |  |  |  |  | Yes |  |  |
| View all cases |  | Own region | Yes | Yes | Yes | Read only | No |
| Read documents | Own | Own region | Yes | Yes | Limited | Read only | **No** |
| Manage users and servers |  |  |  |  |  |  | Yes |

### 8.5 Interfaces

| Interface | Direction | Mode |
| --- | --- | --- |
| AICTE approval portal (institution master, approval status) | In | Read-only API or nightly file; start with file |
| SMS and email gateway | Out | Adapter with retry and fallback to in-app |
| RBI IFSC reference | In | Periodic file import, validated |
| Bank confirmation | Both | Manual evidence now; adapters for SFMS, NeSL, bank APIs later |
| Public NOC verification page | Out | Read-only, rate limited, shows only status |

## 9. Non-functional targets

These numbers are planning assumptions to be replaced with AICTE's real volumes.

| Attribute | Target |
| --- | --- |
| Scale | Order of 10^4 institutions, several instruments each, about 10^5 documents over 5 years |
| Concurrent users | 500 normal, 2,000 at peak (March to July) |
| Availability | 99.5% monthly, planned maintenance outside working hours |
| Response time | 95% of page loads under 2 seconds; search under 2 seconds; upload of 10 MB under 30 seconds on a 2 Mbps link |
| Recovery | RPO 15 minutes (continuous WAL archiving), RTO 4 hours |
| Retention | Documents and audit log for the longer of AICTE rules or 8 years (confirm) |
| Accessibility | WCAG 2.1 AA |

## 10. Deployment, backup and disaster recovery

| Item | Plan |
| --- | --- |
| Environments | Development, test, staging (frozen copy for the security auditor), production, DR |
| Topology | 2 app nodes behind a load balancer, PostgreSQL primary plus streaming replica, object store with versioning, DR site in a different seismic zone within India |
| Backups | Nightly full plus continuous WAL archive, kept in 3 copies on 2 media with 1 offsite (all in India); quarterly restore drill with a written report |
| Release | Blue-green or rolling deploy; database migrations are backward compatible for one release; rollback script tested |
| Monitoring | Alerts on failed jobs, queue depth, disk above 75%, certificate expiry, failed logins, scan backlog |

**Production Reality Check.** Untested backups are not backups, and object storage that fills up silently is the classic outage. Alert on disk growth and run the restore drill on a schedule.

## 11. Data migration and rollout

1. **Discover.** Collect every current record source (Excel registers, regional office files, existing portal tables, scanned PDFs).
2. **Clean.** Normalise bank names, IFSC, dates and amounts; mark unreadable or duplicate rows.
3. **Load as L0.** Migrated records start as *Submitted* with a source tag; none is assumed bank-confirmed.
4. **Reconcile.** Count and value totals compared by region and bank, signed off by the Bureau.
5. **Pilot.** One region for 6 to 8 weeks, running in parallel with the old process.
6. **Phase-in.** Remaining regions in two waves, avoiding March to July peak where possible.
7. **Train.** Short role-based sessions and a printed one-page guide for institutions; helpdesk scripts.
8. **Retire** old registers only after one full reminder cycle has run correctly.

## 12. Delivery plan

### 12.1 Phases

| Phase | Weeks | Output |
| --- | --- | --- |
| 0. Discovery and sign-off | 1 to 3 | Confirmed rules per APH, data sources, hosting decision, bank-confirmation approach, signed scope |
| 1. Foundation | 4 to 7 | Environments, CI/CD, identity, roles, audit core, institution sync, schema |
| 2. Registry and documents | 8 to 11 | Submission forms, document vault, scan pipeline, search |
| 3. Verification and timeline | 12 to 15 | Rule engine, trust levels, timeline engine, alerts and escalation |
| 4. Cases and release | 16 to 19 | Renewal and release workflows, NOC, accounts step |
| 5. Dashboard and reports | 18 to 20 | Dashboards, scheduled reports, exports |
| 6. Hardening | 20 to 25 | Load test, security audit and fixes, DR drill, accessibility check |
| 7. Pilot and rollout | 26 to 38 | Region pilot, migration, phased go-live |

### 12.2 Team

Product owner from AICTE, business analyst, tech lead, 3 backend engineers, 2 frontend engineers, QA lead plus 1 tester, DevOps and security engineer, UX designer (part time). A named AICTE IT contact is required for hosting and integration approvals.

### 12.3 If a working prototype is required (hackathon scope)

The problem statement asks the prototype to demonstrate measurable gains and cover six test scenarios. A realistic prototype includes: institution submission with document upload, the three trust levels, rules R1 to R5, maturity timeline with reminder simulation, officer queue and dashboard, a release case with maker-checker, and an audit trail view. Leave out real bank integration, DSC signing and migration. Show the six scenarios (new submission, validity tracking, approaching maturity, renewal, discrepancy, release) as a scripted demo with seeded data.

## 13. Testing strategy and measurable outcomes

| Test type | Coverage | Tools |
| --- | --- | --- |
| Unit and rules | Every rule R1 to R10, date maths including leap years and month-end, rule-set versioning | JUnit 5 |
| Integration | Database, queue, storage, adapters with simulated failures | Testcontainers |
| End to end | New FDR, validity tracking, approaching maturity, renewal, discrepancy, release | Playwright |
| Load | Peak week upload and search, reminder batch of 50,000 | k6 |
| Security | OWASP ASVS L2 checklist, ZAP scan, role-escalation and cross-institution access tests, then third-party audit | ZAP, auditor |
| Resilience | Kill app node mid-job, take SMS gateway offline, fill disk to 90% | Scripted drills |
| Accessibility | WCAG 2.1 AA | axe-core, manual screen-reader test |
| User acceptance | Officers run real historical cases | Signed UAT report |

### 13.1 Measuring the improvements the problem statement asks for

Measure a **baseline before go-live**, otherwise no improvement can be proven.

| Outcome | Metric | How measured |
| --- | --- | --- |
| Record accuracy | Share of records with zero open discrepancies; error rate found in audit sample | Monthly sample audit of 200 records |
| Verification turnaround | Median days from submission to L1, and to L2 | Case timestamps |
| Timely renewal monitoring | Share of expiring instruments with renewal in place by maturity date | Timeline reports |
| Manual effort | Officer hours per week on tracking, before and after | Time sheets or survey |
| Pending-case visibility | Share of cases with a named owner and due date | Dashboard |

## 14. Risk register

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| No electronic bank confirmation for FDRs | High | High | Design manual-with-evidence as first-class; approach banks and AICTE finance early |
| Handbook rules change mid-project | High | Medium | Versioned rule sets; rules owned by a named AICTE officer |
| Poor legacy data quality | High | High | Migrate as L0; reconciliation sign-off; do not delay go-live for perfect data |
| Security audit finds major issues late | Medium | High | ASVS checks in CI from week 4; pre-audit internal test in week 20 |
| Integration approvals slow | Medium | Medium | File-based sync first; APIs later |
| Institutions upload poor scans | High | Low | Upload guidance, quality check, query workflow |
| Alert fatigue | Medium | Medium | Digests, owner-based queues, tuned offsets |
| Insider misuse | Low | High | Maker-checker, row-level scoping, tamper-evident audit, quarterly access review |
| Cloud or gateway outage | Medium | Medium | Fallbacks, DR site, tested runbook |
| Scope creep into full financial accounting | Medium | Medium | Portal records instructions and evidence; payments stay in AICTE's accounting system |

## 15. Open questions for AICTE

1. Where is the current approval portal hosted, and what database and stack does it use?
2. Is there an existing FDR register (Excel or database)? Approximate record count and date range?
3. Which instrument types are accepted today: FDR, bank guarantee, online payment, RTGS? Is lien marking in AICTE's favour required?
4. Which banks hold most deposits, and have any offered an electronic confirmation or API?
5. What is the exact release procedure and authority matrix in APH 2024-27 (clauses may have moved since 2022-23)?
6. Who is the competent authority for release, and what exceptions are allowed?
7. How are refunds and interest returned in practice, and what does AICTE Accounts need recorded?
8. What are the retention periods for documents and logs?
9. Is hosting at NIC, or an empanelled cloud, mandated? Who will arrange the security audit?
10. What SMS and email gateways are approved for the portal?
11. Does AICTE treat itself as exempt under the DPDP Act for this data? (Legal opinion needed.)
12. Are Hindi or other regional-language interfaces required?

## 16. Key decisions (short ADRs)

| ID | Decision | Alternatives rejected | Revisit when |
| --- | --- | --- | --- |
| ADR-1 | Modular monolith | Microservices: more ops burden than the team and volume justify | Several teams or independent scaling needs appear |
| ADR-2 | PostgreSQL as single system of record, with row-level security | Separate document DB: more moving parts, weaker consistency | Volumes exceed one primary node |
| ADR-3 | Three trust levels with manual-with-evidence bank confirmation | Binary verified flag; assuming a bank API exists | A bank or AICTE confirms an API channel |
| ADR-4 | Rules stored as versioned data by APH edition | Hard-coded thresholds | Never; this is permanent |
| ADR-5 | Self-hosted Keycloak for identity | Custom login; SaaS identity (residency) | AICTE mandates a central SSO |
| ADR-6 | No machine learning in v1; deterministic rules only | ML fraud scoring: no labelled data, harder to audit | After 12 months of verified and disputed cases exist |

## 17. Sources used

- AICTE guide to online security deposit payment, and AICTE notice on release of 2010-11 FDRs (aicte.gov.in)
- AICTE APH 2020-21 change summary; APH 2022-23 text on release of security deposit, clause 7.51 (as reproduced on a public site); APH 2024-25 FAQ (aicte.gov.in and a university copy)
- GIGW 3.0 guideline 5.3.1 on security audit clearance, as quoted by tcsa.in
- MeitY empanelled cloud statement to Parliament (tele.net.in); government hosting overviews
- CERT-In Directions of April 2022 and DPDP Rules 2025 timelines (secondary summaries from cybersigmacs.com, matters.ai, Bar and Bench, seqrite.com). Confirm against the Gazette and CERT-In text before relying on them for a formal submission.
- SFMS message types for bank guarantees (GeM, Department of Financial Services circular, bank pages); NeSL e-BG (ICICI Bank, IOB)

*Items marked as assumptions (A) in Section 4 and all numbers in Section 9 are planning estimates, not facts about AICTE.*
