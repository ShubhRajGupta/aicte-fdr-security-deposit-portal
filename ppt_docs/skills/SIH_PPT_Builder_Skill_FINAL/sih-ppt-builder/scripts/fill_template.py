#!/usr/bin/env python3
"""Apply explicit token replacements and optional font roles to a copy of a PPTX.
Requires: python -m pip install python-pptx
"""
import argparse,json,os
from pptx import Presentation
from pptx.util import Pt
from pptx.dml.color import RGBColor

VALID_ROLES={"H1","H2","BODY","DIAGRAM_LABEL","CAPTION"}

def iter_text_frames(prs):
    for si,slide in enumerate(prs.slides,1):
        for idx,shape in enumerate(slide.shapes):
            if getattr(shape,"has_text_frame",False): yield si,idx,shape,shape.text_frame
            if getattr(shape,"has_table",False):
                for ti,row in enumerate(shape.table.rows):
                    for ci,cell in enumerate(row.cells): yield si,idx,(shape,ti,ci),cell.text_frame

def replace_tokens(tf,replacements):
    changed=0
    for p in tf.paragraphs:
        for r in p.runs:
            old=r.text; new=old
            for token,value in replacements.items(): new=new.replace(token,str(value))
            if new!=old: r.text=new; changed+=1
    return changed

def set_font(tf,name):
    for p in tf.paragraphs:
        for r in p.runs:
            r.font.name=name
            # Set explicit DrawingML typeface attributes as well, so theme fonts don't override Arial.
            try:
                r._element.get_or_add_rPr().latin.typeface=name
            except Exception: pass

def set_role(tf,name,size,role):
    set_font(tf,name)
    for p in tf.paragraphs:
        for r in p.runs:
            r.font.size=Pt(float(size))
            if role in ("H1", "H2"):
                r.font.bold=True

def apply_shape_styles(shape_styles, prs):
    """Apply explicit styles to whole mapped text shapes/panels; no geometry changes."""
    for item in shape_styles:
        sn=int(item["slide"]); ix=int(item["shape_index"])
        if not 1<=sn<=len(prs.slides): raise ValueError(f"Style slide {sn} does not exist")
        slide=prs.slides[sn-1]
        if not 0<=ix<len(slide.shapes): raise ValueError(f"Style shape {ix} does not exist on slide {sn}")
        sh=slide.shapes[ix]
        if getattr(sh,"has_text_frame",False):
            for para in sh.text_frame.paragraphs:
                for run in para.runs:
                    if "bold" in item: run.font.bold=bool(item["bold"])
                    if "italic" in item: run.font.italic=bool(item["italic"])
                    if "underline" in item: run.font.underline=bool(item["underline"])
                    if item.get("font_color_hex"):
                        hx=item["font_color_hex"].lstrip("#")
                        if len(hx)!=6: raise ValueError("font_color_hex must be 6 hex digits")
                        run.font.color.rgb=RGBColor.from_string(hx.upper())
                    if item.get("font_name"): set_font(sh.text_frame,item["font_name"])
        if item.get("fill_color_hex"):
            hx=item["fill_color_hex"].lstrip("#")
            if len(hx)!=6: raise ValueError("fill_color_hex must be 6 hex digits")
            sh.fill.solid(); sh.fill.fore_color.rgb=RGBColor.from_string(hx.upper())
        if item.get("line_color_hex"):
            hx=item["line_color_hex"].lstrip("#")
            if len(hx)!=6: raise ValueError("line_color_hex must be 6 hex digits")
            sh.line.color.rgb=RGBColor.from_string(hx.upper())

def update_shape_text(shape,value):
    tf=shape.text_frame
    pars=tf.paragraphs
    if not pars: tf.text=str(value); return
    p0=pars[0]
    if p0.runs:
        p0.runs[0].text=str(value)
        for r in p0.runs[1:]: r.text=""
    else: p0.text=str(value)
    for p in pars[1:]:
        for r in p.runs: r.text=""

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument("input_pptx"); ap.add_argument("fill_map_json"); ap.add_argument("output_pptx")
    a=ap.parse_args()
    if os.path.abspath(a.input_pptx)==os.path.abspath(a.output_pptx): raise SystemExit("Refusing to overwrite the input template.")
    with open(a.fill_map_json,encoding="utf-8") as f: m=json.load(f)
    prs=Presentation(a.input_pptx); total=0
    for _,_,_,tf in iter_text_frames(prs): total+=replace_tokens(tf,m.get("replacements",{}))
    for u in m.get("shape_updates",[]):
        sn=int(u["slide"]); ix=int(u["shape_index"])
        if not 1<=sn<=len(prs.slides): raise ValueError(f"Slide {sn} does not exist")
        slide=prs.slides[sn-1]
        if not 0<=ix<len(slide.shapes): raise ValueError(f"Shape index {ix} does not exist on slide {sn}")
        sh=slide.shapes[ix]
        if not getattr(sh,"has_text_frame",False): raise ValueError(f"Slide {sn}, shape {ix} has no text frame")
        update_shape_text(sh,u["text"]); total+=1
    style=m.get("style",{}); font=style.get("font_name","Arial")
    if style.get("apply_font_name_to_all_text",True):
        for _,_,_,tf in iter_text_frames(prs): set_font(tf,font)
    sizes=style.get("role_sizes_pt",{"H1":32,"H2":20,"BODY":15,"DIAGRAM_LABEL":12,"CAPTION":9})
    for item in m.get("text_roles",[]):
        sn=int(item["slide"]); ix=int(item["shape_index"]); role=str(item["role"]).upper()
        if not 1<=sn<=len(prs.slides): raise ValueError(f"Role slide {sn} does not exist")
        if role not in VALID_ROLES or role not in sizes: raise ValueError(f"Unknown/missing role size: {role}")
        sh=prs.slides[sn-1].shapes[ix]
        if not getattr(sh,"has_text_frame",False): raise ValueError(f"Role shape {ix} on slide {sn} has no text frame")
        set_role(sh.text_frame,font,sizes[role],role)
    apply_shape_styles(m.get("shape_styles",[]),prs)
    prs.save(a.output_pptx)
    print(f"Saved {a.output_pptx}; applied {total} text updates; font={font}.")
    print("Original shape positions are not changed by this script. Optional shape_styles can set bold/underline/color/fill on mapped text shapes or panels. Run validation and compare_template_integrity.py; visual review is mandatory.")
if __name__=="__main__": main()
