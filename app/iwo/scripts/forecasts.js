const conversions = require('./conversions')
const database = require('./database')
const nominatim = require('./nominatim')
const nws = require('./nws')



// Checks the DB, if exists passes data back.
// If not, it gets coordinates and weather forecast
async function getAll(query, units, appEmail, userAgent) {
    const dbForecast = await database.getAll(query)

    if (dbForecast != null) {
        console.log('IWO:Forecast exists')
        return dbForecast
    } else {
        console.log('IWO:Get coordinates')
        coordinates = await nominatim.getCoordinates(query, appEmail)
                
        if (coordinates == 'e001') {return 'e001'} // HANDLE BAD QUERY HERE
        else {
            console.log('IWO:Get new forecast')
            
            const newForecast = await nws.getWeatherForecast(query, coordinates, units, userAgent)
            return newForecast
        }
    }
}

async function currentForecast(query, forecastHourly, timeZone) {
    const temperatureTrendHourCount = 5
    let temperatureSum = temperatureAverage = 0
    let currentTemperatureTrend = ''
    
    // Determines the temperature trend based in the average for the next 5 hours
    for (let i = 0; i < 5; i++) {
        temperatureSum += forecastHourly[i].temperature
    }
    temperatureAverage = temperatureSum / temperatureTrendHourCount
    
    if (forecastHourly[0].temperature > temperatureAverage) { 
        currentTemperatureTrend = '<span class="text-info">&#8595;</span>'
    } else if (forecastHourly[0].temperature < temperatureAverage) { 
        currentTemperaturetrend = '<span class="text-danger";>&#8593;</span>'
    }

    const highsLows = await database.getHighsLows(query, 0, timeZone)
    // console.log(highsLows)
  
    const i = 0
    const forecast = {
        // "startdate": formatDate(forecastHourly[i].startTime),
        // "starttime": formatTime(forecastHourly[i].startTime),
        "dewpoint": forecastHourly[i].dewpoint.value.toFixed(2),
        // "dewpointunit": formatUnitCode(forecastHourly[i].dewpoint.unitCode),
        "humidity": forecastHourly[i].relativeHumidity.value,
        // "humidityunit": formatUnitCode(forecastHourly[i].relativeHumidity.unitCode),
        // "hightemp": dailyhigh[0],
        // "lowtemp": dailylow[0],
        // "highstart": dailyhigh[1],
        // "highend": dailyhigh[2],
        // "lowstart": dailylow[1],
        // "lowend": dailylow[2],
        "icon": forecastHourly[i].icon.replace(",0?size=small","?size=medium"),
        "isdaytime": forecastHourly[i].isDaytime,
        "probabilityofprecipitation": forecastHourly[i].probabilityOfPrecipitation.value,
        // "probabilityofprecipitationunit": formatUnitCode(forecastHourly[i].probabilityOfPrecipitation.unitCode),
        "shortforecast": forecastHourly[i].shortForecast,
        "temperature": forecastHourly[i].temperature,
        "temperatureunit": forecastHourly[i].temperatureUnit,
        "temperaturetrend": currentTemperatureTrend,
        "winddirection": forecastHourly[i].windDirection,
        "windspeed": forecastHourly[i].windSpeed,
        "highsLows": highsLows
    }
  
    return forecast
}

async function displayTemp(temperature, timeZone) {
    if (temperature.length > 0) {
        const temp = temperature[0].temperature
        const tempUnit = temperature[0].temperatureUnit
        const time = conversions.convertTime(temperature[0].startTime, timeZone)
        
        const display = `${temp}&#176;${tempUnit} at ${time}`
        return display
    } else {
        return ""
    }
}

module.exports = {
    getAll,
    currentForecast,
    displayTemp,
}