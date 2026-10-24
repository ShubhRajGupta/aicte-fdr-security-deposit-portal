---
phase: 0
plan: 1
wave: 1
depends_on: []
files_modified:
  - .gsd/rules/aph-2024-27.yaml
  - .gsd/data-profile/source-inventory.md
  - .gsd/decisions/DECISIONS.md
autonomous: false
user_setup:
  - service: AICTE Bureau
    why: "APH 2024-27 clause review and sign-off"
    action: "Provide APH 2024-27 document; confirm rule amounts, validity periods, deadlines, release conditions"
  - service: AICTE IT
    why: "Hosting decision + audit slot booking"
    action: "Confirm D1 (standalone vs extend), D2 (hosting platform), JDK 25 support, auditor availability"
  - service: AICTE Accounts/Bureau
    why: "Legacy data inventory"
    action: "Share all current FDR registers (Excel, regional files, portal extracts) with approximate record counts"

must_haves:
  truths:
    - "Decisions D1–D5 are confirmed in writing in DECISIONS.md"
    - "APH 2024-27 rule set is captured as structured YAML, reviewed by Bureau"
    - "All current data sources are inventoried with counts, columns, quality notes"
    - "Security audit slot is booked (target: Weeks 21–25)"
  artifacts:
    - ".gsd/rules/aph-2024-27.yaml exists and is signed off by rule owner"
    - ".gsd/data-profile/source-inventory.md lists every source with row count and quality notes"
    - ".gsd/decisions/DECISIONS.md has entries D1–D5 with owner names and dates"
---

# Plan 0.1: Requirements & Rule Capture

<objective>
Capture every AICTE requirement as structured, verifiable data before any code is written.
Produce three outputs: the APH rule set, the data-source inventory, and the decision log.

Purpose: Every status, date, and amount in the system derives from the APH rule set.
If this is wrong or missing, every downstream calculation is wrong.
Output: Three signed documents that unlock Phase 1.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (non-negotiables, ADRs, decisions needed)
- AICTE APH 2024-27 (obtain from Bureau or aicte.gov.in)
- AICTE APH 2022-23 clause 7.51 (release procedure reference)
- Any existing Excel FDR registers provided by Bureau
</context>

<tasks>

<task type="checkpoint:human-action">
  <name>Obtain APH 2024-27 and clarify decision D1–D5</name>
  <files>.gsd/decisions/DECISIONS.md</files>
  <action>
    Schedule a meeting with Bureau head, AICTE IT liaison, and delivery manager.
    Questions to resolve:
    1. D1: Standalone portal OR extend existing approval portal? (Default: standalone)
    2. D2: Hosting platform? NIC / MeitY cloud / AICTE DC? JDK 25 supported?
    3. D3: Accepted instrument types? FDR only, or BG / RTGS / online payment too?
    4. D4: Competent authority + delegation matrix for release?
    5. D5: Rule owner who approves APH rule sets?
    Also: Book the security auditor for Weeks 21–25. This is the go-live gate.
    Record all answers with the name and date of the person who gave them.
    AVOID: Proceeding to Phase 1 without D1 and D2 confirmed in writing.
  </action>
  <verify>DECISIONS.md has an entry for each of D1–D5 with owner name, decision, and date.</verify>
  <done>All five decisions documented; security audit slot confirmed.</done>
</task>

<task type="auto">
  <name>Capture APH rule set as structured YAML</name>
  <files>.gsd/rules/aph-2024-27.yaml</files>
  <action>
    Working from APH 2024-27 document:
    Capture every rule as a structured record:
    - Instrument type (FDR, BG, etc.)
    - Applicable institution category (new, existing, government/private)
    - Required amount (formula or fixed; reference APH table/clause)
    - Minimum validity period
    - Submission deadlines (dates or relative offsets)
    - Release conditions (residency years, merger/closure rules)
    - Renewal rules (window, required notice)
    - APH edition identifier + effective_from date

    Also capture the APH 2022-23 rules as a separate entry (for historical case re-evaluation).

    YAML structure per rule:
    ```yaml
    - aph_edition: "2024-27"
      effective_from: "2024-04-01"
      rules:
        - id: "DEPOSIT_AMOUNT_NEW_PRIVATE"
          applies_to: { institution_type: "private", status: "new" }
          amount_formula: "..."
          validity_min_months: 60
          submission_deadline_offset_days: 0
          source_clause: "APH 2024-27, Table X.Y"
    ```

    AVOID: Hard-coding any threshold. Every number must come from the APH with a clause reference.
    AVOID: Assuming the 2022-23 rules still apply — confirm each with Bureau.
  </action>
  <verify>Bureau rule owner reviews the YAML and confirms it matches the handbook. Diff against 2022-23 rules noted.</verify>
  <done>aph-2024-27.yaml reviewed and signed by rule owner (name + date in a comment at top of file).</done>
</task>

<task type="checkpoint:human-action">
  <name>Inventory all current data sources</name>
  <files>.gsd/data-profile/source-inventory.md</files>
  <action>
    For each data source provided by AICTE (Excel files, portal DB tables, regional office files, scanned PDF registers):
    Record:
    - Source name and location
    - Format (Excel, CSV, DB table, scanned PDF)
    - Approximate row count
    - Date range of records
    - Key fields present (FDR number, bank, amount, issue date, maturity date, institution)
    - Known quality issues (blanks, format variants, duplicates, illegible scans)
    - Responsible officer for this source

    This is input to Spike S8 (data profiling) and Plan 7.1 (data migration).
    AVOID: Making assumptions about what the legacy data looks like.
    AVOID: Starting migration without this inventory signed off by Bureau.
  </action>
  <verify>source-inventory.md lists every source with all fields above; Bureau confirms it is complete.</verify>
  <done>Inventory signed by Bureau head. Spike S8 can begin.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] DECISIONS.md: D1–D5 all confirmed with owner names and dates
- [ ] aph-2024-27.yaml: signed off by rule owner
- [ ] source-inventory.md: signed by Bureau head
- [ ] Security audit slot booked for Weeks 21–25
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
- [ ] Spikes S1–S8 can begin (Plan 0.2 unblocked)
- [ ] Phase 1 can begin (Plans 1.1 and 1.2 unblocked)
</success_criteria>
