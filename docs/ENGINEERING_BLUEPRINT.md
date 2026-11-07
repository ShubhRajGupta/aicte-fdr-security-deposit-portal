# **AICTE Security Deposit / FDR Portal: Engineering Blueprint**

*PSID 26265 · Companion to the Solution Plan · v1.0 · 24 Oct 2026 · Planning only, no code*

## **0\. Purpose and how this document was built**

The Solution Plan says *what* to build. This blueprint says *how to make it work in production*: for AICTE (the client), for the people who use it every day (institutions and officers), and for the engineers who must deliver it. It also sets out where to innovate and, just as important, where not to.

Each part was written through a specific engineering lens:

| Lens | Question it answers | Sections |
| :---- | :---- | :---- |
| Ground reality | What breaks in real government hosting, real networks, real data? | 5, 8, 11 |
| System design | Components, data flow, storage, queues, failure and scale | 5 |
| Decision records (ADR) | Which choices are locked, why, and when to revisit | 15 |
| Testing strategy | What to test, at what level, with what targets | 9 |
| Deploy checklist | What must be true before every release, and what triggers rollback | 10 |
| Incident response | Severity, roles, clocks (CERT-In, DPDP), postmortems | 11 |
| Tech-debt register | Which shortcuts are deliberate, and when they are repaid | 8, 15 |
| Documentation | The document set that lets AICTE own the system after handover | 4, 16 |

**Correction to the earlier Solution Plan (stack versions).** That plan named Java 21 and Spring Boot 3.x. Fresh checks show JDK 25 has been the current LTS since September 2025, Spring Boot 4.0 shipped on 20 November 2025, one ecosystem tracker lists Spring Boot 3.5 open-source support as ending June 2026, and Keycloak supports only the latest Java LTS. This blueprint therefore baselines on **JDK 25 LTS and Spring Boot 4.x**, with Java 21 as an accepted fallback only if the chosen host cannot run JDK 25\. Everything else in the earlier plan stands.

## **1\. Mission, definition of done, non-negotiables**

**Mission.** Give AICTE one trustworthy, always-current picture of every security deposit and FDR, and give institutions a simple, clear path to comply, so that no deposit lapses unnoticed, no release is approved on unverified paper, and no officer has to chase a spreadsheet.

### **1.1 Definition of done, three views**

| View | Done means |
| :---- | :---- |
| AICTE (client) | Every instrument has an owner, a status, a next action and a next date. Any record can be defended in an audit with evidence. Release decisions are traceable to named officers. Dashboards agree with records. AICTE can run, change and support the system without the vendor. |
| Users | An institution clerk completes a submission unaided in under 15 minutes. An officer clears a typical case in under 5 minutes. Nobody is ever unsure what happens next. |
| Engineering | Security audit cleared. Rules and date maths proven by tests. Peak-week load test passed. Backup restore proven. Runbooks exercised. SBOM and documentation delivered. |

### **1.2 Non-negotiables**

1. Production data, backups, logs and monitoring stay in India.  
2. No release of a deposit without maker-checker and a named competent authority.  
3. Every state change writes an audit event in the same database transaction.  
4. Rules (amounts, validity, deadlines) are versioned data, never hard-coded.  
5. Institution-submitted data is never shown as verified until a human or a bank evidence record says so.  
6. Money uses exact decimal types; dates use calendar dates in India time, never floating point or raw timestamps.  
7. The system keeps working when SMS, email, bank and OCR services are down.  
8. No custom cryptography, no custom login, no home-grown file parsers.  
9. Security audit by an approved auditor before go-live, with fixes verified.  
10. Every release is reproducible, scanned, and reversible.  
11. Nothing is hard-deleted; corrections create new versions.  
12. Accessibility (WCAG 2.1 AA) and bilingual labels are release criteria, not polish.

## **2\. Stakeholder map**

| Stakeholder | Goal | Pain today (likely) | Success signal | Risk if ignored |
| :---- | :---- | :---- | :---- | :---- |
| Member Secretary / Chairman's office | Accountability, no embarrassing lapses | Cannot see a reliable total or aging | One-page status that matches records | Loses trust in the system |
| Regulation Bureau officers | Control and speed | Fragmented records, manual letters | Daily queue, few surprises | Work around the portal |
| Regional Office verifiers | Fast, safe verification | Paper copies, phone calls to banks | Split-screen review, rule flags | Rubber-stamping or bottlenecks |
| Accounts / Finance | Correct refunds and interest | Unclear principal vs interest | Clean ledger, exportable | Payment errors |
| AICTE IT / NIC admins | Operable, supportable system | Unknown dependencies | Runbooks, monitoring, SBOM | Unsupported system after handover |
| Institution authorised signatory | Compliance without hassle | Unclear what is due and when | Clear countdown and receipts | Missed deadlines, approval risk |
| Institution clerk or accountant | Finish the task | Repeated uploads, vague rejections | Specific queries, saved drafts | Wrong or repeated submissions |
| Bank branch officer (external) | Confirm quickly, safely | Unclear requests, phishing worry | Short, verifiable request | Slow or no confirmation |
| Auditors (internal, CAG-type, STQC) | Evidence | Reconstructing history | Exportable trail | Audit objections |
| Helpdesk | Resolve queries | No visibility into user state | Safe view-as with audit | Escalations to developers |

## **3\. User side: who uses it and how it must feel**

### **3.1 Personas**

| Persona | Context and device | Main jobs | Fears | Design response |
| :---- | :---- | :---- | :---- | :---- |
| Institution clerk | Shared PC, 2 to 4 Mbps, Chrome, phone for OTP | Upload FDR, answer queries, check status | Rejection, wrong upload | Guided checklist, draft saving, resumable uploads, plain-language errors |
| Authorised signatory | Phone or laptop, rare logins | Declare, confirm, watch deadlines | Missing a due date | Email digest, one-click confirm, deadline countdown |
| Regional verifier | 1366x768 desktop, 40 to 60 cases a day | Check documents, raise queries, request bank confirmation | Missing a forgery, being blamed | Queue, side-by-side view, rule flags with reasons, keyboard shortcuts |
| Bureau officer | Desktop, oversight | Aging, exceptions, reports | Surprises | Risk-ranked worklist, filters, exports |
| Competent authority | Tablet or desktop, time-poor | Approve releases | Approving on bad evidence | Decision summary card: what, why, evidence level, exceptions |
| Accounts officer | Desktop | Record refunds, reconcile | Mismatch with bank | Principal and interest ledger, CSV export |
| Bank branch officer | Office PC, occasional | Confirm or deny instrument | Phishing, liability | Short form from a verifiable sender, clear instrument summary |
| Auditor | Read only | Trace decisions | Gaps | Evidence pack per case |

### **3.2 Core journeys**

**J1. Institution submits a new deposit**

| Step | User does | System does | If it fails |
| :---- | :---- | :---- | :---- |
| 1 | Logs in with OTP | Maps user to institution from the AICTE master | Clear lockout and recovery message |
| 2 | Sees what is required | Computes required amount and due date from the rule set in force and explains how | Shows who to contact if the figure looks wrong |
| 3 | Enters FDR details | Validates live; IFSC fills bank and branch; checks dates | Inline messages naming the exact field |
| 4 | Uploads FDR scan and affidavit | Resumable upload, quality check, virus scan in background | Retry without losing form data |
| 5 | Reviews and declares | Shows a summary; records declaration with OTP | Draft is saved |
| 6 | Submits | Issues a receipt and reference number by SMS and email | Receipt also available in-app |
| 7 | Waits | Shows a plain timeline: with Regional Office, query raised, accepted | Expected timelines shown |
| 8 | Answers a query | Query names the problem and the document; due date shown | Reminder before due date |
| 9 | Done | Level L1, then L2 on bank confirmation; renewal reminders scheduled | None |

**J2. Officer clears a case.** Open queue (sorted by risk and age) → open case → split screen: document left, typed data and rule results right → decide: accept to L1, raise query, request bank confirmation, or escalate → note is mandatory for any non-routine decision → next case loads automatically.

**J3. Renewal.** Reminder at T-90 → institution uploads renewed or replacement instrument → system creates a new version linked to the old one → rules re-run → old version stays valid until the new one is accepted, so there is never a coverage gap in the record.

**J4. Release.** Request with reasons → eligibility checklist computed → Regional verification → Bureau scrutiny → L2 check → competent authority approval → NOC with QR → accounts instruction and bank evidence → closure. Holds (for example an open external NOC) pause the clock visibly.

### **3.3 Screen inventory**

