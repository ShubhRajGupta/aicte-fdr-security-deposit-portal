#!/usr/bin/env bash
# Export a PPTX to PDF and page PNGs using LibreOffice + pdftoppm.
# Usage: scripts/render_and_review.sh input.pptx [output_dir]
set -euo pipefail
INPUT="${1:?Usage: $0 input.pptx [output_dir]}"
OUTDIR="${2:-rendered_review}"
mkdir -p "$OUTDIR"
if ! command -v libreoffice >/dev/null 2>&1; then echo "ERROR: LibreOffice not found. Export from PowerPoint or install LibreOffice." >&2; exit 2; fi
libreoffice --headless --convert-to pdf --outdir "$OUTDIR" "$INPUT" >/dev/null
PDF="$OUTDIR/$(basename "${INPUT%.*}").pdf"
if command -v pdftoppm >/dev/null 2>&1; then pdftoppm -png -r 140 "$PDF" "$OUTDIR/slide"; else echo "PDF exported to $PDF; pdftoppm not found, so PNGs were not created."; fi
echo "Review every page image: layout, text clipping, diagrams, citations, and fixed template elements. Output: $OUTDIR"
