# Bill Kay Chevrolet # Dealer Inspire
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
env = 'dev'

posting_id_array = []
ad_count = 0
ad_noprice = 0
ad_errors = 0
listing_count = 0

page = 0
empty = False
listing_array = []

# years_array = notscrapyet.getYears()
# from pyvirtualdisplay import Display
# display = Display(visible=0, size=(800, 800))
# display = notscrapyet.Display(visible=0, size=(800, 800))
# display.start()
# driver = notscrapyet.selenium_open()

start_time = notscrapyet.datetime.now()

dealer_array = notscrapyet.dealer_get(dealer_id)
# dealer_id = dealer_array[0][0]
# dealer_name = dealer_array[0][1]
# dealer_city = dealer_array[0][2]
# dealer_lat = dealer_array[0][3]
# dealer_lon = dealer_array[0][4]
# dealer_url = dealer_array[0][5]
# dealer_url_path = dealer_array[0][6]




# while not empty:
#     ##############################################################################################################################################
#     # Get pagnation stats
#     ##############################################################################################################################################
#     inventory_url = dealer_url + dealer_url_path + '/?_p=0&_dFR[type][0]=Used&_dFR[type][1]=Certified%2520Used'
#     # print(inventory_url)

#     driver = notscrapyet.selenium_get(driver,inventory_url)

#     if driver.title:
#         posting_total = int(driver.title[:driver.title.find(' ')])
#         page_size = 20
#         page_total = int(notscrapyet.numpy.ceil(posting_total / page_size))
        # print(posting_total)

#         ##############################################################################################################################################
#         # Get list of inventory URLs
#         ##############################################################################################################################################
#         for page in range(page_total):
#             page_url = dealer_url + dealer_url_path + '/?_p=' + str(page) + '&_dFR[type][0]=Used&_dFR[type][1]=Certified%2520Used'
#             print(page_url)

#             driver = notscrapyet.selenium_get(driver,page_url)

#             if driver.title:
#                 href_array = []
#                 href_elements = driver.find_elements(notscrapyet.By.TAG_NAME,'a')
#                 for href in href_elements:
#                     href = href.get_attribute('href')
#                     href_array.append(href)

#                 for url in range(len(href_array)):
#                     if str(href_array[url]).find('/inventory/') != -1:
#                         listing_array.append(str(href_array[url]))
#                         # listing_count += 1

#         listing_array = notscrapyet.remove_duplicates(listing_array)
#         listing_count = len(listing_array)
#         driver.quit()
#         notscrapyet.time.sleep(10)

#         # listing_array = []
#         # listing_array.append('https://www.billkaychevrolet.com/inventory/used-2017-chevrolet-sonic-lt-fwd-4d-sedan-1g1jd5sh2h4106696/')
#         ##############################################################################################################################################
#         # Collect inventory details
#         ##############################################################################################################################################
#         driver = notscrapyet.selenium_open()
#         for auto_url in listing_array:
#             print(auto_url)

#             driver = notscrapyet.selenium_get(driver,auto_url)

#             if driver.title:
#                 # auto_vin
#                 if driver.find_elements(notscrapyet.By.ID,'vin'): auto_vin = driver.find_element(notscrapyet.By.ID,'vin').get_attribute('innerHTML').strip()

#                 # auto_year
#                 year_search = driver.find_element(notscrapyet.By.CLASS_NAME,'vdp-title__vehicle-info').find_element(notscrapyet.By.TAG_NAME,'h1').get_attribute('innerHTML')
#                 for year in years_array:
#                     if year_search.find(str(year)) != -1: auto_year = year

#                 # auto_make
#                 # auto_model
#                 # auto_series
#                 # auto_trim
#                 # auto_type
#                 # auto_base_price
#                 # auto_class
#                 # auto_color_exterior, auto_color_interior, auto_drive_type, auto_odometer
#                 for options in driver.find_elements(notscrapyet.By.CLASS_NAME,'basic-info-item'):
#                     # print(options.text)
#                     title = options.find_element(notscrapyet.By.CLASS_NAME,'basic-info-item__label').text
#                     description = options.find_element(notscrapyet.By.CLASS_NAME,'basic-info-item__value-wrapper').text
#                     if title.lower() == 'exterior:': auto_color_exterior = description.strip()
#                     if title.lower() == 'interior:': auto_color_interior = description.strip()
#                     if title.lower() == 'drivetrain:': auto_drive_type = description.strip()
#                     if title.lower() == 'mileage:': auto_odometer = description.replace(',','').strip()
#                     if title.lower() == 'engine': engine = description.strip()
#                     if title.lower() == 'transmittion': transmission = description.strip()

#                 # auto_doors
#                 # auto_drive_type
#                 # auto_engine_cylinders
#                 # auto_engine_hp
#                 # auto_engine_liter
#                 # auto_engine_turbo
#                 # auto_fuel_type
#                 # auto_note
#                 # auto_odometer

