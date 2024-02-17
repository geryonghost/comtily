const axios = require('axios')

const database = require('./database')
const conversions = require('./conversions')
const sunriseSunset = require('./sunrise-sunset')

async function getWeatherForecast(query, coordinates, unit = 'us', userAgent) {
    let forecastUrl, forecastDaily, forecastHourly, forecastAlerts, dbData

    console.log('IWO:Getting Forecast URL')    
    if (coordinates.forecastUrl != '') {
       forecastUrl = await getForecastUrl(coordinates.lat, coordinates.lon, userAgent)
    } else {
        forecastUrl = coordinates.forecastUrl
    }

    if (forecastUrl != 'e002') {
        const location = coordinates.lat + ',' + coordinates.lon
        console.log('IWO:Getting Forecast Daily')
        forecastDaily = await getForecasts(forecastUrl, 'daily', unit, userAgent)
        console.log('IWO:Getting Forecast Hourly')
        forecastHourly = await getForecasts(forecastUrl, 'hourly', unit, userAgent)
        console.log('IWO:Getting Forecast Alerts')
        forecastAlerts = await getForecasts(forecastUrl, 'alerts', unit, userAgent, location)
        console.log('IWO:Getting Forecast Grid Data')
        forecastGridData = await getForecasts(forecastUrl, 'griddata', unit, userAgent)
        console.log('IWO:Getting Time Zone')
        forecastTimeZone = await sunriseSunset.getTimeZone(coordinates.lat, coordinates.lon)
        console.log('IWO:Getting Sunrise/Sunset Data')
        forecastSunriseSunset = await sunriseSunset.getSunriseSunset(coordinates.lat, coordinates.lon, forecastTimeZone)
    }

    if (forecastDaily != 'e003' && forecastHourly != 'e003' && forecastAlerts != 'e003' && forecastGridData != 'e003') {
        now = new Date().toISOString()
        try {
            const document = {
                'forecastFrom': now,
                'query': query,
                'lat': coordinates.lat,
                'lon': coordinates.lon,
                'addressType': coordinates.addresstype,
                'addressName': coordinates.addressname,
                'forecastUrl': forecastUrl,
                forecastTimeZone,
                forecastSunriseSunset,
                'elevation': Math.round(forecastGridData.elevation.value) + conversions.formatUnitCode(forecastGridData.elevation.unitCode)
            }

            dbData = {...document, ...{'forecastDaily':forecastDaily}, ...{'forecastHourly':forecastHourly}, ...{'forecastAlerts':forecastAlerts}, ...{'forecastGridData':forecastGridData}}

        } catch(err) {
            console.error('Error combining forecasts', err)
            dbData = 'e004'
        }
    }

    if (dbData != 'e004') {
        await database.updateWeatherForecastDb(query, dbData)
        return dbData
    } else {
        return dbData
    }
}

async function getForecastUrl(lat, lon, userAgent) {
    weatherForecastUrl = 'https://api.weather.gov/points/' + lat + ',' + lon
  
    let forecastUrl
    console.log('IWO:Trying to get forecast URL')
    try {
        const results = await axios.get(weatherForecastUrl, { headers: { userAgent } })
        if (results.status == 200) {
            forecastUrl = await results.data.properties.forecastGridData
        } else {
            console.log("IWO:Query results in bad response status")
            forecastUrl = 'e002'
        }
    } catch (err) {
        console.error('Error fetching forecast URL', err)
        forecastUrl = 'e002'
    }

    return forecastUrl
}

async function getForecasts(forecastUrl, type, unit, userAgent, location = null) {
    let results, forecast
    try {
        switch(type) {
            case 'daily':
                results = await axios.get(forecastUrl + '/forecast?units=' + unit, {headers: {userAgent}})
                if (results.status == 200) {
                    forecast = await results.data.properties.periods
                } else if (results.status == 500) {
                    console.log('IWO:Error getting Forecast Daily, status 500')
                    forecast = 'e003'
                }
                break
            case 'hourly':
                results = await axios.get(forecastUrl + '/forecast/hourly?units=' + unit, {headers: {userAgent }})
                if (results.status == 200) {
                    forecast = await results.data.properties.periods
                } else if (results.status == 500) {
                    console.log('IWO:Error getting Forecast Hourly, status 500')
                    forecast = 'e003'
                }
                break
            case 'griddata':
                results = await axios.get(forecastUrl, {headers: {userAgent}})
                if (results.status == 200) {
                    forecast = await results.data.properties
                } else if (results.status == 500) {
                    console.log('IWO:Error getting Forecast Grid Data, status 500')
                    forecast = 'e003'
                }
                break
            case 'alerts':
                results = await axios.get('https://api.weather.gov/alerts/active?point=' + location, {headers: {userAgent}})
                if (results.status == 200) {
                    forecast = await results.data.properties
                } else if (results.status == 500) {
                    console.log('IWO:Error getting Forecast Alerts, status 500')
                    forecast = 'e003'
                }
                break
        }
    } catch (err) {
        console.error('Error fetching forecast', err)
        forecast = 'e003'
    }

    return forecast
}

module.exports = {
    getWeatherForecast,
}