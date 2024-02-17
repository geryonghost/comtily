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

async function currentForecast(units, forecastGridData, forecastSunriseSunset, forecastTimeZone) {
    const temperatureTrendHourCount = 5
    let temperatureSum = temperatureAverage = 0
    let currentTemperatureTrend = ''
    
    // Determines the temperature trend based in the average for the next 5 hours
    for (let i = 0; i < 5; i++) {
        temperatureSum += forecastGridData.temperature.values[i].value
    }
    temperatureAverage = temperatureSum / temperatureTrendHourCount
    
    const i = 0

    if (forecastGridData.temperature.values[i].value > temperatureAverage) { 
        currentTemperatureTrend = '<span class="text-info">&#8595;</span>'
    } else if (forecastGridData.temperature.values[i].value < temperatureAverage) { 
        currentTemperatureTrend = '<span class="text-danger";>&#8593;</span>'
    }

    // const highsLows = await database.getHighsLows(query, 0, timeZone)
    // console.log(highsLows)

   

    const currentDate = new Date()
    const sunrise = new Date(forecastSunriseSunset.sunrise)
    const sunset = new Date(forecastSunriseSunset.sunset)
    let timeOfDay

    if (currentDate > sunrise && currentDate < sunset) {
        timeOfDay = 'day'
    } else {
        timeOfDay = 'night'
    }

    let apparentTemperature, dewPoint, elevation, heatIndex, humidity, highTemp, highTime, lowTemp, lowTime, precipitation, skyCover
    let temperature, timeZone, weatherCoverage, weatherIntensity, weatherType, windChill, windDirection, windGust, windSpeed
    
    apparentTemperature = conversions.convertTemperature(units, forecastGridData.apparentTemperature.values[i].value)
    dewPoint = forecastGridData.dewpoint.values[i].value.toFixed(2)
    elevation = conversions.convertLength(units, forecastGridData.elevation.value)
    // heatIndex = conversions.convertTemperature(units, forecastGridData.heatIndex.values[i].value)
    humidity = forecastGridData.relativeHumidity.values[i].value
    highTemp = conversions.convertTemperature(units, forecastGridData.maxTemperature.values[i].value)
    highTime = conversions.convertTime(forecastGridData.maxTemperature.values[i].validTime, forecastTimeZone.zoneName)
    lowTemp = conversions.convertTemperature(units, forecastGridData.minTemperature.values[i].value)
    lowTime = conversions.convertTime(forecastGridData.minTemperature.values[i].validTime, forecastTimeZone.zoneName)
    
    precipitation = forecastGridData.probabilityOfPrecipitation.values[i].value
    skyCover = forecastGridData.skyCover.values[i].value
    temperature = conversions.convertTemperature(units, forecastGridData.temperature.values[i].value)
    timeZone = timeZoneMap[forecastTimeZone.abbreviation]

    weatherCoverage = forecastGridData.weather.values[i].value[0].coverage
    weatherIntensity = forecastGridData.weather.values[i].value[0].intensity
    weatherType = forecastGridData.weather.values[i].value[0].weather

    // windChill = conversions.convertTemperature(units, forecastGridData.windChill.values[i].value)
    console.log(windChill)
    windDirection = forecastGridData.windDirection.values[i].value
    windGust = forecastGridData.windGust.values[i].value
    windSpeed =  forecastGridData.windSpeed.values[i].value

    // precipitation, skycover, weather_coverage, weather_type, fog???

    const subForecast = getSubForecast(timeOfDay, precipitation, skyCover, weatherCoverage, weatherType)
    
    const forecast = {
        'apparentTemperature': apparentTemperature,
        'dewpoint': dewPoint,
        'elevation': elevation,
        // 'heatIndex': heatIndex,
        'humidity': humidity,
        'highTemp': highTemp,
        'highTime': highTime,
        'lowTemp': lowTemp,
        'lowTime': lowTime,
        'icon': 'icons/' + subForecast.icon + '_large.png',
        'timeOfDay': timeOfDay,
        'probabilityofprecipitation': precipitation,
        'shortForecast': subForecast.shortForecast,
        'skycover': skyCover,
        'temperature': temperature,
        'temperaturetrend': currentTemperatureTrend,
        'timeZone': timeZone,
        // 'windChill': windChill,
        'winddirection': windDirection,
        'windgust': windGust,
        'windspeed': windSpeed,
    }
  
    return forecast
}

