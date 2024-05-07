# Environment Variables
from dotenv import load_dotenv

# Database
from pymongo import MongoClient
from bson.objectid import ObjectId

# NHTSA
import requests

# Selenium
import os,time
import undetected_chromedriver as uc
from pyvirtualdisplay import Display
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select

# # Chromium
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service as ChromiumService
# from webdriver_manager.chrome import ChromeDriverManager
# from webdriver_manager.core.os_manager import ChromeType

# Chrome
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

# Math
# import numpy

# Other
import requests, sys
from datetime import datetime

load_dotenv()
database_connection_string = os.environ['DATABASE_CONNECTION_STRING']

def db_conn():
    client = MongoClient(database_connection_string)
    dbname = client['nsy']
    return dbname




# def getYears():
#     years_array = []
#     for x in range(150): years_array.append(1900 + x)
#     return years_array

# def remove_duplicates(array):
#   return list(dict.fromkeys(array))

def gatherContent(document):
    # currentDate = datetime.now()
    if document['vin'] != '' and int(document['year']) > 1991 and document['price'] != '' and len(document['images']) != 0:
        nhtsa = nhtsa_get(document['vin'])
        if nhtsa == None:
            nhtsa = decode_vin(document['vin'], document['year'])
            nhtsa_update(nhtsa)
        else:
            nhtsa.pop('_id')

        # print(document)
        # print(nhtsa)
        adsDocument = {**document, **nhtsa, **{'status': 'active'}}
        ads_update(adsDocument)
        # dealer_billable({'delaer_id': document['dealer_id'], 'vin': document['vin'], 'date': currentDate.date()})

    else:
        ads_errors(document)