| Screen | Role | Purpose |
| :---- | :---- | :---- |
| Login and OTP | All | Authentication, recovery |
| Institution home | Institution | Requirement, status, next action, deadlines |
| Add or edit instrument | Institution | Guided form with validation |
| Document upload | Institution | Resumable upload, quality feedback |
| Query inbox and reply | Institution | Respond to officer queries |
| Renewal and release request | Institution | Start renewal or release |
| Officer queue | Officers | Risk-ranked worklist with filters |
| Case workspace | Officers | Split view, rules, history, notes, actions |
| Bank confirmation tracker | Officers | Requests, replies, SLA clocks |
| Approval inbox | Competent authority | Decision summaries, approve or return |
| Accounts ledger | Accounts | Principal, interest, payments, exports |
| Dashboard | Bureau | Counts, aging, maturity forecast, drill-down |
| Reports | Bureau | Scheduled and on-demand reports |
| Rule sets and simulation | Rule owner | Draft, simulate, approve, activate rules |
| Admin: users and roles | Admin | Access control with approvals |
| Audit explorer | Auditor | Search events, export evidence pack |
| Public NOC verify | Public | Check an NOC by QR or number |
| Notifications settings | All | Contact details, digest preferences |

### **3.4 UX principles**

1. One obvious next action on every screen.  
2. Say what happens next and when, in plain words.  
3. Errors name the field and the fix, never a code alone.  
4. Never lose work: autosave drafts, resume uploads.  
5. Show why a rule flagged something, not just that it did.  
6. Show trust level on every instrument with colour and text (never colour alone).  
7. Keyboard-complete for officers; mobile-readable for approvers.  
8. English and Hindi labels from day one; other languages by configuration.  
9. Never expose another institution's data; test this as a feature.  
10. Dates shown as 24 Oct 2026, with days remaining beside them.

### **3.5 Notification rules**

Every message states: which institution and instrument (last 4 digits only), what happened, what is needed, by when, and where to click. Messages contain no document content and no full FDR numbers. Email comes from one fixed government domain address, with a line telling recipients that AICTE never asks for passwords or payments by email, which reduces phishing success.

### **3.6 Frontend budgets**

| Item | Budget |
| :---- | :---- |
| Initial JavaScript | At most 250 KB gzipped on the first route |
| Largest contentful paint | At most 2.5 s on a simulated slow 4G, mid-range laptop |
| Large tables | Virtualised; 1,000 rows without lag |
| Accessibility | WCAG 2.1 AA; automated axe checks in CI plus manual screen-reader pass per release |
| Browsers | Last two versions of Chrome, Edge, Firefox; Safari on iOS and macOS |
| Zoom and text | Usable at 200% zoom and with enlarged text |
| Forms | No plugin, no Flash-era dependencies, no pop-ups blocked by default settings |

### **3.7 Help and support model**

L1 helpdesk (existing AICTE helpdesk) with scripts and a safe *view-as* tool (read-only, every use audited, institution notified in the audit log). L2 portal support team. L3 engineering on call in season. Target: acknowledge in 4 working hours, resolve routine queries in 2 working days, escalate anything touching money or security the same day.

## **4\. Client side: how to work with AICTE**

### **4.1 Decisions AICTE must make (with defaults if they are late)**

| \# | Decision | Owner | Needed by | Default if unanswered |
| :---- | :---- | :---- | :---- | :---- |
| D1 | Extend the existing approval portal, or build standalone and integrate | AICTE IT head | Week 2 | Standalone with read-only sync, because it limits risk to the live approval system |
| D2 | Hosting: NIC, empanelled cloud, or AICTE data centre | AICTE IT, NIC | Week 2 | Empanelled cloud in India with a separate DR region |
| D3 | Accepted instruments: FDR only, or BG and online payment too | Bureau head | Week 3 | FDR, bank guarantee, online payment, RTGS recorded; verification differs per type |
| D4 | Competent authority and delegation matrix for release | Member Secretary | Week 3 | Two-level approval: Bureau head then Adviser |
| D5 | Rule owner who approves rule sets for each APH edition | Bureau head | Week 3 | Named Deputy Director, with Legal review |
| D6 | Bank confirmation method per bank | Accounts, Bureau | Week 6 | Manual with evidence, link-based confirmation later |
| D7 | Retention periods for documents and logs | Legal, Records | Week 6 | 8 years documents, 1 year minimum logs |
| D8 | SMS and email gateways | AICTE IT | Week 6 | Pluggable; in-app inbox only until provided |
| D9 | DPDP stance for this data (exempt or covered) | Legal | Week 8 | Build to covered standard |
| D10 | Security auditor and audit window | AICTE IT | Week 10 | Book auditor slot for weeks 21 to 25 |
| D11 | Acceptance committee and UAT officers | Member Secretary | Week 12 | Bureau head plus two Regional officers |
| D12 | Data migration sources and sign-off owner | Bureau head | Week 4 | All current registers, signed reconciliation by Bureau |

### **4.2 Getting a government-hosted application live**

Public tender documents for applications hosted on NIC cloud show the typical pattern. Plan for it from the start:

1. Build to the hosting body's guidelines from day one (OS baseline, WAF, logging, time sync).  
2. Freeze a staging URL and a test account set for the auditor.  
3. Auditor tests, issues findings; fix and re-test until a clearance certificate is issued.  
4. Share the staging URL, clearance certificate and report with the hosting body's cyber security team for verification.  
5. Only then is production opened. Budget 4 to 6 weeks and one re-test.

Production Reality Check: this is the single most common cause of late go-live. If the audit slot is not booked by week 10, the schedule slips by the length of the wait.

### **4.3 Governance**

| Mechanism | Cadence | Purpose |
| :---- | :---- | :---- |
| Steering group (Member Secretary office, Bureau, IT, vendor) | Monthly | Decisions, scope, risks |
| Product review with Bureau officers | Every sprint (2 weeks) | Demo, feedback, priority changes |
| Change control | As needed | Any change to scope, rules, roles, or integrations needs a short written impact note |
| Rule-set approval | Per APH edition and per amendment | Rule owner signs; simulation report attached |
| Release approval | Per release | Deploy checklist signed by QA lead, security lead and product owner |
| Risk review | Fortnightly | Update register, escalate blockers |

### **4.4 Handover and ownership**

AICTE receives: source code and build scripts; infrastructure as code; SBOM and vulnerability exchange notes for every release; architecture, API, data and security documents; runbooks; training material; test suites and test data generator; admin and recovery credentials in a sealed procedure; a warranty period (suggested 6 months of defect fixes after go-live) and a support agreement option. Knowledge transfer is a formal phase with at least two AICTE or NIC engineers shadowing releases before handover.

### **4.5 Questions the client will ask, and honest answers**

| Question | Answer |
| :---- | :---- |
| Why not buy a ready-made product? | Few products fit AICTE's rules, hosting and audit constraints. Reassess in Phase 0 if one fits; the trust model and rule engine are what must be preserved. |
| Why not add this to the existing portal? | Possible and sometimes best. Decision D1 settles it. Either way, institution data comes from the existing master, not re-entered. |
| Will it work if banks do not cooperate? | Yes. Manual-with-evidence is first class; bank adapters are additive. |
| Is blockchain needed for trust? | No. A hash-chained audit log with exported checkpoints gives tamper evidence with standard tools and no new operational risk. |
| How do we know it is secure? | Independent audit before go-live, ASVS-based testing in the pipeline, and a published threat model. |
| Who supports it afterwards? | Section 4.4 and Section 11: warranty, runbooks, and trained AICTE or NIC engineers. |
| What if rules change? | Rules are data with simulation: change, test against all records, approve, activate. No redeploy. |

## **5\. Architecture deep dive**

### **5.1 System context**

  Institution users \----\\                      /---- Regional / Bureau officers  
  (browser, OTP)         \\                    /      (browser, optional DSC)  
                          v                  v  
                   \+--------------------------------+        \+----------------------+  
                   \|   FDR PORTAL (this system)     \|\<------\>\| AICTE approval portal\|  
                   \|   registry, verification,      \|  read  \| (institution master, \|  
                   \|   timeline, cases, audit       \|  sync  \|  approval status)    \|  
                   \+--------------------------------+        \+----------------------+  
                     \|        \|         \|        \|  
                     v        v         v        v  
               SMS/email   IFSC     Bank branch   Auditors (read-only evidence)  
               gateways    list     confirmation  
                                    (letter, link, SFMS/NeSL adapters later)

### **5.2 Runtime components**