#                 # auto_price
#                 if driver.find_elements(notscrapyet.By.CLASS_NAME,'price'):
#                     auto_price = int(driver.find_element(notscrapyet.By.CLASS_NAME,'price').text.strip().replace('$','').replace(',','').strip())
#                 else: auto_price = ''

#                 # auto_trans_speeds
#                 # auto_trans_style

#                 # auto_condition
#                 auto_condition = 'Used'

#                 # auto_title
#                 auto_title = ''

#                 # auto_url

#                 # auto_description
#                 if driver.find_elements(notscrapyet.By.ID,'vehicle-description'):
#                     auto_description = driver.find_element(notscrapyet.By.ID,'vehicle-description').find_element(notscrapyet.By.TAG_NAME,'div').text
#                 else: auto_description = ''

#                 # auto_images
#                 auto_images = []
#                 images = driver.find_element(notscrapyet.By.CLASS_NAME,'swiper-wrapper').find_elements(notscrapyet.By.TAG_NAME,'img')
#                 for image in images:
#                     if image.get_attribute('src') != None: auto_images.append(image.get_attribute('src'))
#                     elif image.get_attribute('data-src') != None: auto_images.append(image.get_attribute('data-src'))

#                 # dealer_id

#                 # dealer_posting_id
#                 if driver.find_element(notscrapyet.By.CLASS_NAME,'stock') != None: dealer_posting_id = driver.find_element(notscrapyet.By.CLASS_NAME,'stock').get_attribute('innerHTML').replace('Stock: ','').strip()

#                 # dealer_city
#                 # dealer_lat
#                 # dealer_lon

#                 if auto_year > 1900 and auto_vin != '' and auto_price != '' and len(auto_images) != 0:
#                     auto_array = []
#                     auto_make = ''
#                     auto_model = ''
#                     auto_series = ''
#                     auto_trim = ''
#                     auto_type = ''
#                     auto_base_price = ''
#                     auto_class = ''
#                     auto_doors = ''
#                     auto_engine_cylinders = ''
#                     auto_engine_hp = ''
#                     auto_engine_liter = ''
#                     auto_engine_turbo = ''
#                     auto_fuel_type = ''
#                     auto_note = ''
#                     auto_trans_speeds = ''
#                     auto_trans_style = ''

#                     auto_array.append(auto_vin)
#                     auto_array.append(auto_year)
#                     auto_array.append(auto_make)
#                     auto_array.append(auto_model)
#                     auto_array.append(auto_series)
#                     auto_array.append(auto_trim)
#                     auto_array.append(auto_type)
#                     auto_array.append(auto_base_price)
#                     auto_array.append(auto_class)
#                     auto_array.append(auto_color_exterior)
#                     auto_array.append(auto_color_interior)
#                     auto_array.append(auto_doors)
#                     auto_array.append(auto_drive_type)
#                     auto_array.append(auto_engine_cylinders)
#                     auto_array.append(auto_engine_hp)
#                     auto_array.append(auto_engine_liter)
#                     auto_array.append(auto_engine_turbo)
#                     auto_array.append(auto_fuel_type)
#                     auto_array.append(auto_note)
#                     auto_array.append(auto_odometer)
#                     auto_array.append(auto_price)
#                     auto_array.append(auto_trans_speeds)
#                     auto_array.append(auto_trans_style)
#                     auto_array.append(auto_condition)
#                     auto_array.append(auto_title)
#                     auto_array.append(auto_url)
#                     auto_array.append(auto_description)
#                     auto_array.append(auto_images)
#                     auto_array.append(dealer_id)
#                     auto_array.append(dealer_posting_id)
#                     auto_array.append(dealer_city)
#                     auto_array.append(dealer_lat)
#                     auto_array.append(dealer_lon)

#                     decoded = notscrapyet.decode_vin(auto_array)

#                     if decoded == 0:
#                         ad_count += 1
#                         posting_id_array.append(dealer_posting_id)
#                     elif decoded == 1:
#                         ad_errors += 1
#                         posting_id_array.append(dealer_posting_id)
#                 elif auto_price == '': ad_noprice += 1; print('No price')
#                 posting_id_array.append(dealer_posting_id)
#             notscrapyet.time.sleep(2)

#         empty=True

#     driver.quit()
#     if display.is_alive: display.stop()

#     ad_deleted = notscrapyet.remove_stale_records(dealer_id,posting_id_array)
# else:
#     print('Missing command line parameters')
#     exit()

# end_time = notscrapyet.datetime.now()
# completion_time = end_time - start_time

# print('The script took ' + str(completion_time) + ' to complete')

# dealer_array = []
# dealer_array.append(listing_count)
# dealer_array.append(ad_count)
# dealer_array.append(ad_deleted)
# dealer_array.append(ad_noprice)
# dealer_array.append(ad_errors)
# dealer_array.append(completion_time)
# dealer_array.append(dealer_id)

# notscrapyet.update_dealer_record(dealer_array)
