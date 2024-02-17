const timezonedb_key = process.env.timezonedb_key

const axios = require('axios')

const conversions = require('./conversions')

async function getSunriseSunset(lat, lon, timeZone) {
    try {
      const apiURL = 'https://api.sunrise-sunset.org/json?formatted=0&lat=' + lat + '&lng=' + lon + '&date=today&tzid=' + timeZone.zoneName
        const results = await axios.get(apiURL)

        if (results.status == 200) {
          const sunrise = results.data.results.sunrise
          const sunset = results.data.results.sunset
          const dayLength = results.data.results.day_length
  
          const day = {
            'sunrise': sunrise,
            'sunset': sunset,
            'dayLength': dayLength
          }
  
          return day

        } else {
          console.log('IWO:Error getting sunrise and sunset')
          return 'e003'
        }
        
      } catch (error) {
        console.error('Error fetching openstreetmap data', error)
        return 'e001'
      }
}

async function getTimeZone(lat, lon) {
  try {
    const apiURL = 'http://api.timezonedb.com/v2.1/get-time-zone?key=' + timezonedb_key + '&format=json&by=position&fields=zoneName,abbreviation&lat=' + lat + '&lng=' + lon
    const results = await axios.get(apiURL)

    if (results.status == 200) {
      const timeZone = {
        'zoneName': results.data.zoneName,
        'abbreviation': results.data.abbreviation
      }
      return timeZone
    } else if (results.status == 400) {
      console.log('IWO:Error getting time zone, status 400')
      return 'e003'
    }
  } catch (error) {
    console.error('Error fetching time zone data', error)
    return 'e001'
  }
}

module.exports = {
    getSunriseSunset,
    getTimeZone,
}