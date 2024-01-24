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

function currentForecast(forecastHourly) {
    let temperaturesum = temperatureaverage = 0
    
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
        "windspeed": forecastHourly[i].windSpeed
    }
  
    return forecast
}

module.exports = {
    getAll,
    currentForecast,
}