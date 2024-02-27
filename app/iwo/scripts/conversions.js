const moment = require('moment-timezone')

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertGridData(gridData, timeZone) {
    // const id = gridData['@id']
    // const type = gridData['@type']
    // const updateTime = gridData.updateTime
    // const validTimes = gridData.validTimes
    const elevation = gridData.elevation
    // const forecastOffice = gridData.forecastOffice
    // const gridId = gridData.gridId
    // const gridX = gridData.gridX
    // const gridY = gridData.gridY
    // temperature
    let temperatureValues = []
    for (i = 0; i < gridData.temperature.values.length; i++) {
        temperatureValues = temperatureValues.concat(convertValidTimeValues(gridData.temperature.values[i], timeZone))
    }
    const temperature = {'uom': gridData.temperature.uom, 'values': temperatureValues}
    // // dewpoint
    // let dewPointValues = []
    // for (i = 0; i < gridData.dewpoint.values.length; i++) {
    //     dewPointValues = dewPointValues.concat(convertValidTimeValues(gridData.dewpoint.values[i]))
    // }
    // const dewpoint = {'uom': gridData.dewpoint.uom, 'values': dewPointValues}
    // const maxTemperature = gridData.maxTemperature
    // const minTemperature = gridData.minTemperature
    // // relativeHumidity
    // let relativeHumidityValues = []
    // for (i = 0; i < gridData.relativeHumidity.values.length; i++) {
    //     relativeHumidityValues = relativeHumidityValues.concat(convertValidTimeValues(gridData.relativeHumidity.values[i]))
    // }
    // const relativeHumidity = {'uom': gridData.relativeHumidity.uom, 'values': relativeHumidityValues}
    // apparentTemperature
    let apparentTemperatureValues = []
    for (i = 0; i < gridData.apparentTemperature.values.length; i++) {
        apparentTemperatureValues = apparentTemperatureValues.concat(convertValidTimeValues(gridData.apparentTemperature.values[i], timeZone))
    }
    const apparentTemperature = {'uom': gridData.apparentTemperature.uom, 'values': apparentTemperatureValues}
    // wetBulbGlobeTemperature
    // heatIndex
    // windChill
    // skyCover
    let skyCoverValues = []
    for (i = 0; i < gridData.skyCover.values.length; i++) {
        skyCoverValues = skyCoverValues.concat(convertValidTimeValues(gridData.skyCover.values[i], timeZone))
    }
    const skyCover = {'uom': gridData.skyCover.uom, 'values': skyCoverValues}

    // windDirection
    // windSpeed
    // windGust
    // weather
    let weatherValues = []
    for (i = 0; i < gridData.weather.values.length; i++) {
        weatherValues = weatherValues.concat(convertValidTimeValues(gridData.weather.values[i], timeZone))
    }
    const weather = {'uom': gridData.weather.uom, 'values': weatherValues}
    // hazards
    // probabilityOfPrecipitation
    let probabilityOfPrecipitationValues = []
    for (i = 0; i < gridData.probabilityOfPrecipitation.values.length; i++) {
        probabilityOfPrecipitationValues = probabilityOfPrecipitationValues.concat(convertValidTimeValues(gridData.probabilityOfPrecipitation.values[i], timeZone))
    }
    const probabilityOfPrecipitation = {'uom': gridData.probabilityOfPrecipitation.uom, 'values': probabilityOfPrecipitationValues}
    // quantitativePrecipitation
    // iceAccumulation
    // snowfallAmount
    // snowLevel
    // ceilingHeight
    // visibility
    // transportWindSpeed
    // transportWindDirection
    // mixingHeight
    // hainesIndex
    // lightningActivityLevel
    // twentyFootWindSpeed
    // twentyFootWindDirection
    // waveHeight
    // wavePeriod
    // waveDirection
    // primarySwellHeight
    // primarySwellDirection
    // secondarySwellHeight
    // secondarySwellDirection
    // wavePeriod2
    // windWaveHeight
    // dispersionIndex
    // pressure
    // probabilityOfTropicalStormWinds
    // probabilityOfHurricaneWinds
    // potentialOf15mphWinds
    // potentialOf25mphWinds
    // potentialOf35mphWinds
    // potentialOf45mphWinds
    // potentialOf20mphWindGusts
    // potentialOf30mphWindGusts
    // potentialOf40mphWindGusts
    // potentialOf50mphWindGusts
    // potentialOf60mphWindGusts
    // grasslandFireDangerIndex
    // probabilityOfThunder
    // davisStabilityIndex
    // atmosphericDispersionIndex
    // lowVisibilityOccurrenceRiskIndex
    // stability
    // redFlagThreatIndex

    // console.log(dewPoint)
// console.log(gridData)
    forecast = {
        // '@id': id,
        // '@type': type,
        // 'updateTime': updateTime,
        // 'validTimes': validTimes,
        'elevation': elevation,
        // 'forecastOffice': forecastOffice,
        // 'gridId': gridId,
        // 'gridX': gridX,
        // 'gridY': gridY,
        'temperature': temperature,
        // 'dewpoint': dewpoint,
        // 'maxTemperature': maxTemperature,
        // 'minTemperature': minTemperature,
        // 'relativeHumidity': relativeHumidity,
        'apparentTemperature': apparentTemperature,
        // 'wetBulbGlobeTemperature': 
        // 'heatIndex':
        // 'windChill': 
        'skyCover': skyCover,
        // 'windDirection':
        // 'windSpeed':
        // 'windGust':
        'weather': weather,
        // 'hazards':
        'probabilityOfPrecipitation': probabilityOfPrecipitation,
        // 'quantitativePrecipitation':
        // 'iceAccumulation':
        // 'snowfallAmount':
        // 'snowLevel':
        // 'ceilingHeight':
        // 'visibility':
        // 'transportWindSpeed':
        // 'transportWindDirection':
        // 'mixingHeight':
        // 'hainesIndex':
        // 'lightningActivityLevel':
        // 'twentyFootWindSpeed':
        // 'twentyFootWindDirection':
        // 'waveHeight':
        // 'wavePeriod':
        // 'waveDirection':
        // 'primarySwellHeight':
        // 'primarySwellDirection':
        // 'secondarySwellHeight':
        // 'secondarySwellDirection':
        // 'wavePeriod2':
        // 'windWaveHeight':
        // 'dispersionIndex':
        // 'pressure':
        // 'probabilityOfTropicalStormWinds':
        // 'probabilityOfHurricaneWinds':
        // 'potentialOf15mphWinds':
        // 'potentialOf25mphWinds':
        // 'potentialOf35mphWinds':
        // 'potentialOf45mphWinds':
        // 'potentialOf20mphWindGusts':
        // 'potentialOf30mphWindGusts':
        // 'potentialOf40mphWindGusts':
        // 'potentialOf50mphWindGusts':
        // 'potentialOf60mphWindGusts':
        // 'grasslandFireDangerIndex':
        // 'probabilityOfThunder':
        // 'davisStabilityIndex':
        // 'atmosphericDispersionIndex':
        // 'lowVisibilityOccurrenceRiskIndex':
        // 'stability':
        // 'redFlagThreatIndex':
      
    }

    return forecast

}