function getSubForecast(timeOfDay, precipitation, skyCover, weatherCoverage, weatherType) {
    console.log('Precipitation:', precipitation, 'Sky Cover:', skyCover, 'Chance:', weatherCoverage, 'Type:', weatherType)
    
    let subForecast = {}
    // Precipitation > 0 
    // skyCover > 0 < 26 = Mostly Clear, > 25 < 51 = Partly Cloudy,  > 50 < 76 = Mostly Cloudy, > 75 = Cloudy
    // Clear Day 10000
    if (precipitation == 0 && skyCover == 0 && weatherCoverage == null && weatherType == null && timeOfDay == 'day') { 
        subForecast = {
            'shortForecast': forecastMap[timeOfDay][10000],
            'icon': '10000_clear'
        }
    // Clear Night 10001
    } else if (precipitation == 0 && skyCover == 0 && weatherCoverage == null && weatherType == null && timeOfDay == 'night') { 
        subForecast = {
            'shortForecast': forecastMap[timeOfDay][10001],
            'icon': '10001_clear'
        }
    
    // Mostly Clear Day 11001
    } else if (precipitation == 0 && skyCover > 0 && skyCover < 26 && weatherCoverage == null && weatherType == null && timeOfDay == 'day') { 
    subForecast = {
        'shortForecast': forecastMap[timeOfDay][11000],
        'icon': '11000_mostly_clear'
    }
    // Mostly Clear Night 11001
    } else if (precipitation == 0 && skyCover > 0 && skyCover < 26 && weatherCoverage == null && weatherType == null && timeOfDay == 'night') { 
        subForecast = {
            'shortForecast': forecastMap[timeOfDay][11001],
            'icon': '11001_mostly_clear'
        }

    //  Partly Cloudy Day 11010
    } else if (precipitation == 0 && skyCover > 25 && skyCover < 51 && weatherCoverage == null && weatherType == null && timeOfDay == 'day') { 
        subForecast = {
            'shortForecast': forecastMap[timeOfDay][11010],
            'icon': '11010_partly_cloudy'
        }
    //  Partly Cloudy Night 11011
    } else if (precipitation == 0 && skyCover > 25 && skyCover < 51 && weatherCoverage == null && weatherType == null && timeOfDay == 'night') { 
        subForecast = {
            'shortForecast': forecastMap[timeOfDay][11011],
            'icon': '11011_partly_cloudy'
        }
    // Mostly Cloudy Day 11020
    } else if (precipitation > 0 && skyCover > 50 && skyCover < 76 && weatherCoverage == null && weatherType == null && timeOfDay == 'day') { 
        subForecast = {
            'shortForecast': forecastMap[timeOfDay][11020],
            'icon': '11020_mostly_cloudy'
        }
    // Mostly Cloudy Night 11021
    } else if (precipitation > 0 && skyCover > 50 && skyCover < 76 && weatherCoverage == null && weatherType == null && timeOfDay == 'night') { 
        subForecast = {
            'shortForecast': forecastMap[timeOfDay][11021],
            'icon': '11021_mostly_cloudy'
    }

    // Cloudy Day 10010
    } else if (precipitation > 0 && skyCover > 75 && weatherCoverage == null && weatherType == null && timeOfDay == 'day') { 
    subForecast = {
        'shortForecast': forecastMap[timeOfDay][10010],
        'icon': '10010_cloudy'
    }
    // Cloudy Night 10011
    } else if (precipitation > 0 && skyCover > 75 && weatherCoverage == null && weatherType == null && timeOfDay == 'night') { 
    subForecast = {
        'shortForecast': forecastMap[timeOfDay][10011],
        'icon': '10011_cloudy'
    }

    // Partly Cloudy and Rain 42000
    } else if (precipitation > 0 && skyCover > 25 && skyCover < 51 && weatherCoverage == 'slight_chance' && weatherType == 'rain' && timeOfDay == 'day') {
        subForecast = {
            'shortForecast': forecastMap[timeOfDay][42080],
            'icon': '42080_rain_partly_cloudy'
        }
    // Unknown
    } else {
        subForecast = {
            'shortForecast': forecastMap[timeOfDay][0],
            'icon': ''
        }
    }
    if (subForecast.shortForecast == 'Unknown') {
        console.log(subForecast.shortForecast)
    }
    return subForecast
}