| Component | Choice | Notes |
| :---- | :---- | :---- |
| Edge | Nginx or host load balancer, WAF with OWASP core rules, TLS 1.2+ (1.3 preferred) | Rate limits per IP and per user; security headers; request size caps |
| Web app | React \+ TypeScript SPA served as static files | Talks only to the backend-for-frontend; no tokens in browser storage |
| Backend | Java 25 LTS, Spring Boot 4.x, one deployable, virtual threads for blocking I/O | Pin exact patch versions; no release younger than 14 days |
| Identity | Keycloak (latest supported minor, on the Java LTS it supports) | OIDC; OTP and TOTP; admin console never exposed publicly |
| Database | PostgreSQL 18.x if the host DBA supports it, else 17.x | One primary, one streaming replica, WAL archive, PgBouncer if needed |
| Object store | S3-compatible (MinIO on-premise or provider store) | Two buckets: quarantine and vault; server-side encryption plus app-level envelope keys |
| Jobs | Quartz (JDBC clustered) plus outbox poller | No separate broker in v1 |
| Scanning | ClamAV daemon with signature updates through an approved mirror | Fail closed: unscanned files never reach the vault |
| Observability | Prometheus, Grafana, Loki or OpenSearch, OpenTelemetry traces | All inside India; 1 year retention for audit-relevant logs |
| Secrets and keys | Vault or HSM-backed KMS | Rotation schedule documented; break-glass procedure |

### **5.3 Code structure that stays maintainable**

One repository, one deployable, strict internal modules (Java packages with enforced boundaries). Hexagonal style: domain logic has no framework imports; adapters (database, storage, SMS, bank) sit at the edge.

| Module | Owns | May depend on |
| :---- | :---- | :---- |
| identity | Users, roles, scopes, step-up auth | none |
| institution | Institution and entity mirror, sync | identity |
| registry | Instruments, versions, ledger lines | institution |
| rules | Rule sets, simulation, evaluation | registry (read) |
| vault | Documents, scanning, hashing, OCR assist | registry |
| verification | Discrepancy checks, trust levels, bank confirmation | rules, vault, registry |
| timeline | Dates, status transitions, next-action dates | rules, registry |
| casework | Scrutiny, queries, renewal, release, holds | verification, timeline, vault |
| notify | Alerts, digests, templates, providers | none (receives events) |
| reporting | Views, scheduled reports, exports | read-only on all |
| audit | Hash-chained events, evidence packs | none (everyone writes to it) |

Boundaries are enforced by automated architecture tests (ArchUnit) that fail the build on a forbidden dependency. If the system outgrows this, modules are already the seams for splitting.

### **5.4 Data architecture**

* **Schemas:** core (institutions, instruments, cases), rules, audit, ref (banks, IFSC, holiday calendar), ops (jobs, outbox, alerts).  
* **Exact types:** amounts as NUMERIC(18,2), rates as NUMERIC(7,4), dates as DATE in India time, event times as TIMESTAMPTZ stored in UTC and shown in IST.  
* **Immutability:** an instrument version is never updated after acceptance; changes create a new version with supersedes\_id. A database trigger blocks updates and deletes on accepted versions and on audit.event.  
* **As-of queries:** because versions and rule sets carry validity ranges, any record can be reconstructed for any past date. This is the audit superpower.  
* **Row-level security:** the application sets institution and region scope for each transaction using SET LOCAL; policies enforce that an institution sees only its rows and a Regional officer only their region's. The application connects as a limited role that does not own tables and cannot disable policies. Migrations run as a separate role.  
* **Duplicates:** a normalised instrument key (bank code plus number with spaces and punctuation removed) is indexed. A clash does not silently overwrite; it raises rule R4 and puts both records in a duplicate-review case.  
* **Audit partitions:** audit.event is partitioned by month, with a covering index on entity and time; old partitions are archived, never dropped before the retention period.  
* **Next-action date:** each live instrument stores a computed next\_action\_date and next\_action\_type, indexed, so queues and dashboards are simple index scans.  
* **Indexes to start with:** (institution, status), (maturity\_date) partial on live instruments, (case state, owner role, due\_at), GIN on full-text, trigram on instrument number.

Production Reality Check: row-level security plus a connection pool can leak scope if a connection is reused without resetting settings. Use SET LOCAL inside the transaction only, and add a test that proves a pooled connection never carries a previous user's scope.

### **5.5 Timeline engine**

The engine answers one question for every instrument, every night and on every change: *what is its status today, what must happen next, and by when?*

| Concern | Design |
| :---- | :---- |
| Inputs | Latest accepted version, institution facts, rule set in force on the evaluation date, holiday calendar |
| Outputs | Status, next\_action\_type, next\_action\_date, alert schedule |
| Time zone | All calendar maths in Asia/Kolkata with calendar dates; never convert a maturity date through UTC |
| Month-end and leap years | Tenor maths uses explicit rules (end-of-month rule, 29 Feb handling) written as data with tests |
| Bank holidays | If a maturity or deadline falls on a non-working day, record both the nominal date and the next working day; alerts use the earlier of the two |
| Idempotency | Alert ledger has a unique key on (case, rule, offset, recipient); rerunning a job cannot double-send |
| Missed runs | On start-up the engine computes from the last successful run date forward, so a day of downtime never skips a reminder |
| Performance | Set-based SQL for the nightly pass (a single statement per transition type), not row-by-row loops; target under 2 minutes for 100,000 instruments |
| Explainability | Every computed date stores the rule and inputs used, so an officer can see why a date is what it is |

### **5.6 Document pipeline**

Received → Quarantined → Type verified → Scanned clean → Sanitised → Hashed → OCR assist done → Vaulted. Any failure moves the file to Rejected with a reason shown to the uploader.

1. Upload goes to the quarantine bucket in chunks; the browser can resume after a drop.  
2. Type is detected from content (magic bytes), not file name; only PDF, JPEG and PNG pass.  
3. PDFs with scripts, embedded files, forms with actions, or encryption are rejected or sanitised; images are re-encoded and metadata stripped; page count and size are capped; archive-style attacks cannot occur because archives are not accepted.  
4. ClamAV scan; if the scanner is down the file waits, it is never skipped.  
5. SHA-256 computed and stored; the same hash under another institution raises R10.  
6. OCR runs offline as a suggestion; failures never block the officer.  
7. File is encrypted with a per-file data key wrapped by a master key, then moved to the vault.  
8. Viewing uses a signed link that expires in minutes and is tied to the user; downloaded copies carry a visible watermark with user, time and case number.

Retries use exponential backoff with jitter; after the retry limit, the item goes to a dead-letter table that raises an alert, never disappears.

### **5.7 Authentication and authorisation**

| Topic | Design |
| :---- | :---- |
| Protocol | OpenID Connect, authorisation code with PKCE, through a backend-for-frontend so tokens stay in HttpOnly, Secure, SameSite cookies |
| Authenticators | Password plus OTP or TOTP; length-based password policy with breached-password checks (aligned with NIST SP 800-63B) |
| Step-up | Approvals, role changes and release actions require a fresh second factor; DSC signing optional where the officer has a token |
| Sessions | 15 minutes idle for officers, 30 for institutions; absolute limit 8 hours; one active session policy configurable |
| Roles | institution\_user, institution\_signatory, regional\_verifier, bureau\_officer, competent\_authority, accounts\_officer, rule\_owner, auditor, helpdesk, system\_admin |
| Scope | Institution scope from the AICTE master; region scope from the officer's posting record |
| Enforcement | Three layers: edge (coarse), service methods (Spring method security), database (row-level security) |
| Lifecycle | Joiner, mover, leaver changes need a second approver; quarterly access recertification by the Bureau; dormant accounts disabled after 90 days |
| Service accounts | Short-lived credentials or mutual TLS; never shared with humans |

### **5.8 API design**

REST over HTTPS with JSON, versioned at /api/v1, described in OpenAPI 3.1 and used for contract tests. Errors use RFC 9457 problem details. Lists use cursor pagination. Updates use ETag and If-Match to prevent lost updates. Requests that create things accept an Idempotency-Key header. Every request carries a trace identifier (W3C traceparent) that also appears in logs and audit events.

| Endpoint (illustrative) | Purpose | Roles |
| :---- | :---- | :---- |
| POST /instruments | Create a draft instrument | institution\_user |
| POST /instruments/{id}/documents | Start a resumable upload | institution\_user |
| POST /instruments/{id}/submit | Submit with declaration | institution\_signatory |
| GET /queue | Risk-ranked worklist | officers |
| GET /cases/{id} | Case workspace data, rules, history | officers |
| POST /cases/{id}/decisions | Accept, query, escalate, hold | officers |
| POST /instruments/{id}/bank-confirmations | Request bank confirmation | verifier roles |
| POST /releases | Start a release case | institution\_signatory |
| POST /releases/{id}/approve | Approve (step-up required) | competent\_authority |
| GET /dashboard/summary | Counts and aging | bureau and above |
| GET /rule-sets, POST /rule-sets/{id}/simulate | Manage and test rules | rule\_owner |
| GET /public/noc/{code} | Public NOC check, status only | public, rate limited |
| GET /integration/v1/institutions/{id}/deposit-status | Deposit status for the approval portal | service account, mutual TLS |

### **5.9 Events, jobs and consistency**