def decode_vin(vin,year):
    # auto_vin = auto_array[0]
    # auto_year = auto_array[1]
    # auto_make = auto_array[2]
    # auto_model = auto_array[3]
    # auto_series = auto_array[4]
    # auto_trim = auto_array[5]
    # auto_type = auto_array[6]
    # auto_base_price = auto_array[7]
    # auto_class = auto_array[8]
    # auto_color_exterior = auto_array[9]
    # auto_color_interior = auto_array[10]
    # auto_doors = auto_array[11]
    # auto_drive_type = auto_array[12]
    # auto_engine_cylinders = auto_array[13]
    # auto_engine_hp = auto_array[14]
    # auto_engine_liter   = auto_array[15]
    # auto_engine_turbo = auto_array[16]
    # auto_fuel_type = auto_array[17]
    # auto_note = auto_array[18]
    # auto_odometer = auto_array[19]
    # auto_price = auto_array[20]
    # auto_trans_speeds = auto_array[21]
    # auto_trans_style = auto_array[22]
    # auto_condition = auto_array[23]
    # auto_title = auto_array[24]
    # auto_url = auto_array[25]
    # auto_description = auto_array[26]
    # auto_images = auto_array[27]
    # dealer_id = auto_array[28]
    # dealer_posting_id = auto_array[29]
    # dealer_city = auto_array[30]
    # dealer_lat = auto_array[31]
    # dealer_lon = auto_array[32]

    url = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/' + str(vin) + '?modelyear=' + str(year) + '&format=json'
    nhtsa_response = requests.get(url)
    nhtsa_json = nhtsa_response.json()
    for results in nhtsa_json['Results']:
        listVar = results['Variable']
        listValue = results['Value']
        if listVar == 'Active Safety System Note': active_safety_system_note = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Adaptive Cruise Control (ACC)': adaptive_cruise_control_acc = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Adaptive Driving Beam (ADB)': adaptive_driving_beam_adb = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Additional Error Text': additional_error_text = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Anti-lock Braking System (ABS)': antilock_braking_system_abs = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Auto-Reverse System for Windows and Sunroofs': autoreverse_system_for_windows_and_sunroofs = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Automatic Crash Notification (ACN) / Advanced Automatic Crash Notification (AACN)': automatic_crash_notification_acn_advanced_automatic_crash_notification_aacn = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Automatic Pedestrian Alerting Sound (for Hybrid and EV only)': automatic_pedestrian_alerting_sound_for_hybrid_and_ev_only = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Axle Configuration': axle_configuration = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Axles': axles = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Backup Camera': backup_camera = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Base Price ($)': base_price = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Battery Current (Amps) From': battery_current_amps_from = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Battery Current (Amps) To': battery_current_amps_to = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Battery Energy (kWh) From': battery_energy_kwh_from = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Battery Energy (kWh) To': battery_energy_kwh_to = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Battery Type': battery_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Battery Voltage (Volts) From': battery_voltage_volts_from = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Battery Voltage (Volts) To': battery_voltage_volts_to = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Bed Length (inches)': bed_length_inches = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Bed Type': bed_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Blind Spot Intervention (BSI)': blind_spot_intervention_bsi = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Blind Spot Warning (BSW)': blind_spot_warning_bsw = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Body Class': body_class = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Brake System Description': brake_system_description = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Brake System Type': brake_system_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Bus Floor Configuration Type': bus_floor_configuration_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Bus Length (feet)': bus_length_feet = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Bus Type': bus_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Cab Type': cab_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Charger Level': charger_level = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Charger Power (kW)': charger_power_kw = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Cooling Type': cooling_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Crash Imminent Braking (CIB)': crash_imminent_braking_cib = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Curb Weight (pounds)': curb_weight_pounds = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Curtain Air Bag Locations': curtain_air_bag_locations = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Custom Motorcycle Type': custom_motorcycle_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Daytime Running Light (DRL)': daytime_running_light_drl = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Destination Market': destination_market = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Displacement (CC)': displacement_cc = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Displacement (CI)': displacement_ci = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Displacement (L)': displacement_l = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Doors': doors = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Drive Type': drive_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Dynamic Brake Support (DBS)': dynamic_brake_support_dbs = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Electrification Level': electrification_level = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Electronic Stability Control (ESC)': electronic_stability_control_esc = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Engine Brake (hp) From': engine_brake_hp_from = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Engine Brake (hp) To': engine_brake_hp_to = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Engine Configuration': engine_configuration = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Engine Manufacturer': engine_manufacturer = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Engine Model': engine_model = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Engine Number of Cylinders': engine_number_of_cylinders = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Engine Power (kW)': engine_power_kw = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Engine Stroke Cycles': engine_stroke_cycles = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Entertainment System': entertainment_system = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Error Code': error_code = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Error Text': error_text = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'EV Drive Unit': ev_drive_unit = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Event Data Recorder (EDR)': event_data_recorder_edr = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Forward Collision Warning (FCW)': forward_collision_warning_fcw = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Front Air Bag Locations': front_air_bag_locations = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Fuel Delivery / Fuel Injection Type': fuel_delivery_fuel_injection_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Fuel Type - Primary': fuel_type_primary = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Fuel Type - Secondary': fuel_type_secondary = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Gross Combination Weight Rating From': gross_combination_weight_rating_from = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Gross Combination Weight Rating To': gross_combination_weight_rating_to = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Gross Vehicle Weight Rating From': gross_vehicle_weight_rating_from = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Gross Vehicle Weight Rating To': gross_vehicle_weight_rating_to = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Headlamp Light Source': headlamp_light_source = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Keyless Ignition': keyless_ignition = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Knee Air Bag Locations': knee_air_bag_locations = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Lane Centering Assistance': lane_centering_assistance = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Lane Departure Warning (LDW)': lane_departure_warning_ldw = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Lane Keeping Assistance (LKA)': lane_keeping_assistance_lka = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Make': make = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Manufacturer Name': manufacturer_name = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Model': model = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Model Year': model_year = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Motorcycle Chassis Type': motorcycle_chassis_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Motorcycle Suspension Type': motorcycle_suspension_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Non-Land Use': nonland_use = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Note': note = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Number of Battery Cells per Module': number_of_battery_cells_per_module = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Number of Battery Modules per Pack': number_of_battery_modules_per_pack = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Number of Battery Packs per Vehicle': number_of_battery_packs_per_vehicle = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Number of Seat Rows': number_of_seat_rows = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Number of Seats': number_of_seats = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Number of Wheels': number_of_wheels = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Other Battery Info': other_battery_info = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Other Bus Info': other_bus_info = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Other Engine Info': other_engine_info = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Other Motorcycle Info': other_motorcycle_info = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Other Restraint System Info': other_restraint_system_info = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Other Trailer Info': other_trailer_info = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Parking Assist': parking_assist = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Pedestrian Automatic Emergency Braking (PAEB)': pedestrian_automatic_emergency_braking_paeb = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Plant City': plant_city = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Plant Company Name': plant_company_name = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Plant Country': plant_country = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Plant State': plant_state = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Possible Values': possible_values = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Pretensioner': pretensioner = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Rear Automatic Emergency Braking': rear_automatic_emergency_braking = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Rear Cross Traffic Alert': rear_cross_traffic_alert = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'SAE Automation Level From': sae_automation_level_from = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'SAE Automation Level To': sae_automation_level_to = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Seat Belt Type': seat_belt_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Seat Cushion Air Bag Locations': seat_cushion_air_bag_locations = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Semiautomatic Headlamp Beam Switching': semiautomatic_headlamp_beam_switching = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Series': series = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Series2': series2 = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Side Air Bag Locations': side_air_bag_locations = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Steering Location': steering_location = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Suggested VIN': suggested_vin = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Tire Pressure Monitoring System (TPMS) Type': tire_pressure_monitoring_system_tpms_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Top Speed (MPH)': top_speed_mph = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Track Width (inches)': track_width_inches = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Traction Control': traction_control = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Trailer Body Type': trailer_body_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Trailer Length (feet)': trailer_length_feet = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Trailer Type Connection': trailer_type_connection = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Transmission Speeds': transmission_speeds = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Transmission Style': transmission_style = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Trim': trim = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Trim2': trim2 = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Turbo': turbo = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Valve Train Design': valve_train_design = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Vehicle Descriptor': vehicle_descriptor = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Vehicle Type': vehicle_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Wheel Base (inches) From': wheel_base_inches_from = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Wheel Base (inches) To': wheel_base_inches_to = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Wheel Base Type': wheel_base_type = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Wheel Size Front (inches)': wheel_size_front_inches = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Wheel Size Rear (inches)': wheel_size_rear_inches = '' if listValue == 'NULL' or listValue == None else listValue
        if listVar == 'Windows': windows = '' if listValue == 'NULL' or listValue == None else listValue

        # if listVar == 'Make': auto_make = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Model': auto_model = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Model Year': auto_year = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Series': auto_series = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Trim': auto_trim = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Vehicle Type': auto_type = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Note': auto_note = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Base Price ($)': auto_base_price = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Body Class': auto_class = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Doors': auto_doors = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Transmission Style': auto_trans_style = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Transmission Speeds': auto_trans_speeds = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Drive Type': auto_drive_type = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Engine Number of Cylinders': auto_engine_cylinders = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Displacement (L)': auto_engine_liter = '' if listValue == 'NULL' or listValue == None else listValue
        # if listVar == 'Fuel Type - Primary': auto_fuel_type = '' if listValue == 'NULL' or listValue == None else listValue
        # # if listVar == 'Engine Brake (hp) From': auto_engine_hp = '' if listValue == 'NULL' or listValue == None else listValue
        # # if listVar == 'Turbo': auto_engine_turbo = '' if listValue == 'NULL' or listValue == None else listValue

    if body_class == 'Sedan/Saloon': body_class = 'Sedan'
    elif body_class.find('SUV') != -1: body_class = 'SUV'

    if transmission_style == 'Manual/Standard': transmission_style = 'Manual'
    if transmission_style == '': transmission_style = 'Unknown'

    if drive_type == '4WD/4-Wheel Drive/4x4': drive_type = '4WD'
    elif drive_type == 'AWD/All-Wheel Drive': drive_type = 'AWD'
    elif drive_type == 'FWD/Front-Wheel Drive' or drive_type == '4x2': drive_type = 'FWD'
    elif drive_type == 'RWD/Rear-Wheel Drive': drive_type = 'RWD'

    document = {
        'vin': vin,
        'active_safety_system_note': active_safety_system_note,
        'adaptive_cruise_control_acc': adaptive_cruise_control_acc,
        'adaptive_driving_beam_adb': adaptive_driving_beam_adb,
        'additional_error_text': additional_error_text,
        'antilock_braking_system_abs': antilock_braking_system_abs,
        'autoreverse_system_for_windows_and_sunroofs': autoreverse_system_for_windows_and_sunroofs,
        'automatic_crash_notification_acn_advanced_automatic_crash_notification_aacn': automatic_crash_notification_acn_advanced_automatic_crash_notification_aacn,
        'automatic_pedestrian_alerting_sound_for_hybrid_and_ev_only': automatic_pedestrian_alerting_sound_for_hybrid_and_ev_only,
        'axle_configuration': axle_configuration,
        'axles': axles,
        'backup_camera': backup_camera,
        'base_price': base_price,
        'battery_current_amps_from': battery_current_amps_from,
        'battery_current_amps_to': battery_current_amps_to,
        'battery_energy_kwh_from': battery_energy_kwh_from,
        'battery_energy_kwh_to': battery_energy_kwh_to,
        'battery_type': battery_type,
        'battery_voltage_volts_from': battery_voltage_volts_from,
        'battery_voltage_volts_to': battery_voltage_volts_to,
        'bed_length_inches': bed_length_inches,
        'bed_type': bed_type,
        'blind_spot_intervention_bsi': blind_spot_intervention_bsi,
        'blind_spot_warning_bsw': blind_spot_warning_bsw,
        'body_class': body_class,
        'brake_system_description': brake_system_description,
        'brake_system_type': brake_system_type,
        'bus_floor_configuration_type': bus_floor_configuration_type,
        'bus_length_feet': bus_length_feet,
        'bus_type': bus_type,
        'cab_type': cab_type,
        'charger_level': charger_level,
        'charger_power_kw': charger_power_kw,
        'cooling_type': cooling_type,
        'crash_imminent_braking_cib': crash_imminent_braking_cib,
        'curb_weight_pounds': curb_weight_pounds,
        'curtain_air_bag_locations': curtain_air_bag_locations,
        'custom_motorcycle_type': custom_motorcycle_type,
        'daytime_running_light_drl': daytime_running_light_drl,
        'destination_market': destination_market,
        'displacement_cc': displacement_cc,
        'displacement_ci': displacement_ci,
        'displacement_l': displacement_l,
        'doors': doors,
        'drive_type': drive_type,
        'dynamic_brake_support_dbs': dynamic_brake_support_dbs,
        'electrification_level': electrification_level,
        'electronic_stability_control_esc': electronic_stability_control_esc,
        'engine_brake_hp_from': engine_brake_hp_from,
        'engine_brake_hp_to': engine_brake_hp_to,
        'engine_configuration': engine_configuration,
        'engine_manufacturer': engine_manufacturer,
        'engine_model': engine_model,
        'engine_number_of_cylinders': engine_number_of_cylinders,
        'engine_power_kw': engine_power_kw,
        'engine_stroke_cycles': engine_stroke_cycles,
        'entertainment_system': entertainment_system,
        'error_code': error_code,
        'error_text': error_text,
        'ev_drive_unit': ev_drive_unit,
        'event_data_recorder_edr': event_data_recorder_edr,
        'forward_collision_warning_fcw': forward_collision_warning_fcw,
        'front_air_bag_locations': front_air_bag_locations,
        'fuel_delivery_fuel_injection_type': fuel_delivery_fuel_injection_type,
        'fuel_type_primary': fuel_type_primary,
        'fuel_type_secondary': fuel_type_secondary,
        'gross_combination_weight_rating_from': gross_combination_weight_rating_from,
        'gross_combination_weight_rating_to': gross_combination_weight_rating_to,
        'gross_vehicle_weight_rating_from': gross_vehicle_weight_rating_from,
        'gross_vehicle_weight_rating_to': gross_vehicle_weight_rating_to,
        'headlamp_light_source': headlamp_light_source,
        'keyless_ignition': keyless_ignition,
        'knee_air_bag_locations': knee_air_bag_locations,
        'lane_centering_assistance': lane_centering_assistance,
        'lane_departure_warning_ldw': lane_departure_warning_ldw,
        'lane_keeping_assistance_lka': lane_keeping_assistance_lka,
        'make': make,
        'manufacturer_name': manufacturer_name,
        'model': model,
        'model_year': model_year,
        'motorcycle_chassis_type': motorcycle_chassis_type,
        'motorcycle_suspension_type': motorcycle_suspension_type,
        'nonland_use': nonland_use,
        'note': note,
        'number_of_battery_cells_per_module': number_of_battery_cells_per_module,
        'number_of_battery_modules_per_pack': number_of_battery_modules_per_pack,
        'number_of_battery_packs_per_vehicle': number_of_battery_packs_per_vehicle,
        'number_of_seat_rows': number_of_seat_rows,
        'number_of_seats': number_of_seats,
        'number_of_wheels': number_of_wheels,
        'other_battery_info': other_battery_info,
        'other_bus_info': other_bus_info,
        'other_engine_info': other_engine_info,
        'other_motorcycle_info': other_motorcycle_info,
        'other_restraint_system_info': other_restraint_system_info,
        'other_trailer_info': other_trailer_info,
        'parking_assist': parking_assist,
        'pedestrian_automatic_emergency_braking_paeb': pedestrian_automatic_emergency_braking_paeb,
        'plant_city': plant_city,
        'plant_company_name': plant_company_name,
        'plant_country': plant_country,
        'plant_state': plant_state,
        'possible_values': possible_values,
        'pretensioner': pretensioner,
        'rear_automatic_emergency_braking': rear_automatic_emergency_braking,
        'rear_cross_traffic_alert': rear_cross_traffic_alert,
        'sae_automation_level_from': sae_automation_level_from,
        'sae_automation_level_to': sae_automation_level_to,
        'seat_belt_type': seat_belt_type,
        'seat_cushion_air_bag_locations': seat_cushion_air_bag_locations,
        'semiautomatic_headlamp_beam_switching': semiautomatic_headlamp_beam_switching,
        'series': series,
        'series2': series2,
        'side_air_bag_locations': side_air_bag_locations,
        'steering_location': steering_location,
        'suggested_vin': suggested_vin,
        'tire_pressure_monitoring_system_tpms_type': tire_pressure_monitoring_system_tpms_type,
        'top_speed_mph': top_speed_mph,
        'track_width_inches': track_width_inches,
        'traction_control': traction_control,
        'trailer_body_type': trailer_body_type,
        'trailer_length_feet': trailer_length_feet,
        'trailer_type_connection': trailer_type_connection,
        'transmission_speeds': transmission_speeds,
        'transmission_style': transmission_style,
        'trim': trim,
        'trim2': trim2,
        'turbo': turbo,
        'valve_train_design': valve_train_design,
        'vehicle_descriptor': vehicle_descriptor,
        'vehicle_type': vehicle_type,
        'wheel_base_inches_from': wheel_base_inches_from,
        'wheel_base_inches_to': wheel_base_inches_to,
        'wheel_base_type': wheel_base_type,
        'wheel_size_front_inches': wheel_size_front_inches,
        'wheel_size_rear_inches': wheel_size_rear_inches,
        'windows': windows,
    }

    return document


    # if nhtsa_json['Message'].find('Results returned successfully') != -1:
    #     autos_db = db_conn()
    #     autos_cursor = autos_db.cursor()

    #     autos_cursor.execute('SELECT id FROM ads WHERE auto_vin = "' + auto_vin + '" AND auto_year = ' + auto_year)
    #     ad_exists = autos_cursor.fetchall()
    #     if len(ad_exists) > 0:
    #         print('Update Ad')
    #         sql = 'UPDATE ads SET auto_vin=%s,auto_year=%s,auto_make=%s,auto_model=%s,auto_series=%s,auto_trim=%s,auto_type=%s,auto_base_price=%s,auto_class=%s,auto_color_exterior=%s,auto_color_exterior_search=%s,auto_color_interior=%s,auto_color_interior_search=%s,auto_doors=%s,auto_drive_type=%s,auto_engine_cylinders=%s,auto_engine_liter=%s,auto_fuel_type=%s,auto_note=%s,auto_odometer=%s,auto_price=%s,auto_trans_speeds=%s,auto_trans_style=%s,auto_condition=%s,auto_title=%s,auto_url=%s,auto_description=%s,auto_images=%s,dealer_id=%s,dealer_posting_id=%s,dealer_city=%s,dealer_lat=%s,dealer_lon=%s WHERE auto_vin=%s AND auto_year=%s'
    #         val = (auto_vin,auto_year,auto_make,auto_model,auto_series,auto_trim,auto_type,auto_base_price,auto_class,auto_color_exterior,auto_color_exterior_search,auto_color_interior,auto_color_interior_search,auto_doors,auto_drive_type,auto_engine_cylinders,auto_engine_liter,auto_fuel_type,auto_note,auto_odometer,auto_price,auto_trans_speeds,auto_trans_style,auto_condition,auto_title,auto_url,auto_description,",".join(str(x) for x in auto_images),dealer_id,dealer_posting_id,dealer_city,dealer_lat,dealer_lon,auto_vin,auto_year)
    #         try:
    #             autos_cursor.execute(sql,val)
    #             autos_db.commit()
    #             print('The ad was updated in the DB')
    #             ad_status = 0
    #         except mysql.connector.Error as err:
    #             print(err)
    #             print(autos_cursor._executed)
    #             ad_erad_statusror = 1
    #     else:
    #         print('Insert Ad')
    #         sql = 'INSERT INTO ads (auto_vin,auto_year,auto_make,auto_model,auto_series,auto_trim,auto_type,auto_base_price,auto_class,auto_color_exterior,auto_color_exterior_search,auto_color_interior,auto_color_interior_search,auto_doors,auto_drive_type,auto_engine_cylinders,auto_engine_liter,auto_fuel_type,auto_note,auto_odometer,auto_price,auto_trans_speeds,auto_trans_style,auto_condition,auto_title,auto_url,auto_description,auto_images,dealer_id,dealer_posting_id,dealer_city,dealer_lat,dealer_lon) VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'
    #         val = (auto_vin,auto_year,auto_make,auto_model,auto_series,auto_trim,auto_type,auto_base_price,auto_class,auto_color_exterior,auto_color_exterior_search,auto_color_interior,auto_color_interior_search,auto_doors,auto_drive_type,auto_engine_cylinders,auto_engine_liter,auto_fuel_type,auto_note,auto_odometer,auto_price,auto_trans_speeds,auto_trans_style,auto_condition,auto_title,auto_url,auto_description,",".join(str(x) for x in auto_images),dealer_id,dealer_posting_id,dealer_city,dealer_lat,dealer_lon)

    #         try:
    #             autos_cursor.execute(sql,val)
    #             autos_db.commit()
    #             print('The ad was inserted in the DB')
    #             ad_status = 0
    #         except mysql.connector.Error as err:
    #             print(err)
    #             print(autos_cursor._executed)
    #             ad_status = 1
    #     autos_db.close()

    # return ad_status