module.exports = {
    getAll,
    currentForecast,
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

const forecastMap = {
    'day' : {
        '0': 'Unknown',
        '10000': 'Clear, Sunny',
        '11000': 'Mostly Clear',
        '11010': 'Partly Cloudy',
        '11020': 'Mostly Cloudy',
        '10010': 'Cloudy',
        '11030': 'Partly Cloudy and Mostly Clear',
        '21000': 'Light Fog',
        '21010': 'Mostly Clear and Light Fog',
        '21020': 'Partly Cloudy and Light Fog',
        '21030': 'Mostly Cloudy and Light Fog',
        '21060': 'Mostly Clear and Fog',
        '21070': 'Partly Cloudy and Fog',
        '21080': 'Mostly Cloudy and Fog',
        '20000': 'Fog',
        '42040': 'Partly Cloudy and Drizzle',
        '42030': 'Mostly Clear and Drizzle',
        '42050': 'Mostly Cloudy and Drizzle',
        '40000': 'Drizzle',
        '42000': 'Light Rain',
        '42130': 'Mostly Clear and Light Rain',
        '42140': 'Partly Cloudy and Light Rain',
        '42150': 'Mostly Cloudy and Light Rain',
        '42090': 'Mostly Clear and Rain',
        '42080': 'Partly Cloudy and Rain',
        '42100': 'Mostly Cloudy and Rain',
        '40010': 'Rain',
        '42110': 'Mostly Clear and Heavy Rain',
        '42020': 'Partly Cloudy and Heavy Rain',
        '42120': 'Mostly Cloudy and Heavy Rain',
        '42010': 'Heavy Rain',
        '51150': 'Mostly Clear and Flurries',
        '51160': 'Partly Cloudy and Flurries',
        '51170': 'Mostly Cloudy and Flurries',
        '50010': 'Flurries',
        '51000': 'Light Snow',
        '51020': 'Mostly Clear and Light Snow',
        '51030': 'Partly Cloudy and Light Snow',
        '51040': 'Mostly Cloudy and Light Snow',
        '51220': 'Drizzle and Light Snow',
        '51050': 'Mostly Clear and Snow',
        '51060': 'Partly Cloudy and Snow',
        '51070': 'Mostly Cloudy and Snow',
        '50000': 'Snow',
        '51010': 'Heavy Snow',
        '51190': 'Mostly Clear and Heavy Snow',
        '51200': 'Partly Cloudy and Heavy Snow',
        '51210': 'Mostly Cloudy and Heavy Snow',
        '51100': 'Drizzle and Snow',
        '51080': 'Rain and Snow',
        '51140': 'Snow and Freezing Rain',
        '51120': 'Snow and Ice Pellets',
        '60000': 'Freezing Drizzle',
        '60030': 'Mostly Clear and Freezing drizzle',
        '60020': 'Partly Cloudy and Freezing drizzle',
        '60040': 'Mostly Cloudy and Freezing drizzle',
        '62040': 'Drizzle and Freezing Drizzle',
        '62060': 'Light Rain and Freezing Drizzle',
        '62050': 'Mostly Clear and Light Freezing Rain',
        '62030': 'Partly Cloudy and Light Freezing Rain',
        '62090': 'Mostly Cloudy and Light Freezing Rain',
        '62000': 'Light Freezing Rain',
        '62130': 'Mostly Clear and Freezing Rain',
        '62140': 'Partly Cloudy and Freezing Rain',
        '62150': 'Mostly Cloudy and Freezing Rain',
        '60010': 'Freezing Rain',
        '62120': 'Drizzle and Freezing Rain',
        '62200': 'Light Rain and Freezing Rain',
        '62220': 'Rain and Freezing Rain',
        '62070': 'Mostly Clear and Heavy Freezing Rain',
        '62020': 'Partly Cloudy and Heavy Freezing Rain',
        '62080': 'Mostly Cloudy and Heavy Freezing Rain',
        '62010': 'Heavy Freezing Rain',
        '71100': 'Mostly Clear and Light Ice Pellets',
        '71110': 'Partly Cloudy and Light Ice Pellets',
        '71120': 'Mostly Cloudy and Light Ice Pellets',
        '71020': 'Light Ice Pellets',
        '71080': 'Mostly Clear and Ice Pellets',
        '71070': 'Partly Cloudy and Ice Pellets',
        '71090': 'Mostly Cloudy and Ice Pellets',
        '70000': 'Ice Pellets',
        '71050': 'Drizzle and Ice Pellets',
        '71060': 'Freezing Rain and Ice Pellets',
        '71150': 'Light Rain and Ice Pellets',
        '71170': 'Rain and Ice Pellets',
        '71030': 'Freezing Rain and Heavy Ice Pellets',
        '71130': 'Mostly Clear and Heavy Ice Pellets',
        '71140': 'Partly Cloudy and Heavy Ice Pellets',
        '71160': 'Mostly Cloudy and Heavy Ice Pellets',
        '71010': 'Heavy Ice Pellets',
        '80010': 'Mostly Clear and Thunderstorm',
        '80030': 'Partly Cloudy and Thunderstorm',
        '80020': 'Mostly Cloudy and Thunderstorm',
        '80000': 'Thunderstorm'
    },
    'night': {
        '0': 'Unknown',
        '10001': 'Clear',
        '11001': 'Mostly Clear',
        '11011': 'Partly Cloudy',
        '11021': 'Mostly Cloudy',
        '10011': 'Cloudy',
        '11031': 'Partly Cloudy and Mostly Clear',
        '21001': 'Light Fog',
        '21011': 'Mostly Clear and Light Fog',
        '21021': 'Partly Cloudy and Light Fog',
        '21031': 'Mostly Cloudy and Light Fog',
        '21061': 'Mostly Clear and Fog',
        '21071': 'Partly Cloudy and Fog',
        '21081': 'Mostly Cloudy and Fog',
        '20001': 'Fog',
        '42041': 'Partly Cloudy and Drizzle',
        '42031': 'Mostly Clear and Drizzle',
        '42051': 'Mostly Cloudy and Drizzle',
        '40001': 'Drizzle',
        '42001': 'Light Rain',
        '42131': 'Mostly Clear and Light Rain',
        '42141': 'Partly Cloudy and Light Rain',
        '42151': 'Mostly Cloudy and Light Rain',
        '42091': 'Mostly Clear and Rain',
        '42081': 'Partly Cloudy and Rain',
        '42101': 'Mostly Cloudy and Rain',
        '40011': 'Rain',
        '42111': 'Mostly Clear and Heavy Rain',
        '42021': 'Partly Cloudy and Heavy Rain',
        '42121': 'Mostly Cloudy and Heavy Rain',
        '42011': 'Heavy Rain',
        '51151': 'Mostly Clear and Flurries',
        '51161': 'Partly Cloudy and Flurries',
        '51171': 'Mostly Cloudy and Flurries',
        '50011': 'Flurries',
        '51001': 'Light Snow',
        '51021': 'Mostly Clear and Light Snow',
        '51031': 'Partly Cloudy and Light Snow',
        '51041': 'Mostly Cloudy and Light Snow',
        '51221': 'Drizzle and Light Snow',
        '51051': 'Mostly Clear and Snow',
        '51061': 'Partly Cloudy and Snow',
        '51071': 'Mostly Cloudy and Snow',
        '50001': 'Snow',
        '51011': 'Heavy Snow',
        '51191': 'Mostly Clear and Heavy Snow',
        '51201': 'Partly Cloudy and Heavy Snow',
        '51211': 'Mostly Cloudy and Heavy Snow',
        '51101': 'Drizzle and Snow',
        '51081': 'Rain and Snow',
        '51141': 'Snow and Freezing Rain',
        '51121': 'Snow and Ice Pellets',
        '60001': 'Freezing Drizzle',
        '60031': 'Mostly Clear and Freezing drizzle',
        '60021': 'Partly Cloudy and Freezing drizzle',
        '60041': 'Mostly Cloudy and Freezing drizzle',
        '62041': 'Drizzle and Freezing Drizzle',
        '62061': 'Light Rain and Freezing Drizzle',
        '62051': 'Mostly Clear and Light Freezing Rain',
        '62031': 'Partly cloudy and Light Freezing Rain',
        '62091': 'Mostly Cloudy and Light Freezing Rain',
        '62001': 'Light Freezing Rain',
        '62131': 'Mostly Clear and Freezing Rain',
        '62141': 'Partly Cloudy and Freezing Rain',
        '62151': 'Mostly Cloudy and Freezing Rain',
        '60011': 'Freezing Rain',
        '62121': 'Drizzle and Freezing Rain',
        '62201': 'Light Rain and Freezing Rain',
        '62221': 'Rain and Freezing Rain',
        '62071': 'Mostly Clear and Heavy Freezing Rain',
        '62021': 'Partly Cloudy and Heavy Freezing Rain',
        '62081': 'Mostly Cloudy and Heavy Freezing Rain',
        '62011': 'Heavy Freezing Rain',
        '71101': 'Mostly Clear and Light Ice Pellets',
        '71111': 'Partly Cloudy and Light Ice Pellets',
        '71121': 'Mostly Cloudy and Light Ice Pellets',
        '71021': 'Light Ice Pellets',
        '71081': 'Mostly Clear and Ice Pellets',
        '71071': 'Partly Cloudy and Ice Pellets',
        '71091': 'Mostly Cloudy and Ice Pellets',
        '70001': 'Ice Pellets',
        '71051': 'Drizzle and Ice Pellets',
        '71061': 'Freezing Rain and Ice Pellets',
        '71151': 'Light Rain and Ice Pellets',
        '71171': 'Rain and Ice Pellets',
        '71031': 'Freezing Rain and Heavy Ice Pellets',
        '71131': 'Mostly Clear and Heavy Ice Pellets',
        '71141': 'Partly Cloudy and Heavy Ice Pellets',
        '71161': 'Mostly Cloudy and Heavy Ice Pellets',
        '71011': 'Heavy Ice Pellets',
        '80011': 'Mostly Clear and Thunderstorm',
        '80031': 'Partly Cloudy and Thunderstorm',
        '80021': 'Mostly Cloudy and Thunderstorm',
        '80001': 'Thunderstorm'
    }
}