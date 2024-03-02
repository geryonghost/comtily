const moment = require('moment-timezone')

const conversions = require('./conversions')
const database = require('./database')

async function currentForecast(units, forecast) {
    const query = forecast.query
    const currentTime = moment.utc().tz(forecast.timeZone.zoneName).format()
    
    let index = -1
    for (let i = 0; i < forecast.temperature.values.length; i++) {
        if (forecast.temperature.values[i].validTime > currentTime) {
            index = i;
            break;
        }
    }

    const temperatureTrendHourCount = 5
    let temperatureSum = temperatureAverage = 0
    let currentTemperatureTrend = ''
    
    for (let i = index; i < index + temperatureTrendHourCount; i++) {
        temperatureSum += forecast.temperature.values[i].value
    }
    temperatureAverage = temperatureSum / temperatureTrendHourCount
    
    const i = index

    if (forecast.temperature.values[i].value > temperatureAverage) { 
        currentTemperatureTrend = '<span class="text-info">&#8595;</span>'
    } else if (forecast.temperature.values[i].value < temperatureAverage) { 
        currentTemperatureTrend = '<span class="text-danger";>&#8593;</span>'
    }

    const todaySunrise = moment(forecast.sunriseSunset[0].sunrise).tz(forecast.timeZone.zoneName).format()
    const todaySunset = moment(forecast.sunriseSunset[0].sunset).tz(forecast.timeZone.zoneName).format()

    let timeOfDay
    if (currentTime > todaySunrise && currentTime < todaySunset) {
        timeOfDay = 'day'
    } else {
        timeOfDay = 'night'
    }

    const addressName = forecast.addressname
    const apparentTemperature = conversions.convertTemperature(units, forecast.apparentTemperature.values[i].value)
    const coverage = forecast.weather.values[i].value[0].coverage

    const highsLows = await database.getHighsLows(forecast.query, forecast.timeZone.zoneName, 0)
    if (highsLows != null && highsLows != undefined) {
        highTemp = conversions.convertTemperature(units, highsLows.high[0].temperature)
        highTime = moment(highsLows.high[0].validTime).tz(forecast.timeZone.zoneName).format('LT')
        lowTemp = conversions.convertTemperature(units, highsLows.low[0].temperature)
        lowTime = moment(highsLows.low[0].validTime).tz(forecast.timeZone.zoneName).format('LT')
    } else {
        highTemp = 999
    }

    const intensity = forecast.weather.values[i].value[0].intensity

    let precipitation = forecast.probabilityOfPrecipitation.values[i].value
    if (precipitation > 0) {
        precipitation = precipitation + conversions.formatUnitCode(forecast.probabilityOfPrecipitation.uom)
    }
    
    const skyCover = forecast.skyCover.values[i].value
    const temperature = conversions.convertTemperature(units, forecast.temperature.values[i].value)
    const timeZone = timeZoneMap[forecast.timeZone.abbreviation]
    const weather = forecast.weather.values[i].value[0].weather
    const windGust = conversions.convertSpeed(units, forecast.windGust.values[i].value)
    const windSpeed =  conversions.convertSpeed(units, forecast.windSpeed.values[i].value)

    const subForecast = getSubForecast(timeOfDay, precipitation, skyCover, coverage, intensity, weather)
    
    const currentForecast = {
        'addressName': addressName,
        'apparentTemperature': apparentTemperature,
        'coverage': coverage,
        'highTemp': highTemp,
        'highTime': highTime,
        'lowTemp': lowTemp,
        'lowTime': lowTime,
        'icon': 'icons/' + subForecast.icon + '_large.png',
        'timeOfDay': timeOfDay,
        'precipitation': precipitation,
        'query': query,
        'shortForecast': subForecast.shortForecast,
        'skycover': skyCover,
        'sunrise': moment(todaySunrise).tz(forecast.timeZone.zoneName).format('LT'),
        'sunset': moment(todaySunset).tz(forecast.timeZone.zoneName).format('LT'),
        'temperature': temperature,
        'temperaturetrend': currentTemperatureTrend,
        'timeZone': timeZone,
        'weather': weather,
        'windGust': windGust,
        'windSpeed': windSpeed,
    }
    return currentForecast
}