All side effects (alerts, emails, report generation, document processing) are written to an **outbox** table in the same transaction as the change that caused them. A poller using FOR UPDATE SKIP LOCKED hands rows to workers, so several nodes can run safely. Delivery is at least once, so every consumer is idempotent. Failed items back off, then go to a dead-letter table with an alert. Quartz runs scheduled work with a clustered JDBC store so a job fires once even with two nodes.

Production Reality Check: at-least-once delivery means duplicates will happen. The unique alert ledger key and idempotent handlers are not optional.

### **5.10 Search and reporting**

Full-text search and trigram matching in PostgreSQL cover institution name, FDR number fuzzy match and notes; a separate search cluster is not needed at this volume and would add an operational and residency burden (revisit if search latency exceeds 500 ms at the 95th percentile). Dashboards read from materialised views refreshed concurrently, or from the replica. CSV and Excel exports neutralise formula injection by prefixing cells that start with \=, \+, \- or @.

### **5.11 Configuration, flags and resilience**

Configuration follows twelve-factor practice: environment variables and a secrets vault, nothing sensitive in images or repositories. Feature flags are stored in the database, audited, and default to off. Every outbound call has a timeout, retries with jitter, a circuit breaker and a bulkhead (Resilience4j).

| Dependency down | Degraded behaviour | Alert |
| :---- | :---- | :---- |
| SMS gateway | Email and in-app only; SMS queued with expiry | Warn after 15 minutes |
| Email gateway | In-app and SMS; digest delayed | Warn after 15 minutes |
| Bank or IFSC source | Manual confirmation; last good IFSC list used | Info |
| OCR | Skipped; officer reviews manually | Info |
| ClamAV | Uploads wait in quarantine; users told scan is pending | Critical after 10 minutes |
| Keycloak | Existing sessions continue to expiry; no new logins | Critical |
| Object store | Uploads paused with friendly message; reads from replica if configured | Critical |
| Read replica | Dashboards fall back to primary with lower limits | Warn |
| Primary database | Automatic or manual failover per runbook; app reconnects with backoff | Critical |

## **6\. Innovation, kept inside industry standards**

**Rule of thumb.** Innovate in workflow, explainability and verification experience. Do not innovate in cryptography, authentication protocols, storage engines or file formats. Every innovation below has a manual fallback, writes to the audit log, can be switched off by a flag, and rests on a published standard or a mainstream pattern.

| \# | Innovation | Why it helps | Standard or pattern underneath | Guardrail | Value | Risk | Phase |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| I1 | Evidence pack and QR-verifiable NOC | Anyone can check an NOC; auditors get one bundle per case | PAdES signed PDF, PDF/A for archive, DSC or eSign | Public page shows status only, rate limited | High | Low | v1 |
| I2 | Risk-ranked worklist with visible score breakdown | Officers work the right case first | Deterministic weighted scoring, explainable | Weights owned by rule owner; no machine learning | High | Low | v1 |
| I3 | Rule simulation sandbox | Test a new APH rule on all records before activating | Versioned rules as data, dry-run pattern | Activation needs approval and a diff report | High | Low | v1 |
| I4 | As-of reconstruction | Show any instrument as it stood on any date | Immutable versions, validity ranges | Read-only; heavy queries throttled | High | Low | v1 |
| I5 | Tamper-evident audit with external checkpoints | Proves no silent edits | Hash chaining, RFC 3161 timestamping if an approved authority exists | Daily checkpoint stored outside the database | High | Low | v1 |
| I6 | Maturity forecast and workload heatmap | Plan officer capacity before the peak | Standard aggregation over indexed dates | Aggregated data only | Medium | Low | v1 |
| I7 | Data-quality score and canonical bank names | Cleaner records, fewer false flags | RBI IFSC reference data, normalisation rules | Suggestions need officer approval | Medium | Low | v1 |
| I8 | Signed releases with SBOM and vulnerability exchange notes | Supply-chain transparency for AICTE and auditors | CycloneDX or SPDX; CERT-In SBOM guidelines (voluntary but encouraged for government); SLSA-style provenance; signed images | Build fails on unknown components or critical vulnerabilities | High | Low | v1 |
| I9 | Synthetic officer canary | Detects broken flows before users do | Synthetic monitoring | Uses a hidden dummy institution excluded from reports | Medium | Low | v1 |
| I10 | Game days before peak season | Proves the failure plan works | Chaos engineering practice | Staging first; production drills only with approval | Medium | Low | Yearly |
| I11 | Bank confirmation link | Faster than letters where banks agree | Single-use signed token, SPF and DKIM on sender, second factor to a listed branch address | Branch address must come from a bank-published directory; phishing training; manual fallback | High | Medium | v1.5 pilot with 2 to 3 banks |
| I12 | Live deposit-status API for the approval portal | The approval decision can see deposit state in real time | OAuth2 client credentials or mutual TLS, OpenAPI | Read-only; rate limited; contract tests | High | Medium | v1.5 |
| I13 | OCR and layout assist | Fewer typing errors | Offline OCR, human in the loop | Suggestions only; accuracy tracked; any model on-premise with a CERT-In style AI bill of materials | Medium | Medium | v2 |
| I14 | DigiLocker and eSign for institution paperwork | Less paper for registration certificates and declarations | DigiLocker requester APIs and eSign, subject to onboarding with the national agencies | Not assumed for bank FDRs; consent-based | Medium | Medium | v2 |

### **6.1 How the risk-ranked worklist is scored (I2)**

Score \= urgency (days to next action, steeper inside 30 days) \+ amount band \+ highest open discrepancy severity \+ days waiting on a bank \+ case age. Each component is a transparent number with a weight set by the rule owner. The case screen shows the breakdown, so an officer can see why it ranks where it does, and can override with a recorded reason. No hidden model, no surprises in an audit.

### **6.2 How the bank confirmation link works (I11)**

1. Officer requests confirmation; the system selects the branch contact from the bank directory on file.  
2. A single-use link, valid for a limited time, goes from a fixed government domain with SPF and DKIM aligned.  
3. The bank officer sees only the instrument summary needed (number, amount, dates, beneficiary, lien), and answers confirm, deny, or discrepancy, with a second factor sent to the same directory address.  
4. The portal generates an evidence record (time, address, answers, hashes) and attaches it to the case. The result is **provisional L2** until an officer ticks that the sender matched the directory; then it becomes L2.  
5. If a bank prefers letters or email attachments, the officer uploads the reply as evidence, same L2 rule applies.

Honest caveat: bank adoption is uncertain, and this must be agreed with each bank. Pilot with two or three banks that hold most deposits, and measure turnaround before expanding.

### **6.3 Where we deliberately do not innovate**

Cryptographic primitives and key handling (use platform libraries and the KMS), login and session protocols (OIDC through Keycloak), database engine features beyond mainstream PostgreSQL, document formats (PDF, JPEG, PNG in; PDF/A out), payment rails (the portal records instructions; AICTE accounting systems pay), and time sources (NIC or NPL). SMS must use templates registered with the sending gateway under India's telecom template rules; confirm the process with the gateway provider early, as template approval takes time.

## **7\. Industry standards map**

Standards are followed because auditors, hosts and AICTE's own officers expect them. Applicability of each item must be confirmed with AICTE IT and Legal; items marked (voluntary) are guidance, not mandates.

| Standard or rule | Where it applies | Evidence we keep |
| :---- | :---- | :---- |
| GIGW 3.0 (including security audit clearance before hosting, and accessibility) | Whole portal; go-live gate | Audit clearance certificate, accessibility report |
| CERT-In Directions (2022): 6-hour incident reporting, 180-day logs in India, synchronised clocks | Operations, logging, time sync | Incident runbook, log retention config, NTP config |
| CERT-In SBOM guidelines v2.0, July 2025 (voluntary) | Every release | SBOM, vulnerability exchange notes |
| DPDP Act 2023 and DPDP Rules 2025 (substantive duties from May 2027\) | Personal data of signatories and officers | Data map, retention schedule, breach runbook |
| MeitY cloud empanelment and data residency (if cloud hosted) | Hosting | Provider empanelment proof, data location attestation |
| ISO/IEC 27001:2022 Annex A as a control checklist | Security management | Control mapping sheet (certification not assumed) |
| OWASP ASVS Level 2 and OWASP Top 10 | Application security testing | ASVS checklist results per release |
| NIST SSDF (SP 800-218) | Secure development life cycle | Pipeline gates, review records |
| NIST SP 800-63B | Passwords, authenticators, sessions | Keycloak policy export |
| WCAG 2.1 AA | UI | axe reports, manual test notes |
| OIDC, OAuth 2.0 with PKCE, TLS 1.2 or higher | Login, APIs | Config baselines, TLS scan |
| OpenAPI 3.1, RFC 9457 | APIs | Published spec, contract test results |
| PAdES, PDF/A, RFC 3161 | NOC signing, archive, timestamps | Sample validated files |
| CycloneDX or SPDX | SBOM format | SBOM files per release |
| ISO/IEC 25010 | Quality attributes in non-functional targets | NFR traceability table |
| ISO 22301 principles | Backup, recovery, continuity | DR drill reports |
| ISO/IEC/IEEE 29119 style test documentation | Test plans and reports | Test plan, reports, traceability matrix |
| SFMS (IFN 760 / 760COV) and NeSL e-BG for guarantees | Bank guarantee verification where accepted | Adapter spec, sample messages |

