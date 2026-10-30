# Recommended tools and libraries

The stack should be selected to support the chosen approach, not to impress judges with a long technology list. Include only tools that the team can explain and use.

## PPTX and template preservation

| Tool | Best use | Rule for this SIH workflow |
|---|---|---|
| **Microsoft PowerPoint / LibreOffice Impress** | Final editing, rendering, visual inspection | Always inspect the editable output in a real presentation renderer |
| **python-pptx** | Inspect shape geometry; replace text in a provided PPTX; add tables, charts, raster images; read slide dimensions | Preferred automation for the existing template; edit a copy and compare original shape geometry |
| **PptxGenJS** | Programmatic PPTX generation, tables, charts, images and custom layouts | Use only if a separately generated deck is allowed; do not rebuild/replace the mandatory official template |
| **LibreOffice headless + pdftoppm/pdfium** | Export PPTX to PDF and pages to images for QA | Render all slides after edits; automated PPTX parsing is not a visual check |

## Diagrams and technical visuals

| Tool | Best for | Output/use |
|---|---|---|
| **Mermaid** | Flowcharts, sequence diagrams, state diagrams, user journeys and simple architecture | Editable text source (`.mmd`); render SVG/PNG for the PPT |
| **Graphviz (DOT)** | Complex dependency graphs, data-flow/architecture graphs, directed hierarchies | SVG/PNG; strong for automated graph layout and edge routing |
| **diagrams.net / draw.io** | Manual architecture, network, cloud, hardware and process diagrams | Export SVG or PNG; keep the editable source file when practical |
| **Excalidraw** | Early-stage sketches and hand-drawn explanatory diagrams | Export SVG/PNG; use when the informal style improves comprehension, not for all diagrams |
| **PlantUML** | UML component/deployment diagrams and technical sequence diagrams | SVG/PNG; use if UML precision is needed |
| **LaTeX + TikZ/PGF** | Equations, algorithms and precise vector technical figures | Compile figures independently and import SVG/PDF/PNG; do not use Beamer to replace the official PPTX |

## Data, methods and research

| Tool | Best for | Guardrail |
|---|---|---|
| **Python + Pandas** | Cleaning data, calculating metrics, auditable tabular analysis | Preserve source data and transformation scripts |
| **Matplotlib** | Charts with controlled labels, axes, annotations and units | Plot real data only; label baseline, sample/timeframe and source; distinguish target from measurement |
| **Plotly** | Interactive analysis during research and demos | Use static export in the PPT; confirm static image labels stay readable |
| **Jupyter** | Reproducible exploratory analysis and prototype evidence | Record data origin, environment, assumptions and notebook outputs |
| **Zotero** | Reference collection and citation metadata | Verify actual title, author, venue, year and DOI/URL; a citation manager cannot validate a false source |
| **Official data portals, APIs, dataset cards, standards and maintained repositories** | Primary source evidence and integration feasibility | Confirm licensing, currentness, access, format, rate limits, privacy and dependency availability |

## Real imagery

Preferred order:
1. screenshots of the team's actual prototype / test results;
2. original diagrams built from the actual proposed architecture;
3. team-owned field photos with necessary consent;
4. official reports/dashboards or other permitted primary source imagery;
5. licensed illustrative photos from sources such as Pexels/Pixabay/Wikimedia Commons, with licence checked.

Never use an illustrative stock photo as evidence of actual field work or as an identified project user. Avoid images that do not explain the proposed system. Record source URL, creator/licence and access date. Check additional rights for identifiable people, logos, trademarks and sensitive places even when the image platform offers a broad licence.

## Pick the smallest useful toolchain

- **Most projects:** `python-pptx` + Mermaid or diagrams.net + Pandas/Matplotlib if quantitative evidence exists + LibreOffice/PDF render.
- **Complex graph/system:** Graphviz or PlantUML for technical accuracy.
- **Mathematical/algorithm-heavy:** LaTeX equations/TikZ figures + Python validation, while keeping the official template as the deck.
- **Field-facing/public-service:** genuine workflow screenshots/field evidence + stakeholder journey + privacy/accessibility/fallback analysis.
- **Image/data-heavy:** original source-backed charts and appropriately licensed images, not generic AI art.

## Practical source documentation
- python-pptx docs: https://python-pptx.readthedocs.io/en/latest/
- PptxGenJS docs: https://gitbrent.github.io/PptxGenJS/docs/introduction/
- Mermaid syntax: https://mermaid.js.org/intro/syntax-reference.html
- Graphviz docs: https://graphviz.org/documentation/
- diagrams.net export guide: https://www-diagrams-net-source.pages.dev/doc/faq/export-diagram
- Excalidraw export docs: https://docs.excalidraw.com/docs/%40excalidraw/excalidraw/api/utils/export
- LaTeX Beamer (for figures/material, not template substitution): https://ctan.org/pkg/beamer
- Pexels licence: https://www.pexels.com/legal-pages/license/
- Pixabay licence summary: https://pixabay.com/service/license-summary/