# def selenium_display():
#     chromedriver_path = '/Users/geryonghost/gitrepos/comtily/scripts/chromedriver'
#     chrome_options = webdriver.ChromeOptions()
# # chrome_options.add_argument('--headless')  # Uncomment to run Chrome in headless mode

# # Create a new instance of the Chrome driver
# driver = webdriver.Chrome(service=Service(executable_path=chromedriver_path), options=chrome_options)
def get_exterior_color(color):
    if color.lower().find('black') != -1: simple_color = 'black'
    elif color.lower().find('blue') != -1: simple_color = 'blue'
    elif color.lower().find('gray') != -1 or color.lower().find('grey') != -1: simple_color = 'gray'
    elif color.lower().find('silver') != -1: simple_color = 'silver'
    elif color.lower().find('white') != -1: simple_color = 'white'
    else: simple_color = ''

    return [color,simple_color]

def get_interior_color(color):
    if color.lower().find('black') != -1: simple_color = 'black'
    elif color.lower().find('blue') != -1: simple_color = 'blue'
    elif color.lower().find('gray') != -1 or color.lower().find('grey') != -1: simple_color = 'gray'
    elif color.lower().find('silver') != -1: simple_color = 'silver'
    elif color.lower().find('white') != -1: simple_color = 'white'
    else: simple_color = ''

    return [color,simple_color]

