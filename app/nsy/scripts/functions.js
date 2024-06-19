const fs = require('fs')
const papa = require('papaparse')

async function readFileContent(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8')
        return content
    } catch (error) {
        console.error('Error reading file:', error)
        return error
    }
}

async function parseFileContent(fileContent) {
    try {
        const content = papa.parse(fileContent, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
        })
        return content.data
    } catch (error) {
        console.error('Error reading file:', error)
        return error
    }
    // papa.parse(data, {
    //       complete: function (results) {
    //           // Respond with parsed data
    //           // res.json(results.data)
    //           // console.log(results.data)

    //       },
    //       header: true,
    //       dynamicTyping: true,
    //       skipEmptyLines: true
    //   })
}

// const axios = require('axios'); // Used to connect to remote APIs

// async function decode_vin(auto_array) {
//     const auto_vin = '1FTYR14V0YPA56155' // Ranger
//     const auto_year = '2000'
//     // auto_vin = '3VWBB21C42M407954' // Beetle
//     // auto_year = '2002'
//     // auto_vin = 'WMEEK31X08K192017' // Fortwo
//     // auto_year = '2008'
//     // auto_vin = '5TDDK3DC0BS023103' // Sienna
//     // auto_year = '2011'
//     // auto_vin = 'WBXHT3C36J5L25194' // X1
//     // auto_year = '2018'

//     let active_safety_system_note = ''
//     let adaptive_cruise_control_acc = ''
//     let adaptive_driving_beam_adb = ''
//     let additional_error_text = ''
//     let antilock_braking_system_abs = ''
//     let autoreverse_system_for_windows_and_sunroofs = ''
//     let automatic_crash_notification_acn_advanced_automatic_crash_notification_aacn = ''
//     let automatic_pedestrian_alerting_sound_for_hybrid_and_ev_only = ''
//     let axle_configuration = ''
//     let axles = ''
//     let backup_camera = ''
//     let base_price = ''
//     let battery_current_amps_from = ''
//     let battery_current_amps_to = ''
//     let battery_energy_kwh_from = ''
//     let battery_energy_kwh_to = ''
//     let battery_type = ''
//     let battery_voltage_volts_from = ''
//     let battery_voltage_volts_to = ''
//     let bed_length_inches = ''
//     let bed_type = ''
//     let blind_spot_intervention_bsi = ''
//     let blind_spot_warning_bsw = ''
//     let body_class = ''
//     let brake_system_description = ''
//     let brake_system_type = ''
//     let bus_floor_configuration_type = ''
//     let bus_length_feet = ''
//     let bus_type = ''
//     let cab_type = ''
//     let charger_level = ''
//     let charger_power_kw = ''
//     let cooling_type = ''
//     let crash_imminent_braking_cib = ''
//     let curb_weight_pounds = ''
//     let curtain_air_bag_locations = ''
//     let custom_motorcycle_type = ''
//     let daytime_running_light_drl = ''
//     let destination_market = ''
//     let displacement_cc = ''
//     let displacement_ci = ''
//     let displacement_l = ''
//     let doors = ''
//     let drive_type = ''
//     let dynamic_brake_support_dbs = ''
//     let electrification_level = ''
//     let electronic_stability_control_esc = ''
//     let engine_brake_hp_from = ''
//     let engine_brake_hp_to = ''
//     let engine_configuration = ''
//     let engine_manufacturer = ''
//     let engine_model = ''
//     let engine_number_of_cylinders = ''
//     let engine_power_kw = ''
//     let engine_stroke_cycles = ''
//     let entertainment_system = ''
//     let error_code = ''
//     let error_text = ''
//     let ev_drive_unit = ''
//     let event_data_recorder_edr = ''
//     let forward_collision_warning_fcw = ''
//     let front_air_bag_locations = ''
//     let fuel_delivery_fuel_injection_type = ''
//     let fuel_type_primary = ''
//     let fuel_type_secondary = ''
//     let gross_combination_weight_rating_from = ''
//     let gross_combination_weight_rating_to = ''
//     let gross_vehicle_weight_rating_from = ''
//     let gross_vehicle_weight_rating_to = ''
//     let headlamp_light_source = ''
//     let keyless_ignition = ''
//     let knee_air_bag_locations = ''
//     let lane_centering_assistance = ''
//     let lane_departure_warning_ldw = ''
//     let lane_keeping_assistance_lka = ''
//     let make = ''
//     let manufacturer_name = ''
//     let model = ''
//     let model_year = ''
//     let motorcycle_chassis_type = ''
//     let motorcycle_suspension_type = ''
//     let nonland_use = ''
//     let note = ''
//     let number_of_battery_cells_per_module = ''
//     let number_of_battery_modules_per_pack = ''
//     let number_of_battery_packs_per_vehicle = ''
//     let number_of_seat_rows = ''
//     let number_of_seats = ''
//     let number_of_wheels = ''
//     let other_battery_info = ''
//     let other_bus_info = ''
//     let other_engine_info = ''
//     let other_motorcycle_info = ''
//     let other_restraint_system_info = ''
//     let other_trailer_info = ''
//     let parking_assist = ''
//     let pedestrian_automatic_emergency_braking_paeb = ''
//     let plant_city = ''
//     let plant_company_name = ''
//     let plant_country = ''
//     let plant_state = ''
//     let possible_values = ''
//     let pretensioner = ''
//     let rear_automatic_emergency_braking = ''
//     let rear_cross_traffic_alert = ''
//     let sae_automation_level_from = ''
//     let sae_automation_level_to = ''
//     let seat_belt_type = ''
//     let seat_cushion_air_bag_locations = ''
//     let semiautomatic_headlamp_beam_switching = ''
//     let series = ''
//     let series2 = ''
//     let side_air_bag_locations = ''
//     let steering_location = ''
//     let suggested_vin = ''
//     let tire_pressure_monitoring_system_tpms_type = ''
//     let top_speed_mph = ''
//     let track_width_inches = ''
//     let traction_control = ''
//     let trailer_body_type = ''
//     let trailer_length_feet = ''
//     let trailer_type_connection = ''
//     let transmission_speeds = ''
//     let transmission_style = ''
//     let trim = ''
//     let trim2 = ''
//     let turbo = ''
//     let valve_train_design = ''
//     let vehicle_descriptor = ''
//     let vehicle_type = ''
//     let wheel_base_inches_from = ''
//     let wheel_base_inches_to = ''
//     let wheel_base_type = ''
//     let wheel_size_front_inches = ''
//     let wheel_size_rear_inches = ''
//     let windows = ''

