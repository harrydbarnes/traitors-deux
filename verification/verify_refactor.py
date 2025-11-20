from playwright.sync_api import sync_playwright, expect
import os

def verify_pages():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Verify Index Page
        print("Verifying Index Page...")
        page.goto("http://localhost:8000/index.html")

        # The content of index.html is:
        # <div class="info-box">
        #   <p>Thank you for playing!</p> ...
        # </div>
        # It does NOT contain h1. The h1 is created dynamically by Home.showNotEverythingIsAsItSeems,
        # OR it is static content if we are in the "Endgame" state which index.html seems to represent now.
        # The current index.html has static p tags.

        expect(page.locator(".info-box p").first).to_be_visible(timeout=10000)

        # Check if menu is injected
        expect(page.locator(".menu-bar")).to_be_visible()
        page.screenshot(path="verification/index.png")
        print("Index page verified.")

        # Verify Credits Page
        print("Verifying Credits Page...")
        page.goto("http://localhost:8000/credits.html")
        # Menu bar on credits page has opacity 0 initially, but is present in DOM
        expect(page.locator("#menuBar")).to_be_attached()
        # The credits container fades in
        expect(page.locator("#creditsContainer")).to_be_visible()
        page.screenshot(path="verification/credits.png")
        print("Credits page verified.")

        # Verify Game Info Page
        print("Verifying Game Info Page...")
        page.goto("http://localhost:8000/game-info.html")
        # Info box fades in
        expect(page.locator(".info-box")).to_be_visible(timeout=5000)
        expect(page.locator(".menu-bar")).to_be_visible()
        page.screenshot(path="verification/game-info.png")
        print("Game Info page verified.")

        browser.close()

if __name__ == "__main__":
    verify_pages()