def selenium_open():
    options = webdriver.ChromeOptions()
    options.add_argument('--remote-debugging-port=9222')
    options.add_argument('--no-sandbox')
    options.add_argument("--disable-setuid-sandbox")
    options.add_argument("--disable-dev-shm-using")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-gpu")
    options.add_argument("--start-maximized")
    options.add_argument('--headless')  # Uncomment to run Chrome in headless mode
    # Chrome
    driver = uc.Chrome(service=ChromeService(ChromeDriverManager().install()),options=options)
    # Chromium
    # driver = uc.Chrome(service=ChromiumService(ChromeDriverManager(chrome_type=ChromeType.CHROMIUM).install()),options=options)
    # driver = uc.Chrome(options=options)
    return driver

def selenium_get(driver,url,delay=0,scroll=0):
    try:
        driver.get(url)
        if scroll > 0:
            for i in range(1,scroll):
                driver.execute_script('window.scrollTo(1,50000)')
                time.sleep(delay)
        time.sleep(delay)
    except Exception as err:
        print('Error ' + str(err))
        ads_errors({'url': url, 'error': err})
    return driver



# def ads_check_status( vin):
#     dbname = db_conn()
#     ads = dbname["ads"]
#     filter = {'vin': vin}
#     count = ads.count_documents(filter)
#     if (count == 1): return 'update'
#     else: return 'insert'

