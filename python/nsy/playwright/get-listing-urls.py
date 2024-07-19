import asyncio

from time import sleep
from playwright.async_api import Page, Playwright, async_playwright

tags = {
    'listing_url': '.ds-listview-vehicle-title > a',
}

async def get_listing_urls(playwright: Playwright, *, url: str, scroll: bool) -> None:
    # Launch the Chromium browser in non-headless mode (visible UI) to see the browser in action.
    browser = await playwright.chromium.launch(headless=False)

    # Open a new browser page.
    page = await browser.new_page(viewport={'width': 1600, 'height': 900})

    # Short sleep to be able to see the browser in action.
    await asyncio.sleep(1)

    # Navigate to the specified URL.
    await page.goto(url)

    await asyncio.sleep(1)

    if scroll:
        await scroll_to_bottom(page)
        await asyncio.sleep(1)

    elements = await page.query_selector_all(tags['listing_url'])
    urls = [await element.get_attribute('href') for element in elements]

    # Close the browser.
    await browser.close()

    return urls

async def scroll_to_bottom(page: Page) -> None:
    # Get the initial scroll height
    last_height = await page.evaluate('document.body.scrollHeight')
    i = 1

    while True:
        print(f'Scrolling page ({i})...')

        # Scroll to the bottom of the page.
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight);')

        # Wait for the page to load.
        await asyncio.sleep(1)

        # Calculate the new scroll height and compare it with the last scroll height.
        new_height = await page.evaluate('document.body.scrollHeight')
        if new_height == last_height:
            break  # Exit the loop when the bottom of the page is reached.

        last_height = new_height
        i += 1

async def main() -> None:
    # Use sync_playwright context manager to close the Playwright instance automatically
    async with async_playwright() as playwright:
        listings = await get_listing_urls(
            playwright=playwright,
            url='https://www.autosofchicago.com/pre-owned-cars',
            scroll=True
        )
        # result = run(playwright, url='')
        # print(result)
        print(listings, len(listings))

if __name__ == '__main__':
   asyncio.run(main())