## **8\. Development criticality: what makes or breaks delivery**

### **8.1 Critical path**

| Item | Why it is critical | Latest start | Fallback |
| :---- | :---- | :---- | :---- |
| Rule capture from the Approval Process Handbook into rule data | Every status, date and amount depends on it | Week 1 | Start with the current edition only; add older editions for history later |
| Hosting decision and audit slot booking | Audit is the gate to production | Week 2 and week 10 | Pre-audit by internal security tester to shorten the real audit |
| Institution master sync | Without it, users must re-key data | Week 4 | Nightly file import |
| Identity, row-level security, audit core | Everything else builds on these | Week 4 | None; do first |
| Timeline engine | Core value of the system | Week 8 | None; do before dashboards |
| Document pipeline | Biggest attack surface | Week 8 | Reduce to PDF only at launch |
| Data migration | Longest tail of surprises | Week 6 profiling, week 20 rehearsals | Load as L0 and clean over time |
| Bank confirmation agreements | Outside engineering control | Week 6 | Manual-with-evidence |
| UAT officer availability | Acceptance depends on busy people | Week 12 booking | Time-boxed UAT with deputies |

### **8.2 Early spikes (weeks 1 to 4), to remove unknowns first**

| Spike | Question answered | Pass criterion |
| :---- | :---- | :---- |
| S1 | Does row-level security with pooling ever leak scope? | 10,000 randomised requests, zero leaks |
| S2 | Is date maths right across leap years, month-ends, holidays? | Property tests over 30 years pass |
| S3 | Can the upload pipeline take peak load? | 100 concurrent 10 MB uploads scanned and vaulted in under 60 seconds |
| S4 | Does the backend-for-frontend login flow work in the host's network? | Login, refresh, logout, step-up all pass |
| S5 | Can officers sign with their DSC tokens from a browser? | Signed sample verifies in a standard PDF reader |
| S6 | Can we verify a guarantee through SFMS or NeSL, if AICTE accepts them? | One real or sandbox example end to end, or a written bank statement of how |
| S7 | What can the production network reach? | Written list of allowed outbound calls and proxies |
| S8 | How bad is the legacy data? | Profile report: completeness, duplicates, format variants |

### **8.3 Engineering rules**

| Practice | Rule | Enforced by |
| :---- | :---- | :---- |
| Branching | Trunk-based; branches live under 2 days; pull requests under 400 changed lines | Branch protection, bot comment |
| Review | Two reviewers for rules, timeline, authorisation, audit and migrations; one elsewhere; authors never merge their own work | CODEOWNERS, protected branch |
| Definition of done | Code, tests, docs, audit events, accessibility check, feature flag, runbook note | Pull request template |
| Decisions | Any boundary, library or data-model change needs an ADR | Review checklist |
| Database changes | Expand then contract, one release apart; tested on a production-size copy; always reversible | Flyway, migration review |
| Infrastructure | Everything as code; no hand edits in production | Ansible or Terraform per host, drift check |
| Secrets | None in repositories or images | Secret scanning in pre-commit and CI |
| Dependencies | Pinned; no release younger than 14 days; no abandoned packages; licences checked | Self-hosted update bot, licence scan |
| Static analysis | Fail build on high findings | SonarQube, Semgrep |
| Software composition | Fail build on critical or high known vulnerabilities without an accepted exception | OWASP Dependency-Check, Trivy |
| Containers | Minimal base images, non-root, read-only filesystem, signed | Trivy, image signing |
| Dynamic testing | Nightly on staging | OWASP ZAP |
| Observability | Every feature ships with metrics, logs and an alert where relevant | Review checklist |

Production Reality Check on licences: if MinIO is considered for object storage, its community edition is licensed under AGPL and its community support status has changed over time. Prefer the host's S3-compatible store or Ceph; use MinIO only after Legal and support review.

### **8.4 Correctness-critical code**

| Zone | Why | Extra rigour |
| :---- | :---- | :---- |
| Date and tenor maths | A wrong date means a missed reminder or a wrong release | Property-based tests (jqwik), 100% branch coverage, golden files per rule set, mutation score at least 80% |
| Rule evaluation | A wrong rule flags or passes the wrong record | Same as above, plus simulation diffs reviewed before activation |
| Authorisation and row-level policies | A leak is a legal and trust failure | Negative tests for every role and endpoint, DB-level tests that bypass application code |
| Money and ledger | Principal and interest errors | Exact decimals, reconciliation tests, double-entry style checks |
| Audit chain | Evidence must be trusted | Chain verification job, tamper test, separate checkpoint store |
| Notification sending | A bug can message thousands wrongly | Dry-run mode, rate cap, kill switch, recipient preview |

### **8.5 Failure catalogue (beyond infrastructure outages)**

| Failure | How we detect it | How we contain it | How we recover |
| :---- | :---- | :---- | :---- |
| Wrong rule set activated | Simulation diff, post-activation canary query | Roll back to previous rule set (versioned) | Recompute affected dates; notify rule owner |
| Reminder blast to wrong audience | Send-rate alarm, recipient preview mismatch | Kill switch pauses sender within 60 seconds | Correction message; incident review |
| Duplicate scheduled run | Unique ledger key rejects duplicates | Job idempotency | None needed |
| Clock skew between nodes | NTP drift alarm, audit time checks | Reject writes if skew above threshold | Resync; recompute affected events |
| Certificate expiry | Expiry alarm at 30, 14, 7 days | Automated renewal where possible | Runbook for manual renewal |
| Disk or bucket full | Growth alarm at 75% | Pause uploads with friendly message | Expand, then drain queue |
| Slow queries after growth | Slow query log, p95 alarms | Query timeouts, pagination caps | Index or rewrite; ADR if design changes |
| Stuck outbox | Queue depth and age alarms | Dead-letter after retries | Replay tool with audit |
| Migration loaded twice | Idempotent keys, reconciliation counts | Block second run | Roll back by batch identifier |
| Mis-assigned region | Daily check of cases with no owner | Fallback queue at Bureau | Reassign with audit |
| Insider approves own case | Maker-checker rule | Hard block in code and in database constraint | Alert to Bureau head |

### **8.6 Capacity and performance model (planning estimates)**

| Quantity | Estimate | Basis |
| :---- | :---- | :---- |
| Institutions | Order of 10^4 | Assumption, confirm with AICTE |
| Instruments | 2 to 5 per institution over time, versions add 2 to 3x | Assumption |
| Documents | About 10^5 over 5 years, average 2 MB, with derivatives about 0.5 TB | Calculation from assumption |
| Concurrent users | 500 normal, 2,000 peak | Assumption for March to July |
| Sustained API load | About 50 requests per second; bursts to 200 | 2,000 users, short think time |
| Upload burst | 100 simultaneous 10 MB uploads, about 1 GB total | Peak week |
| Audit events | About 10^7 over 5 years | Several events per action |
| Nightly timeline pass | Under 2 minutes for 100,000 instruments | Set-based SQL target |

Load tests use a realistic mix (70% reads, 20% writes, 10% uploads), run for at least 60 minutes at peak, and include a 3x spike. Pass criteria: p95 under 2 seconds, errors under 0.1%, no queue backlog older than 5 minutes.

### **8.7 Technical debt register (deliberate shortcuts)**

Priority \= (Impact \+ Risk) x (6 minus Effort), each scored 1 to 5, so higher is more urgent.

| Shortcut taken on purpose | Impact | Risk | Effort | Priority | Repay when |
| :---- | :---- | :---- | :---- | :---- | :---- |
| File-based institution sync instead of API | 3 | 2 | 3 | 15 | AICTE provides a stable internal API |
| Manual bank confirmation as the default | 4 | 4 | 4 | 16 | Banks agree link or API confirmation |
| PostgreSQL search instead of a search cluster | 2 | 2 | 2 | 16 | p95 search exceeds 500 ms |
| Warm standby DR instead of active-active | 3 | 3 | 4 | 12 | Availability target rises above 99.9% |
| Two languages only | 2 | 2 | 2 | 16 | Regional-language demand confirmed |
| Modular monolith | 2 | 2 | 5 | 4 | Several teams need independent release |
| Deterministic risk score instead of learned model | 2 | 1 | 3 | 9 | 12 months of labelled outcomes exist |

## **9\. Testing strategy**

### **9.1 Pyramid and targets**

