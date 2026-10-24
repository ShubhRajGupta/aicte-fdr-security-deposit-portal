---
phase: 6
plan: 2
wave: 1
depends_on: [5.2, 6.1]
files_modified:
  - docs/security/threat-model.md
  - docs/security/asvs-checklist.md
  - docs/security/pentest-report-internal.md
  - docs/security/audit-clearance.md
  - docs/dpdp/data-map.md
  - docs/dpdp/breach-runbook.md
autonomous: false
user_setup:
  - service: CERT-In Empanelled Security Auditor
    why: "GIGW 3.0 §5.3.1: go-live blocked without clearance certificate"
    action: "Book audit slot (target Weeks 21–25). Freeze staging URL. Create test accounts for all 10 roles. Provide network access from auditor's IP."
  - service: AICTE Legal
    why: "DPDP Act 2023 stance confirmation"
    action: "Confirm whether AICTE is covered or exempt under DPDP for this data. Confirm retention periods."

must_haves:
  truths:
    - "Internal pentest (Week 20) finds no open HIGH or CRITICAL findings"
    - "All role-matrix negative tests pass (T05–T08): no privilege escalation, no cross-institution access"
    - "Independent CERT-In empanelled audit clearance certificate issued"
    - "All findings from the independent audit are remediated and re-tested"
    - "DPDP data map is complete; breach runbook is exercised"
    - "OWASP ASVS Level 2 checklist completed with no unaccepted HIGH items"
  artifacts:
    - "docs/security/threat-model.md: STRIDE threat model"
    - "docs/security/asvs-checklist.md: ASVS L2 results per release"
    - "docs/security/audit-clearance.md: signed clearance certificate from the auditor"
    - "docs/dpdp/data-map.md: personal data inventory, retention schedules"
    - "docs/dpdp/breach-runbook.md: step-by-step breach response with CERT-In and DPB timelines"
---

# Plan 6.2: Security Audit & Penetration Testing

<objective>
Clear the security audit that gates production go-live.
This is not an optional quality step — it is a legal and hosting requirement (GIGW 3.0 §5.3.1).
Output: Clearance certificate; all findings remediated; DPDP readiness confirmed.
</objective>

