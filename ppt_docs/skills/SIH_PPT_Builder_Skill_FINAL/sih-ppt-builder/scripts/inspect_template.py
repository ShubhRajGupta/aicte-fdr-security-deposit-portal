#!/usr/bin/env python3
"""Inspect an editable PPTX and export slide dimensions, shape geometry and text. Requires python-pptx."""
import argparse, json
from pptx import Presentation

def shape_text_info(shape):
    info=[]
    if getattr(shape, "has_text_frame", False):
        for pi,p in enumerate(shape.text_frame.paragraphs):
            for ri,run in enumerate(p.runs):
                if run.text.strip():
                    info.append({"paragraph":pi,"run":ri,"text":run.text,"font_name":run.font.name,
                                 "font_size_pt":round(run.font.size.pt,2) if run.font.size else None,
                                 "bold":run.font.bold,"italic":run.font.italic,"underline":run.font.underline})
    return info

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument("pptx"); ap.add_argument("--out",default="template_map.json")
    a=ap.parse_args(); prs=Presentation(a.pptx)
    result={"file":a.pptx,"slide_count":len(prs.slides),"slide_width_emu":prs.slide_width,
            "slide_height_emu":prs.slide_height,"slide_width_in":round(prs.slide_width/914400,3),
            "slide_height_in":round(prs.slide_height/914400,3),"slides":[]}
    for si,slide in enumerate(prs.slides,1):
        shapes=[]
        for idx,sh in enumerate(slide.shapes):
            item={"shape_index":idx,"name":sh.name,"type":str(sh.shape_type),"left_emu":sh.left,
                  "top_emu":sh.top,"width_emu":sh.width,"height_emu":sh.height,
                  "left_in":round(sh.left/914400,3),"top_in":round(sh.top/914400,3),
                  "width_in":round(sh.width/914400,3),"height_in":round(sh.height/914400,3),
                  "has_text_frame":bool(getattr(sh,"has_text_frame",False)),"text":getattr(sh,"text",""),
                  "run_styles":shape_text_info(sh)}
            if getattr(sh,"has_table",False): item["table"]=[[c.text for c in row.cells] for row in sh.table.rows]
            if getattr(sh,"is_placeholder",False):
                try: item["placeholder_type"]=str(sh.placeholder_format.type)
                except Exception: pass
            shapes.append(item)
        result["slides"].append({"slide":si,"layout":slide.slide_layout.name,"shape_count":len(shapes),"shapes":shapes})
    with open(a.out,"w",encoding="utf-8") as f: json.dump(result,f,ensure_ascii=False,indent=2)
    print(f"Inspected {len(prs.slides)} slides ({result['slide_width_in']} x {result['slide_height_in']} in). Wrote {a.out}.")
    print("Review logo/header/footer and mark available body zones before editing.")
if __name__=="__main__": main()