| Level | Scope | Tools | Target and gate |
| :---- | :---- | :---- | :---- |
| Unit | Domain logic, rules, date maths, scoring | JUnit, AssertJ, jqwik | 80% line overall; 95% branch in timeline, rules, audit and authorisation |
| Mutation | Rules and timeline modules | PIT | At least 80% mutants killed |
| Architecture | Module boundaries, no forbidden dependencies | ArchUnit | Zero violations |
| Integration | Database, storage, queue, identity, scanner, adapters | Testcontainers (PostgreSQL, Keycloak, ClamAV, S3-compatible), Toxiproxy | All critical flows pass against real services |
| API contract | Every endpoint against OpenAPI | Schema validation, Schemathesis fuzzing | No undocumented behaviour; no 500s under fuzz |
| Frontend component | Forms, tables, status badges | Vitest, Testing Library | Key components covered; no accessibility violations |
| End to end | Journeys J1 to J4 and the officer day | Playwright | All pass on every merge to main, in under 15 minutes |
| Accessibility | WCAG 2.1 AA | axe-core, manual screen reader | Zero critical issues per release |
| Performance | Peak week profile | k6 | p95 under 2 s, errors under 0.1% |
| Security | ASVS L2, Top 10, role matrix | ZAP, Semgrep, manual tests, third-party audit | No open high findings at release |
| Resilience | Dependency failures, node loss, disk pressure | Scripted drills | Behaviour matches the degradation table |
| Recovery | Backup restore and point-in-time recovery | Restore drill | RPO 15 minutes, RTO 4 hours proven |
| Migration | Counts, values, duplicates, idempotency | Reconciliation scripts | 100% reconciled or exceptions signed off |
| Acceptance | Real cases run by officers | UAT scripts | Signed by acceptance committee |

### **9.2 Critical test cases**

| ID | Scenario | Expected result |
| :---- | :---- | :---- |
| T01 | Issue date 31 Jan, tenor one month, leap and non-leap year | Maturity follows the configured month-end rule in both years |
| T02 | Maturity falls on a bank holiday | Both dates stored; alert uses the earlier; status flips correctly |
| T03 | Timeline job down for 3 days, then restarts | No reminder missed, none duplicated |
| T04 | Nightly job run twice | Alert count unchanged |
| T05 | Institution A requests an instrument of institution B | Not found response; audit event written |
| T06 | Regional officer reads another region with application checks removed | Database policy still denies |
| T07 | Pooled connection reused by different users | No scope carried over |
| T08 | Officer tries to approve a case they prepared | Blocked in code and database |
| T09 | EICAR test file uploaded | Rejected, quarantined, alert raised |
| T10 | PDF with embedded script uploaded | Rejected or sanitised; never served as uploaded |
| T11 | Network drops at 70% of an upload | Upload resumes; no duplicate file |
| T12 | Same FDR number under two institutions | R4 raised; duplicate-review case opened |
| T13 | Amount below the sum for approved programmes | R1 raised with the computed requirement |
| T14 | Renewal submitted | New version created; old valid until acceptance; history intact |
| T15 | Release attempted below L2 | Blocked unless a competent authority records an exception |
| T16 | External NOC hold placed on a release | SLA clock pauses; reason visible to all parties |
| T17 | New rule set simulated | Diff shows how many instruments change; activation needs approval |
| T18 | Rule set changes mid-year | Old cases still evaluate under the rule in force on their date |
| T19 | A row in the audit table altered directly | Chain verification job detects it |
| T20 | SMS gateway down for 6 hours | Email and in-app sent; stale SMS expire instead of blasting later |
| T21 | Digest generated for an officer | Only their cases; no document content |
| T22 | Export with a cell beginning with an equals sign | Cell neutralised |
| T23 | Keycloak unavailable | Existing sessions continue to expiry; no data loss |
| T24 | Database failover during an upload | Client retries; no orphaned files |
| T25 | 2,000 concurrent users for 30 minutes | p95 under 2 s; errors under 0.1% |
| T26 | Point-in-time restore | Data matches to within 15 minutes; reconciliation passes |
| T27 | Migration run twice | No duplicates |
| T28 | Screen-reader user completes J1 | Task completed unaided |
| T29 | Many invalid public NOC lookups | Rate limited; no information leaked |
| T30 | Mass notification kill switch pressed | Sending stops within 60 seconds |

### **9.3 Test data and time**

A synthetic data generator builds institutions, instruments and documents following the real rules, including deliberately bad records for each rule R1 to R10. Production extracts are used only when masked and approved. The system's clock is an injectable component, so tests can jump forward years in milliseconds; no test sleeps.

### **9.4 Acceptance**

Entry: staging stable, no open critical defects, test data loaded. Scripts per persona. Severity: S1 blocks use or leaks data, S2 breaks a core journey, S3 has a workaround, S4 cosmetic. Exit: no open S1 or S2, S3 items agreed with dates, committee signs.

## **10\. Delivery pipeline and releases**

### **10.1 Pipeline**

| Stage | What runs | Gate |
| :---- | :---- | :---- |
| Pre-commit | Format, lint, secret scan | Blocks the commit |
| Build | Compile, unit tests, architecture tests, mutation tests on critical modules | All green; coverage targets met |
| Static and composition analysis | SonarQube, Semgrep, Dependency-Check, licence scan | No high findings without a recorded exception |
| Package | Reproducible container build, SBOM, vulnerability exchange notes, image scan and signing | Unknown component or critical vulnerability fails the build |
| Integration | Testcontainers suite, contract and fuzz tests | All pass |
| Deploy to staging | Same artefact, same configuration shape as production | Smoke tests pass |
| End to end and accessibility | Playwright journeys, axe | All pass |
| Nightly | ZAP scan, dependency refresh check, backup restore test on staging | Reports reviewed next morning |
| Release candidate | Load test, security checklist, migration rehearsal on production-size copy | Signed by QA, security and product owner |
| Production | Blue-green or rolling deploy, migration, smoke tests | Rollback triggers below |

### **10.2 Environments**

| Environment | Purpose | Data |
| :---- | :---- | :---- |
| Development | Daily work | Synthetic only |
| Test | Automated suites | Synthetic, reset nightly |
| Staging | Production twin; frozen copy for the security auditor | Synthetic plus masked samples with approval |
| Production | Live | Real |
| DR | Warm standby in another region of India | Replicated |

Access to production is by named accounts with approval, session recording where the host allows it, and no shared logins.

### **10.3 Release checklist**

**Before deploy**

* ☐ All pipeline stages green on the exact artefact being released  
* ☐ Code reviewed and approved by the required reviewers  
* ☐ No open S1 or S2 defects; known issues listed in release notes  
* ☐ Migrations rehearsed on a production-size copy and reversible  
* ☐ Feature flags set (new features off by default)  
* ☐ Rule-set changes (if any) simulated and approved by the rule owner  
* ☐ SBOM and vulnerability notes generated; security lead has signed  
* ☐ Rollback plan written; backup taken and verified  
* ☐ Support and on-call informed; maintenance notice sent if needed

**Deploy**

* ☐ Deploy to staging and run smoke tests  
* ☐ Deploy to production (one node or one slice first)  
* ☐ Watch error rate, latency, queue depth and login success for 15 minutes  
* ☐ Verify key flows with the synthetic officer canary

**After deploy**

* ☐ Metrics nominal for 24 hours  
* ☐ Release notes and changelog published to AICTE  
* ☐ Tickets closed; stakeholders told

**Rollback triggers (decided before deploy)**

| Signal | Threshold |
| :---- | :---- |
| Server error rate | Above 1% for 5 minutes |
| p95 page latency | Above 3 seconds for 10 minutes |
| Login success rate | Below 98% |
| Upload success rate | Below 95% |
| Canary flow | Fails twice in a row |
| Data integrity check | Any audit-chain or reconciliation mismatch |

### **10.4 Change safety**

Database changes follow expand and contract: add the new structure, deploy code that writes both, backfill, switch reads, remove the old structure a release later. Feature flags allow dark launches and instant switch-off. Deploys avoid working hours for officers unless urgent. **Seasonal freeze:** from 1 March to 31 July only critical fixes are released, and each needs a second approver. A readiness review runs every February.

## **11\. Operations and incident response**

### **11.1 Service level objectives**

| Objective | Target |
| :---- | :---- |
| Availability (monthly) | 99.5% |
| Login success | 99% or better excluding user error |
| Upload success | 99% or better |
| Page load p95 | Under 2 seconds |
| Reminders sent on schedule | 99.9% within 1 hour of due time |
| Audit chain verification | Daily, 100% pass |
| Backup success | 100% nightly; restore drill each quarter |
| Recovery point and time | 15 minutes and 4 hours |

### **11.2 What is monitored**

User-facing: availability, latency, error rate, login and upload success. Platform: CPU, memory, disk, connection pool, replication lag, queue depth and age, job failures, certificate expiry, clock drift. Security: failed logins, privilege changes, unusual downloads, WAF blocks, scan rejects. Business: instruments by status, reminders due and sent, cases overdue, bank confirmations waiting. Alerts page a human only when action is needed; everything else goes to a daily digest.

