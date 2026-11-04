from playwright.sync_api import sync_playwright

def test_browser_launch():

    with sync_playwright() as p:

        browser = p.chromium.launch(headless=False)

        page = browser.new_page()

        page.goto("https://www.google.com")

        print("Page title:", page.title())

        assert "Google" in page.title()

        browser.close()