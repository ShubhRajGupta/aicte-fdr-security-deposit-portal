---
name: sih-ppt-builder
description: Research, design, fill, and quality-check Smart India Hackathon presentations in the user's exact official PPTX template. Emphasizes approach, evidence, real-world validation, technical maturity, dense partitioned layouts, Arial, and a Hindi-word project acronym.
---

# SIH PPT Builder

## Mission
Produce a technically mature, evidence-backed, real-world-grounded SIH idea presentation. The deck is **not a retelling of the problem statement**: after the required title-page metadata, nearly all slide content must explain the team's approach, research, engineering decisions, evidence, maturity, feasibility, and effect on actual people and workflows.

Use the user's supplied former deck (`60427.pdf`) as a reference for information density and diagrams, and the hand-drawn partition sketch as a mandatory content-layout principle. Neither is a replacement for the current editable official PPTX.

## User-specific defaults
- **Registered team name:** `Phra Uma Thewi` (exact spelling; never split a word across lines).
- **Typeface:** Arial for all editable text.
- **Hierarchy:** clear H1/H2/body/caption roles; sizes below are target ranges, not permission to reshape the template.
- **Writing:** compact technical fragments and labels; no long prose blocks; avoid complete sentences except where a tiny piece of prose is essential for accuracy.
- **Density:** information-rich, not minimalist; use the available content region efficiently.
- **Layout:** every slide must have clear partitions inside the existing content area.
- **Visuals:** prefer meaningful real images/screenshots, original architecture diagrams, process diagrams and evidence-backed charts over decorative stock art.
- **Research focus:** implementation approach, field constraints, affected people/workflows, existing alternatives, validation evidence and maturity.
- **Citations:** numeric source marker on every slide, with full references on slide 6.
- **Project naming:** pronounceable Hindi/Sanskrit-origin word in Latin letters + full technical English expansion matching acronym letters in order.
- **Numbers:** number steps, modules, risks, table rows, workflows and metrics where this aids scanning. All metric figures must be sourced or labelled as targets/estimates.
- **No emoji characters**, including bullets/icons/captions/diagram labels.
- **Template:** do not redesign, resize, rebrand, reorder or replace the supplied official template.

Do not reuse the former deck's old team name `Contrast`, Team ID `60427`, PS ID `25230`, project name `TARANG`, or its percentages/results. Those are examples from a different submission. Populate current identifiers from current verified sources; keep unknown fields blank or `TBD`.

## Prime directives

### 1. Official template integrity
- Work from the exact, current, editable official SIH `.pptx` for the right edition and track.
- Preserve original slide count/order, page size, master, backgrounds, logo, footer, template title locations, page numbers, fixed shapes, and prescribed headings.
- Never create a replacement theme or rebuild the deck in Beamer/Canva/PptxGenJS when the submission requires the supplied template.
- Add content or visual assets only inside existing content areas/blank zones. Do not cover reserved top and bottom bands, logos, footer, or fixed text.
- Edit a copy. Keep an untouched original.
- An image/PDF of an old deck is a design reference, not the editable template. Do not claim exact-template preservation when the current PPTX was unavailable.

### 2. Do not spend slides explaining the problem statement
- Slide 1 may contain the exact required PS ID/title/theme/category and team metadata because the official template requires it.
- From slide 2 onward, use the space for **proposed mechanism, architecture, research-backed choices, field realities, validation, implementation maturity, risk controls, and measurable impact**.
- Do not create a standalone “problem statement explanation” panel or repeat the challenge description in prose.
- A brief ground-reality fact is allowed only when it motivates a technical design decision, and should follow this chain: **observed reality → design constraint → technical response → test/metric**.

