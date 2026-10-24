---
phase: 1
plan: 4
wave: 3
depends_on: [1.3]
files_modified:
  - backend/institution/sync/
  - backend/institution/entity_history/
  - db/migrations/V005__institution_sync_log.sql
autonomous: true

must_haves:
  truths:
    - "100 seeded institution records import with no duplicates and no data loss"
    - "A renamed institution still links to the original record via entity name history"
    - "Nightly sync job is idempotent: running it twice produces the same result"
    - "Sync failures write to the dead-letter table and fire an alert; they never silently fail"
  artifacts:
    - "backend/institution/sync/: file-import adapter with idempotent upsert"
    - "backend/institution/entity_history/: officer-confirmed alias flow"
    - "db/migrations/V005: sync_log table for import audit trail"
---

# Plan 1.4: Institution Sync

<objective>
Mirror the AICTE institution master into the FDR portal so institution users never re-key their data.
Nightly file-based import; idempotent; failures are visible and alerting.

Purpose: Without institution data, users cannot submit instruments. Re-keying creates inconsistencies.
Output: Working nightly sync; entity name history; sync failures visible.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (Section 6.2: integration layer; ADR-14: standalone + read-only sync)
- .gsd/decisions/DECISIONS.md (D1: standalone portal; D12: data migration sources)
- .gsd/spikes/S7-network-reach.md (whether the AICTE portal is reachable, or file export only)
- PROJECT_RULES.md (database rules; failure handling: dead-letter table, never silent)
</context>

<tasks>

<task type="auto">
  <name>Nightly institution file-import adapter</name>
  <files>backend/institution/sync/, db/migrations/V005__institution_sync_log.sql</files>
  <action>
    Implement a Quartz job that runs nightly (configurable time, default 02:00 IST):

    Input: A CSV/JSON file exported from the AICTE approval portal, placed in a designated
    incoming directory (or fetched via an approved internal API if S7 confirms it is reachable).

    Processing:
    1. Read file; validate schema (required columns present, no empty aicte_id).
    2. For each record: UPSERT into the institution table using aicte_id as the natural key.
       - If the institution name has changed: write a new row to entity_history with effective_from = today.
       - Never overwrite verified FDR data based on sync alone.
    3. Log every import to sync_log: file name, record count, inserted, updated, skipped, errors.
    4. If a record fails validation: write to dead-letter table with the raw row and error reason.
       Do NOT abort the whole import for one bad record.
    5. If the import file is missing or malformed: fire a critical alert; do not silently skip.

    Idempotency:
    - Each batch has a batch_id (SHA-256 of the file content).
    - The sync_log checks: if batch_id already processed successfully, skip.
    - This prevents double-import if the job is re-triggered.

    API stub:
    - Create a placeholder InstitutionSyncApiAdapter interface with one method: fetchInstitutions().
    - FileImportAdapter implements it; future ApiAdapter will implement it.
    - This allows swapping to a live API without schema changes.

    AVOID: Deleting institutions from the portal if they disappear from the sync file.
      Mark them as sync_status = MISSING and alert. A human decides what to do.
    AVOID: Importing personal data of individuals beyond the institution contact email
      and authorized signatory name — these are required for notifications.
  </action>
  <verify>
    Import a 100-record test file → institution table has 100 rows; sync_log shows 100 inserted.
    Run the same import again → sync_log shows 100 skipped (idempotent).
    Modify 5 records in the file → sync_log shows 5 updated; entity_history has new rows for name changes.
    Corrupt one record → dead-letter table has 1 row; alert fires; import completes the remaining 99.
    Remove the import file → alert fires within 5 min of the scheduled job time.
  </verify>
  <done>Sync job idempotent; 100-record import verified; dead-letter and alert confirmed.</done>
</task>

<task type="auto">
  <name>Entity name history and officer-confirmed alias</name>
  <files>backend/institution/entity_history/</files>
  <action>
    When an institution's trust/society/company name changes (e.g., a rename or merger):
    - The old name must remain searchable and must match historical FDR documents.
    - Officers must be able to confirm an alias (e.g., "ABC Trust" is now "XYZ Society").

    Implementation:
    - entity_history table (already in schema): institution_id, trust_name, registration_no,
      effective_from, effective_to, confirmed_by, confirmed_at.
    - On each sync import: if institution.name differs from the most recent entity_history row,
      close the previous row (set effective_to = today - 1) and insert a new row.
    - The new row starts in status UNCONFIRMED; rule R6 (depositor name mismatch) is raised
      until an officer confirms the alias.
    - Officer confirmation: updates confirmed_by and confirmed_at; closes the R6 discrepancy.

    API endpoints (added to the institution module):
    - GET /institutions/{id}/entity-history — list all name history for an institution
    - POST /institutions/{id}/entity-history/{historyId}/confirm — officer confirms an alias
      (requires regional_verifier or bureau_officer role; writes audit event)

    AVOID: Auto-confirming name changes — a human must always review an alias.
    AVOID: Making old names unsearchable — they must still appear in case history.
  </action>
  <verify>
    Sync imports institution "ABC Trust" → entity_history has one CONFIRMED row.
    Next sync has "XYZ Society" for the same aicte_id → entity_history has second UNCONFIRMED row.
    R6 discrepancy is raised on any instrument version that references "ABC Trust" name.
    Officer confirms alias → R6 discrepancy closed; audit event written.
    Search for "ABC Trust" → still finds the institution.
  </verify>
  <done>Entity history tracks name changes; alias confirmation flow verified; old names searchable.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] 100-record sync import: idempotent; dead-letter on bad record; alert on missing file
- [ ] Entity name history: old names searchable; R6 raised on mismatch; officer confirmation writes audit event
- [ ] Sync_log records every import with counts
- [ ] API stub pattern: FileImportAdapter implements InstitutionSyncApiAdapter interface
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
- [ ] Phase 1 complete — Phase 2 (Registry + Vault) fully unblocked
</success_criteria>
