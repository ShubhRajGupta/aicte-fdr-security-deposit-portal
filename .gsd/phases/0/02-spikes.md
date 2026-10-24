---
phase: 0
plan: 2
wave: 2
depends_on: [0.1]
files_modified:
  - .gsd/spikes/S1-rls-scope-leak.md
  - .gsd/spikes/S2-date-maths.md
  - .gsd/spikes/S3-upload-pipeline.md
  - .gsd/spikes/S4-bff-login.md
  - .gsd/spikes/S5-dsc-signing.md
  - .gsd/spikes/S6-sfms-nesl.md
  - .gsd/spikes/S7-network-reach.md
  - .gsd/spikes/S8-legacy-data.md
autonomous: false

must_haves:
  truths:
    - "S1: 10,000 randomised requests produce zero RLS scope leaks"
    - "S2: Property tests over 30 years of date arithmetic pass (leap years, month-ends, bank holidays)"
    - "S3: 100 concurrent 10 MB uploads scanned and vaulted in < 60 seconds"
    - "S4: BFF login flow (login, refresh, logout, step-up) works in the host's network"
    - "S5: DSC signing confirmed feasible or explicitly deferred with a fallback documented"
    - "S6: SFMS/NeSL guarantee verification confirmed or explicitly deferred"
    - "S7: Written list of allowed outbound calls and proxies from the production network"
    - "S8: Profile report on legacy data: completeness %, duplicate count, format variants"
  artifacts:
    - "Each spike has a .gsd/spikes/SN-*.md with: question, approach, result, pass/fail, consequences"
---

# Plan 0.2: Spike Execution — Remove Unknowns First

<objective>
Run 8 time-boxed spikes to answer the engineering unknowns that would otherwise cause the most
expensive surprises later. All spikes must close before their dependent phases begin.

Purpose: A spike that fails changes the design. Running it early is free.
Running it late destroys a phase of work.
Output: 8 spike result documents in .gsd/spikes/.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (ADRs, non-negotiables)
- .gsd/decisions/DECISIONS.md (especially D1, D2 hosting decision)
- .gsd/data-profile/source-inventory.md (for S8)
</context>

<tasks>

<task type="auto">
  <name>Spike S1: RLS + Connection Pool Scope Leak</name>
  <files>.gsd/spikes/S1-rls-scope-leak.md</files>
  <action>
    Question: Does row-level security with PgBouncer/HikariCP ever carry one user's scope
    to another user's request?

    Approach:
    1. Stand up PostgreSQL with RLS policies that restrict rows to institution_id.
    2. Stand up HikariCP pool (and PgBouncer if the host requires it).
    3. Write a test that:
       - Runs 10,000 requests alternating between institution A and institution B user contexts.
       - Each request: SET LOCAL app.institution_id = X inside a transaction, query rows.
       - Asserts: institution A never sees institution B's rows, and vice versa.
    4. Confirm: SET LOCAL (not SET) is used — local scope resets at transaction end.
    5. Add a test that proves a pooled connection after a committed transaction has no leftover context.

    AVOID: Using SET (session-level) — this is the bug. Only SET LOCAL inside a transaction.
    AVOID: Closing the spike without a result document, even if it passes trivially.

    Pass criterion: Zero scope leaks in 10,000 randomised requests.
    Record: PostgreSQL version, pool config, exact test setup, result.
  </action>
  <verify>Test output shows 0 leaks. Result written to S1-rls-scope-leak.md.</verify>
  <done>S1 closed. Result documented. Plan 1.3 (RLS policies) is unblocked.</done>
</task>

<task type="auto">
  <name>Spike S2: Date Maths — Leap Years, Month-Ends, Bank Holidays</name>
  <files>.gsd/spikes/S2-date-maths.md</files>
  <action>
    Question: Is the date arithmetic correct across 30 years of edge cases?

    Approach:
    1. Define the date calculation rules from the APH (tenor maths, maturity date from issue date, month-end rule, 29 Feb handling).
    2. Write property-based tests (jqwik) covering:
       - Tenors ending on 31st of months with < 31 days
       - Issue dates on 29 Feb, 28 Feb, 31 Jan, 31 Mar
       - Maturity dates falling on bank holidays (RBI holiday calendar)
       - Reminders relative to maturity across a year boundary
       - All calculations in Asia/Kolkata — never UTC
    3. Run tests with date range 2000-01-01 to 2030-12-31.
    4. Record any failures and the corrected rule.

    AVOID: Converting maturity dates through UTC (causes off-by-one on DST-adjacent days).
    AVOID: Using java.util.Date or Calendar — use java.time with ZoneId.of("Asia/Kolkata").

    Pass criterion: All property tests pass for the full 30-year range.
    Record: Test cases, any failures found, corrected rules, Java time API chosen.
  </action>
  <verify>jqwik test suite reports 0 failures. Result written to S2-date-maths.md.</verify>
  <done>S2 closed. Timeline engine TDD (Plan 3.3) is unblocked.</done>
