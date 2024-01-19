const database = require('./database')
const nominatim = require('./nominatim')
const nws = require('./nws')

// Checks the DB, if exists passes data back.
// If not, it gets coordinates and weather forecast
async function getAll(query, units, appEmail, userAgent) {
    const dbForecast = await database.getAll(query)

    if (dbForecast != null) {
        console.log('Forecast exists')
        const now = new Date();
        const forecastFrom = new Date(dbForecast.forecastFrom)
        const forecastDifference = Math.floor(Math.abs(forecastFrom - now) / (1000 * 60))
        console.log('Forecast Difference: ' + forecastDifference)
        
        if (forecastDifference > -1 ) {
            console.log('Forecast is aged')
            coordinates = {
                'lat': dbForecast.lat,
                'lon': dbForecast.lon,
                'addresstype': dbForecast.addressType,
                'addressname': dbForecast.addressName,
                'forecastUrl': dbForecast.forecastUrl
            }
            console.log('Get updated forecast')
            updatedForecast = await nws.getWeatherForecast('update', query, coordinates, units, userAgent)

            hourlyReference(updatedForecast)
            return updatedForecast
        } else {
            hourlyReference(dbForecast)
            return dbForecast
        }
    } else {
        console.log('Get coordinates')
        coordinates = await nominatim.getCoordinates(query, appEmail)
                
        if (coordinates == 'e001') {return 'e001'} // HANDLE BAD QUERY HERE
        else {
            console.log('Get new forecast')
            const newForecast = await nws.getWeatherForecast('new', query, coordinates, units, userAgent)
            hourlyReference(newForecast)
            return newForecast
        }
    }
}

async function hourlyReference(forecast) {
    console.log('Getting Hourly Reference')
    const dbForecast = await database.getHourlyReference(forecast.query)

    if (dbForecast.length > 0) {
        console.log('Hourly Reference exists')
    //     let hourlyTemperature = []
        const now = new Date().toISOString()

        for (let i = 0; i < dbForecast.length; i++) {
            if (dbForecast[i].startTime < now) { // If older than 2 days exclude
                let hourlyTemperatureValue

                hourlyTemperatureValue = {
                    'query': dbForecast.query,
                    'startTime': dbForecast[i].startTime,
                    'isDaytime': dbForecast[i].isDaytime,
                    'temperature':dbForecast[i].temperature,
                    'temperatureUnit': dbForecast[i].temperatureUnit
                }

    //             hourlyTemperature.push(hourlyTemperatureValue)
                await database.updateHourlyReference(hourlyTemperatureValue)
            }
        }
        for (let i = 0; i < forecast.forecastHourly.length; i++) {
            if (forecast.forecastHourly[i].startTime > now) {
                let hourlyTemperatureValue

                hourlyTemperatureValue = {
                    'query': forecast.query,
                    'startTime': forecast.forecastHourly[i].startTime,
                    'isDaytime': forecast.forecastHourly[i].isDaytime,
                    'temperature': forecast.forecastHourly[i].temperature,
                    'temperatureUnit': forecast.forecastHourly[i].temperatureUnit
                }

                await database.updateHourlyReference(hourlyTemperatureValue)
                
        //         hourlyTemperature.push(hourlyTemperatureValue)    
            }
        }
        //     dbData = {...{'query': forecast.query}, ...{'hourlyTemperature': hourlyTemperature}}
        //     await database.updateHourlyReference(dbData)
    } else {
        // let hourlyTemperature = []
        for (let i = 0; i < forecast.forecastHourly.length; i++) {
            let hourlyTemperatureValue

            hourlyTemperatureValue = {
                'query': forecast.query,
                'startTime': forecast.forecastHourly[i].startTime,
                'isDaytime': forecast.forecastHourly[i].isDaytime,
                'temperature': forecast.forecastHourly[i].temperature,
                'temperatureUnit': forecast.forecastHourly[i].temperatureUnit
            }
            await database.addHourlyReference(hourlyTemperatureValue)
            // hourlyTemperature.push(hourlyTemperatureValue)    
        }

        // dbData = {...{'query': forecast.query}, ...{'hourlyTemperature': hourlyTemperature}}
        // await database.addHourlyReference(dbData)
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