# def ads_insert( content):
#     dbname = db_conn()
#     ads = dbname["ads"]
#     ads.insert_one(content)
#     return 'success'

def ads_errors(document):
    dbName = db_conn()
    dbTable = dbName['ads_errors']
    dbTable.insert_one(document)

def ads_missing(document):
    dbName = db_conn()
    dbTable = dbName['ads_missing']
    filter = {'vin': document['vin']}
    dbTable.update_one(filter, {'$set': document}, upsert=True)

def ads_update(document):
    dbName = db_conn()
    dbTable = dbName["ads"]
    filter = {'vin': document['vin']}
    dbTable.update_one(filter, {'$set': document}, upsert=True)


def dealer_get(id):
    dbname = db_conn()
    dealers = dbname["dealers"]

    filter = { '_id': ObjectId(id) }
    dealer_details = dealers.find(filter)

    for dealer in dealer_details:
        dealer_array = [str(dealer['_id']),dealer['name'],dealer['address_city'],dealer['url'],dealer['url_path']]
    return dealer_array

def dealer_billable(document):
    dbName = db_conn()
    dbBillable = dbName['dealer_billable']
    filter = {'_id': document['id'], 'vin': document['vin'], 'date': document['date']}
    dbBillable.update_one(filter, {'$set': document}, upsert=True)
