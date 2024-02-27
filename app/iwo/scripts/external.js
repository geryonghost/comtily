const timezonedb_key = process.env.timezonedb_key

const axios = require('axios')
const moment = require('moment-timezone')

const conversions = require('./conversions')

async function getAlerts(dbCoordinates, variables) {
  let forecast

  try {
    const location = dbCoordinates.lat + ',' + dbCoordinates.lon
    const userAgent = variables.userAgent
    const results = await axios.get('https://api.weather.gov/alerts/active?point=' + location, {headers: {userAgent}})
    
    if (results.status == 200) {
        forecast = await results.data.properties
        return forecast
    } else {
        console.log('IWO:Error getting Forecast Alerts')
        return 'e003'
    }
  } catch (error) {
    console.log('IWO:Error getting Forecast Alerts', error)
    return'e003'
  }
}

async function getCoordinates(query, app_email) {
    try {
        const results = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: query,
                'format': 'json',
                'accept-language': 'en',
                'countrycodes':'us',
                'limit':1,
                'email': app_email
            }
        })
        
        if (results.status == 200) {
            if (results.data.length == 0) {
                return 'e001'
            } else {
                const coordinates = {
                    'lat':results.data[0].lat, 
                    'lon':results.data[0].lon,
                    "addresstype": results.data[0].addresstype,
                    "addressname": results.data[0].name,
                }
                return coordinates
            }
        }

      } catch (error) {
        console.error('Error fetching openstreetmap data', error)
        return 'e001'
      }
}

async function getForecastUrl(lat, lon, userAgent) {
  const weatherForecastUrl = 'https://api.weather.gov/points/' + lat + ',' + lon

  try {
      const results = await axios.get(weatherForecastUrl, { headers: { userAgent } })
      if (results.status == 200) {
          const forecastUrl = await results.data.properties.forecastGridData
          return forecastUrl
      } else {
          console.log("IWO:Query results in bad response status")
          return 'e002'
      }
  } catch (err) {
      console.error('Error fetching forecast URL', err)
      return 'e002'
  }
}


async function getGridData(dbCoordinates, variables) {
  try {
    const userAgent = variables.userAgent
    const results = await axios.get(dbCoordinates.forecastURL, {headers: {userAgent}})
    if (results.status == 200) {
      console.log('IWO:Convert griddata')
      const forecast = conversions.convertGridData(await results.data.properties, dbCoordinates.timeZone.zoneName)
      return forecast
    } else {
      console.log('IWO:Error getting Forecast Grid Data')
      return 'e003'
    }
  } catch (error) {
    console.error('IWO:Error getting Forecast Grid Data', error.response)
    return 'e003'
  }
}

async function getSunriseSunset(lat, lon) {
    try {
      let apiURL = ''
      let today, tomorrow, sunriseSunset

      for (let i = 0; i < 2; i++) {
        if (i == 0) { apiURL = 'https://api.sunrise-sunset.org/json?formatted=0&lat=' + lat + '&lng=' + lon + '&date=today' }
        if (i == 1) { apiURL = 'https://api.sunrise-sunset.org/json?formatted=0&lat=' + lat + '&lng=' + lon + '&date=tomorrow' }

        const results = await axios.get(apiURL)

        if (results.status == 200) {
          const currentTime = moment.utc().format()
          const sunrise = results.data.results.sunrise
          const sunset = results.data.results.sunset
          const dayLength = results.data.results.day_length
  
          if (i == 0 ) {
            today = {
              'sunrise': sunrise,
              'sunset': sunset,
              'dayLength': dayLength
            }
          }

          if (i == 1) {
            tomorrow = {
              'sunrise': sunrise,
              'sunset': sunset,
              'dayLength': dayLength
            }
          }
          
          sunriseSunset = {
            'forecastFrom':currentTime,
            ...{'today':today},
            ...{'tomorrow':tomorrow}
          }

        } else {
          console.log('IWO:Error getting sunrise and sunset')
          return 'e003'
        }
      }
      return sunriseSunset
      
    } catch (error) {
      console.error('Error fetching openstreetmap data', error)
      return 'e003'
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
    return 'e003'
  }
}

module.exports = {
  getAlerts,
  getCoordinates,
  getForecastUrl,
  getGridData,
  getSunriseSunset,
  getTimeZone,
}