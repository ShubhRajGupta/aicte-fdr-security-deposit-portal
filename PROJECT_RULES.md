# PROJECT RULES — AICTE FDR Portal (PSID 26265)

> These rules are invariants. They apply to every plan, every commit, every release.
> If a situation seems to require an exception, that is a signal to raise it with the tech lead, not to proceed anyway.

---

## Planning Rules

1. **No implementation without an approved plan.** Every feature has a PLAN.md first.
2. **Plans are prompts.** PLAN.md is not documentation — it is the instruction set for execution.
3. **2–3 tasks per plan maximum.** Larger scope → split into multiple plans.
4. **No plan modifies more than 5 files per task.** More files = split the task.
5. **Same-wave plans must not touch the same files.** Resolve at planning time.
6. **Spikes close before their dependent phases begin.** No assumptions about spike results.
7. **Rules are data, never code.** Any APH threshold, deadline, or amount lives in the rule_set table, versioned by APH edition. Raise a blocker if tempted to hard-code.

---

## Branching & Commit Rules

1. Trunk-based development. Feature branches live under **2 days**.
2. Pull requests ≤ **400 changed lines**. Split if larger.
3. Authors never merge their own PRs.
4. **CODEOWNERS enforced:** rules engine, timeline, authorisation, audit, and migrations require **2 reviewers**. Everything else requires 1.
5. Commit message format: `type(module): short description` (e.g., `feat(timeline): add next-action-date computation`)

---

## Definition of Done (per task/PR)

A task is done when ALL of the following are true:
- [ ] Code written and tests pass
- [ ] Audit event written for every state change (in same DB transaction)
- [ ] Accessibility check done (if UI change)
- [ ] Feature flag added (new features default OFF)
- [ ] Runbook note updated if operational behaviour changed
- [ ] PR template fully filled

---

## Database Rules

1. **Expand-and-contract migrations only.** Add new structure, deploy code that writes both, backfill, switch reads, remove old structure a release later.
2. Every migration tested on a **production-size copy** before release.
3. Every migration has a **rollback script**.
4. Flyway manages all migrations. No hand edits in production.
5. **No UPDATE or DELETE on accepted instrument versions or audit.event.** DB triggers enforce this.
6. Money: **NUMERIC(18,2)** only. Never float, never string.
7. Calendar dates: **DATE type in Asia/Kolkata**. Event times: **TIMESTAMPTZ stored in UTC, displayed in IST**. Never convert a maturity date through UTC.
8. **SET LOCAL for RLS context, inside the transaction only.** Never SET (session-level) in a pooled connection.

---

## Security Rules

1. **No secrets in source code or container images.** Injected from vault at deploy time.
2. Secret scanning runs in pre-commit hook AND CI. Fails the build.
3. No dependency release younger than **14 days** in production.
4. No abandoned packages. Licence scan on every build.
5. Container images: minimal base, non-root, read-only filesystem, signed.
6. **No custom cryptography.** Use platform libraries and the KMS.
7. TLS 1.2 minimum (1.3 preferred) everywhere.
8. Admin console for Keycloak never exposed publicly.
9. Documents served only through **short-lived signed links** (expiry in minutes), never directly.
10. Every outbound call has: timeout, retry with jitter, circuit breaker, bulkhead (Resilience4j), and a degraded-mode fallback.

---

## Infrastructure Rules

1. Everything as code (Terraform / Ansible). No hand edits in production.
2. Drift check runs after every deploy.
3. All environments (dev, test, staging, prod, DR) provisioned from the same IaC.
4. Production access: named accounts, session recording, no shared logins, requires approval.

---

## Release Rules

1. **Seasonal freeze: 1 March – 31 July.** Only critical fixes; second approver required.
2. Readiness review every February before the freeze.
3. All pipeline stages green on the exact artefact being released.
4. SBOM (CycloneDX) + VEX notes generated for every release.
5. Release checklist signed by QA lead, security lead, and product owner.
6. Feature flags set: new features OFF by default.
7. Rollback plan written and rollback script tested before deploy.
8. **Rule-set changes** must be simulated and approved by the rule owner before activation — even in hotfixes.

---

## Correctness-Critical Zones

Any PR touching these zones requires an **ADR** if it changes a design boundary:

| Zone | Extra requirement |
|------|-------------------|
| Date & tenor maths | Property-based tests (jqwik); 100% branch coverage; mutation score ≥ 80% |
| Rule evaluation | Simulation diffs reviewed before activation |
| Authorisation + RLS | Negative tests for every role/endpoint; DB-level tests bypassing app code |
| Money & ledger | Exact decimals; reconciliation tests |
| Audit chain | Chain verification job; tamper test; external checkpoint |
| Notification sending | Dry-run mode; rate cap; kill switch; recipient preview |

---

## ADR Rule

Any change to:
- module boundaries
- third-party libraries
- data model (beyond add-column)
- authentication/authorisation flow
- external integration

...requires a written ADR before the PR is merged.
