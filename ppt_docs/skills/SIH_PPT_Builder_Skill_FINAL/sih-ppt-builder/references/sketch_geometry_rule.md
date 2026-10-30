# Mandatory content geometry from the user's sketch

Reference: `slide_partition_sketch.png` (user supplied 2026-10-29).

## Diagram reading
The sketch is a rule for how the content should occupy the slide, not a replacement theme:

1. **Reserved top band** — preserved exactly as supplied by the editable template; existing title/logo/header only.
2. **Main content body** — the majority of slide area, divided by a visible separator into a large primary content partition and a smaller supporting partition. About 2/3 : 1/3 is a reasonable first guess where the existing template permits it.
3. **Reserved bottom band** — preserved exactly; existing footer, page number and submission label.
4. **Efficient use** — fill body regions with real solution information: architecture diagram, real prototype image, compact table, workflow, measurement panel, or grounded evidence—not repeated problem text or decoration.

## How to implement without changing the template
- Read the PPTX dimensions and shape bounding boxes first using `scripts/inspect_template.py`.
- Identify body region boundaries by existing placeholder/blank area and fixed template elements.
- Make internal panels with existing empty placeholders or by placing content in the blank space. If drawing dividers or adding new panels, ensure the new shape is fully inside the body region and does not cover any original shape.
- Never resize, move, hide, recolor, or replace the official logo, header, footer, title shape, page number or master background.
- Do not apply the sketch's pixel percentages mechanically. Different official templates may have different reservations.
- After filling, run `scripts/compare_template_integrity.py` and render every slide.

## Area target
Aim to use approximately 85–95% of the body area *for useful, readable content* on slides with substantial technical content. The primary partition should carry the main diagram/explanation; the support partition should provide evidence, key configuration, metrics, risk, technology choice or a short table. A compact reference slide can use grouped columns instead. Do not add meaningless filler to meet an area quota.
