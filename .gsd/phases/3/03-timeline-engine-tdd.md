---
phase: 3
plan: 3
wave: 2
depends_on: [3.1, 0.2]
files_modified:
  - backend/timeline/
  - backend/timeline/TimelineEngine.java
  - backend/timeline/DateCalculator.java
  - backend/timeline/TimelineJob.java
  - db/migrations/V012__timeline_indexes.sql
type: tdd
autonomous: true

must_haves:
  truths:
    - "Nightly timeline pass runs in < 2 minutes for 100,000 instruments (set-based SQL)"
    - "T01: Issue date 31 Jan, tenor 1 month → maturity follows configured month-end rule in both leap and non-leap years"
    - "T02: Maturity on a bank holiday → both the nominal date and next working day are stored; alert uses the earlier"
    - "T03: Timeline job down for 3 days, then restarts → no reminder missed, none duplicated"
    - "T04: Nightly job run twice → alert count unchanged (idempotent)"
    - "Spike S2 confirmed: property tests pass for 30-year date range"
    - "Every computed date stores the rule and inputs used (explainability requirement)"
    - "System clock is an injectable component; tests can jump forward years in milliseconds"
  artifacts:
    - "backend/timeline/DateCalculator.java: all calendar maths; no external calls; pure function"
    - "backend/timeline/TimelineEngine.java: set-based SQL nightly pass"
    - "backend/timeline/TimelineJob.java: Quartz job; idempotent; resumes from last run date"
    - "backend/timeline/TimelineEngineTest.java: property tests (jqwik); ≥ 80% mutation score"
---

# Plan 3.3: Timeline Engine (TDD)

<objective>
Build the timeline engine — the heart of the system. It answers for every instrument:
what is its status today, what must happen next, and by when?

This is correctness-critical. A wrong date = a missed reminder or a wrong release decision.
TDD is mandatory here: write tests first, make them pass, then refactor.

Purpose: The timeline engine drives queues, dashboards, reminders, and status badges.
Getting dates wrong is a financial and compliance failure.
Output: A proven, property-tested timeline engine with ≥ 80% mutation score.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (Section 5.5: timeline engine design)
- .gsd/spikes/S2-date-maths.md (the property test suite and approach that passed)
- .gsd/rules/aph-2024-27.yaml (reminder offsets, validity periods)
- PROJECT_RULES.md (date types; correctness-critical zone rules)
</context>

<tasks>

<task type="auto">
  <name>RED phase: write all failing property and unit tests</name>
  <files>
    backend/timeline/TimelineEngineTest.java
    backend/timeline/DateCalculatorTest.java
  </files>
  <action>
    Write the test suite BEFORE writing any implementation.
    All tests must FAIL at this stage (implementation does not exist).

    DateCalculatorTest (jqwik property tests):
    - @Property: for any issue_date in [2000-01-01, 2030-12-31] and tenor in [1, 60] months,
      computed maturity_date is always a valid calendar date in Asia/Kolkata.
    - @Property: maturity_date is never in UTC (verify no timezone shift).
    - @Example: issue 2024-01-31, tenor 1 month → maturity = 2024-02-29 (leap year month-end rule).
    - @Example: issue 2025-01-31, tenor 1 month → maturity = 2025-02-28 (non-leap year).
    - @Example: issue 2024-03-31, tenor 3 months → maturity = 2024-06-30.
    - @Property: maturity on a bank holiday → next_working_date > maturity_date AND
      next_working_date is in the holiday calendar.
    - @Example: maturity on 15 Aug (Independence Day) → next working day returned.

    TimelineEngineTest (unit tests):
    - T01: 31 Jan issue, 1-month tenor → correct maturity in both leap and non-leap year.
    - T02: maturity on bank holiday → nominal_date and next_working_date both stored; alert uses earlier.
    - T03: last_run_date = 3 days ago → instrument gets all 3 days of transitions without duplication.
    - T04: run engine twice on same day → instrument status unchanged; alert count unchanged.
    - Status transitions (each tested):
      ACTIVE → EXPIRING (at T-90 days before maturity)
      EXPIRING → RENEWAL_PENDING (at T-30 days)
      RENEWAL_PENDING → MATURED (if no renewal submitted by maturity_date)
    - Explainability: every status change stores the rule_code and input values used.
    - Clock injection: TimelineEngine accepts a Clock parameter; tests inject a fixed or advancing clock.

    AVOID: Using Thread.sleep() in tests. Inject the clock.
    AVOID: Writing tests that only check the happy path. The edge cases (leap year, month-end, holiday) are the point.
  </action>
  <verify>
    `./mvnw test -pl backend/timeline` → ALL tests FAIL (red phase confirmed).
    Test output shows "expected: computed maturity, but no implementation exists."
    Exactly the tests defined above exist in the test file.
  </verify>
  <done>Test suite written; all tests fail; RED phase confirmed.</done>
</task>