function convertLength(units, data) {
    let math, unit
    if (units == 'us') {
        math  = Math.round(data * 3.2808399)
        unit = math + 'ft'
    }
    if (units == 'metric') {
        unit = data + 'm'
    }
    return unit
}

function convertTemperature(units, data) {
    let math, unit
    if (units == 'us') {
        math = Math.round((data * 1.8) + 32)
        unit = math + '&#176;F'
    }
    if (units == 'metric') {
        unit = data + '&#176;C'
    }
    return unit
}

function convertValidTimeValues(values, timeZone) {
    let validTimeValues = []
    const parts = values.validTime.split('/')
    const indexP = parts[1].indexOf('P')
    const indexD = parts[1].indexOf('D')
    const indexT = parts[1].indexOf('T')
    const indexH = parts[1].indexOf('H')
    const numberDays = parts[1].substring(indexP+1,indexD)
    let numberHours = parts[1].substring(indexT+1,indexH)
    
    if (numberDays > 0) {
        const daysInHours = numberDays * 24
        numberHours = Number(numberHours) + Number(daysInHours)
    }

    for (let i = 0; i < numberHours; i++) {
        const newTime = moment(parts[0]).add(i, 'hours').tz(timeZone).format() //.format('LT')
        const newTimeValue = {'validTime': newTime, 'value': values.value}
        validTimeValues.push(newTimeValue)
    }
    
    return validTimeValues
}

function formatUnitCode(unitcode) {
    let unit = unitcode.substring(unitcode.lastIndexOf(':') + 1)
  
    if (unit == "degC") { unit = "C" }
    if (unit == "percent") { unit = "%"}
  
    return unit
}


module.exports = {
    capitalizeFirstLetter,
    convertGridData,
    convertLength,
    convertTemperature,
    formatUnitCode,
}