### **11.3 Severity levels**

| Level | Meaning for AICTE | Response | Clocks |
| :---- | :---- | :---- | :---- |
| SEV1 | Portal down for all users, data exposure or suspected breach, wrong mass notification, audit chain broken | Immediate, all hands | Security incident: report to CERT-In within 6 hours of detection; if personal data is affected, board and individual notices under DPDP rules on their timelines |
| SEV2 | Major function degraded: uploads, approvals, reminders or login failing for many users | Within 15 minutes | Update every 30 minutes |
| SEV3 | Minor function affected or a few users impacted | Within 1 hour | Update every 4 hours |
| SEV4 | Cosmetic or low impact | Next working day | Ticket |

**Roles:** incident commander, technical lead, communications lead, scribe, AICTE liaison, security officer (owns CERT-In and data protection reporting). Two named people per role, so leave never leaves a gap.

**Communication.** Updates state what is happening, who is affected, what we are doing, and when the next update comes. A status banner appears in the portal. Updates are factual; no speculation.

**Postmortem.** Blameless, drafted within 5 working days: summary, impact, timeline, root cause, five whys, what went well and badly, action items with owner, priority and due date. Actions are tracked in the same backlog as features and reviewed at the steering group.

### **11.4 Runbooks to write before go-live**

Database failover and restore; point-in-time recovery; object store full; scanner down; Keycloak down or locked out; certificate renewal; stuck outbox and dead-letter replay; mass notification kill switch; rule-set rollback; suspected data exposure (includes reporting steps); user lockout and recovery; region reassignment; peak-season scale-up; DR failover and failback.

### **11.5 Routine operations**

| Activity | Frequency | Owner |
| :---- | :---- | :---- |
| Backup restore drill | Quarterly | DevOps with AICTE IT witness |
| DR failover exercise | Twice a year | DevOps |
| Access recertification | Quarterly | Bureau head |
| Vulnerability patching targets | Critical within 7 days (faster if exploited in the wild), high within 30, medium within 90 | Security lead |
| Dependency refresh | Monthly, with the 14-day age rule | Tech lead |
| Capacity review | Monthly, and before February | DevOps |
| Rule-set review | At every handbook change | Rule owner |
| Game day | Yearly, before peak | Tech lead |
| Penetration test | Yearly and after major change | Security lead |

## **12\. Security engineering**

### **12.1 Threat model (STRIDE, top threats)**

| Threat | Example | Controls |
| :---- | :---- | :---- |
| Spoofing | Someone logs in as an institution signatory | OTP or TOTP, lockout, device and IP anomaly alerts, signatory changes need AICTE approval |
| Tampering | Edited FDR scan or silent record edit | Hashing, immutable versions, hash-chained audit, bank evidence |
| Repudiation | Officer denies approving a release | Named approvals, step-up authentication, signed NOC, audit chain |
| Information disclosure | Institution A reads institution B | Row-level security, negative tests, signed short-lived document links, watermarking |
| Denial of service | Flood during peak week | WAF, rate limits, queues, autoscaling headroom, upload caps |
| Elevation of privilege | Admin reads documents or approves | Role separation, maker-checker, break-glass with alerts |
| Malicious file | Weaponised PDF | Type checks, sanitising, scanning, isolated processing, no server-side rendering of untrusted content |
| Phishing | Fake AICTE or bank email asking for confirmation or payment | Fixed sender domain with SPF and DKIM, no payment asks by email, bank directory for confirmation links |
| Supply chain | Poisoned dependency | Pinned versions, 14-day age rule, SBOM, signed images, scan gates |
| Log tampering | Attacker erases traces | Separate log store, append-only audit, daily external checkpoint |
| Insider misuse | Officer browses without need | Scope limits, access alerts, quarterly review, audit explorer |
| Backup theft | Copies leave the data centre | Encrypted backups, key separation, access logging |

### **12.2 Data classification**

| Class | Examples | Handling |
| :---- | :---- | :---- |
| Restricted | FDR scans, affidavits, bank details, signatory contact data | Encrypted at rest and in transit, role and scope limited, watermarked views, never in logs or emails |
| Confidential | Case notes, rule parameters, audit events | Role limited, encrypted |
| Internal | Reports, aggregates | Authenticated users |
| Public | NOC verification status | Rate limited, no personal data |

### **12.3 Keys and secrets**

Master keys live in a vault or HSM and never in the application image. Document data keys are generated per file and wrapped by the master key. Rotation: master key yearly, service credentials every 90 days or on staff change. A documented break-glass procedure gives two-person access to emergency credentials, and any use pages the security lead.

### **12.4 Privacy by design (DPDP)**

Collect only what is needed (signatory name, designation, official email and phone, officer identity). Show a clear notice at first login. Keep retention schedules in configuration. Provide a process for correction and erasure requests where law allows, with the exception that regulatory records must be kept. Keep a data map and a breach runbook ready before the substantive duties start in May 2027\. Legal decides whether AICTE's processing is exempt; the system is built to the stricter standard regardless.

### **12.5 Security testing plan**

| When | What |
| :---- | :---- |
| Every build | Static analysis, dependency and container scans, secret scans |
| Nightly | Dynamic scan on staging |
| Each release | ASVS L2 checklist items for changed areas, role-matrix negative tests |
| Week 20 | Internal penetration test by someone outside the build team |
| Weeks 21 to 25 | Independent audit by an approved auditor; fixes; re-test; clearance certificate |
| Yearly | Repeat audit and tabletop incident exercise |

## **13\. Data migration and cutover**

| Stage | Activity | Output |
| :---- | :---- | :---- |
| Profile | Inventory every source; measure completeness, duplicates, format variants | Profile report (spike S8) |
| Map | Map fields to the new model; record transformations | Mapping sheet signed by Bureau |
| Clean | Normalise bank names, IFSC, dates, amounts; flag unreadable | Cleaning rules as code, exceptions list |
| Load | Idempotent batch loads with batch identifiers; all records land as L0 with source tag | Load logs |
| Reconcile | Counts and totals by region, bank, status; sample document checks | Reconciliation report |
| Rehearse | At least three full rehearsals on staging, timed | Rehearsal reports |
| Cutover | Freeze old registers, final delta load, verify, switch, open to users | Cutover log |
| Hypercare | Daily review for 4 weeks; old registers read-only | Daily bulletin |

**Cutover checklist (T minus):** T-14 days freeze scope; T-7 final rehearsal and sign-off on reconciliation tolerances; T-2 backups verified and rollback tested; T-1 communication to institutions and officers; T-0 freeze, delta load, verify, switch; T+1 to T+28 hypercare. **Rollback:** if reconciliation fails or a critical defect appears within 48 hours, return to the old registers (kept intact and read-only) and re-run after the fix.

## **14\. Roadmap, team and estimates**

### **14.1 Phases with exit criteria**

| Phase | Weeks | Exit criteria | Demo to AICTE |
| :---- | :---- | :---- | :---- |
| 0 Discovery | 1 to 3 | Decisions D1 to D5 made; rules captured; spikes S1 to S8 started | Rule sheet and decision log |
| 1 Foundation | 4 to 7 | Pipeline, identity, row-level security, audit chain, institution sync; spikes closed | Login by role, audit explorer |
| 2 Registry and vault | 8 to 11 | Submission journey J1; upload pipeline; search | Institution submits an FDR end to end |
| 3 Verification and timeline | 12 to 15 | Rules R1 to R10; trust levels; timeline engine; alerts | Reminders fire on schedule; discrepancies flagged |
| 4 Cases and release | 16 to 19 | Queries, renewal, release, NOC with QR; accounts ledger | Full release on test data |
| 5 Dashboards and reports | 18 to 20 | Dashboard, forecasts, scheduled reports | Bureau reviews real-looking data |
| 6 Hardening | 20 to 25 | Load test, internal test, audit, fixes, DR drill, accessibility | Audit clearance, restore proof |
| 7 Pilot and rollout | 26 to 38 | Pilot region stable; migration signed; phased go-live; handover training | Go-live review |

### **14.2 Team and responsibilities**

| Role | Count | Accountable for |
| :---- | :---- | :---- |
| AICTE product owner | 1 | Priorities, acceptance, rules |
| AICTE IT liaison | 1 | Hosting, integrations, approvals |
| Business analyst | 1 | Requirements, rule capture, UAT scripts |
| Tech lead / architect | 1 | Architecture, ADRs, quality |
| Backend engineers | 3 | Modules, APIs, jobs |
| Frontend engineers | 2 | UI, accessibility |
| QA lead and tester | 2 | Test strategy, automation, UAT support |
| DevOps and security engineer | 1 to 2 | Pipeline, environments, hardening |
| UX designer | 0.5 | Journeys, content, usability tests |
| Delivery manager | 1 | Plan, risks, reporting |

