#!/usr/bin/env python3
"""Compare source and filled PPTX dimensions/layout/original shape geometry.
Additional shapes appended to body zones are allowed; original shapes must remain in place.
Requires: python -m pip install python-pptx
"""
import argparse,json,sys
from pptx import Presentation

def shape_type(s): return str(s.shape_type)
def main():
    ap=argparse.ArgumentParser(description=__doc__); ap.add_argument("original_pptx"); ap.add_argument("filled_pptx"); ap.add_argument("--out",default="template_integrity.json"); a=ap.parse_args()
    src=Presentation(a.original_pptx); out=Presentation(a.filled_pptx); errors=[]; notes=[]
    if (src.slide_width,src.slide_height)!=(out.slide_width,out.slide_height): errors.append("Slide dimensions changed.")
    if len(src.slides)!=len(out.slides): errors.append(f"Slide count changed: {len(src.slides)} -> {len(out.slides)}")
    for si,(ss,os_) in enumerate(zip(src.slides,out.slides),1):
        if ss.slide_layout.name!=os_.slide_layout.name: errors.append(f"Slide {si}: layout changed ({ss.slide_layout.name!r} -> {os_.slide_layout.name!r})")
        if len(os_.shapes)<len(ss.shapes): errors.append(f"Slide {si}: original shapes missing ({len(ss.shapes)} -> {len(os_.shapes)})")
        for ix,old in enumerate(ss.shapes):
            if ix>=len(os_.shapes): break
            new=os_.shapes[ix]
            attrs=("name","left","top","width","height")
            for attr in attrs:
                if getattr(old,attr)!=getattr(new,attr): errors.append(f"Slide {si}, shape {ix}: {attr} changed ({getattr(old,attr)!r} -> {getattr(new,attr)!r})")
            if shape_type(old)!=shape_type(new): errors.append(f"Slide {si}, shape {ix}: shape type changed ({shape_type(old)} -> {shape_type(new)})")
        if len(os_.shapes)>len(ss.shapes): notes.append(f"Slide {si}: {len(os_.shapes)-len(ss.shapes)} additional shape(s); verify they are inside the approved content body.")
    report={"original":a.original_pptx,"filled":a.filled_pptx,"slide_count_original":len(src.slides),"slide_count_filled":len(out.slides),"errors":errors,"notes":notes,"passed":not errors,"limitation":"This checks slide/layout/shape geometry, not master edits, background changes, overlays, text overflow or visual quality. Render and compare every slide manually."}
    with open(a.out,"w",encoding="utf-8") as f: json.dump(report,f,ensure_ascii=False,indent=2)
    print(json.dumps(report,ensure_ascii=False,indent=2)); sys.exit(1 if errors else 0)
if __name__=="__main__": main()