<context>
Load for context:
- .gsd/SPEC.md (Section 5: security design; Section 12: security engineering; non-negotiable #9)
- .gsd/decisions/DECISIONS.md (D10: auditor and audit window)
- docs/security/threat-model.md (written in Phase 1)
- PROJECT_RULES.md (security rules)
</context>

<tasks>

<task type="auto">
  <name>Internal penetration test and ASVS L2 checklist (Week 20)</name>
  <files>docs/security/pentest-report-internal.md, docs/security/asvs-checklist.md</files>
  <action>
    Assign someone NOT on the build team to run the internal pentest.
    Focus areas (these have been correctness-critical throughout):

    Authentication + session management:
    - Attempt login without OTP → must fail
    - Session fixation: log in with a known session ID → must fail
    - PKCE bypass: attempt auth code flow without code_verifier → must fail
    - Check HttpOnly and SameSite=Strict on all cookies
    - Idle timeout: officer session active after 16 min of idle → must expire

    Authorisation (role-matrix negative tests):
    - T05: institution A requests instrument of institution B → 404 (not 403, not 500)
    - T06: regional officer queries another region's case (application auth bypassed) → DB RLS denies
    - T07: pooled connection reused by different users → no scope leakage (Spike S1 re-run on production build)
    - T08: officer tries to approve a case they initiated → blocked in code AND DB constraint

    Document pipeline:
    - T09: upload EICAR test file → rejected; quarantined; alert raised
    - T10: upload PDF with embedded JavaScript → rejected or sanitised; never served as uploaded
    - Upload a file > 10 MB → rejected with helpful error

    API security:
    - All endpoints: missing auth → 401
    - CSRF: POST without CSRF token → rejected
    - Mass assignment: include unexpected fields in POST body → ignored; no error 500
    - SQL injection: inject in all string parameters (automated + manual)
    - XXE: if any XML parsing exists → confirm disabled
    - Rate limiting: /api/v1/public/noc/{code} → rate limited at 10 req/min per IP

    ZAP automated scan on staging:
    - Run OWASP ZAP full scan on staging
    - All HIGH alerts must have a remediation plan

    ASVS L2 checklist:
    - Complete the full OWASP ASVS Level 2 checklist
    - Mark each item: PASS / FAIL / N/A with evidence
    - For each FAIL: create a tracked issue with severity and due date

    AVOID: Skipping the DB-level tests (T06) — application auth can be bypassed; only RLS cannot.
    AVOID: Running the pentest on production — staging only.
  </action>
  <verify>
    Pentest report: no open HIGH or CRITICAL findings.
    T05–T08, T09, T10 all pass.
    ZAP scan: no unaddressed HIGH alerts.
    ASVS checklist: all items assessed; no unaccepted HIGH fails.
  </verify>
  <done>Internal pentest report signed; ASVS checklist complete; all HIGH findings remediated before external audit.</done>
</task>

<task type="checkpoint:human-action">
  <name>Independent CERT-In empanelled audit (Weeks 21–25)</name>
  <files>docs/security/audit-clearance.md</files>
  <action>
    Coordinate the external audit:

    Pre-audit preparation:
    - Freeze the staging environment: no deploys during the audit window
    - Create test accounts for all 10 roles with realistic seeded data
    - Provide the auditor with: threat model, ASVS checklist, API spec (OpenAPI 3.1), data model, network diagram
    - Confirm network access from the auditor's IP to the staging environment
    - Brief the auditor on the security architecture (BFF, RLS, audit chain, document pipeline)

    During audit:
    - Assign a technical contact who can answer auditor questions within 2 hours
    - Track all findings in the issue tracker as they come in
    - Begin triaging and fixing HIGH and CRITICAL findings immediately — do not wait for the final report

    After the audit report:
    - For each finding: remediate, test the fix, document the fix
    - Request a re-test of all HIGH and CRITICAL findings
    - Obtain the clearance certificate (safe-to-host certificate)

    Record in docs/security/audit-clearance.md:
    - Auditor name and CERT-In empanelment number
    - Audit dates
    - Number of findings by severity (CRITICAL, HIGH, MEDIUM, LOW, INFO)
    - Re-test date(s)
    - Clearance certificate reference number and date

    AVOID: Treating the audit as a checkbox. The auditor will find things; plan for at least one re-test cycle.
    AVOID: Deploying any new feature to staging during the audit window.
  </action>
  <verify>
    Clearance certificate received from the auditor.
    All CRITICAL and HIGH findings: remediated, re-tested, and marked PASS in the auditor's re-test report.
    docs/security/audit-clearance.md: complete with certificate reference.
  </verify>
  <done>Clearance certificate received; all HIGH findings closed; production hosting approved by host.</done>
</task>

<task type="auto">
  <name>DPDP readiness: data map and breach runbook</name>
  <files>docs/dpdp/data-map.md, docs/dpdp/breach-runbook.md</files>
  <action>
    Data map (docs/dpdp/data-map.md):
    - List every category of personal data the system holds:
      * Institution authorised signatory: name, designation, official email, phone
      * Officers: name, role, region, login activity
      * (No beneficiary personal data beyond institution-level: confirm with Legal)
    - For each category: purpose, legal basis, retention period, who can access, where stored, how encrypted
    - Confirm retention periods (decision D7): documents 8 years; logs 1 year minimum; implement as configuration, not hard-code
    - Identify data not needed and confirm it is not collected (data minimisation)

    Breach runbook (docs/dpdp/breach-runbook.md):
    Incident response steps if a personal data breach is detected:
    1. Detection: who, how (monitoring alerts, user report, auditor finding)
    2. Containment: isolate affected system, revoke compromised credentials
    3. Assessment: what data, how many individuals, how exposed
    4. CERT-In notification (within 6 hours of detection per CERT-In Directions 2022)
    5. Data Protection Board notification (within 72 hours if substantive duties apply post May 2027)
    6. Individual notification (if required by DPB or DPDP Rules)
    7. Remediation and postmortem

    Named owners for each step; 24/7 contact numbers; CERT-In submission URL and format.

    Exercise the runbook: conduct a tabletop exercise with the incident commander, security officer, and AICTE liaison.
    Document the exercise outcome and any gaps found.

    AVOID: Relying on a legal exemption from DPDP without a written Legal opinion — build to the stricter standard.
  </action>
  <verify>
    Data map: reviewed by Legal; no personal data collected beyond what is listed.
    Breach runbook: tabletop exercise completed; all steps walkable; no step has "TBD" or "someone."
    Retention configuration: documents and logs are deleted (or archived) on schedule.
  </verify>
  <done>Data map reviewed; breach runbook exercised; retention schedule in configuration and tested.</done>
</task>

</tasks>

<verification>
After all tasks:
- [ ] Internal pentest: no open HIGH findings; T05–T08 pass
- [ ] ASVS L2 checklist: complete; no unaccepted HIGH fails
- [ ] External audit: clearance certificate received
- [ ] All audit HIGH and CRITICAL findings: remediated and re-tested
- [ ] DPDP: data map complete; breach runbook exercised
</verification>

<success_criteria>
- [ ] All tasks verified
- [ ] Must-haves confirmed
- [ ] Clearance certificate in hand → production hosting approved
- [ ] Plan 6.3 (DR + Accessibility + SBOM) unblocked
</success_criteria>
