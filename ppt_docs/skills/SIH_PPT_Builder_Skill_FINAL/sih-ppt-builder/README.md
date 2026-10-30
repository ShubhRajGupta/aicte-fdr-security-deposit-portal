# SIH PPT Builder Skill — Final package

A reusable research-to-presentation skill for Smart India Hackathon idea decks. It is built around the user's requirements: preserve the official template, use Arial, use dense content partitions, keep writing to compact technical fragments, cite every slide, select a Hindi-word project acronym, show real-world evidence, and make the approach/engineering maturity the focus.

## Core principle
The presentation is **not a problem-statement explainer**. The title slide carries the official metadata; the remaining slides should mainly demonstrate the approach, technical architecture, existing research/alternatives, ground-reality fit, feasibility, maturity and measurable outcomes.

## Contents
- `SKILL.md` — end-to-end operating instructions
- `references/slide_partition_sketch.png` — the supplied visual layout rule
- `references/style_profile_from_60427_sample.md` — patterns learned from the old six-page sample, while excluding old facts
- `references/sketch_geometry_rule.md` — fixed top/body/footer and partition geometry principle
- `references/typography_and_layout_rules.md` — Arial, H1/H2, density, highlight, partition rules
- `references/ground_reality_evidence.md` — field evidence, people and prototype maturity
- `references/toolchain_and_libraries.md` — recommended tools and when to use each
- `references/project_naming_rules.md` — Hindi-word acronym naming process
- `references/research_playbook.md` — research sources, claims ledger and citation handling
- `references/slide_blueprint.md` — six-slide content and partition blueprint
- `references/evaluator_rubric.md` — diagnostic rubric, not an official SIH scoring sheet
- `references/final_checklist.md` — submission and QA checklist
- `references/official_sources.md` — SIH sources and current tool documentation links
- `templates/idea_brief.template.json` — structured project intake
- `templates/slide_plan.template.json` — slide-by-slide partition plan
- `templates/fill_map.example.json` — explicit text/role mapping example
- `templates/visual_asset_plan.template.json` — example coordinates for adding visuals inside approved blank areas
- `templates/source_ledger.template.csv` — evidence/source ledger
- `templates/diagram_examples/solution_flow.mmd` — editable Mermaid flow example
- `templates/diagram_examples/architecture.dot` — Graphviz architecture starter
- `scripts/inspect_template.py` — editable shape/geometry inventory
- `scripts/fill_template.py` — explicit text replacement, role sizing and Arial application
- `scripts/add_visual_assets.py` — add raster visuals to mapped body zones without moving original template shapes
- `scripts/compare_template_integrity.py` — compare slide size, layout and original shape geometry
- `scripts/validate_deck.py` — structural/style/source-marker/stale-token diagnostics
- `scripts/render_and_review.sh` — optional LibreOffice PDF + PNG rendering workflow

## Quick start
1. Obtain the official editable PPTX for the correct SIH edition/track and your own institution's rules.
2. Preserve an untouched copy. Copy `templates/idea_brief.template.json` and fill only verified facts; unknown values should remain empty or `TBD`.
3. Install core dependency: `python -m pip install python-pptx pillow`.
4. Inspect: `python scripts/inspect_template.py official_template.pptx --out template_map.json`.
5. Plan partitions and content in `templates/slide_plan.template.json`. Use the official template's open body regions; never copy pixel coordinates from the sketch without inspecting the deck dimensions.
6. Prepare `fill_map.json` with explicit placeholder replacements, shape updates and roles; fill a copy with `python scripts/fill_template.py official_template.pptx fill_map.json draft.pptx`.
7. Add optional visual files through `visual_asset_plan.json` and `scripts/add_visual_assets.py` only after measuring the available blank areas.
8. Run `python scripts/validate_deck.py draft.pptx --expected-slides 6 --out qa_report.json`.
9. Compare template geometry: `python scripts/compare_template_integrity.py official_template.pptx draft.pptx`.
10. Render the deck to PDF/PNG and inspect every slide at presentation size. Fix any clipping, overlap, unreadable labels, missed sources or wrong metadata before delivery.

## Recommended tools
See `references/toolchain_and_libraries.md`. Primary editing path: `python-pptx` on the existing PPTX. Mermaid/Graphviz/diagrams.net/Excalidraw for diagrams; Python/Pandas/Matplotlib for source-backed charts; LaTeX/TikZ for equations and technical figures; Zotero plus primary sources for references; LibreOffice/PowerPoint rendering for final visual QA. Use PptxGenJS only when a separately generated deck is permitted or for standalone visual assets—not as a reason to replace the required SIH template.

## Known limits
- The package is a workflow and helper-tool set, not an automatic solution inventor or a one-click layout engine.
- No current official PPTX is bundled. The template and internal rules must be supplied or verified per edition.
- `python-pptx` scripts can preserve original shapes but cannot guarantee visual quality, citations or semantic correctness. Visual review is mandatory.
- The previous sample PDF's old team, IDs, project name and results are explicitly not defaults.
- This package is independent and is not an official SIH publication.