<task type="auto">
  <name>GREEN phase: implement DateCalculator and TimelineEngine</name>
  <files>
    backend/timeline/DateCalculator.java
    backend/timeline/TimelineEngine.java
    backend/timeline/TimelineJob.java
    db/migrations/V012__timeline_indexes.sql
  </files>
  <action>
    Implement the minimum code to make all tests pass.

    DateCalculator (pure functions; no external calls; no database access):
    - Use java.time.LocalDate with ZoneId.of("Asia/Kolkata") throughout.
    - Month-end rule: when adding months would land on a non-existent date (e.g. 31 Jan + 1 month),
      use the last day of the resulting month (2024-02-29 in a leap year, 2025-02-28 otherwise).
    - Bank holiday check: load the holiday calendar from the ref table; cache it for the run.
    - If maturity_date is a bank holiday: find the next business day (skip weekends and holidays).
    - All methods are static pure functions with no side effects.

    TimelineEngine (set-based SQL; no row-by-row loops):
    Write ONE SQL statement per transition type that updates all qualifying instruments in one pass:
    - ACTIVE → EXPIRING: UPDATE instrument_version SET status='EXPIRING', next_action_date = maturity_date,
      next_action_type = 'RENEWAL_OR_MATURITY' WHERE status='ACTIVE'
      AND maturity_date <= CURRENT_DATE + INTERVAL '90 days'
      AND maturity_date > CURRENT_DATE
    - EXPIRING → RENEWAL_PENDING: ...
    - RENEWAL_PENDING → MATURED: ...
    Each statement also writes an entry to the timeline_event table (status, rule_code, inputs used).

    Last-run tracking:
    - The job reads the last_successful_run_date from a job_state table.
    - If last_run was 3 days ago: run the engine for each of the 3 missed days in order.
    - This ensures T03: no transition is skipped after downtime.

    Idempotency:
    - timeline_event has a UNIQUE constraint on (instrument_version_id, status, effective_date).
    - If the engine runs twice for the same date, the second run's INSERT is a no-op.
    - T04 confirmed.

    V012 — Indexes:
    - instrument_version: partial index on (maturity_date) WHERE status IN ('ACTIVE', 'EXPIRING', 'RENEWAL_PENDING')
    - instrument_version: index on (next_action_date, status)
    - timeline_event: index on (instrument_version_id, effective_date)

    TimelineJob (Quartz, nightly, clustered JDBC):
    - Runs at 01:00 IST (configurable).
    - Calls TimelineEngine.runForDate(date, clock) for each date since last successful run.
    - On completion: updates last_successful_run_date.
    - On failure: writes to dead-letter table; fires critical alert.
    - Job is JDBC-clustered: only one node runs it even if two nodes are up.

    AVOID: Row-by-row loops in the SQL — use set-based UPDATE statements.
    AVOID: Using java.util.Date or java.util.Calendar.
    AVOID: Hardcoding reminder offsets — read from rule_set.parameters.
  </action>
  <verify>
    `./mvnw test -pl backend/timeline` → ALL tests PASS (green phase confirmed).
    T01, T02, T03, T04 all pass.
    Property tests pass for the full 30-year date range.
    Nightly pass performance test (100,000 synthetic instruments): completes in < 2 minutes.
  </verify>
  <done>All tests pass; GREEN phase confirmed; performance target met.</done>
</task>

<task type="auto">
  <name>REFACTOR phase: mutation testing, explainability, and clock injection</name>
  <files>
    backend/timeline/DateCalculator.java
    backend/timeline/TimelineEngine.java
    backend/timeline/TimelineEngineTest.java
  </files>
  <action>
    Run PIT mutation testing on the timeline module:
    - `./mvnw org.pitest:pitest-maven:mutationCoverage -pl backend/timeline`
    - Target: at least 80% mutants killed.
    - For any surviving mutant: add a test that kills it. Understand WHY the mutant survived.
    - Common survivors in date code: off-by-one on comparison operators (< vs <=).

    Verify explainability:
    - Every timeline_event row has: rule_code, input values (maturity_date, rule_set_id, evaluation_date), computed output.
    - Add an API endpoint: GET /api/v1/instruments/{id}/timeline-explanation
      → returns the history of status transitions with the rule and inputs used for each.

    Refactor for clarity:
    - Extract named constants for status transition names.
    - Add JavaDoc on the month-end rule explaining the exact algorithm.
    - No behaviour changes; all tests must still pass.

    Golden files:
    - Create test/resources/timeline_golden_cases.csv with 50 representative instruments
      spanning multiple APH editions, instrument types, and edge cases.
    - Add a parameterized test that reads the golden file and verifies the computed dates match.
    - This golden file is the regression baseline for future rule changes.
  </action>
  <verify>
    PIT mutation score ≥ 80% (printed in the Maven output).
    All original tests still pass after refactor.
    GET /instruments/{id}/timeline-explanation returns a list of transitions with rule and inputs.
    Golden file test: all 50 cases match expected dates.
  </verify>
  <done>Mutation score ≥ 80%; explainability API working; golden file tests pass; REFACTOR phase complete.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] T01: 31 Jan + 1 month → correct maturity (leap and non-leap)
- [ ] T02: holiday maturity → both dates stored; alert uses earlier
- [ ] T03: 3-day downtime → no missed transitions, no duplicates
- [ ] T04: double-run → idempotent
- [ ] Property tests: 0 failures over 30-year range
- [ ] Mutation score ≥ 80%
- [ ] Nightly pass < 2 min for 100,000 instruments
- [ ] Explainability: every transition stores rule + inputs
- [ ] Golden file: 50 cases correct
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
- [ ] Plan 3.4 (Alert Service) unblocked
</success_criteria>
