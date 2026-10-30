# Research playbook: approach, maturity and actual reality

## Search order
1. Official SIH problem statement and organization issuing it (for metadata/constraints, not to fill slides with paraphrase).
2. Official workflow documents, technical policies, annual reports, operational SOPs, public dashboards, audits, public data and API/specification docs.
3. Current deployed services and existing manual workflows; record their actual capability and gaps.
4. Primary papers, established conference/journal papers, standards and reproducible benchmark studies.
5. Maintained open-source implementations, issues/release notes and API docs relevant to integration feasibility.
6. Original datasets, dictionary/schema, licensing, missingness, representativeness and update cadence.
7. Direct field interviews/observations only if genuinely conducted, consented and accurately represented.

## Research questions
- What does an actual user/operator currently do, in what environment and with which constraints?
- Which observed fact should change the technical design? Connectivity, language, latency, devices, staff, power, data quality, maintenance, accessibility, institutional approval?
- What alternatives exist and have they been tested in the relevant context?
- What is the precise evidence-backed gap, not a generic claim of “no solution”?
- Which data and permissions are actually accessible to this team during a hackathon?
- Which module is the riskiest and what smallest experiment would falsify the key assumption?
- What will count as success or failure? Baseline, sample, metric, unit, threshold and timeframe?
- What is the current maturity of each module and what artifact supports that status?
- What happens when connectivity/data/API/model/device/operator is unavailable or wrong?
- Who approves use, pays/maintains the solution, trains people, handles complaints and responds to failure?

## Ground-reality mapping
Keep a row per design decision:
`Observed reality/source | date/place/context | constraint | proposed response | component | test | evidence status | limitation`.

Direct field evidence is powerful but not mandatory when unavailable. Official records and existing workflow evidence can support design; label them clearly as documentary evidence. Mark field validation as pending rather than fabricate it.

## Alternatives matrix
`Alternative | actual capability | deployment/context | evidenced limitation | proposed difference | source | confidence`.
Include manual workflows, government/industry tools, commercial products, open-source methods and research baselines where relevant. Do not select straw-man alternatives.

## Evidence ledger
`ID | exact claim | title | author/publisher | publication date | URL/DOI | accessed date | evidence summary | confidence | slide | limitation/caveat`.

## Source quality
- **Tier 1:** official PS owner/government/standard, primary research, original dataset, original benchmark, maintained project documentation.
- **Tier 2:** peer-reviewed review, trusted institutional report, reproducible technical evaluation.
- **Tier 3:** credible secondary industry reporting or vendor material; disclose potential bias.
- **Discovery only:** search snippets, social posts, unsourced blogs and AI summaries; not adequate as the sole support for critical claims.

## Citation mechanics
- Numeric markers `[1]`, `[2]`, etc. next to claims on **every** slide.
- Full bibliographic entries on slide 6.
- Keep a `slide_sources` mapping so every marker has one source entry and no source is dead or irrelevant.
- Cite external visuals, datasets, code frameworks, standards, numbers and method comparisons.
- Check publication metadata and source supports exactly the claim, not merely a similar topic.
- If sources conflict, report the difference; prefer current primary evidence and state the date/context.
- Do not claim to have read paywalled full text when only the abstract/metadata was available.
- Never make up DOIs, titles, authors, publication dates, fieldwork or statistics.

## Claim status labels
Use `[MEASURED]`, `[TARGET]`, `[ESTIMATE]`, `[ASSUMPTION]`, `[PLANNED]` or `[DEMONSTRATED]` in working material; use concise equivalents on the slide where needed. Remove unsupported claims rather than hiding them in footnotes.
