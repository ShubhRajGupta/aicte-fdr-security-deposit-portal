#!/usr/bin/env python3
"""Run structural/content/style diagnostics on an SIH PPTX. Visual QA remains mandatory."""
import argparse,json,os,re,sys
from pptx import Presentation
EMOJI_RE=re.compile("[\\U0001F300-\\U0001FAFF\\U00002600-\\U000027BF]")
CITATION_RE=re.compile(r"\[\d{1,3}\]")
def main():
    ap=argparse.ArgumentParser(description=__doc__); ap.add_argument("pptx"); ap.add_argument("--expected-slides",type=int,default=None); ap.add_argument("--team-name",default="Phra Uma Thewi"); ap.add_argument("--out",default="qa_report.json"); a=ap.parse_args()
    prs=Presentation(a.pptx); issues=[]; warnings=[]; slides=[]; fonts={}; alltext=[]
    if a.expected_slides is not None and len(prs.slides)!=a.expected_slides: issues.append(f"Slide count {len(prs.slides)}; expected {a.expected_slides}.")
    for si,slide in enumerate(prs.slides,1):
        texts=[]; text_shapes=0; citations=[]; paragraph_count=0; long_shapes=[]
        for sh in slide.shapes:
            if getattr(sh,"has_text_frame",False):
                text_shapes+=1; txt=sh.text.strip()
                if txt:
                    texts.append(txt); alltext.append(txt)
                    if len(txt)>600: long_shapes.append({"shape":sh.name,"chars":len(txt)})
                    if re.search(r"\{\{[^}]+\}\}",txt): issues.append(f"Slide {si}, shape {sh.name}: unresolved template token {txt[:100]!r}.")
                    if EMOJI_RE.search(txt): warnings.append(f"Slide {si}, shape {sh.name}: emoji/symbol-like glyph detected; review no-emoji requirement.")
                    citations.extend(CITATION_RE.findall(txt))
                for p in sh.text_frame.paragraphs:
                    paragraph_count+=1
                    for r in p.runs:
                        if r.text.strip():
                            name=r.font.name or "(theme/default)"; fonts[name]=fonts.get(name,0)+1
                            if name not in ("Arial","(theme/default)"): warnings.append(f"Slide {si}, shape {sh.name}: run typeface {name!r}, expected Arial.")
            if getattr(sh,"has_table",False):
                for row in sh.table.rows:
                    for cell in row.cells:
                        if cell.text.strip(): texts.append(cell.text.strip()); alltext.append(cell.text.strip()); citations.extend(CITATION_RE.findall(cell.text))
        if len(texts)<2: warnings.append(f"Slide {si}: few extractable text elements; check required partitions/visuals.")
        if long_shapes: warnings.append(f"Slide {si}: long text shapes may be paragraphs/overcrowded: {long_shapes}")
        if not citations: warnings.append(f"Slide {si}: no numeric [n] citation marker found in extractable text.")
        slides.append({"slide":si,"text_shape_count":text_shapes,"citation_markers":sorted(set(citations)),"text_preview":texts[:12],"long_shapes":long_shapes})
    blob="\n".join(alltext).lower()
    for stale in ["team name - contrast","team name: contrast","60427","25230","targeted adaptive reactive ai-based network guard"]:
        if stale in blob: warnings.append(f"Potential stale sample-deck content: {stale!r}. Verify it belongs to the current submission before retaining.")
    if a.team_name and a.team_name.lower() not in blob: warnings.append(f"Requested team name {a.team_name!r} not found in editable slide text.")
    if not ("http://" in blob or "https://" in blob or "doi:" in blob): warnings.append("No full URL/DOI detected. Ensure slide 6 contains full references, not only citation numbers.")
    report={"file":a.pptx,"file_size_bytes":os.path.getsize(a.pptx),"slide_count":len(prs.slides),"issues":issues,"warnings":warnings,"font_run_counts":fonts,"slides":slides,"visual_inspection_required":True,"note":"This tool cannot reliably detect clipping, overlap, readability, source truth, licensing, master/background changes or whether each partition is useful. Render and inspect the full deck."}
    with open(a.out,"w",encoding="utf-8") as f: json.dump(report,f,ensure_ascii=False,indent=2)
    print(json.dumps({"slide_count":report["slide_count"],"issues":issues,"warnings":warnings,"font_run_counts":fonts,"report":a.out},ensure_ascii=False,indent=2)); sys.exit(1 if issues else 0)
if __name__=="__main__": main()
