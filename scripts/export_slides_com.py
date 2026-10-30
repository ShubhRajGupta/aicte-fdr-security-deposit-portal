import os
import win32com.client

def export_deck():
    given_ppt = os.path.abspath("ppt_docs/SIH2026-IDEA-Presentation-Format.pptx")
    given_pdf = os.path.abspath("ppt_docs/SIH2026-IDEA-Presentation-Format.pdf")
    sub_ppt = os.path.abspath("ppt_docs/NYAAS_SIH2026_Submission_6Slides.pptx")
    sub_pdf = os.path.abspath("ppt_docs/NYAAS_SIH2026_Submission_6Slides.pdf")
    img_dir = os.path.abspath("ppt_docs/rendered_slides")
    os.makedirs(img_dir, exist_ok=True)

    print("Opening PowerPoint application...")
    powerpoint = win32com.client.Dispatch("PowerPoint.Application")

    # Export given template to PDF
    print(f"Exporting given template to PDF: {given_pdf}")
    deck_given = powerpoint.Presentations.Open(given_ppt, WithWindow=False)
    deck_given.SaveAs(given_pdf, 32)
    deck_given.Close()

    # Export 6-slide submission to PDF & JPGs
    print(f"Exporting 6-slide submission to PDF: {sub_pdf}")
    deck_sub = powerpoint.Presentations.Open(sub_ppt, WithWindow=False)
    deck_sub.SaveAs(sub_pdf, 32)
    print(f"Exporting slides to images in: {img_dir}")
    deck_sub.SaveAs(img_dir, 17)
    deck_sub.Close()

    powerpoint.Quit()
    print("All exports successfully finished!")

if __name__ == "__main__":
    export_deck()
