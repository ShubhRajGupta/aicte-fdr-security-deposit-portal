import asyncio
import os
from playwright.async_api import async_playwright

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

async def capture():
    os.makedirs("ppt_docs/assets", exist_ok=True)
    async with async_playwright() as p:
        print(f"Launching Chrome from: {CHROME_PATH}")
        browser = await p.chromium.launch(executable_path=CHROME_PATH, headless=True)
        context = await browser.new_context(viewport={"width": 1600, "height": 900})
        page = await context.new_page()

        # Set localStorage before navigation to auto-login
        await page.add_init_script("""
            localStorage.setItem('aicte_auth_token', 'mock-token-sih-2026');
            localStorage.setItem('aicte_user_persona', JSON.stringify({
                id: 'vikram.seth@aicte-india.org',
                name: 'Dr. Vikram Seth',
                role: 'REGULATION_BUREAU_OFFICER',
                title: 'Director (Regulation)',
                department: 'Regulation Bureau, AICTE HQ New Delhi'
            }));
        """)

        print("Navigating to http://localhost:3000/ ...")
        await page.goto("http://localhost:3000/", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        # 1. Bureau Dashboard screenshot
        await page.screenshot(path="ppt_docs/assets/screenshot_dashboard.png")
        print("Captured: screenshot_dashboard.png")

        # 2. Risk Worklist
        # Click on Risk Worklist button
        buttons = await page.locator("button").all()
        for b in buttons:
            txt = (await b.inner_text()).strip()
            if "Risk Worklist" in txt or "Worklist" in txt:
                await b.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path="ppt_docs/assets/screenshot_risk_worklist.png")
                print("Captured: screenshot_risk_worklist.png")
                break

        # 3. Audit Explorer
        for b in buttons:
            txt = (await b.inner_text()).strip()
            if "Audit Explorer" in txt or "Audit Ledger" in txt or "Audit" in txt:
                await b.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path="ppt_docs/assets/screenshot_audit_explorer.png")
                print("Captured: screenshot_audit_explorer.png")
                break

        # 4. Public NOC
        for b in buttons:
            txt = (await b.inner_text()).strip()
            if "Public NOC" in txt or "NOC Verification" in txt or "NOC" in txt:
                await b.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path="ppt_docs/assets/screenshot_digital_noc.png")
                print("Captured: screenshot_digital_noc.png")
                break

        # 5. Bank Confirmation
        for b in buttons:
            txt = (await b.inner_text()).strip()
            if "Bank Confirmation" in txt or "Bank" in txt:
                await b.click()
                await page.wait_for_timeout(1500)
                await page.screenshot(path="ppt_docs/assets/screenshot_bank_confirmation.png")
                print("Captured: screenshot_bank_confirmation.png")
                break

        await browser.close()
        print("All screenshots successfully captured!")

if __name__ == "__main__":
    asyncio.run(capture())
