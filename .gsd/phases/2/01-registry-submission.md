---
phase: 2
plan: 1
wave: 1
depends_on: [1.3, 1.4]
files_modified:
  - backend/registry/
  - backend/rules/engine/
  - backend/registry/ifsc/
  - frontend/src/pages/instrument-add/
  - db/migrations/V006__ifsc_import.sql
autonomous: true

must_haves:
  truths:
    - "An institution can create an instrument draft, fill all fields, and submit it"
    - "Draft data is saved automatically (not lost on page reload)"
    - "Rules R1–R5 are evaluated automatically on submission"
    - "Each of R1–R5 seeded bad records produces the correct rule code"
    - "IFSC lookup fills bank name and branch from the RBI reference data"
    - "Submission produces a receipt with a reference number, delivered by email and SMS (or in-app fallback)"
    - "Duplicate FDR number under another institution triggers R4 and blocks acceptance"
  artifacts:
    - "backend/registry/: instrument and instrument_version CRUD; draft → submitted lifecycle"
    - "backend/rules/engine/: R1–R5 evaluated on submission"
    - "backend/registry/ifsc/: RBI IFSC import job + live lookup"
    - "frontend/src/pages/instrument-add/: guided form with draft save and inline validation"
---

# Plan 2.1: Instrument Registry & Submission Form

<objective>
Allow institutions to submit new FDR/deposit instruments, with automatic discrepancy checking.
Officers should see submitted instruments in their queue.

Purpose: The instrument is the central data entity. Without a working submission flow,
no verification, timeline, or release work is possible.
Output: Working submission flow end-to-end; R1–R5 rules evaluated; receipt issued.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (Section 8.1: data model; Section 6.6: discrepancy rules R1–R5; instrument lifecycle)
- .gsd/rules/aph-2024-27.yaml (rule amounts and validity periods for R1 evaluation)
- .gsd/phases/1/03-schema-rls-audit.md (schema decisions)
- PROJECT_RULES.md (NUMERIC types; no hard-coded amounts; idempotency key on creates)
</context>

<tasks>

<task type="auto">
  <name>Instrument CRUD API + IFSC import</name>
  <files>backend/registry/, backend/registry/ifsc/, db/migrations/V006__ifsc_import.sql</files>
  <action>
    REST API (versioned at /api/v1; errors use RFC 9457 problem details):

    POST /api/v1/instruments
    - Creates an instrument in DRAFT status
    - Accepts: institution_id (from RLS scope), type (FDR/BG/ONLINE/RTGS)
    - Requires Idempotency-Key header; duplicate keys return 200 with the existing resource
    - Writes audit event: INSTRUMENT_DRAFT_CREATED

    PUT /api/v1/instruments/{id}/draft
    - Updates the draft instrument_version fields
    - Validates live: IFSC lookup, date consistency, amount format
    - Returns validation errors as RFC 9457 with field-level detail
    - Auto-saves: client can call this on every field change; it is idempotent

    POST /api/v1/instruments/{id}/submit
    - Role: institution_signatory only
    - Requires OTP confirmation (declaration step)
    - Runs rules R1–R5 synchronously; writes discrepancy records for each failing rule
    - Transitions status: DRAFT → SUBMITTED (or → SUBMITTED_WITH_DISCREPANCIES)
    - Creates a case of type SCRUTINY
    - Writes audit event: INSTRUMENT_SUBMITTED
    - Issues receipt (reference number = date prefix + UUID last 8 chars)
    - Adds receipt dispatch to outbox (SMS + email; fallback to in-app)

    IFSC import job (Quartz, weekly):
    - Downloads the RBI IFSC master file from an approved source (or a static file from AICTE IT)
    - Upserts into ifsc_ref table: ifsc_code, bank_name, branch_name, address, city, state, active
    - Idempotent: same file → no changes

    IFSC lookup endpoint:
    GET /api/v1/ref/ifsc/{code} → {bank_name, branch_name, city} or 404

    R1 evaluation:
    - Load the rule_set with aph_edition matching the institution's applicable year
    - Compute required_amount based on institution type and approved programmes
    - Compare with amount_principal; flag R1 if the difference exceeds tolerance

    R4 duplicate check:
    - On submit: query for any ACTIVE or ACCEPTED instrument_version where bank_code = submitted bank_code
      AND number_normalised = submitted normalised number AND institution_id != this institution
    - If found: raise R4; create a DUPLICATE_REVIEW case; block the instrument from ACCEPTED status

    AVOID: Hard-coding any amount threshold — read from rule_set table.
    AVOID: Accepting the instrument automatically if all rules pass — an officer must still check.
    AVOID: Putting institution_id in the request body — derive it from the RLS session context.
  </action>
  <verify>
    T12: same FDR number submitted by institution A and B → R4 raised on B's submission.
    T13: submit with amount below required → R1 raised with the computed requirement shown.
    IFSC lookup: known good IFSC → returns bank and branch name; unknown IFSC → 404 + R5 raised.
    Idempotency: POST /instruments with same key twice → same response, one instrument created.
    Submit without OTP confirmation → 403.
  </verify>
  <done>R1–R5 evaluation verified with seeded bad records; IFSC lookup working; duplicate check working.</done>