# def ads_delete( dealer, postings):
#     dbname = db_conn()
#     ads = dbname["ads"]
#     filter = {'dealer_id': dealer, 'posting_id': {'$nin': postings}}
#     count = ads.delete_many(filter)
#     return count.deleted_count

# def remove_stale_records(dealer_id,dealer_posting_id):
#     autos_db = db_conn()
#     deleted_ads = 0
#     autos_cursor = autos_db.cursor()

#     try:
#         sql = 'SELECT dealer_posting_id FROM ads WHERE dealer_id = ' + str(dealer_id)
#         autos_cursor.execute(sql)
#         for posting_id in autos_cursor.fetchall():
#             sql = 'DELETE FROM ads WHERE dealer_posting_id = "' + posting_id[0] + '"'
#             if posting_id[0] not in dealer_posting_id:
#                 autos_cursor.execute(sql)
#                 deleted_ads += 1
#         autos_db.commit()
#     except mysql.connector.Error as err:
#         print(err)
#         print(autos_cursor._executed)
#     try:
#         sql = 'SELECT dealer_posting_id FROM ads_exceptions WHERE dealer_id = ' + str(dealer_id)
#         autos_cursor.execute(sql)
#         for posting_id in autos_cursor.fetchall():
#             if posting_id[0] not in dealer_posting_id:
#                 sql = 'DELETE FROM ads_exceptions WHERE dealer_posting_id = ' + posting_id[0]
#                 autos_cursor.execute(sql)
#         autos_db.commit()
#     except mysql.connector.Error as err:
#         print(err)
#         print(autos_cursor._executed)
#     try:
#         sql = 'SELECT dealer_posting_id FROM ads_skipped WHERE dealer_id = ' + str(dealer_id)
#         autos_cursor.execute(sql)
#         for posting_id in autos_cursor.fetchall():
#             if posting_id[0] not in dealer_posting_id:
#                 sql = 'DELETE FROM ads_skipped WHERE dealer_posting_id = "' + posting_id[0] + '"'
#                 autos_cursor.execute(sql)
#         autos_db.commit()
#     except mysql.connector.Error as err:
#         print(err)
#         print(autos_cursor._executed)
#     autos_db.close()

