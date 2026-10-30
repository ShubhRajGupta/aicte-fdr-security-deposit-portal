---
name: gsd
description: Master spec-driven development, context engineering, and phased execution framework (GSD) for Antigravity. Use when the user asks to "Get Shit Done", use "GSD", plan/execute/verify phases, or run structured AI-led engineering workflows (/new-project, /plan, /execute, /verify, /resume, /progress).
---

# Get Shit Done (GSD) for Google Antigravity

> **Stop vibecoding. Start shipping.**
> GSD is the spec-driven development and context-engineering layer for Google Antigravity.

---

## 1. Core Philosophy

1. **Spec Before Code**: Never write code without an approved spec and phase plan.
2. **Atomic Commits**: One task = one commit. Never combine unrelated changes.
3. **Goal-Backward Verification**: Derive requirements from the final user outcome, not from implementation convenience.
4. **Empirical Evidence**: A task is never done until proven with tests, screenshots, or executed command logs.
5. **Fresh Context Execution**: Keep tasks focused (2-3 per plan) to eliminate context degradation and hallucinations.

---

## 2. GSD Workflow Lifecycle

```
Phase 0: Discovery ──────> Phase 1: Planning ──────> Phase 2: Execution ──────> Phase 3: Verification
  /new-project               /plan <phase>             /execute <phase>            /verify <phase>
  /discuss-phase             Goal-backward             Atomic commits              Empirical proof
  /research-phase            Dependency waves          Subagent isolation          Screenshots & tests
```

### Typical Session
```bash
/resume              # Load session state from .gsd/STATE.md
/progress            # Inspect current roadmap milestones & phase status
/discuss-phase <N>   # Clarify user expectations before planning
/plan <N>            # Decompose phase into 2-3 atomic tasks with verification criteria
/execute <N>         # Implement code changes with task-by-task commits
/verify <N>          # Validate against acceptance criteria with empirical proof
/complete-milestone  # Archive milestone upon full phase completion
```

---

## 3. Slash Commands Catalog (27 Commands)

| Category | Commands |
|----------|----------|
| **Project Setup** | `/new-project`, `/new-milestone`, `/complete-milestone`, `/audit-milestone`, `/install` |
| **Phase Management** | `/add-phase`, `/insert-phase`, `/remove-phase`, `/discuss-phase`, `/research-phase`, `/list-phase-assumptions` |
| **Planning & Execution** | `/plan`, `/plan-milestone-gaps`, `/execute`, `/verify`, `/sprint`, `/map` |
| **Session Control** | `/resume`, `/progress`, `/pause`, `/debug`, `/add-todo`, `/check-todos` |
| **System & Reference** | `/help`, `/whats-new`, `/update`, `/web-search` |

---

## 4. GSD Specialized Sub-Skills

This installation includes 12 specialized GSD skills available in the environment:

1. **`planner`**: Decomposes phases into atomic tasks, plans execution waves, and builds dependency trees.
2. **`executor`**: Executes tasks with strict atomic commits and fresh context discipline.
3. **`verifier`**: Validates outcomes against goal-backward criteria with empirical proof.
4. **`debugger`**: Systematic root-cause debugging with hypothesis testing and minimal-repro steps.
5. **`plan-checker`**: Audits plans for gaps, missing dependencies, or unverified assumptions.
6. **`empirical-validation`**: Captures real-world evidence (tests, DOM/browser screenshots, logs).
7. **`codebase-mapper`**: Scans and diagrams project architecture and component linkages.
8. **`subagent-delegation`**: Uses Antigravity's `invoke_subagent` to isolate context-heavy workflows.
9. **`context-fetch`**: Targeted, token-efficient extraction of codebase segments.
10. **`context-compressor`**: Distills long transcripts into concise state checkpoints.
11. **`context-health-monitor`**: Detects context rot, repetition, and hallucination indicators.
12. **`token-budget`**: Monitors token usage and enforces concise communication invariants.

---

## 5. State Files & Directory Layout

Every GSD workspace maintains:
- `.gsd/SPEC.md` — Project specification, core requirements, non-goals.
- `.gsd/ROADMAP.md` — Milestones, phases, status tracking.
- `.gsd/STATE.md` — Current active phase, open decisions, next immediate steps.
- `.gsd/ARCHITECTURE.md` — Component architecture and dependency graph.
- `.gsd/STACK.md` — Technology choices and toolchain inventory.
- `.gsd/DECISIONS.md` — Architectural Decision Records (ADRs).
- `PROJECT_RULES.md` — Single source of truth for repository coding standards.
- `GSD-STYLE.md` — Code style and UI/UX conventions.