### 3. Evidence and truthfulness
- Never invent interviews, field visits, quotes, photos, user counts, datasets, benchmarks, results, validation numbers, partnerships, approvals or deployment status.
- Separate **measured result**, **test target**, **estimate**, **assumption**, **hypothesis**, **planned feature**, and **demonstrated feature**.
- Treat real users with dignity. Use consented/anonymized interviews and field photos only. If ground research has not occurred, state `field validation pending` and show a feasible validation plan; never fabricate an affected person or imply a stock photo documents fieldwork.
- Cite statistics, design methods, datasets, standards, APIs, existing system capabilities, external images/figures and benchmark claims.
- Team members must be able to defend every slide claim and every engineering choice.

### 4. Compact writing; complete technical meaning
- Prefer short noun phrases, keypoints, labels, table rows, equations, caption fragments, arrows and numbered steps.
- No essay paragraphs. Avoid full sentence text unless necessary for a quote, caveat, or precise technical definition.
- Every bullet should convey a distinct decision, capability, constraint, evidence point or outcome.
- Define unusual acronyms once. Use units on metrics. Avoid marketing terms such as “revolutionary”, “best”, “100% secure”, “zero-cost” or “fully automated” without proof.
- Use tables to compress structured comparisons, implementation stages and risk/mitigation pairs. Never compress by making the text illegible.

## Mandatory slide geometry: follow the user's sketch
Use `references/slide_partition_sketch.png` as the visual rule. The sketch indicates three zones: reserved top, content body split into two useful partitions, reserved bottom.

1. **Top reserved band:** leave its original logo/title/header area unchanged; do not put new content over it.
2. **Main body:** use the majority of the slide. Divide it into two or more clearly distinguishable panels/columns inside the existing content region. Use the sketch's larger primary panel + smaller supporting panel as a default (roughly 2/3 : 1/3 where the template allows), not a fixed measurement.
3. **Bottom reserved band:** leave its footer/page-number/source-branding area unchanged. Do not place content over it.
4. **Space usage:** aim to use approximately 85–95% of the *usable body area* for meaningful content on information slides. Avoid a half-empty body, but never add filler just to occupy space. Preserve clear margins and readable type.
5. **Visual share:** on slides 2–5, aim for a substantial meaningful visual—often around 35–50% of the usable body—when diagrams, real imagery, screenshots, tables or charts genuinely explain the approach. This is a working target, not an unbreakable ratio.
6. **Partitions are compulsory:** use columns, panels, compact tables, numbered stages, a diagram plus an evidence panel, a roadmap plus a risk table, or grouped reference blocks. Each partition needs an informative H2/label.
7. **Do not copy sketch pixels into the actual PPTX.** Inspect the template's real geometry and use only its available content zones. The sketch is a layout principle, not a template replacement.

## Typography and visual emphasis
Starting targets:
- **H1 / slide title:** Arial Bold, 30–36 pt
- **H2 / partition heading:** Arial Bold, 18–22 pt
- **Body / keypoint:** Arial, 14–17 pt
- **Diagram/table label:** Arial, 11–14 pt
- **Caption / source marker:** Arial, 8–10 pt, legible in presentation-size view

Use the fixed template's title boxes and sizes as the geometric source of truth. The typography roles are target hierarchy; do not move/resize fixed shapes to force the sizes. Apply Arial to editable text while preserving position, box size, template layout and core formatting. If content doesn't fit, cut low-value words before reducing body text below a readable size.

Use selective emphasis only:
- Bold for the technical term, differentiator, decision or outcome.
- Underline/highlighter treatment for one or two key fragments, not entire paragraphs.
- Accent text color from the existing template palette; never recolor or replace template branding.
- Use numeric labels such as `01`, `02`, `03` to establish flow.
- Strong contrast; color never carries meaning alone—pair color with label/legend.
- No emoji glyphs. Simple shapes and standard arrows are fine.

## Real-world grounding protocol
For each slide 2–5, include at least one useful link from technical design to actual operation or affected people, if the evidence is available. Use this mini-chain in working notes:

`Real observation/source → operational constraint → design choice → technical component → validation method → expected/observed outcome`

Prioritize:
- official workflow documents, public dashboards, audit reports, service records, complaint data, field requirements and operational SOPs;
- observed device/network/connectivity/power/language/accessibility/maintenance constraints;
- user or operator interviews only when actually conducted, with consent and anonymization;
- photographs/screenshots of the real relevant environment or prototype, when permission and source are clear;
- baseline versus target measured using a credible test design.

