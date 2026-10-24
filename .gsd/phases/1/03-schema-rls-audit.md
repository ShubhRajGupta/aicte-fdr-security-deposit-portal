---
phase: 1
plan: 3
wave: 2
depends_on: [1.1, 1.2, 0.2]
files_modified:
  - db/migrations/V001__baseline_schema.sql
  - db/migrations/V002__rls_policies.sql
  - db/migrations/V003__immutability_triggers.sql
  - db/migrations/V004__audit_chain_indexes.sql
  - backend/audit/
autonomous: true

must_haves:
  truths:
    - "Flyway applies all migrations cleanly on a fresh database; rollback scripts exist for each"
    - "An institution user can only read their own institution's rows (RLS enforced at DB level)"
    - "A regional officer can only read rows belonging to their assigned region (RLS enforced at DB level)"
    - "Spike S1 passes: zero RLS scope leaks in 10,000 randomised pooled requests"
    - "Audit events are written in the same DB transaction as the state change that caused them"
    - "Audit chain: each event stores SHA-256 hash of the previous event"
    - "A directly altered audit row is detected by the chain verification job"
    - "DB trigger blocks UPDATE and DELETE on accepted instrument versions and on audit.event rows"
  artifacts:
    - "db/migrations/V001–V004: all pass Flyway; rollback scripts exist"
    - "backend/audit/AuditService.java: writes events in caller's transaction; chain maintained"
    - "backend/audit/ChainVerificationJob.java: runs daily; alerts on break"
---

# Plan 1.3: Core Database Schema + Row-Level Security + Audit Chain

<objective>
Deploy the baseline schema, row-level security policies, immutability triggers, and the hash-chained audit service.
These three things — schema, RLS, audit — are the security and integrity foundation.
Nothing else can be built until they are proven correct.

