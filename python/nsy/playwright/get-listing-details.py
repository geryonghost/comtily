import asyncio

from time import sleep
from playwright.async_api import Playwright, async_playwright

tags = {
    'vin': '.ds-vdp-sidebar-vehicle-id-vin',
    'auto_year': 'meta[itemprop="vehicleModelDate"]',
    'odometer': '.ds-vdp-sidebar-mileage-total-value',
    'price': '.ds-vdp-sidebar-price-value',
    'description': '#ds-vdp-description',
    'image':'#ds-vdp-photos',
    'image_src': 'data-src',
    'posting_id': '.ds-vdp-sidebar-vehicle-id-stock'
}

async def get_listing_details(playwright: Playwright, *, url: str) -> None:
    # Launch the Chromium browser in non-headless mode (visible UI) to see the browser in action.
    browser = await playwright.chromium.launch(headless=True)

    # Open a new browser page.
    page = await browser.new_page(viewport={'width': 1600, 'height': 900})
    # await asyncio.sleep(1)

    # Navigate to the specified URL.
    await page.goto(url)
    await asyncio.sleep(1)

    if await page.title():
        # VIN
        vin = None
        vin_element = await page.query_selector(tags['vin'])
        if vin_element:
            text_content = await vin_element.text_content()
            if text_content:
                vin = text_content
            else:
                content_attr = await vin_element.get_attribute('content')
                if content_attr:
                    vin = content_attr
                else:
                    inner_attr = await vin_element.get_attribute('innerHTML')
                    if inner_attr:
                        vin = inner_attr
            vin = vin.strip()

        # auto_year
        auto_year = None
        auto_year_element = await page.query_selector(tags['auto_year'])
        if auto_year_element:
            text_content = await auto_year_element.text_content()
            if text_content:
                auto_year = text_content
            else:
                content_attr = await auto_year_element.get_attribute('content')
                if content_attr:
                    auto_year = content_attr
                else:
                    inner_attr = await auto_year_element.get_attribute('innerHTML')
                    if inner_attr:
                        auto_year = inner_attr
            auto_year = int(auto_year.strip())

        # odometer
        odometer = None
        odometer_element = await page.query_selector(tags['odometer'])
        if odometer_element:
            text_content = await odometer_element.text_content()
            if text_content:
                odometer = text_content
            else:
                content_attr = await odometer_element.get_attribute('content')
                if content_attr:
                    odometer = content_attr
                else:
                    inner_attr = await description_element.get_attribute('innerHTML')
                    if inner_attr:
                        odometer = inner_attr
            odometer = int(odometer.replace(',','').replace(' ','').strip())

        # price
        price = None
        price_element = await page.query_selector(tags['price'])
        if price_element:
            text_content = await price_element.text_content()
            if text_content:
                price = text_content
            else:
                content_attr = await price_element.get_attribute('content')
                if content_attr:
                    price = content_attr
                else:
                    inner_attr = await price_element.get_attribute('innerHTML')
                    if inner_attr:
                        price = inner_attr
            price = int(price.replace('$','').replace(',','').strip())

        # description
        description = None
        description_element = await page.query_selector(tags['description'])
        if description_element:
            content_attr = await description_element.get_attribute('content')
            if content_attr:
                description = content_attr
            else:
                text_content = await description_element.text_content()
                if text_content:
                    description = text_content
                else:
                    inner_attr = await description_element.get_attribute('innerHTML')
                    if inner_attr:
                        description = inner_attr

            description = description.strip()

        # auto_images
        images = []
        image_element = await page.query_selector(tags['image'])
        if image_element:
            image_elements = await image_element.query_selector_all('img')

            if image_elements:
                for image in image_elements:
                    image_src = await image.get_attribute(tags['image_src'])
                    image_src = image_src.replace('https://','').replace('http://','').replace('//','')
                    images.append(image_src)

        # posting_id
        posting_id = None
        posting_id_element = await page.query_selector(tags['posting_id'])
        if posting_id_element:
            text_content = await posting_id_element.text_content()
            if text_content:
                posting_id = text_content
            else:
                content_attr = await posting_id_element.get_attribute('content')
                if content_attr:
                    posting_id = content_attr
                else:
                    inner_attr = await posting_id_element.get_attribute('innerHTML')
                    if inner_attr:
                        posting_id = inner_attr
            posting_id = posting_id.strip()

    # Close the browser.
    await browser.close()

    listing_details = {
        'vin': vin,
        'auto_year': auto_year,
        'odometer': odometer,
        'price': price,
        'description': description,
        'image': images,
        'posting_id': posting_id,
    }

    return listing_details

async def main() -> None:
    # Use sync_playwright context manager to close the Playwright instance automatically
    async with async_playwright() as playwright:
        listings = await get_listing_details(
            playwright=playwright,
            url='https://www.autosofchicago.com//pre-owned-cars/detail/2015-BMW-X1/1149425',
        )
        # result = run(playwright, url='')
        # print(result)
        print(listings, len(listings))

if __name__ == '__main__':
   asyncio.run(main())
