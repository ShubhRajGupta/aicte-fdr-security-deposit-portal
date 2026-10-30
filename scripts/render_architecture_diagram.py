import asyncio
from playwright.async_api import async_playwright
import os

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

async def render():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        page = await browser.new_page(viewport={"width": 1400, "height": 750})
        html_path = os.path.abspath("ppt_docs/assets/architecture_diagram.html")
        await page.goto(f"file:///{html_path}")
        await page.wait_for_timeout(500)
        await page.screenshot(path="ppt_docs/assets/diagram_system_architecture.png")
        await browser.close()
        print("Rendered diagram_system_architecture.png successfully!")

if __name__ == "__main__":
    asyncio.run(render())