Purpose: A scope leak is a legal failure. A broken audit chain destroys evidence in an investigation.
An alterable instrument record means AICTE cannot defend a decision.
Output: Proven schema, proven RLS (Spike S1), proven audit chain.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (Section 8.1: core data model; Section 5.4: data architecture; non-negotiable #3, #11)
- .gsd/spikes/S1-rls-scope-leak.md (the RLS approach that passed)
- .gsd/spikes/S2-date-maths.md (date type decisions)
- PROJECT_RULES.md (database rules: SET LOCAL, NUMERIC types, no hard deletes)
</context>

<tasks>

<task type="auto">
  <name>Deploy baseline schema (all core tables)</name>
  <files>db/migrations/V001__baseline_schema.sql</files>
  <action>
    Create all tables from SPEC Section 8.1. Key type rules:
    - All monetary amounts: NUMERIC(18,2). Never FLOAT, never VARCHAR.
    - All calendar dates (maturity, issue, deadline): DATE. Named column suffix: _date.
    - All event timestamps: TIMESTAMPTZ stored in UTC. Named column suffix: _at.
    - All IDs: UUID (gen_random_uuid()).

    Tables to create:
    - institution (aicte_id, name, type enum, region, status, founded_year, closure_flag, merger_ref, sync_source, synced_at)
    - entity (institution_id, trust_name, registration_no, effective_from, effective_to, confirmed_by, confirmed_at) -- name history
    - instrument (institution_id, type enum [FDR|BG|ONLINE|RTGS], current_version_id FK, created_at)
    - instrument_version (instrument_id, version_no, number_normalised UNIQUE per bank_code, bank, branch, ifsc, amount_principal NUMERIC(18,2), amount_required NUMERIC(18,2), issue_date DATE, maturity_date DATE, tenor_months, interest_rate NUMERIC(7,4), interest_terms, beneficiary, lien_flag, trust_level enum [L0|L1|L2|LX], valid_from, valid_to, supersedes_id, status enum, next_action_date DATE, next_action_type, accepted_at, accepted_by, rule_set_id FK)
    - document (version_id, type enum [FDR_SCAN|AFFIDAVIT|BANK_EVIDENCE|NOC|OTHER], storage_key, sha256, file_size_bytes, page_count, scanned_ok, scan_status enum, uploaded_by, uploaded_at, ocr_text_suggestion, watermark_key)
    - verification (version_id, rule_code, channel, result enum [PASS|FAIL|PENDING], detail_json, evidence_doc_id, by_user, verified_at)
    - case (type enum [SCRUTINY|RENEWAL|RELEASE|HOLD|QUERY], instrument_id, state enum, opened_by, owner_role, owner_user_id, region, due_at, hold_reason, hold_external_noc_ref)
    - case_event (case_id, from_state, to_state, actor, note, at TIMESTAMPTZ)
    - rule_set (id, aph_edition, effective_from DATE, effective_to DATE, parameters JSONB, approved_by, approved_at, status enum [DRAFT|ACTIVE|ARCHIVED])
    - alert_rule (rule_set_id, offset_days INT, audience_role, channel enum)
    - alert_ledger (case_id, rule_code, offset_days, recipient_user_id, sent_at, channel, status enum, retry_count, dead_lettered_at)
    - audit_event (id UUID, actor_user_id, action, entity_type, entity_id, before_json, after_json, ip, trace_id, occurred_at TIMESTAMPTZ, prev_hash TEXT, hash TEXT)
    - user_role (user_id, role, region_scope, institution_scope, granted_by, granted_at, revoked_at, recertified_at)
    - outbox (id, event_type, payload JSONB, created_at, processed_at, retry_count, dead_lettered_at)

    Normalised instrument number: strip spaces, dashes, and punctuation from the raw FDR number; store as number_normalised. Unique index on (bank_code, number_normalised).

    AVOID: Using SERIAL (int) for IDs — use UUID for all primary keys.
    AVOID: Storing money as FLOAT or DOUBLE.
    AVOID: Nullable columns where the domain says the value is always present.
    Write a rollback script (V001__rollback.sql) that drops all tables.
  </action>
  <verify>
    `flyway migrate` on a fresh PostgreSQL instance: succeeds with exit code 0.
    `flyway migrate` run twice: idempotent (no error, no duplication).
    `flyway repair` + rollback script: restores to the pre-migration state.
  </verify>
  <done>Flyway applies V001 cleanly; rollback script verified on a test instance.</done>
</task>

<task type="auto">
  <name>Row-level security policies + immutability triggers</name>
  <files>db/migrations/V002__rls_policies.sql, db/migrations/V003__immutability_triggers.sql</files>
  <action>
    V002 — RLS policies:
    Enable RLS on: institution, instrument, instrument_version, document, case, case_event, alert_ledger.

    Application user (fdr_app role): limited role, does not own tables, cannot disable RLS.
    Migration user (fdr_migrate role): separate role; owns tables; runs migrations.

    Policies:
    - Institution scope: an institution_user or institution_signatory sees only rows where institution_id = current_setting('app.institution_id')::UUID. SET LOCAL app.institution_id = 'X' at the start of every transaction.
    - Region scope: a regional_verifier sees only rows where region = current_setting('app.region')::TEXT.
    - Bureau and above roles: no row-level restriction (enforced at application level).
    - audit_event: no SELECT policy for app role; readable only by auditor role.
    - Read-only roles (auditor, helpdesk): SELECT only; no INSERT/UPDATE/DELETE.

    SET LOCAL strategy:
    - The BFF extracts institution_id and region from the Keycloak token claims.
    - A Spring @Aspect intercepts every @Transactional method and runs:
      `SET LOCAL app.institution_id = ?` and `SET LOCAL app.region = ?`
    - These local settings reset automatically when the transaction ends (committed or rolled back).
    - Spike S1 confirmed this approach produces zero scope leaks.

    V003 — Immutability triggers:
    - On instrument_version: BEFORE UPDATE — raise exception if status is 'ACCEPTED'.
    - On instrument_version: BEFORE DELETE — always raise exception.
    - On audit_event: BEFORE UPDATE or DELETE — always raise exception.

    AVOID: Using SET (session-level) for RLS context — always SET LOCAL inside a transaction.
    AVOID: Granting the app role ownership of any table.
    AVOID: Granting the app role the ability to execute SET ROW SECURITY or ALTER TABLE.
  </action>
  <verify>
    T05: institution A's session cannot read institution B's rows (confirmed via direct DB test).
    T06: regional officer's session cannot read another region's rows, even if application-level checks are bypassed.
    T07: a pooled connection reused by a different user has no leftover context (Spike S1 test re-run on V002 schema).
    T08: trigger blocks UPDATE on an ACCEPTED instrument_version row.
    T19 precursor: trigger blocks DELETE on audit_event row.
  </verify>
  <done>RLS confirmed (T05, T06, T07 pass); immutability triggers confirmed (T08 precursor).</done>
</task>

<task type="auto">
  <name>Hash-chained audit service + chain verification job</name>
  <files>backend/audit/AuditService.java, backend/audit/ChainVerificationJob.java, db/migrations/V004__audit_indexes.sql</files>
  <action>
    AuditService:
    - Single method: writeEvent(AuditEvent event) — called by all state-changing service methods.
    - Must run within the CALLER'S existing transaction (not a new transaction).
      Implementation: annotate with @Transactional(propagation = MANDATORY) — fails if no active transaction.
    - For each event: compute hash = SHA-256(prev_hash + actor + action + entity_type + entity_id + before_json + after_json + occurred_at.toString()).
    - Store: prev_hash (the previous row's hash), hash (this row's hash).
    - The very first event uses a genesis hash (a well-known constant string, documented).
    - Event fields: actor_user_id, action (e.g. INSTRUMENT_SUBMITTED), entity_type, entity_id, before_json (JSONB), after_json (JSONB), ip, trace_id (W3C traceparent from request), occurred_at.

    ChainVerificationJob (runs daily via Quartz):
    - Reads audit_event in occurred_at order.
    - Recomputes each row's hash from its fields.
    - Compares with stored hash.
    - If any row has a broken chain: logs a CRITICAL alert, fires a Prometheus alert, writes to the ops dead-letter table.
    - Job is idempotent: re-running it does not produce duplicate alerts.

    Daily checkpoint export (for tamper evidence external to the DB):
    - After verification, write the latest block hash + timestamp to a separate location
      (a separate file store, or a monitoring system that is not the application DB).
    - This implements I5 (tamper-evident audit with external checkpoints).

    V004 — Indexes:
    - audit_event: index on (entity_type, entity_id, occurred_at) — for case history queries.
    - audit_event: partitioned by month (PARTITION BY RANGE on occurred_at).
      Old partitions archived (never dropped before the retention period).
    - instrument_version: partial index on (institution_id, status) WHERE status != 'CLOSED'.
    - instrument_version: index on (maturity_date) WHERE status IN ('ACTIVE','EXPIRING').
    - case: index on (state, owner_role, due_at).
    - alert_ledger: UNIQUE on (case_id, rule_code, offset_days, recipient_user_id).

    AVOID: Calling AuditService inside a @Transactional(propagation = REQUIRES_NEW) — this breaks
    the "same transaction" guarantee and allows a state change with no audit record if the outer tx rolls back.
    AVOID: Queuing audit events to an outbox — the audit write must be synchronous in the same transaction.
  </action>
  <verify>
    T19: alter a row in audit_event directly via psql → ChainVerificationJob detects the break and fires an alert.
    T08: accept an instrument version → audit event written; roll back the acceptance → audit event also rolled back (both in the same transaction).
    Run ChainVerificationJob twice in a row → alert fires at most once.
    Daily checkpoint file exists in the separate store after job runs.
  </verify>
  <done>Audit chain proven tamper-evident (T19). Events written in same transaction (T08 rollback test). Checkpoint written externally.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] Flyway V001–V004 apply cleanly on fresh DB; all rollback scripts verified
- [ ] RLS: T05, T06, T07 pass (institution and region isolation at DB level)
- [ ] Immutability: UPDATE on ACCEPTED instrument_version raises exception
- [ ] Audit: T19 — tampered row detected by ChainVerificationJob
- [ ] Audit: state-change rollback also rolls back the audit event
- [ ] Audit: daily checkpoint written to external store
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
- [ ] Plan 1.4 (Institution Sync) can begin
- [ ] Phase 2 plans (2.1 Registry, 2.2 Vault) can begin
</success_criteria>