//     console.log("Query NHTSA")
//     const url = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/' + auto_vin + '?modelyear=' + auto_year + '&format=json'
//     try {
//         const nhtsa_results = await axios.get(url)
//         if (nhtsa_results.status == 200) {
//             const nhtsa_json = await nhtsa_results.data.Results

//             for (let i = 0; i < nhtsa_json.length; i++) {
//                 const currentItem = nhtsa_json[i]
//                 const listVar = currentItem.Variable
//                 const listValue = currentItem.Value

//                 if (listVar == 'Active Safety System Note') { active_safety_system_note = listValue }
//                 if (listVar == 'Adaptive Cruise Control (ACC)') { adaptive_cruise_control_acc = listValue }
//                 if (listVar == 'Adaptive Driving Beam (ADB)') { adaptive_driving_beam_adb = listValue }
//                 if (listVar == 'Additional Error Text') { additional_error_text = listValue }
//                 if (listVar == 'Anti-lock Braking System (ABS)') { antilock_braking_system_abs = listValue }
//                 if (listVar == 'Auto-Reverse System for Windows and Sunroofs') { autoreverse_system_for_windows_and_sunroofs = listValue }
//                 if (listVar == 'Automatic Crash Notification (ACN) / Advanced Automatic Crash Notification (AACN)') { automatic_crash_notification_acn_advanced_automatic_crash_notification_aacn = listValue }
//                 if (listVar == 'Automatic Pedestrian Alerting Sound (for Hybrid and EV only)') { automatic_pedestrian_alerting_sound_for_hybrid_and_ev_only = listValue }
//                 if (listVar == 'Axle Configuration') { axle_configuration = listValue }
//                 if (listVar == 'Axles') { axles = listValue }
//                 if (listVar == 'Backup Camera') { backup_camera = listValue }
//                 if (listVar == 'Base Price ($)') { base_price = listValue }
//                 if (listVar == 'Battery Current (Amps) From') { battery_current_amps_from = listValue }
//                 if (listVar == 'Battery Current (Amps) To') { battery_current_amps_to = listValue }
//                 if (listVar == 'Battery Energy (kWh) From') { battery_energy_kwh_from = listValue }
//                 if (listVar == 'Battery Energy (kWh) To') { battery_energy_kwh_to = listValue }
//                 if (listVar == 'Battery Type') { battery_type = listValue }
//                 if (listVar == 'Battery Voltage (Volts) From') { battery_voltage_volts_from = listValue }
//                 if (listVar == 'Battery Voltage (Volts) To') { battery_voltage_volts_to = listValue }
//                 if (listVar == 'Bed Length (inches)') { bed_length_inches = listValue }
//                 if (listVar == 'Bed Type') { bed_type = listValue }
//                 if (listVar == 'Blind Spot Intervention (BSI)') { blind_spot_intervention_bsi = listValue }
//                 if (listVar == 'Blind Spot Warning (BSW)') { blind_spot_warning_bsw = listValue }
//                 if (listVar == 'Body Class') { body_class = listValue }
//                 if (listVar == 'Brake System Description') { brake_system_description = listValue }
//                 if (listVar == 'Brake System Type') { brake_system_type = listValue }
//                 if (listVar == 'Bus Floor Configuration Type') { bus_floor_configuration_type = listValue }
//                 if (listVar == 'Bus Length (feet)') { bus_length_feet = listValue }
//                 if (listVar == 'Bus Type') { bus_type = listValue }
//                 if (listVar == 'Cab Type') { cab_type = listValue }
//                 if (listVar == 'Charger Level') { charger_level = listValue }
//                 if (listVar == 'Charger Power (kW)') { charger_power_kw = listValue }
//                 if (listVar == 'Cooling Type') { cooling_type = listValue }
//                 if (listVar == 'Crash Imminent Braking (CIB)') { crash_imminent_braking_cib = listValue }
//                 if (listVar == 'Curb Weight (pounds)') { curb_weight_pounds = listValue }
//                 if (listVar == 'Curtain Air Bag Locations') { curtain_air_bag_locations = listValue }
//                 if (listVar == 'Custom Motorcycle Type') { custom_motorcycle_type = listValue }
//                 if (listVar == 'Daytime Running Light (DRL)') { daytime_running_light_drl = listValue }
//                 if (listVar == 'Destination Market') { destination_market = listValue }
//                 if (listVar == 'Displacement (CC)') { displacement_cc = listValue }
//                 if (listVar == 'Displacement (CI)') { displacement_ci = listValue }
//                 if (listVar == 'Displacement (L)') { displacement_l = listValue }
//                 if (listVar == 'Doors') { doors = listValue }
//                 if (listVar == 'Drive Type') { drive_type = listValue }
//                 if (listVar == 'Dynamic Brake Support (DBS)') { dynamic_brake_support_dbs = listValue }
//                 if (listVar == 'Electrification Level') { electrification_level = listValue }
//                 if (listVar == 'Electronic Stability Control (ESC)') { electronic_stability_control_esc = listValue }
//                 if (listVar == 'Engine Brake (hp) From') { engine_brake_hp_from = listValue }
//                 if (listVar == 'Engine Brake (hp) To') { engine_brake_hp_to = listValue }
//                 if (listVar == 'Engine Configuration') { engine_configuration = listValue }
//                 if (listVar == 'Engine Manufacturer') { engine_manufacturer = listValue }
//                 if (listVar == 'Engine Model') { engine_model = listValue }
//                 if (listVar == 'Engine Number of Cylinders') { engine_number_of_cylinders = listValue }
//                 if (listVar == 'Engine Power (kW)') { engine_power_kw = listValue }
//                 if (listVar == 'Engine Stroke Cycles') { engine_stroke_cycles = listValue }
//                 if (listVar == 'Entertainment System') { entertainment_system = listValue }
//                 if (listVar == 'Error Code') { error_code = listValue }
//                 if (listVar == 'Error Text') { error_text = listValue }
//                 if (listVar == 'EV Drive Unit') { ev_drive_unit = listValue }
//                 if (listVar == 'Event Data Recorder (EDR)') { event_data_recorder_edr = listValue }
//                 if (listVar == 'Forward Collision Warning (FCW)') { forward_collision_warning_fcw = listValue }
//                 if (listVar == 'Front Air Bag Locations') { front_air_bag_locations = listValue }
//                 if (listVar == 'Fuel Delivery / Fuel Injection Type') { fuel_delivery_fuel_injection_type = listValue }
//                 if (listVar == 'Fuel Type - Primary') { fuel_type_primary = listValue }
//                 if (listVar == 'Fuel Type - Secondary') { fuel_type_secondary = listValue }
//                 if (listVar == 'Gross Combination Weight Rating From') { gross_combination_weight_rating_from = listValue }
//                 if (listVar == 'Gross Combination Weight Rating To') { gross_combination_weight_rating_to = listValue }
//                 if (listVar == 'Gross Vehicle Weight Rating From') { gross_vehicle_weight_rating_from = listValue }
//                 if (listVar == 'Gross Vehicle Weight Rating To') { gross_vehicle_weight_rating_to = listValue }
//                 if (listVar == 'Headlamp Light Source') { headlamp_light_source = listValue }
//                 if (listVar == 'Keyless Ignition') { keyless_ignition = listValue }
//                 if (listVar == 'Knee Air Bag Locations') { knee_air_bag_locations = listValue }
//                 if (listVar == 'Lane Centering Assistance') { lane_centering_assistance = listValue }
//                 if (listVar == 'Lane Departure Warning (LDW)') { lane_departure_warning_ldw = listValue }
//                 if (listVar == 'Lane Keeping Assistance (LKA)') { lane_keeping_assistance_lka = listValue }
//                 if (listVar == 'Make') { make = listValue }
//                 if (listVar == 'Manufacturer Name') { manufacturer_name = listValue }
//                 if (listVar == 'Model') { model = listValue }
//                 if (listVar == 'Model Year') { model_year = listValue }
//                 if (listVar == 'Motorcycle Chassis Type') { motorcycle_chassis_type = listValue }
//                 if (listVar == 'Motorcycle Suspension Type') { motorcycle_suspension_type = listValue }
//                 if (listVar == 'Non-Land Use') { nonland_use = listValue }
//                 if (listVar == 'Note') { note = listValue }
//                 if (listVar == 'Number of Battery Cells per Module') { number_of_battery_cells_per_module = listValue }
//                 if (listVar == 'Number of Battery Modules per Pack') { number_of_battery_modules_per_pack = listValue }
//                 if (listVar == 'Number of Battery Packs per Vehicle') { number_of_battery_packs_per_vehicle = listValue }
//                 if (listVar == 'Number of Seat Rows') { number_of_seat_rows = listValue }
//                 if (listVar == 'Number of Seats') { number_of_seats = listValue }
//                 if (listVar == 'Number of Wheels') { number_of_wheels = listValue }
//                 if (listVar == 'Other Battery Info') { other_battery_info = listValue }
//                 if (listVar == 'Other Bus Info') { other_bus_info = listValue }
//                 if (listVar == 'Other Engine Info') { other_engine_info = listValue }
//                 if (listVar == 'Other Motorcycle Info') { other_motorcycle_info = listValue }
//                 if (listVar == 'Other Restraint System Info') { other_restraint_system_info = listValue }
//                 if (listVar == 'Other Trailer Info') { other_trailer_info = listValue }
//                 if (listVar == 'Parking Assist') { parking_assist = listValue }
//                 if (listVar == 'Pedestrian Automatic Emergency Braking (PAEB)') { pedestrian_automatic_emergency_braking_paeb = listValue }
//                 if (listVar == 'Plant City') { plant_city = listValue }
//                 if (listVar == 'Plant Company Name') { plant_company_name = listValue }
//                 if (listVar == 'Plant Country') { plant_country = listValue }
//                 if (listVar == 'Plant State') { plant_state = listValue }
//                 if (listVar == 'Possible Values') { possible_values = listValue }
//                 if (listVar == 'Pretensioner') { pretensioner = listValue }
//                 if (listVar == 'Rear Automatic Emergency Braking') { rear_automatic_emergency_braking = listValue }
//                 if (listVar == 'Rear Cross Traffic Alert') { rear_cross_traffic_alert = listValue }
//                 if (listVar == 'SAE Automation Level From') { sae_automation_level_from = listValue }
//                 if (listVar == 'SAE Automation Level To') { sae_automation_level_to = listValue }
//                 if (listVar == 'Seat Belt Type') { seat_belt_type = listValue }
//                 if (listVar == 'Seat Cushion Air Bag Locations') { seat_cushion_air_bag_locations = listValue }
//                 if (listVar == 'Semiautomatic Headlamp Beam Switching') { semiautomatic_headlamp_beam_switching = listValue }
//                 if (listVar == 'Series') { series = listValue }
//                 if (listVar == 'Series2') { series2 = listValue }
//                 if (listVar == 'Side Air Bag Locations') { side_air_bag_locations = listValue }
//                 if (listVar == 'Steering Location') { steering_location = listValue }
//                 if (listVar == 'Suggested VIN') { suggested_vin = listValue }
//                 if (listVar == 'Tire Pressure Monitoring System (TPMS) Type') { tire_pressure_monitoring_system_tpms_type = listValue }
//                 if (listVar == 'Top Speed (MPH)') { top_speed_mph = listValue }
//                 if (listVar == 'Track Width (inches)') { track_width_inches = listValue }
//                 if (listVar == 'Traction Control') { traction_control = listValue }
//                 if (listVar == 'Trailer Body Type') { trailer_body_type = listValue }
//                 if (listVar == 'Trailer Length (feet)') { trailer_length_feet = listValue }
//                 if (listVar == 'Trailer Type Connection') { trailer_type_connection = listValue }
//                 if (listVar == 'Transmission Speeds') { transmission_speeds = listValue }
//                 if (listVar == 'Transmission Style') { transmission_style = listValue }
//                 if (listVar == 'Trim') { trim = listValue }
//                 if (listVar == 'Trim2') { trim2 = listValue }
//                 if (listVar == 'Turbo') { turbo = listValue }
//                 if (listVar == 'Valve Train Design') { valve_train_design = listValue }
//                 if (listVar == 'Vehicle Descriptor') { vehicle_descriptor = listValue }
//                 if (listVar == 'Vehicle Type') { vehicle_type = listValue }
//                 if (listVar == 'Wheel Base (inches) From') { wheel_base_inches_from = listValue }
//                 if (listVar == 'Wheel Base (inches) To') { wheel_base_inches_to = listValue }
//                 if (listVar == 'Wheel Base Type') { wheel_base_type = listValue }
//                 if (listVar == 'Wheel Size Front (inches)') { wheel_size_front_inches = listValue }
//                 if (listVar == 'Wheel Size Rear (inches)') { wheel_size_rear_inches = listValue }
//                 if (listVar == 'Windows') { windows = listValue }