async function hourlyForecast(units, forecast) {
    const todaySunrise = moment(forecast.sunriseSunset[0].sunrise).format()
    const todaySunset = moment(forecast.sunriseSunset[0].sunset).format()
    const tomorrowSunrise = moment(forecast.sunriseSunset[1].sunrise).format()
    const tomorrowSunset = moment(forecast.sunriseSunset[1].sunset).format()

    const currentTime = moment.utc().tz(forecast.timeZone.zoneName).format()
    let index = -1
    for (let i = 0; i < forecast.temperature.values.length; i++) {
        if (forecast.temperature.values[i].validTime > currentTime) {
            index = i;
            break;
        }
    }

    let hourlyForecast = []
    for (let i = index -1; i < index + 24; i++) {
        let timeOfDay
        
        const hourlyDate = moment(forecast.temperature.values[i].validTime).format()        
        if ((hourlyDate > todaySunrise && hourlyDate < todaySunset) || (hourlyDate > tomorrowSunrise && hourlyDate < tomorrowSunset) ) {
            timeOfDay = 'day'
        } else {
            timeOfDay = 'night'
        }

        const apparentTemperature = conversions.convertTemperature(units, forecast.apparentTemperature.values[i].value)
        const coverage = forecast.weather.values[i].value[0].coverage
        const intensity = forecast.weather.values[i].value[0].intensity

        let precipitation = forecast.probabilityOfPrecipitation.values[i].value
        if (precipitation > 0) {
            precipitation = precipitation + conversions.formatUnitCode(forecast.probabilityOfPrecipitation.uom)
        }

        const skyCover = forecast.skyCover.values[i].value
        const temperature = conversions.convertTemperature(units, forecast.temperature.values[i].value)
        const temperatureTime = moment(forecast.temperature.values[i].validTime).tz(forecast.timeZone.zoneName).format('LT')
        const weather = forecast.weather.values[i].value[0].weather
        const windGust = conversions.convertSpeed(units, forecast.windGust.values[i].value)
        const windSpeed =  conversions.convertSpeed(units, forecast.windSpeed.values[i].value)
        
        const subForecast = getSubForecast(timeOfDay, precipitation, skyCover, coverage, intensity, weather, i)

        const document = {...{
            'apparentTemperature': apparentTemperature,
            'temperature': temperature,
            'temperatureTime': temperatureTime,
            'shortForecast': subForecast.shortForecast,
            'icon': 'icons/' + subForecast.icon + '_large.png',
            'currentTime': moment(currentTime).format('LT'),
            'todaySunrise': moment(todaySunrise).format('LT'),
            'todaySunset': moment(todaySunset).format('LT'),
            'tomorrowSunrise': moment(tomorrowSunrise).format('LT'),
            'tomorrowSunset': moment(tomorrowSunset).format('LT'),
            'coverage': coverage,
            'precipitation': precipitation,
            'weather': weather,
            'windGust': windGust,
            'windSpeed': windSpeed,
        }}

        hourlyForecast.push(document)
    }
    return hourlyForecast
}

