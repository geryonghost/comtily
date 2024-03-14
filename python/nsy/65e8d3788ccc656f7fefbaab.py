# Autos Of Chicago # Dealer Sync
import notscrapyet

##############################################################################################################################################
# CLI Arguments
##############################################################################################################################################
if len(notscrapyet.sys.argv) == 2:
    dealer_id = notscrapyet.sys.argv[1]
else:
    print('Missing required CLI arguments')
    exit()

##############################################################################################################################################
# Global variables
##############################################################################################################################################
count = page = 0
empty = False
listing_array = []

start_time = notscrapyet.datetime.now()

dealer_array = notscrapyet.dealer_get(dealer_id)
dealer_id = dealer_array[0]
dealer_name = dealer_array[1]
dealer_city = dealer_array[2]
dealer_url = dealer_array[3]
dealer_url_path = dealer_array[4]

driver = notscrapyet.selenium_open()

while not empty:
    # ############################################################################################################################################
    # Get pagnation stats
    # ############################################################################################################################################
    inventory_url = dealer_url + dealer_url_path
    print(inventory_url)

    driver = notscrapyet.selenium_get(driver,inventory_url,2,25) # Scrolls through page to display ALL listings

    if driver.title:
        posting_total = int(driver.find_element(notscrapyet.By.CLASS_NAME,'ds-page-results-value').get_attribute('innerHTML'))

        for titlebar in driver.find_elements(notscrapyet.By.CLASS_NAME,'ds-listview-vehicle-title'):
            listing_array.append(titlebar.find_element(notscrapyet.By.TAG_NAME,'a').get_attribute('href'))


        ###########################################################################################################################################
        # Collect inventory details
        ###########################################################################################################################################
        for url in listing_array:
            print(url)

            if (count == 0): driver = notscrapyet.selenium_open()
            driver = notscrapyet.selenium_get(driver,url)

            if driver.title:
                # VIN
                if driver.find_element(notscrapyet.By.CSS_SELECTOR,'meta[itemprop="vehicleIdentificationNumber"]'):
                    vin = driver.find_element(notscrapyet.By.CSS_SELECTOR,'meta[itemprop="vehicleIdentificationNumber"]').get_attribute('content')

                # auto_year
                if driver.find_element(notscrapyet.By.CSS_SELECTOR,'meta[itemprop="vehicleModelDate"]'):
                    year = driver.find_element(notscrapyet.By.CSS_SELECTOR,'meta[itemprop="vehicleModelDate"]').get_attribute('content')

                # auto_exterior_color, auto_interior_color, auto_drive_type, auto_engine_cylinders
                for options in driver.find_elements(notscrapyet.By.CLASS_NAME,'ds-vdp-feature-text-container'):
                    title = options.find_element(notscrapyet.By.CLASS_NAME,'ds-vdp-feature-title').get_attribute('innerHTML')
                    description = options.find_element(notscrapyet.By.CLASS_NAME,'ds-vdp-feature-description').get_attribute('innerHTML')
                    if title == 'Exterior': color_exterior = notscrapyet.get_exterior_color(description.strip())
                    if title == 'Interior': color_interior = notscrapyet.get_interior_color(description.strip())

                # odometer
                if driver.find_elements(notscrapyet.By.CLASS_NAME,'ds-vdp-sidebar-mileage-total-value'):
                    odometer = int(driver.find_element(notscrapyet.By.CLASS_NAME,'ds-vdp-sidebar-mileage-total-value').get_attribute('innerHTML').replace(',','').replace(' ','').strip())

                # price
                if driver.find_elements(notscrapyet.By.CLASS_NAME,'ds-vdp-sidebar-price-value'):
                    if driver.find_element(notscrapyet.By.CLASS_NAME,'ds-vdp-sidebar-price-value').get_attribute('innerHTML') == 'Call For Price':
                        price = ''
                    else:
                        price = int(driver.find_element(notscrapyet.By.CLASS_NAME,'ds-vdp-sidebar-price-value').get_attribute('innerHTML').replace('$','').replace(',','').strip())

                # description
                if driver.find_elements(notscrapyet.By.ID,'ds-vdp-description'):
                    description = driver.find_element(notscrapyet.By.ID,'ds-vdp-description').get_attribute('innerHTML').replace('<div><span style="font-size: 13.3333px;">','').replace('</span></div>','').strip()
                else:
                    description = ''

                # auto_images
                images = []
                image_container = driver.find_element(notscrapyet.By.ID,'ds-vdp-photos')
                image_urls = image_container.find_elements(notscrapyet.By.TAG_NAME,'img')
                for image in image_urls:
                    images.append('https:' + image.get_attribute('data-src'))

                # posting_id
                if driver.find_element(notscrapyet.By.CSS_SELECTOR,'meta[itemprop="sku"]'):
                    posting_id = driver.find_element(notscrapyet.By.CSS_SELECTOR,'meta[itemprop="sku"]').get_attribute('content')

                document = {
                    'vin': vin,
                    'year': year,
                    'price': price,
                    'condition': 'Used',
                    'odometer': odometer,
                    'color_exterior': color_exterior,
                    'color_interior': color_interior,
                    'description': description,
                    'images': images,
                    'posting_id': posting_id,
                    'posting_url': url,
                    'dealer_id': dealer_id,
                    'dealer_city': dealer_city,
                }

                notscrapyet.gatherContent(document)

            count += 1
            if (count > 75):
                driver.quit()
                count = 0

        empty=True

    driver.quit()

end_time = notscrapyet.datetime.now()
completion_time = end_time - start_time

print('The script took ' + str(completion_time) + ' to complete')