//                 if (body_class == 'Sedan/Saloon') { auto_class = 'Sedan' }
//                 // if (body_class.find('SUV') != -1) { auto_class = 'SUV' }

//                 if (transmission_style == 'Manual/Standard') { transmission_style = 'Manual' }

//                 if (drive_type == '4WD/4-Wheel Drive/4x4') { drive_type = '4WD' }
//                 if (drive_type == 'AWD/All-Wheel Drive') { drive_type = 'AWD' }
//                 if (drive_type == 'FWD/Front-Wheel Drive' || drive_type == '4x2') { drive_type = 'FWD' }
//                 if (drive_type == 'RWD/Rear-Wheel Drive') { drive_type = 'RWD' }

//     //         // Auto Colors
//     //         if (auto_color_exterior.lower().find('black') != -1) auto_color_exterior_search = 'black'
//     // elif auto_color_exterior.lower().find('blue') != -1: auto_color_exterior_search = 'blue'
//     // elif auto_color_exterior.lower().find('gray') != -1 or auto_color_exterior.lower().find('grey') != -1: auto_color_exterior_search = 'gray'
//     // elif auto_color_exterior.lower().find('silver') != -1: auto_color_exterior_search = 'silver'
//     // elif auto_color_exterior.lower().find('white') != -1: auto_color_exterior_search = 'white'
//     // else: auto_color_exterior_search = ''

