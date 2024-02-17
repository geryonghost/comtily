const { getClient, dbName } = require('./db')

const conversions = require('./conversions')

async function getAll(query) {
    const client = getClient()
    const db = client.db(dbName)
    const collection = db.collection('forecasts')
    
    console.log('IWO:Querying the collection with: ' + query)
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
        console.log('IWO:Updating forecast in MongoDB')
        const filter = {'query': query}
        const collection = db.collection('forecasts')
        await collection.updateOne(filter, {$set: dbData}, {'upsert': true})
    } catch(err) {
        console.error(err)
    }

    // // Update hourly reference
    // try {
    //     const collection = db.collection('hourlyReference')
        
    //     console.log('IWO:Create hourly reference index')
    //     await collection.createIndex({query: 1, startTime: 1}, {unique: true})
        
    //     console.log('IWO:Updating hourly reference in MongoDB')
    //     const currentTime = conversions.convertDateTime(new Date(), dbData.timeZone[0])

    //     for (let i = 0; i < dbData.forecastHourly.length; i++) {
    //         const hourlyReference = {
    //             'query': dbData.query,
    //             'startTime': dbData.forecastHourly[i].startTime,
    //             'isDaytime': dbData.forecastHourly[i].isDaytime,
    //             'temperature':dbData.forecastHourly[i].temperature,
    //             'temperatureUnit': dbData.forecastHourly[i].temperatureUnit
    //         }

    //         if (hourlyReference.startTime > currentTime) {
    //             const filter = {"query": query, 'startTime': hourlyReference.startTime}
    //             await collection.updateOne(filter, {$set: hourlyReference}, {'upsert': true})
    //         }
    //     }
    // } catch(err) {
    //     console.error(err)
    // }

    // // Update shortforecast naming
    // try {
    //     console.log('IWO:Updating short forecast types in MongoDB')
    //     const collection = db.collection('short_forecast_types')

    //     for (let i = 0; i < dbData.forecastDaily.length; i++) {
    //         const dbInsert = {
    //             'shortForecast': dbData.forecastDaily[i].shortForecast,
    //             'icon': dbData.forecastDaily[i].icon
    //         }
    //         await collection.insertOne(dbInsert)
    //     }
    // } catch(err) {
    //     console.error(err)
    // }

    return 'complete'
}

async function getHighsLows(query, dateOffset, timeZone) {
    const client = getClient()
    const db = client.db(dbName)
    const collection = db.collection('hourlyReference')

    const currentDate = conversions.getCurrentDate(timeZone, dateOffset)
    const morning = `${currentDate}T00:00:00${timeZone[2]}`
    const day = `${currentDate}T12:00:00${timeZone[2]}`
    const evening = `${currentDate}T23:59:59${timeZone[2]}`

    let filter, options

    // // Morning High
    // filter = {'query': query, 'isDaytime': false, 'startTime': {$gte: morning, $lt: day}}
    // console.log(filter)
    // options = {sort: {temperature: -1}, limit: 1} // Max = -1, Min = 1
    // const morningHigh = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // // Morning Low
    // filter = {'query': query, 'isDaytime': false, 'startTime': {$gte: morning, $lt: day}}
    // options = {sort: {temperature: 1}, limit: 1} // Max = -1, Min = 1
    // const morningLow = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // // midDay High
    // filter = {'query': query, 'isDaytime': true, 'startTime': {$gte: morning, $lt: evening}}
    // options = {sort: {temperature: -1}, limit: 1} // Max = -1, Min = 1
    // const dayHigh = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // // midDay Low
    // filter = {'query': query, 'isDaytime': true, 'startTime': {$gte: morning, $lt: evening}}
    // options = {sort: {temperature: 1}, limit: 1} // Max = -1, Min = 1
    // const dayLow = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // // Evening High
    // filter = {'query': query, 'isDaytime': false, 'startTime': {$gte: day, $lt: evening}}
    // options = {sort: {temperature: -1}, limit: 1} // Max = -1, Min = 1
    // const eveningHigh = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // // Evening Low
    // filter = {'query': query, 'isDaytime': false, 'startTime': {$gte: day, $lt: evening}}
    // options = {sort: {temperature: 1}, limit: 1} // Max = -1, Min = 1
    // const eveningLow = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // High
    filter = {'query': query, 'startTime': {$gte: morning, $lt: evening}}
    options = {sort: {temperature: -1}, limit: 1} // Max = -1, Min = 1
    const high = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

    // Low
    filter = {'query': query, 'startTime': {$gte: morning, $lt: evening}}
    options = {sort: {temperature: 1}, limit: 1} // Max = -1, Min = 1
    const low = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()


    const highsLows = {
        // ...{'morningHigh': morningHigh},
        // ...{'morningLow': morningLow},
        // ...{'dayHigh': dayHigh},
        // ...{'dayLow': dayLow},
        // ...{'eveningHigh': eveningHigh},
        // ...{'eveningLow': eveningLow},
        ...{'high': high},
        ...{'low': low}
    }
    
    return highsLows
}

module.exports = {
    getAll,
    updateWeatherForecastDb,
    getHighsLows,
}