#     return deleted_ads

# def dealer_update( dealer_id, dealer):
#     dbname = db_conn()
#     ads = dbname['dealers']
#     filter = {'_id': ObjectId(dealer_id)}
#     ads.update_one(filter, {'$set': dealer})

def nhtsa_update(document):
      dbName = db_conn()
      dbTable = dbName['nhtsa']
      filter = {'vin': document['vin']}
      dbTable.update_one(filter, {'$set': document}, upsert=True)

def nhtsa_get(vin):
      dbName = db_conn()
      dbTable = dbName['nhtsa']
      filter = {'vin': vin}
      results = dbTable.find_one(filter)
      return results



# def update_dealer_record(dealer_array):
#     listing_count = dealer_array[0]
#     ad_count = dealer_array[1]
#     ad_deleted = dealer_array[2]
#     ad_noprice = dealer_array[3]
#     ad_errors = dealer_array[4]
#     completion_time = dealer_array[5]
#     dealer_id = dealer_array[6]

#     autos_db = db_conn()

#     sql = 'UPDATE dealers SET total_listings = %s,total_processed = %s,total_deleted = %s,total_no_price = %s,total_errors = %s,runtime = %s WHERE id = %s'
#     val = (listing_count,ad_count,ad_deleted,ad_noprice,ad_errors,completion_time,dealer_id)
#     update_cursor = autos_db.cursor()
#     update_cursor.execute(sql, val)
#     autos_db.commit()

#     autos_db.close()