// //     if auto_color_interior.lower().find('black') != -1: auto_color_interior_search = 'black'
// //     elif auto_color_interior.lower().find('blue') != -1: auto_color_interior_search = 'blue'
// //     elif auto_color_interior.lower().find('gray') != -1 or auto_color_interior.lower().find('grey') != -1: auto_color_interior_search = 'gray'
// //     elif auto_color_interior.lower().find('silver') != -1: auto_color_interior_search = 'silver'
// //     elif auto_color_interior.lower().find('white') != -1: auto_color_interior_search = 'white'
// //     else: auto_color_interior_search = ''
//             }

//             const document = {
//                 'active_safety_system_note': active_safety_system_note,
//                 'adaptive_cruise_control_acc': adaptive_cruise_control_acc,
//                 'adaptive_driving_beam_adb': adaptive_driving_beam_adb,
//                 'additional_error_text': additional_error_text,
//                 'antilock_braking_system_abs': antilock_braking_system_abs,
//                 'autoreverse_system_for_windows_and_sunroofs': autoreverse_system_for_windows_and_sunroofs,
//                 'automatic_crash_notification_acn_advanced_automatic_crash_notification_aacn': automatic_crash_notification_acn_advanced_automatic_crash_notification_aacn,
//                 'automatic_pedestrian_alerting_sound_for_hybrid_and_ev_only': automatic_pedestrian_alerting_sound_for_hybrid_and_ev_only,
//                 'axle_configuration': axle_configuration,
//                 'axles': axles,
//                 'backup_camera': backup_camera,
//                 'base_price': base_price,
//                 'battery_current_amps_from': battery_current_amps_from,
//                 'battery_current_amps_to': battery_current_amps_to,
//                 'battery_energy_kwh_from': battery_energy_kwh_from,
//                 'battery_energy_kwh_to': battery_energy_kwh_to,
//                 'battery_type': battery_type,
//                 'battery_voltage_volts_from': battery_voltage_volts_from,
//                 'battery_voltage_volts_to': battery_voltage_volts_to,
//                 'bed_length_inches': bed_length_inches,
//                 'bed_type': bed_type,
//                 'blind_spot_intervention_bsi': blind_spot_intervention_bsi,
//                 'blind_spot_warning_bsw': blind_spot_warning_bsw,
//                 'body_class': body_class,
//                 'brake_system_description': brake_system_description,
//                 'brake_system_type': brake_system_type,
//                 'bus_floor_configuration_type': bus_floor_configuration_type,
//                 'bus_length_feet': bus_length_feet,
//                 'bus_type': bus_type,
//                 'cab_type': cab_type,
//                 'charger_level': charger_level,
//                 'charger_power_kw': charger_power_kw,
//                 'cooling_type': cooling_type,
//                 'crash_imminent_braking_cib': crash_imminent_braking_cib,
//                 'curb_weight_pounds': curb_weight_pounds,
//                 'curtain_air_bag_locations': curtain_air_bag_locations,
//                 'custom_motorcycle_type': custom_motorcycle_type,
//                 'daytime_running_light_drl': daytime_running_light_drl,
//                 'destination_market': destination_market,
//                 'displacement_cc': displacement_cc,
//                 'displacement_ci': displacement_ci,
//                 'displacement_l': displacement_l,
//                 'doors': doors,
//                 'drive_type': drive_type,
//                 'dynamic_brake_support_dbs': dynamic_brake_support_dbs,
//                 'electrification_level': electrification_level,
//                 'electronic_stability_control_esc': electronic_stability_control_esc,
//                 'engine_brake_hp_from': engine_brake_hp_from,
//                 'engine_brake_hp_to': engine_brake_hp_to,
//                 'engine_configuration': engine_configuration,
//                 'engine_manufacturer': engine_manufacturer,
//                 'engine_model': engine_model,
//                 'engine_number_of_cylinders': engine_number_of_cylinders,
//                 'engine_power_kw': engine_power_kw,
//                 'engine_stroke_cycles': engine_stroke_cycles,
//                 'entertainment_system': entertainment_system,
//                 'error_code': error_code,
//                 'error_text': error_text,
//                 'ev_drive_unit': ev_drive_unit,
//                 'event_data_recorder_edr': event_data_recorder_edr,
//                 'forward_collision_warning_fcw': forward_collision_warning_fcw,
//                 'front_air_bag_locations': front_air_bag_locations,
//                 'fuel_delivery_fuel_injection_type': fuel_delivery_fuel_injection_type,
//                 'fuel_type_primary': fuel_type_primary,
//                 'fuel_type_secondary': fuel_type_secondary,
//                 'gross_combination_weight_rating_from': gross_combination_weight_rating_from,
//                 'gross_combination_weight_rating_to': gross_combination_weight_rating_to,
//                 'gross_vehicle_weight_rating_from': gross_vehicle_weight_rating_from,
//                 'gross_vehicle_weight_rating_to': gross_vehicle_weight_rating_to,
//                 'headlamp_light_source': headlamp_light_source,
//                 'keyless_ignition': keyless_ignition,
//                 'knee_air_bag_locations': knee_air_bag_locations,
//                 'lane_centering_assistance': lane_centering_assistance,
//                 'lane_departure_warning_ldw': lane_departure_warning_ldw,
//                 'lane_keeping_assistance_lka': lane_keeping_assistance_lka,
//                 'make': make,
//                 'manufacturer_name': manufacturer_name,
//                 'model': model,
//                 'model_year': model_year,
//                 'motorcycle_chassis_type': motorcycle_chassis_type,
//                 'motorcycle_suspension_type': motorcycle_suspension_type,
//                 'nonland_use': nonland_use,
//                 'note': note,
//                 'number_of_battery_cells_per_module': number_of_battery_cells_per_module,
//                 'number_of_battery_modules_per_pack': number_of_battery_modules_per_pack,
//                 'number_of_battery_packs_per_vehicle': number_of_battery_packs_per_vehicle,
//                 'number_of_seat_rows': number_of_seat_rows,
//                 'number_of_seats': number_of_seats,
//                 'number_of_wheels': number_of_wheels,
//                 'other_battery_info': other_battery_info,
//                 'other_bus_info': other_bus_info,
//                 'other_engine_info': other_engine_info,
//                 'other_motorcycle_info': other_motorcycle_info,
//                 'other_restraint_system_info': other_restraint_system_info,
//                 'other_trailer_info': other_trailer_info,
//                 'parking_assist': parking_assist,
//                 'pedestrian_automatic_emergency_braking_paeb': pedestrian_automatic_emergency_braking_paeb,
//                 'plant_city': plant_city,
//                 'plant_company_name': plant_company_name,
//                 'plant_country': plant_country,
//                 'plant_state': plant_state,
//                 'possible_values': possible_values,
//                 'pretensioner': pretensioner,
//                 'rear_automatic_emergency_braking': rear_automatic_emergency_braking,
//                 'rear_cross_traffic_alert': rear_cross_traffic_alert,
//                 'sae_automation_level_from': sae_automation_level_from,
//                 'sae_automation_level_to': sae_automation_level_to,
//                 'seat_belt_type': seat_belt_type,
//                 'seat_cushion_air_bag_locations': seat_cushion_air_bag_locations,
//                 'semiautomatic_headlamp_beam_switching': semiautomatic_headlamp_beam_switching,
//                 'series': series,
//                 'series2': series2,
//                 'side_air_bag_locations': side_air_bag_locations,
//                 'steering_location': steering_location,
//                 'suggested_vin': suggested_vin,
//                 'tire_pressure_monitoring_system_tpms_type': tire_pressure_monitoring_system_tpms_type,
//                 'top_speed_mph': top_speed_mph,
//                 'track_width_inches': track_width_inches,
//                 'traction_control': traction_control,
//                 'trailer_body_type': trailer_body_type,
//                 'trailer_length_feet': trailer_length_feet,
//                 'trailer_type_connection': trailer_type_connection,
//                 'transmission_speeds': transmission_speeds,
//                 'transmission_style': transmission_style,
//                 'trim': trim,
//                 'trim2': trim2,
//                 'turbo': turbo,
//                 'valve_train_design': valve_train_design,
//                 'vehicle_descriptor': vehicle_descriptor,
//                 'vehicle_type': vehicle_type,
//                 'wheel_base_inches_from': wheel_base_inches_from,
//                 'wheel_base_inches_to': wheel_base_inches_to,
//                 'wheel_base_type': wheel_base_type,
//                 'wheel_size_front_inches': wheel_size_front_inches,
//                 'wheel_size_rear_inches': wheel_size_rear_inches,
//                 'windows': windows,
//             }

//         return document

//         } else {
//             console.log("Query results in bad response status")
//             return 'Error ' + auto_vin + ' | ' + auto_year
//         }
//     } catch (err) {
//         console.error('Error fetching NHTSA results', err)
//         return 'Error ' + auto_vin + ' | ' + auto_year
//     }
// }

module.exports = {
    readFileContent,
    parseFileContent,
    // db_conn,
}