async function dailyForecast(units, forecast) {
    let sunrise, sunset
    let dailyForecast = []
    
    const currentDate = moment.utc().format('YYYY-MM-DD')
    for (let i = 0; i < 7; i++) {
        const dailyDate = moment(currentDate).add(i, 'day').format('YYYY-MM-DD')
        const dayOfWeek = moment(dailyDate).format('dddd')
        for (let j = 0; j < forecast.sunriseSunset.length; j++) {
            if (moment(forecast.sunriseSunset[j].sunrise).format('YYYY-MM-DD') == dailyDate) {
                sunrise = moment(forecast.sunriseSunset[j].sunrise).tz(forecast.timeZone.zoneName).format()
                sunset = moment(forecast.sunriseSunset[j].sunset).tz(forecast.timeZone.zoneName).format()
            }
        }

        let morningTemps = [], dayTemps = [], eveningTemps = []
        let morningTimes = [], dayTimes = [], eveningTimes = []
        for (let j = 0; j < forecast.temperature.values.length; j++) {
            if (
                moment(forecast.temperature.values[j].validTime).format('YYYY-MM-DD') == moment(sunrise).format('YYYY-MM-DD') &&
                moment(forecast.temperature.values[j].validTime).format() < sunrise
            ) {
                morningTemps.push(forecast.temperature.values[j].value)
                morningTimes.push(forecast.temperature.values[j].validTime)
            }
            if (
                moment(forecast.temperature.values[j].validTime).format('YYYY-MM-DD') == moment(sunrise).format('YYYY-MM-DD') &&
                moment(forecast.temperature.values[j].validTime).format() > sunrise &&
                moment(forecast.temperature.values[j].validTime).format() < sunset
            ) {
                dayTemps.push(forecast.temperature.values[j].value)
                dayTimes.push(forecast.temperature.values[j].validTime)
            }
            if (
                moment(forecast.temperature.values[j].validTime).format('YYYY-MM-DD') == moment(sunrise).format('YYYY-MM-DD') &&
                moment(forecast.temperature.values[j].validTime).format() > sunset
            ) {
                eveningTemps.push(forecast.temperature.values[j].value)
                eveningTimes.push(forecast.temperature.values[j].validTime)
            }
        }
        const morningLowIndex = morningTemps.indexOf(Math.min(...morningTemps))
        const morningHighIndex = morningTemps.indexOf(Math.max(...morningTemps))
        const morningLow = conversions.convertTemperature(units, morningTemps[morningLowIndex])
        const morningLowTime = moment(morningTimes[morningLowIndex]).format('LT')
        const morningHigh = conversions.convertTemperature(units, morningTemps[morningHighIndex])
        const morningHighTime = moment(morningTimes[morningHighIndex]).format('LT')
        
        const dayLowIndex = dayTemps.indexOf(Math.min(...dayTemps))
        const dayHighIndex = dayTemps.indexOf(Math.max(...dayTemps))
        const dayLow = conversions.convertTemperature(units, dayTemps[dayLowIndex])
        const dayLowTime = moment(dayTimes[dayLowIndex]).format('LT')
        const dayHigh = conversions.convertTemperature(units, dayTemps[dayHighIndex])
        const dayHighTime = moment(dayTimes[dayHighIndex]).format('LT')
        
        const eveningLowIndex = eveningTemps.indexOf(Math.min(...eveningTemps))
        const eveningHighIndex = eveningTemps.indexOf(Math.max(...eveningTemps))
        const eveningLow = conversions.convertTemperature(units, eveningTemps[eveningLowIndex])
        const eveningLowTime = moment(eveningTimes[eveningLowIndex]).format('LT')
        const eveningHigh = conversions.convertTemperature(units, eveningTemps[eveningHighIndex])
        const eveningHighTime = moment(eveningTimes[eveningHighIndex]).format('LT')

        let morningWeather = [], dayWeather = [], eveningWeather = []
        for (let j = 0; j < forecast.weather.values.length; j++) {
            if (
                moment(forecast.weather.values[j].validTime).format('YYYY-MM-DD') == moment(sunrise).format('YYYY-MM-DD') &&
                moment(forecast.weather.values[j].validTime).format() < sunrise
            ) {
                const coverage = forecast.weather.values[j].value[0].coverage
                const intensity = forecast.weather.values[j].value[0].intensity
                const precipitation = forecast.probabilityOfPrecipitation.values[j].value
                const skyCover = forecast.skyCover.values[j].value
                const weather = forecast.weather.values[j].value[0].weather

                if (weather != null) {
                    morningWeather = [coverage, intensity, precipitation, skyCover, weather]
                } else if (morningWeather[3] < skyCover) {
                    morningWeather = [coverage, intensity, precipitation, skyCover, weather]
                } else if (morningWeather[3] == undefined) {
                    morningWeather = [coverage, intensity, precipitation, skyCover, weather]
                }                
            }
            if (
                moment(forecast.temperature.values[j].validTime).format('YYYY-MM-DD') == moment(sunrise).format('YYYY-MM-DD') &&
                moment(forecast.temperature.values[j].validTime).format() > sunrise &&
                moment(forecast.temperature.values[j].validTime).format() < sunset
            ) {
                const coverage = forecast.weather.values[j].value[0].coverage
                const intensity = forecast.weather.values[j].value[0].intensity
                const precipitation = forecast.probabilityOfPrecipitation.values[j].value
                const skyCover = forecast.skyCover.values[j].value
                const weather = forecast.weather.values[j].value[0].weather

                if (weather != null) {
                    dayWeather = [coverage, intensity, precipitation, skyCover, weather]
                } else if (dayWeather[3] < skyCover) {
                    dayWeather = [coverage, intensity, precipitation, skyCover, weather]
                } else if (dayWeather[3] == undefined) {
                    dayWeather = [coverage, intensity, precipitation, skyCover, weather]
                }
            }
            if (
                moment(forecast.temperature.values[j].validTime).format('YYYY-MM-DD') == moment(sunrise).format('YYYY-MM-DD') &&
                moment(forecast.temperature.values[j].validTime).format() > sunset
            ) {
                const coverage = forecast.weather.values[j].value[0].coverage
                const intensity = forecast.weather.values[j].value[0].intensity
                const precipitation = forecast.probabilityOfPrecipitation.values[j].value
                const skyCover = forecast.skyCover.values[j].value
                const weather = forecast.weather.values[j].value[0].weather

                if (weather != null) {
                    eveningWeather = [coverage, intensity, precipitation, skyCover, weather]
                } else if (eveningWeather[3] < skyCover) {
                    eveningWeather = [coverage, intensity, precipitation, skyCover, weather]
                } else if (eveningWeather[3] == undefined) {
                    eveningWeather = [coverage, intensity, precipitation, skyCover, weather]
                }  
            }
        }

        const morningForecast = getSubForecast('night', morningWeather[2], morningWeather[3], morningWeather[0], morningWeather[1], morningWeather[4])
        const dayForecast = getSubForecast('day', dayWeather[2], dayWeather[3], dayWeather[0], dayWeather[1], dayWeather[4])
        const eveningForecast = getSubForecast('night', eveningWeather[2], eveningWeather[3], eveningWeather[0], eveningWeather[1], eveningWeather[4])

        const dailyMap = {
            'dayOfWeek': dayOfWeek,
            'morningLow': morningLow,
            'morningLowTime': morningLowTime,
            'morningHigh': morningHigh,
            'morningHighTime': morningHighTime,
            'dayLow': dayLow,
            'dayLowTime': dayLowTime,
            'dayHigh': dayHigh,
            'dayHighTime': dayHighTime,
            'eveningLow': eveningLow,
            'eveningLowTime': eveningLowTime,
            'eveningHigh': eveningHigh,
            'eveningHighTime': eveningHighTime,
            'sunrise': moment(sunrise).format('LT'),
            'sunset': moment(sunset).format('LT'),
            'morningForecast': {'shortForecast': morningForecast.shortForecast, 'icon': 'icons/' + morningForecast.icon + '_large.png'},
            'dayForecast': {'shortForecast': dayForecast.shortForecast, 'icon': 'icons/' + dayForecast.icon + '_large.png'},
            'eveningForecast': {'shortForecast': eveningForecast.shortForecast, 'icon': 'icons/' + eveningForecast.icon + '_large.png'},
        }
        dailyForecast.push(dailyMap)
    }
    return dailyForecast
}