</task>

<task type="auto">
  <name>Institution submission form (React)</name>
  <files>frontend/src/pages/instrument-add/</files>
  <action>
    Guided multi-step form for instrument submission.

    Step 1: Instrument type selector (FDR / BG / Online / RTGS based on D3 decision).
    Step 2: Required amount display — computed from rule_set and shown with source clause.
    Step 3: Instrument details:
    - IFSC field: on blur, calls GET /ref/ifsc/{code} and fills bank name + branch (do not let user type bank name manually if IFSC is known)
    - Issue date, maturity date: calendar pickers showing dates in "24 Oct 2026" format with days remaining
    - Amount (NUMERIC field; no scientific notation; currency formatting for display only)
    - Beneficiary and lien flag (required; shows warning if lien not in favour of AICTE)
    Step 4: Document upload (links to Plan 2.2 upload component).
    Step 5: Declaration and OTP confirmation. Summary of all entered data. "Edit" links back to each step.
    Step 6: Receipt page showing reference number + next steps timeline.

    Draft saving:
    - Calls PUT /instruments/{id}/draft on every field change (debounced 2 s)
    - On page load: if a draft exists for this user, offers to resume
    - Draft saved indicator in the UI

    Inline validation:
    - Errors name the field and the fix, never a code alone
    - Show computed requirement with source clause for context

    Accessibility:
    - WCAG 2.1 AA
    - Form works with keyboard only
    - Error messages linked to fields via aria-describedby
    - Works at 200% zoom

    AVOID: Pop-up dialogs that may be blocked.
    AVOID: Flash or plugin-based upload components.
    AVOID: Showing another institution's requirement or data (RLS + scope from session-info endpoint).
  </action>
  <verify>
    Institution clerk completes the form end-to-end in < 15 min (timed with a test user).
    Draft survives a page reload.
    IFSC fills bank name on blur.
    Invalid amount shows inline error naming the field and the computed requirement.
    axe-core reports zero critical accessibility violations.
    Form works at 200% zoom.
  </verify>
  <done>Form end-to-end flow verified; draft save confirmed; IFSC autofill confirmed; accessibility check passes.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] T12: duplicate FDR → R4 raised
- [ ] T13: wrong amount → R1 raised with computed requirement
- [ ] R2–R5: each seeded bad record triggers the correct code
- [ ] Draft save: survives page reload
- [ ] IFSC lookup: fills bank/branch; mismatch raises R5
- [ ] Receipt issued on submission
- [ ] axe-core: zero critical issues
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
- [ ] Plan 2.2 (Document Vault) can begin in parallel; Plan 2.3 (Search) after both 2.1 and 2.2
</success_criteria>