If evidence is indirect, label it as documentary evidence or an assumption. If direct field testing is not possible yet, include a realistic validation plan, participants/sample strategy, permissions, metrics and failure criteria on the feasibility slide or in speaker notes.

## Images, diagrams and tables
Use a figure because it explains something, not because a slide must look “designed”. Prefer in this order:
1. original architecture/workflow/sequence diagram of the solution;
2. genuine screenshot of the current prototype, UI, device, test bench or real workflow;
3. actual field photo from the team or an authoritative source, with permissions/source;
4. source-verified chart derived from real data;
5. licensed contextual image if no stronger evidence visual exists, clearly not presented as the actual deployment or affected user.

Diagrams must show meaningful nodes/edges, numbered flow, labels, system boundaries, data source/output and error/fallback paths where relevant. Tables must compare useful values/choices, not repeat prose. Charts need title, axes, units, baseline, sample size/timeframe and source; label targets vs measured data. Never create a fake dashboard or misleading metric image.

## Hindi-word acronym protocol
1. Research the domain before naming the project.
2. Generate 5–10 pronounceable Hindi/Sanskrit-origin words in Latin script that fit the solution's purpose.
3. Expand each word into a concise, technically meaningful English name with acronym letters mapped in order.
4. Reject forced letter stuffing, vague “AI-powered” expansions, misleading claims and likely existing-project collisions.
5. Quick-check search results and record checked URLs; this is not legal trademark clearance.
6. Use one format consistently: `HINDI WORD — Full Technical Expansion`.
7. Show the full expansion on slide 2 and the short name in diagrams/captions. Do not reuse `TARANG` unless research independently justifies it for a new project.

## Working process

### Phase 0 — Intake and submission rules
Collect available information without blocking useful work:
- SIH edition/track, PS ID/title/organization/official listing;
- official editable template and current rules;
- institution/College SPOC rules, deadline, format, size, filename, demo/video requirement;
- current Team ID and institution details; default team name `Phra Uma Thewi`;
- solution idea, team capabilities, current build status, datasets/API/hardware access, timeline/resources;
- current prototype screenshots, source code, user research, field evidence and references.
Never infer identifiers or deadlines. An institution's local rules do not automatically apply to other institutions.

### Phase 1 — Inspect the template
Run `scripts/inspect_template.py`. Build a slide map showing existing headings, placeholders, geometry, reserved bands, blank content regions and fixed elements. Mark allowable insertion areas without editing original shape positions. Save an untouched template copy.

### Phase 2 — Research in the real context
Search official PS-owner/government documents, operational workflow and policy; existing deployed solutions; technical papers, standards, datasets, API docs and current open-source implementations; then actual-user/operator evidence where available. Identify what runs in the real world today and what constraints could make an otherwise elegant design fail.

Maintain: `claim | source | date | evidence | confidence | caveat | design implication | slide`.

### Phase 3 — Compare and decide
Compare 3–6 relevant alternatives, including manual/current workflow, existing government/industry systems, open-source implementations or research baselines as appropriate. Define the exact evidence-backed gap. Show why the chosen approach is better suited to the PS context—not that it is universally superior.

### Phase 4 — Architect and ground the approach
Map the complete path: inputs → processing → decision/action → outputs → feedback/monitoring. Add users/operators, external dependencies, data rights, security boundaries, failure handling and deployment/maintenance assumptions. Explain each technology choice in a short “choice → reason” pair.

For AI/ML: data provenance, labels, baseline, split/leakage risks, metrics, calibration/failure modes, human review, fallback. For hardware/IoT: BOM, power, environmental constraints, sensors/actuators, calibration, safety, connectivity, maintainability and manufacturing. For civic/public-service ideas: workflow owner, language/accessibility, last-mile use, consent/privacy, institutional adoption and escalation path.

