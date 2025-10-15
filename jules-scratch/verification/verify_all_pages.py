import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        pages_to_verify = [
            "credits.html",
            "endgame.html",
            "game-info.html",
            "games.html",
            "index.html",
            "journal.html",
            "photo-wall.html",
            "points.html",
            "schedule-test.html",
            "schedule.html",
            "welcome.html"
        ]

        for page_name in pages_to_verify:
            await page.goto(f"file://{os.path.abspath(page_name)}")
            await page.wait_for_load_state('networkidle')
            # Wait for the fade-in animation to complete
            await page.wait_for_timeout(1000)
            screenshot_path = f"jules-scratch/verification/{page_name.replace('.html', '.png')}"
            await page.screenshot(path=screenshot_path)
            print(f"Screenshot taken for {page_name}")

        await browser.close()

if __name__ == "__main__":
    import os
    asyncio.run(main())