module.exports = {
    currentForecast,
    hourlyForecast,
    dailyForecast,
}

function getSubForecast(timeOfDay, precipitation, skyCover, coverage, intensity, weather, index) {
    // 
    
    let subForecast = {}
    // Precipitation > 0 
    // skyCover > 0 < 26 = Mostly Clear, > 25 < 51 = Partly Cloudy,  > 50 < 76 = Mostly Cloudy, > 75 = Cloudy
    // intensity light, moderate, heavy, violent

    if (timeOfDay == 'day') {
        // Clear Day 10000
        if (skyCover == 0 && weather == null && intensity == null) { 
            subForecast = {
                'shortForecast': 'Clear, Sunny',
                'icon': '10000_clear'
            }
        }
        // Mostly Clear Day 11001
        else if (skyCover > 0 && skyCover < 26 && weather == null && intensity == null) { 
            subForecast = {
                'shortForecast': 'Mostly Clear',
                'icon': '11000_mostly_clear'
            }
        }
        //  Partly Cloudy Day 11010
        else if (skyCover > 25 && skyCover < 51 && weather == null && intensity == null) { 
            subForecast = {
                'shortForecast': 'Partly Cloudy',
                'icon': '11010_partly_cloudy'
            }
        }
        // Mostly Cloudy Day 11020
        else if (skyCover > 50 && skyCover < 76 && weather == null && intensity == null) { 
            subForecast = {
                'shortForecast': 'Mostly Cloudy',
                'icon': '11020_mostly_cloudy'
            }
        }
        // Cloudy Day 10010
        else if (skyCover > 75 && weather == null && intensity == null) { 
            subForecast = {
                'shortForecast': 'Cloudy',
                'icon': '10010_cloudy'
            }
        }

        // '11030': 'Partly Cloudy and Mostly Clear',
        // '21000': 'Light Fog',
        else if (coverage == 'Patchy' && weather == 'fog' && intensity == null) {
            subForecast = {
                'shortForecast': 'Light Fog',
                'icon': '21000_fog_light'
            }
        }
        // '21010': 'Mostly Clear and Light Fog',
        // '21020': 'Partly Cloudy and Light Fog',
        // '21030': 'Mostly Cloudy and Light Fog',
        // '21060': 'Mostly Clear and Fog',
        // '21070': 'Partly Cloudy and Fog',
        // '21080': 'Mostly Cloudy and Fog',
        // '20000': 'Fog',
        // '42040': 'Partly Cloudy and Drizzle',
        // '42030': 'Mostly Clear and Drizzle',
        // '42050': 'Mostly Cloudy and Drizzle',
        // '40000': 'Drizzle',
        // '42000': 'Light Rain',
        else if ((weather == 'rain' || weather == 'rain_showers') && intensity == 'light') {
            subForecast = {
                'shortForecast': 'Light Rain',
                'icon': '42000_rain_light'
            }
        }
        // '42130': 'Mostly Clear and Light Rain',
        // '42140': 'Partly Cloudy and Light Rain',
        // '42150': 'Mostly Cloudy and Light Rain',
        // '42090': 'Mostly Clear and Rain'
        // else if (skyCover > 0 && skyCover < 26 && weather == 'rain' && intensity == null) {
        //     subForecast = {
        //         'shortForecast': 'Mostly Clear and Rain',
        //         'icon': '42090'
        //     }            
        // }
        
        
        // '42080': 'Partly Cloudy and Rain 42080'
        // else if (skyCover > 25 && skyCover < 51 && coverage == 'slight_coverage' && weather == 'rain') {
        //     subForecast = {
        //         'shortForecast': 'Partly Cloudy and Rain',
        //         'icon': '42080_rain_partly_cloudy'
        //     }
        // }

        // '42100': 'Mostly Cloudy and Rain',
        // '40010': 'Rain',
        else if ((weather == 'rain' || weather == 'rain_showers') && intensity == 'moderate') {
            subForecast = {
                'shortForecast': 'Rain',
                'icon': '40010_rain'
            }
        }
        // '42110': 'Mostly Clear and Heavy Rain',
        // '42020': 'Partly Cloudy and Heavy Rain',
        // '42120': 'Mostly Cloudy and Heavy Rain',
        // '42010': 'Heavy Rain',
        // '51150': 'Mostly Clear and Flurries'
        // else if (skyCover > 0 && skyCover < 26 && weather == 'snow_showers' && intensity == null) {
        //     subForecast = {
        //         'shortForecast': 'Mostly Clear and Flurries',
        //         'icon': '51150_flurries_mostly_clear'
        //     }
        // }
        // '51160': 'Partly Cloudy and Flurries',
        // '51170': 'Mostly Cloudy and Flurries',
        // '50010': 'Flurries',
        // '51000': 'Light Snow',
        // '51020': 'Mostly Clear and Light Snow',
        // '51030': 'Partly Cloudy and Light Snow',
        // '51040': 'Mostly Cloudy and Light Snow',
        // '51220': 'Drizzle and Light Snow',
        // '51050': 'Mostly Clear and Snow',
        // '51060': 'Partly Cloudy and Snow',
        // '51070': 'Mostly Cloudy and Snow',
        // '50000': 'Snow',
        else if (coverage == 'Likely' && weather == 'snow' || (weather == 'snow_showers') && intensity == 'moderate') {
            subForecast = {
                'shortForecast': 'Snow',
                'icon': '50000_snow'
            }
        }
        // '51010': 'Heavy Snow',
        // '51190': 'Mostly Clear and Heavy Snow',
        // '51200': 'Partly Cloudy and Heavy Snow',
        // '51210': 'Mostly Cloudy and Heavy Snow',
        // '51100': 'Drizzle and Snow',
        // '51080': 'Rain and Snow',
        // '51140': 'Snow and Freezing Rain',
        // '51120': 'Snow and Ice Pellets',
        // '60000': 'Freezing Drizzle',
        // '60030': 'Mostly Clear and Freezing drizzle',
        // '60020': 'Partly Cloudy and Freezing drizzle',
        // '60040': 'Mostly Cloudy and Freezing drizzle',
        // '62040': 'Drizzle and Freezing Drizzle',
        // '62060': 'Light Rain and Freezing Drizzle',
        // '62050': 'Mostly Clear and Light Freezing Rain',
        // '62030': 'Partly Cloudy and Light Freezing Rain',
        // '62090': 'Mostly Cloudy and Light Freezing Rain',
        // '62000': 'Light Freezing Rain',
        // '62130': 'Mostly Clear and Freezing Rain',
        // '62140': 'Partly Cloudy and Freezing Rain',
        // '62150': 'Mostly Cloudy and Freezing Rain',
        // '60010': 'Freezing Rain',
        // '62120': 'Drizzle and Freezing Rain',
        // '62200': 'Light Rain and Freezing Rain',
        // '62220': 'Rain and Freezing Rain',
        // '62070': 'Mostly Clear and Heavy Freezing Rain',
        // '62020': 'Partly Cloudy and Heavy Freezing Rain',
        // '62080': 'Mostly Cloudy and Heavy Freezing Rain',
        // '62010': 'Heavy Freezing Rain',
        // '71100': 'Mostly Clear and Light Ice Pellets',
        // '71110': 'Partly Cloudy and Light Ice Pellets',
        // '71120': 'Mostly Cloudy and Light Ice Pellets',
        // '71020': 'Light Ice Pellets',
        // '71080': 'Mostly Clear and Ice Pellets',
        // '71070': 'Partly Cloudy and Ice Pellets',
        // '71090': 'Mostly Cloudy and Ice Pellets',
        // '70000': 'Ice Pellets',
        // '71050': 'Drizzle and Ice Pellets',
        // '71060': 'Freezing Rain and Ice Pellets',
        // '71150': 'Light Rain and Ice Pellets',
        // '71170': 'Rain and Ice Pellets',
        // '71030': 'Freezing Rain and Heavy Ice Pellets',
        // '71130': 'Mostly Clear and Heavy Ice Pellets',
        // '71140': 'Partly Cloudy and Heavy Ice Pellets',
        // '71160': 'Mostly Cloudy and Heavy Ice Pellets',
        // '71010': 'Heavy Ice Pellets',
        // '80010': 'Mostly Clear and Thunderstorm',
        // '80030': 'Partly Cloudy and Thunderstorm',
        // '80020': 'Mostly Cloudy and Thunderstorm',
        // '80000': 'Thunderstorm'
        else if (weather == 'thunderstorms' && intensity == null) {
            subForecast = {
                'shortForecast': 'Thunderstorm',
                'icon': '80000_tstorm'
            }
        }
        else {
            subForecast = {
                'shortForecast': 'Unknown',
                'icon': ''
            }
        }

    } else if (timeOfDay == 'night') {
        // Clear Night 10001
        if (skyCover == 0 && weather == null && intensity == null) { 
            subForecast = {
                'shortForecast': 'Clear',
                'icon': '10001_clear'
            }
        }
        // Mostly Clear Night 11001
        else if (skyCover > 0 && skyCover < 26 && weather == null && intensity == null) { 
            subForecast = {
                'shortForecast': 'Mostly Clear',
                'icon': '11001_mostly_clear'
            }
        }
        //  Partly Cloudy Night 11011
        else if (skyCover > 25 && skyCover < 51 && weather == null && intensity == null) { 
            subForecast = {
                'shortForecast': 'Partly Cloudy',
                'icon': '11011_partly_cloudy'
            }
        }
        // Mostly Cloudy Night 11021
        else if (skyCover > 50 && skyCover < 76 && weather == null && intensity == null) { 
            subForecast = {
                'shortForecast': 'Mostly Cloudy',
                'icon': '11021_mostly_cloudy'
            }
        }
        // Cloudy Night 10011
        else if (skyCover > 75 && weather == null && intensity == null) { 
            subForecast = {
                'shortForecast': 'Cloudy',
                'icon': '10010_cloudy'
            }
        }

        // '11031': 'Partly Cloudy and Mostly Clear',
        // '21001': 'Light Fog',
        else if (coverage == 'Patchy' && weather == 'fog' && intensity == null) {
            subForecast = {
                'shortForecast': 'Light Fog',
                'icon': '21000_fog_light'
            }
        }
        // '21011': 'Mostly Clear and Light Fog',
        // '21021': 'Partly Cloudy and Light Fog',
        // '21031': 'Mostly Cloudy and Light Fog',
        // '21061': 'Mostly Clear and Fog',
        // '21071': 'Partly Cloudy and Fog',
        // '21081': 'Mostly Cloudy and Fog',
        // '20001': 'Fog',
        // '42041': 'Partly Cloudy and Drizzle',
        // '42031': 'Mostly Clear and Drizzle',
        // '42051': 'Mostly Cloudy and Drizzle',
        // '40001': 'Drizzle',
        // else if (weather == 'rain' && intensity == null) {
        //     subForecast = {
        //         'shortForecast': 'Drizzle',
        //         'icon': '40001_drizzle'
        //     }
        // }
        // '42001': 'Light Rain',
        else if ((weather == 'rain' || weather == 'rain_showers') && intensity == 'light') {
            subForecast = {
                'shortForecast': 'Light Rain',
                'icon': '42001_rain_light'
            }
        }
        // '42131': 'Mostly Clear and Light Rain',
        // '42141': 'Partly Cloudy and Light Rain',
        // '42151': 'Mostly Cloudy and Light Rain',
        // '42091': 'Mostly Clear and Rain',
        // else if (skyCover > 0 && skyCover < 26 && weather == 'rain' && intensity == null) {
        //     subForecast = {
        //         'shortForecast': 'Mostly Clear and Rain',
        //         'icon': '42091'
        //     }            
        // }
        // Partly Cloudy and Rain 42081
        // else if ((weather == 'rain' || weather == 'rain_showers') && intensity == 'light') {
        //     subForecast = {
        //         'shortForecast': 'Light Rain',
        //         'icon': '42001_drizzle'
        //     }
        // }

        // '42101': 'Mostly Cloudy and Rain',
        // '40011': 'Rain' (Day/Night icons are the same)
        else if ((weather == 'rain' || weather == 'rain_showers') && intensity == 'moderate') {
            subForecast = {
                'shortForecast': 'Rain',
                'icon': '40010_rain'
            }
        }
        // '42111': 'Mostly Clear and Heavy Rain',
        // '42021': 'Partly Cloudy and Heavy Rain',
        // '42121': 'Mostly Cloudy and Heavy Rain',
        // '42011': 'Heavy Rain',
        // '51151': 'Mostly Clear and Flurries',
        // else if (skyCover > 0 && skyCover < 26 && weather == 'snow_showers' && intensity == null) {
        //     subForecast = {
        //         'shortForecast': 'Mostly Clear and Flurries',
        //         'icon': '51151_flurries_mostly_clear'
        //     }
        // }
        // '51161': 'Partly Cloudy and Flurries',
        // '51171': 'Mostly Cloudy and Flurries',
        // '50011': 'Flurries',
        // '51001': 'Light Snow',
        // '51021': 'Mostly Clear and Light Snow',
        // '51031': 'Partly Cloudy and Light Snow',
        // '51041': 'Mostly Cloudy and Light Snow',
        // '51221': 'Drizzle and Light Snow',
        // '51051': 'Mostly Clear and Snow',
        // '51061': 'Partly Cloudy and Snow',
        // '51071': 'Mostly Cloudy and Snow',
        // '50001': 'Snow',
        else if ((coverage == 'likely' || coverage == 'slight_chance') && (weather == 'snow' || weather == 'snow_showers') && intensity == 'moderate') {
            subForecast = {
                'shortForecast': 'Snow',
                'icon': '50000_snow'
            }
        }
        // '51011': 'Heavy Snow',
        // '51191': 'Mostly Clear and Heavy Snow',
        // '51201': 'Partly Cloudy and Heavy Snow',
        // '51211': 'Mostly Cloudy and Heavy Snow',
        // '51101': 'Drizzle and Snow',
        // '51081': 'Rain and Snow',
        // '51141': 'Snow and Freezing Rain',
        // '51121': 'Snow and Ice Pellets',
        // '60001': 'Freezing Drizzle',
        // '60031': 'Mostly Clear and Freezing drizzle',
        // '60021': 'Partly Cloudy and Freezing drizzle',
        // '60041': 'Mostly Cloudy and Freezing drizzle',
        // '62041': 'Drizzle and Freezing Drizzle',
        // '62061': 'Light Rain and Freezing Drizzle',
        // '62051': 'Mostly Clear and Light Freezing Rain',
        // '62031': 'Partly cloudy and Light Freezing Rain',
        // '62091': 'Mostly Cloudy and Light Freezing Rain',
        // '62001': 'Light Freezing Rain',
        // '62131': 'Mostly Clear and Freezing Rain',
        // '62141': 'Partly Cloudy and Freezing Rain',
        // '62151': 'Mostly Cloudy and Freezing Rain',
        // '60011': 'Freezing Rain',
        // '62121': 'Drizzle and Freezing Rain',
        // '62201': 'Light Rain and Freezing Rain',
        // '62221': 'Rain and Freezing Rain',
        // '62071': 'Mostly Clear and Heavy Freezing Rain',
        // '62021': 'Partly Cloudy and Heavy Freezing Rain',
        // '62081': 'Mostly Cloudy and Heavy Freezing Rain',
        // '62011': 'Heavy Freezing Rain',
        // '71101': 'Mostly Clear and Light Ice Pellets',
        // '71111': 'Partly Cloudy and Light Ice Pellets',
        // '71121': 'Mostly Cloudy and Light Ice Pellets',
        // '71021': 'Light Ice Pellets',
        // '71081': 'Mostly Clear and Ice Pellets',
        // '71071': 'Partly Cloudy and Ice Pellets',
        // '71091': 'Mostly Cloudy and Ice Pellets',
        // '70001': 'Ice Pellets',
        // '71051': 'Drizzle and Ice Pellets',
        // '71061': 'Freezing Rain and Ice Pellets',
        // '71151': 'Light Rain and Ice Pellets',
        // '71171': 'Rain and Ice Pellets',
        // '71031': 'Freezing Rain and Heavy Ice Pellets',
        // '71131': 'Mostly Clear and Heavy Ice Pellets',
        // '71141': 'Partly Cloudy and Heavy Ice Pellets',
        // '71161': 'Mostly Cloudy and Heavy Ice Pellets',
        // '71011': 'Heavy Ice Pellets',
        // '80011': 'Mostly Clear and Thunderstorm',
        // '80031': 'Partly Cloudy and Thunderstorm',
        // '80021': 'Mostly Cloudy and Thunderstorm',
        // '80001': 'Thunderstorm'
        else if (weather == 'thunderstorms' && intensity == null) {
            subForecast = {
                'shortForecast': 'Thunderstorm',
                'icon': '80000_tstorm'
            }
        }
        
        else {
            subForecast = {
                'shortForecast': 'Unknown',
                'icon': ''
            } 
        }

    } else (
        subForecast = 'Unknown Time of Day'
    )

    if (subForecast.shortForecast == 'Unknown') {
        console.warn(index, 'Precipitation:', precipitation, 'Sky Cover:', skyCover, 'coverage:', coverage, 'Weather:', weather, 'Intensity', intensity)
    }
    return subForecast
}

const timeZoneMap = {
    'EDT': 'Eastern',
    'EST': 'Eastern',
    'CDT': 'Central',
    'CST': 'Central',
    'MDT': 'Mountain',
    'MST': 'Mountain',
    'PDT': 'Pacific',
    'PST': 'Pacific',
    'AKDT': 'Alaska',
    'AKST': 'Alaska',
    'HST': 'Hawaii',
    'HDT': 'Hawaii',
}