</task>

<task type="auto">
  <name>Spike S3: Upload Pipeline Peak Load</name>
  <files>.gsd/spikes/S3-upload-pipeline.md</files>
  <action>
    Question: Can the upload pipeline handle 100 concurrent 10 MB uploads, scanned and vaulted, in under 60 seconds?

    Approach:
    1. Stand up: quarantine bucket (S3-compatible), ClamAV daemon, vault bucket.
    2. Write a load test (k6 or a shell script with parallel curl) that simulates
       100 concurrent 10 MB file uploads.
    3. Measure: time from upload start to vault confirmation.
    4. Identify: bottleneck (ClamAV throughput? S3 write? network?).
    5. Tune ClamAV scan concurrency and bucket write settings.

    AVOID: Skipping ClamAV in the test (the real pipeline must include it).
    AVOID: Using a local file system instead of the S3-compatible store.

    Pass criterion: 100 concurrent 10 MB uploads scanned + vaulted in < 60 seconds.
    Record: Infrastructure config, throughput numbers, bottleneck found, tuning applied.
  </action>
  <verify>Load test output shows < 60 s wall clock for 100 concurrent uploads. Result written to S3-upload-pipeline.md.</verify>
  <done>S3 closed. Plan 2.2 (Document Vault) is unblocked.</done>
</task>

<task type="checkpoint:human-action">
  <name>Spikes S4–S8: Host-Dependent and External-Party Spikes</name>
  <files>
    .gsd/spikes/S4-bff-login.md
    .gsd/spikes/S5-dsc-signing.md
    .gsd/spikes/S6-sfms-nesl.md
    .gsd/spikes/S7-network-reach.md
    .gsd/spikes/S8-legacy-data.md
  </files>
  <action>
    These spikes require the host environment, AICTE IT, or bank cooperation.
    Assign an owner for each spike and run them in parallel as soon as access is available.

    S4 — BFF login flow in the host's network:
      Stand up Keycloak in the target environment.
      Test: login (OIDC code + PKCE), token refresh, logout, step-up (second factor).
      Confirm: tokens never appear in browser storage.
      Confirm: the host network allows the required Keycloak redirect URIs.
      Pass criterion: All four flows work end-to-end in the actual host environment.

    S5 — DSC signing from a browser:
      Test a sample document signing using the officer's Class 3 DSC USB token.
      Use a vendor-neutral browser signing utility (no Java applets).
      Pass criterion: Signed sample verifies in a standard PDF reader.
      If DSC is not available: document the OTP-only fallback and mark S5 as deferred.

    S6 — SFMS/NeSL bank guarantee verification:
      Confirm with AICTE Accounts whether bank guarantees are accepted.
      If yes: obtain SFMS sandbox credentials or a bank that will demonstrate the flow.
      Pass criterion: One real or sandbox SFMS/NeSL example end-to-end, OR a written statement
      from AICTE/the bank describing the expected message format.
      If FDR-only: mark S6 as deferred; bank confirmation is manual-with-evidence.

    S7 — Production network outbound reach:
      Ask AICTE IT: what can the production network reach without a proxy?
      Test from the staging environment: SMS gateway, email gateway, IFSC import URL, bank API URLs.
      Pass criterion: Written list of allowed outbound calls, proxy details, and required firewall rules.

    S8 — Legacy data quality:
      Import the sources inventoried in Plan 0.1 into a staging DB.
      Run profiling queries: completeness %, duplicate FDR numbers, date format variants, amount format variants, bank name variants, illegible or missing scans.
      Pass criterion: Profile report with numbers for each quality dimension, signed by Bureau.
      This directly informs the cleaning rules in Plan 7.1.

    AVOID: Closing any spike with "assume it works" — every spike needs a documented result.
    AVOID: Delaying S4 or S7 — they are on the critical path for Phase 1.
  </action>
  <verify>Each spike has a result document with: question, approach, result (pass/fail/deferred), consequences for the design.</verify>
  <done>All 8 spikes documented. Phase 1 is unblocked.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] S1: RLS scope leak test: 0 leaks
- [ ] S2: Date property tests: 0 failures over 30-year range
- [ ] S3: Upload pipeline: < 60 s for 100 concurrent 10 MB uploads
- [ ] S4: BFF login flow works in host network
- [ ] S5: DSC result documented (pass or deferred with fallback)
- [ ] S6: SFMS/NeSL result documented (pass or deferred)
- [ ] S7: Network reach list written and confirmed
- [ ] S8: Legacy data profile report signed by Bureau
</verification>

<success_criteria>
- [ ] All 8 spike result documents written
- [ ] Must-haves confirmed
- [ ] No spike result requires a design change that would break a confirmed ADR
- [ ] Phase 1 all plans unblocked
</success_criteria>
