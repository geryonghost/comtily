const { getClient, dbName } = require('./db')

const moment = require('moment-timezone')
const conversions = require('./conversions')

async function getAll(query) {
    const client = getClient()
    const db = client.db(dbName)
    const collection = db.collection('forecasts')
    
    console.log('Querying the collection with: ' + query)
    try {
        const currentTime = new Date()
        const tenMinutesAgo = new Date(currentTime - 10 * 60 * 1000)
        const filterTime = tenMinutesAgo.toISOString()
        
        const filter = {'query': query, 'forecastFrom': {$gt: filterTime}}
        const weatherForecast = await collection.findOne(filter)
        
        return weatherForecast
    } catch (err) {
        console.error(err)
        return err
    }
}

async function updateWeatherForecastDb(query, dbData) {
    const client = getClient()
    const db = client.db(dbName)

    // Update forecasts
    try {
        console.log('Updating forecast in MongoDB')
        const filter = {'query': query}
        const collection = db.collection('forecasts')
        await collection.updateOne(filter, {$set: dbData}, {'upsert': true})
    } catch(err) {
        console.error(err)
    }

    // Update hourly reference
    try {
        const collection = db.collection('hourlyReference')
        
        console.log('Create hourly reference index')
        await collection.createIndex({query: 1, startTime: 1}, {unique: true})
        
        console.log('Updating hourly reference in MongoDB')
        const currentTime = new Date()
        for (let i = 0; i < dbData.forecastHourly.length; i++) {
            let hourlyReference
            hourlyReference = {
                'query': dbData.query,
                'startTime': dbData.forecastHourly[i].startTime,
                'isDaytime': dbData.forecastHourly[i].isDaytime,
                'temperature':dbData.forecastHourly[i].temperature,
                'temperatureUnit': dbData.forecastHourly[i].temperatureUnit
            }
            
            const filter = { "query": query, 'startTime': {$lt: currentTime}}
            await collection.updateOne(filter, {$set: hourlyReference}, {'upsert': true})
        }
    } catch(err) {
        console.error(err)
    }

    return 'complete'
}

async function getHighsLows(query, dateOffset, timeZone) {
    const client = getClient()
    const db = client.db(dbName)
    const collection = db.collection('hourlyReference')

    const now = new Date()
    console.log(now)

    const currentDate = conversions.getCurrentDate(timeZone, 3)
    console.log(currentDate)
    // 2024-01-25T00:00:00-06:00
    
    const startDay = `${currentDate}T00:00:00${timeZone[2]}`
    console.log(startDay)
    // const startDayLocal = moment.utc(startDay).tz(timeZone[0]).format()
    // console.log(startDayLocal)
    const midDay = `${currentDate}T12:00:00${timeZone[2]}`
    // const midDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dateOffset, 12, 0, 0)
    // const midDayLocal = moment.utc(midDay).tz(timeZone[0]).format()
    // console.log(midDayLocal)

    const endDay = `${currentDate}T23:59:59${timeZone[2]}`
    // const endDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dateOffset, 23, 59, 59)
    // const endDayLocal = moment.utc(endDay).tz(timeZone[0]).format()
    // console.log(endDayLocal)

    let filter, options

    // Morning High
    filter = {'query': query, 'isDaytime': false, 'startTime': {$gte: startDay, $lt: midDay}}
    console.log(filter)
    options = {sort: {temperature: -1}, limit: 1} // Max = -1, Min = 1
    const morningHigh = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // Morning Low
    filter = {'query': query, 'isDaytime': false, 'startTime': {$gte: startDay, $lt: midDay}}
    options = {sort: {temperature: 1}, limit: 1} // Max = -1, Min = 1
    const morningLow = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // midDay High
    filter = {'query': query, 'isDaytime': true, 'startTime': {$gte: startDay, $lt: endDay}}
    options = {sort: {temperature: -1}, limit: 1} // Max = -1, Min = 1
    const dayHigh = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // midDay Low
    filter = {'query': query, 'isDaytime': true, 'startTime': {$gte: startDay, $lt: endDay}}
    options = {sort: {temperature: 1}, limit: 1} // Max = -1, Min = 1
    const dayLow = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // Evening High
    filter = {'query': query, 'isDaytime': false, 'startTime': {$gte: midDay, $lt: endDay}}
    options = {sort: {temperature: -1}, limit: 1} // Max = -1, Min = 1
    const eveningHigh = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // Evening Low
    filter = {'query': query, 'isDaytime': false, 'startTime': {$gte: midDay, $lt: endDay}}
    options = {sort: {temperature: 1}, limit: 1} // Max = -1, Min = 1
    const eveningLow = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    const highsLows = {
        ...{'morningHigh': morningHigh},
        ...{'morningLow': morningLow},
        ...{'dayHigh': dayHigh},
        ...{'dayLow': dayLow},
        ...{'eveningHigh': eveningHigh},
        ...{'eveningLow': eveningLow}
    }
    
    return highsLows
}

// Hourly Reference for High/Low functions
// {query: "60532", "startTime": {$gte: '2024-01-18T00:00:00.000Z', $lt: '2024-01-18T23:59:59.999Z'}}
// Max
// db.teams.find().sort({"field":-1}).limit(1)
// Min
// db.teams.find().sort({"field":1}).limit(1)


module.exports = {
    getAll,
    updateWeatherForecastDb,
    getHighsLows,
}