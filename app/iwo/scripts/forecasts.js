const conversions = require('./conversions')
const database = require('./database')
const nominatim = require('./nominatim')
const nws = require('./nws')



// Checks the DB, if exists passes data back.
// If not, it gets coordinates and weather forecast
async function getAll(query, units, appEmail, userAgent) {
    const dbForecast = await database.getAll(query)

    if (dbForecast != null) {
        console.log('Forecast exists')
        return dbForecast
    } else {
        console.log('Get coordinates')
        coordinates = await nominatim.getCoordinates(query, appEmail)
                
        if (coordinates == 'e001') {return 'e001'} // HANDLE BAD QUERY HERE
        else {
            console.log('Get new forecast')
            
            const newForecast = await nws.getWeatherForecast(query, coordinates, units, userAgent)
            return newForecast
        }
    }
}

async function currentForecast(query, forecastHourly, timeZone) {
    // let temperaturesum = temperatureaverage = 0
    
    // const now = new Date().setHours(0,0,0,0)
    // const now = new Date()
    // const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    // const startOfDayLocal = startOfDay.toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
    // const startOfDayISO = new Date(startOfDayLocal).toISOString()
    
    // const midDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
    // const midDayLocal = midDay.toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
    // const midDayISO = new Date(midDayLocal).toISOString()

    // const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
    // const endOfDayLocal = endOfDay.toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
    // const endOfDayISO = new Date(endOfDayLocal).toISOString()

    // const dailyhigh = getDailyHighs(forecastHourly)
    // const dailylow = getDailyLows(forecastHourly)
    // const dailyhigh = getTodaysHigh(forecastHourly)
    // const dailylow = getTodaysLow(forecastHourly)
    
    // Determines the temperature trend based in the average for the next 10 hours
    // for (let i = 0; i < 10; i++) {
    //     temperaturesum += forecastHourly[i].temperature
    // }
    // temperatureaverage = temperaturesum / 10
    
    // if (forecastHourly[0].temperature > temperatureaverage) { 
    //     currenttemperaturetrend = "<span style=\"color:blue;\">&#8595;</span>"
    // } else if (forecastHourly[0].temperature < temperatureaverage) { 
    //     currenttemperaturetrend = "<span style=\"color:green\";>&#8593;</span>"
    // }

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
        // "temperaturetrend": currenttemperaturetrend,
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
        
        const display = `${temp}&#176;${tempUnit}<br /><font size="2">${time}</font>`
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