### Phase 5 — State technical maturity honestly
Use explicit status: `CONCEPT`, `POC`, `WORKING PROTOTYPE`, `TESTED PROTOTYPE`, `FIELD PILOT`, or `DEPLOYED` only where evidenced. For every major module, show:
- demonstrated now;
- build target for the hackathon;
- blocked by data/hardware/permission/integration;
- post-hackathon scale-up.
Use maturity gates: test condition → pass/fail threshold → evidence artifact. Never claim deployment readiness based only on a mockup.

### Phase 6 — Draft the six-slide story using the template's own headings
The common SIH 2026 six-slide sequence below is a guide only; the supplied current template takes precedence.

1. **Title page:** exact PS ID/title/theme/category and current team metadata; visual project identity; source marker for official metadata. No problem analysis or unsupported claims.
2. **Proposed solution:** Hindi-word acronym + technical expansion; solution mechanism; numbered workflow; top differentiators; true prototype status; a diagram/screenshot that makes the flow understandable.
3. **Technical approach:** large architecture/data flow; compact technology choice table; key interfaces/data; security/reliability/fallback; research sources next to method/component claims.
4. **Feasibility and viability:** build roadmap/maturity gates; dependency/resource matrix; top risks and mitigations; actual constraints and validation protocol.
5. **Impact and benefits:** beneficiary → current reality/evidence → technical intervention → measurable change; target vs measured status; limitations and scale conditions.
6. **Research and references:** complete sources used across the deck, compactly grouped and numbered; add datasets, standards, APIs, comparison baselines and image attribution where necessary.

Do not create a separate slide to restate or explain the PS. Keep required metadata in slide 1 and devote remaining space to approach, research, engineering maturity and actual reality.

### Phase 7 — Pack each slide
For each slide:
1. Keep the fixed top/footer bands and template shapes unchanged.
2. Use 2–4 named partitions in the body where appropriate.
3. Use the main partition for the dominant technical explanation; reserve the secondary partition for evidence, metrics, implementation choices or a visual.
4. Prefer one readable architecture diagram or authentic image over multiple tiny decorative pictures.
5. Convert paragraphs to phrases; number important method/workflow steps.
6. Put numeric source markers near claims and figures on the same slide.
7. Check the view from a projected 16:9 slide or exported page: the main visual should read at a glance.
8. Do not leave large blank body areas, but do not fill with generic stock imagery or unsupported content.

### Phase 8 — Evaluator pressure test
Score 0–5 with written evidence: problem fit; real-user grounding; novelty vs alternatives; architecture coherence; implementation/maturity; measurable outcomes; research/source quality; risk/privacy/security; template compliance/readability; team defensibility. Fix weak evidence and design gaps, not just visuals.

### Phase 9 — Fill, validate and render
- Fill text in a copy of the official PPTX using `scripts/fill_template.py` and explicit shape mapping.
- Add only those approved visual assets whose positions fit the existing content zones; use `scripts/add_visual_assets.py` when suitable.
- Run `scripts/validate_deck.py` for structure, stale IDs/names, Arial, citation markers, unresolved tokens and density warnings.
- Run `scripts/compare_template_integrity.py original.pptx filled.pptx` to verify original slide size/layout and original shape geometry remain unchanged while allowing additional visual assets.
- Export to PDF with LibreOffice or PowerPoint and inspect every page as a raster. Automated scripts cannot guarantee correct text wrapping, legibility, image source validity or visual quality.

## Deliverables
- editable PPTX filled from the exact supplied template;
- PDF if the actual submission rules require/request it;
- source ledger and per-slide citation map;
- concise quality-assurance report;
- unresolved assumptions and data/field-validation gaps;
- likely judge questions / presenter notes on request.

Never call the deck submission-ready until current rules/template are verified and the rendered slides have been visually reviewed.

## First response behavior
If the current PS and official PPTX are absent, ask for them while offering to start a research outline from partial information. Keep team name default `Phra Uma Thewi`. Do not ask again for information already supplied. Never use the old PDF's problem, team ID, name or metrics as current facts.