### **14.3 Estimate**

Planning range: 90 to 130 person-months of effort over about 9 months, plus 20% contingency, before AICTE-side effort and external audit fees. Biggest swing factors: decision D1 (standalone or integrated), the number of legacy data sources, how many banks adopt confirmation links, and audit re-test cycles. This is an estimate to be replaced after Phase 0\.

### **14.4 If a working prototype is required (hackathon track)**

Build order, so something credible exists at every checkpoint:

1. Data model, seeded institutions and instruments, three trust levels.  
2. Institution submission with upload and rules R1 to R5.  
3. Timeline engine with a time-travel control, so judges can jump to maturity day and see reminders fire.  
4. Officer queue with the risk score breakdown and split-screen case view.  
5. Release case with maker-checker, NOC with QR, and the audit explorer.  
6. Dashboard with maturity forecast.

Demo script (about 8 minutes): a new submission with a deliberate wrong amount; the system flags R1; the officer raises a query; the institution fixes it; time-travel to 90 days before maturity; reminders fire; renewal creates a new version; release is attempted below L2 and blocked; competent authority approves with an exception note; NOC verified by QR; audit explorer shows every step.

Measurable improvement slide, using the problem statement's own words: record accuracy (seeded errors caught: X of Y), verification turnaround (time to find and review a record, spreadsheet versus portal), timely renewal monitoring (reminders on schedule: 100% in the simulated year), manual effort (clicks and minutes per case), visibility (share of cases with owner and due date). State clearly that figures come from simulated data.

## **15\. Architecture decision records**

| ID | Decision | Status | Revisit when |
| :---- | :---- | :---- | :---- |
| ADR-1 | Modular monolith | Accepted | Several teams need independent releases |
| ADR-2 | PostgreSQL as single system of record | Accepted | One primary cannot carry the load |
| ADR-3 | Three trust levels; manual-with-evidence bank confirmation | Accepted | A bank offers an API |
| ADR-4 | Rules stored as versioned data | Accepted | Never |
| ADR-5 | Self-hosted Keycloak | Accepted | AICTE mandates central single sign-on |
| ADR-6 | Deterministic rules, no machine learning in v1 | Accepted | 12 months of labelled outcomes |
| ADR-7 | JDK 25 LTS and Spring Boot 4.x (supersedes the Java 21 baseline in the Solution Plan) | Accepted, host support to be confirmed | Host cannot run JDK 25 |
| ADR-8 | Row-level security as defence in depth behind application checks | Accepted | Never remove |
| ADR-9 | Outbox and Quartz instead of Kafka | Accepted | Event volume or consumers grow sharply |
| ADR-10 | Backend-for-frontend with cookie sessions, no tokens in browser storage | Accepted | None |
| ADR-11 | Object store chosen by host; MinIO only after licence and support review | Proposed | Host decision D2 |
| ADR-12 | Explainable weighted scoring for worklist | Accepted | See ADR-6 |
| ADR-13 | Bank link confirmation counts as provisional L2 until officer cross-check | Proposed | After bank pilot |
| ADR-14 | Standalone portal with read-only sync versus module in existing approval portal | Pending decision D1 | Phase 0 |

### **ADR-7 in full**

**Status:** Accepted, pending confirmation of host support. **Date:** 24 Oct 2026\. **Deciders:** AICTE IT head, tech lead, security lead.

**Context.** The Solution Plan assumed Java 21 and Spring Boot 3.x. Current information shows JDK 25 is the latest LTS (September 2025), Spring Boot 4.0 was released in November 2025, one ecosystem tracker lists Spring Boot 3.5 open-source support ending June 2026, and Keycloak supports only the latest Java LTS. A system delivered in 2027 and supported for years should not start on a platform nearing the end of free updates.

**Decision.** Baseline on JDK 25 LTS with Spring Boot 4.x, latest patch releases that are at least two weeks old.

| Dimension | Option A: JDK 21 and Spring Boot 3.5 | Option B: JDK 25 and Spring Boot 4.x |
| :---- | :---- | :---- |
| Complexity | Low, widely known | Medium, newer migration notes |
| Support horizon | Shorter; Boot 3.5 open-source support ends June 2026 | Longer; JDK 25 LTS support runs for years |
| Ecosystem fit | Some tools drop Java 21 support over time | Keycloak and current libraries target latest LTS |
| Risk | Forced upgrade during the project's life | Newer libraries may have rough edges |

**Trade-offs.** B costs a little early friction and requires checking that the hosting body can run JDK 25\. A forces a migration soon after go-live. For a system meant to run for years under audit, B is the safer long-term choice.

**Consequences.** Easier: staying supported and patched, using current Keycloak. Harder: some libraries need version checks. To revisit: if the host cannot run JDK 25, fall back to A with a dated upgrade plan.

**Actions.** Confirm host runtime support (week 2); run spike S4 on JDK 25 and Spring Boot 4 (week 3); record all pinned versions in the SBOM.

## **16\. Documentation set for handover**

| Document | Audience | Content |
| :---- | :---- | :---- |
| Architecture overview | AICTE IT, new engineers | Context, components, data flow, decisions |
| API reference | Integrators | OpenAPI spec, auth, errors, rate limits, examples |
| Data dictionary | Analysts, auditors | Tables, fields, meanings, retention |
| Rule book | Rule owner, Bureau | Every rule, its source clause, parameters, test cases |
| Security pack | Auditors, CISO | Threat model, controls, ASVS results, audit report |
| Runbooks | Operations | Section 11.4 list, each with steps, rollback and escalation |
| User guides | Institutions, officers | Task-based, bilingual, with screenshots |
| Training deck and videos | All roles | Short role-based modules |
| Onboarding guide | New developers | Setup in under a day, key systems, who to ask |
| Release notes | AICTE | What changed and what to check |
| Test pack | QA, auditors | Plans, cases, results, traceability matrix |

## **17\. New open questions and assumptions**

1. Can the chosen host run JDK 25 and the required container tooling?  
2. Does the host permit self-managed PostgreSQL, or only a managed offering and which version?  
3. Which S3-compatible store does the host provide?  
4. Are DSC-based signing and eSign available to AICTE officers today, and through which provider?  
5. Is a trusted timestamp authority approved for AICTE use?  
6. Which banks will pilot the confirmation link, and who signs the arrangement for AICTE?  
7. Who owns the holiday calendar and how often is it updated?  
8. What is AICTE's incident-reporting contact path to CERT-In and the Data Protection Board?  
9. Are there existing AICTE branding, accessibility or content standards the UI must follow?  
10. What is the approved SMS template process and lead time?

Assumptions made in this blueprint: all numbers in Sections 8.6 and 14.3 are estimates; Section 5 designs assume a virtual-machine or container host in India without open internet access; every integration other than the institution master is optional at go-live.

## **18\. Glossary**

**APH** Approval Process Handbook. **EoA** Extension of Approval. **FDR** Fixed Deposit Receipt. **NOC** No Objection Certificate. **DSC** Digital Signature Certificate. **SFMS** Structured Financial Messaging System. **NeSL** National e-Governance Services Ltd (e-bank guarantee repository). **GIGW** Guidelines for Indian Government Websites and Apps. **STQC** Standardisation Testing and Quality Certification. **RLS** Row-level security. **BFF** Backend-for-frontend. **SBOM** Software bill of materials. **VEX** Vulnerability exploitability exchange. **ASVS** Application Security Verification Standard. **SLO** Service level objective. **RPO / RTO** Recovery point / time objective. **L0 / L1 / L2** Submitted / Document-checked / Bank-confirmed.

## **19\. Sources used for this blueprint**

* Current platform baseline: ecosystem and release summaries on JDK 25 LTS, Spring Boot 4.0 and Keycloak Java support (a GitHub upgrade tracker, a library ecosystem tracker, State of Java 2026). Confirm exact patch versions at build time.  
* CERT-In Technical Guidelines on SBOM, QBOM, CBOM, AIBOM and HBOM version 2.0, July 2025 (law-firm summaries from AZB and Mondaq; KPMG note); CERT-In Directions 2022 and DPDP Rules 2025 timelines (as in the Solution Plan sources).  
* DigiLocker requester and partner API specifications and onboarding FAQ (digilocker.gov.in, api-setu.in resources).  
* Government hosting and audit practice: GIGW 3.0 clause 5.3.1 summary and public NIC-cloud security audit tenders (MoSPI), as used in the Solution Plan.  
* Banking verification: SFMS and NeSL e-BG sources, as in the Solution Plan.  
* Engineering practice lenses: testing-strategy, deploy-checklist, incident-response, tech-debt, architecture decision record and system-design frameworks.

*This blueprint is a planning document. Items marked as estimates or assumptions must be confirmed with AICTE before commitments are made.*