#!/usr/bin/env python3
"""Add raster visuals to explicitly mapped blank regions of an existing PPTX copy.
Requires: python -m pip install python-pptx pillow
Coordinates are inches. This appends images; it does not move existing shapes.
"""
import argparse,json,os
from pathlib import Path
from PIL import Image
from pptx import Presentation
from pptx.util import Inches

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument("input_pptx"); ap.add_argument("asset_plan_json"); ap.add_argument("output_pptx")
    a=ap.parse_args()
    if os.path.abspath(a.input_pptx)==os.path.abspath(a.output_pptx): raise SystemExit("Refusing to overwrite input PPTX.")
    planpath=Path(a.asset_plan_json).resolve()
    with open(planpath,encoding="utf-8") as f: plan=json.load(f)
    prs=Presentation(a.input_pptx); added=0
    for it in plan.get("assets",[]):
        sn=int(it["slide"])
        if not 1<=sn<=len(prs.slides): raise ValueError(f"Slide {sn} does not exist")
        asset=Path(it["path"])
        if not asset.is_absolute(): asset=(planpath.parent/asset).resolve()
        if not asset.exists(): raise FileNotFoundError(f"Missing visual asset: {asset}")
        x,y,w,h=[float(it[k]) for k in ("left_in","top_in","width_in","height_in")]
        if min(w,h)<=0 or min(x,y)<0: raise ValueError(f"Invalid placement: {it}")
        if Inches(x+w)>prs.slide_width or Inches(y+h)>prs.slide_height: raise ValueError(f"Asset extends beyond slide: {it}")
        with Image.open(asset) as im: iw,ih=im.size
        box_ratio=w/h; img_ratio=iw/ih
        if img_ratio>box_ratio:
            outw=w; outh=w/img_ratio
        else:
            outh=h; outw=h*img_ratio
        left=x+(w-outw)/2; top=y+(h-outh)/2
        pic=prs.slides[sn-1].shapes.add_picture(str(asset),Inches(left),Inches(top),width=Inches(outw),height=Inches(outh))
        alt=it.get("alt","")
        if alt:
            try: pic._element._nvXxPr.cNvPr.set("descr",alt)
            except Exception: pass
        added+=1
        print(f"Added slide {sn}: {asset.name} at ({left:.2f},{top:.2f}) size {outw:.2f}x{outh:.2f} in")
    prs.save(a.output_pptx)
    print(f"Saved {a.output_pptx}; appended {added} asset(s).")
    print("Verify each placement is inside the content body; this script cannot know where logos, footers or other fixed content sit.")
if __name__=="__main__": main()
