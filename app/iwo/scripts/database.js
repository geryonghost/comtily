const { getClient, dbName } = require('./db')

const moment = require('moment-timezone')

const conversions = require('./conversions')
const external = require('./external')

async function getAll(query, variables) {
    const client = getClient()
    const db = client.db(dbName)

    const collectionCoordinates = db.collection('coordinates')
    let queryCoordinates

    console.log('IWO:Querying the coordinates collection with: ' + query)
    try {
        const filter = {'query': query}
        queryCoordinates = await collectionCoordinates.findOne(filter)
    } catch (error) {
        console.error(error)
    }

    if (queryCoordinates == null) {
        let coordinates, forecastURL, timeZone, sunriseSunset

        console.log('IWO:Get coordinates')
        try {
            coordinates = await external.getCoordinates(query, variables.appEmail)
        } catch (error) {
            console.error(error)
        }

        console.log('IWO:Get timezone')
        try {
            timeZone = await external.getTimeZone(coordinates.lat, coordinates.lon)
        } catch (error) {
            console.error(error)
        }

        console.log('IWO:Get sunrisesunset')
        try {
            sunriseSunset = await external.getSunriseSunset(coordinates.lat, coordinates.lon)
        } catch (error) {
            console.error(error)
        }

        console.log('IWO:Get forecasturl')
        try {
            forecastURL = await external.getForecastUrl(coordinates.lat, coordinates.lon, variables.userAgent)
        } catch (error) {
            console.error(error)
        }

        const dbCoordinates = {
            ...coordinates,
            ...{'timeZone': timeZone},
            ...{'forecastURL':forecastURL},
        }

        const dbSunriseSunset = {
            ...{'query': query},
            ...sunriseSunset,
        }
        
        console.log('IWO:Get forecast griddata')
        gridData = await external.getGridData(dbCoordinates, variables)

        console.log('IWO:Get forecast alerts')
        alerts = await external.getAlerts(dbCoordinates, variables)

        const currentTime = moment.utc().format()
        const dbForecast = {
            ...{'query': query},
            ...{'forecastFrom': currentTime},
            ...gridData,
            ...alerts,
        }

        console.log('IWO:Update coordinates in db')
        await updateCoordinatesDb(query, dbCoordinates)

        console.log('IWO:Update sunrisesunset in db')
        await updateSunriseSunsetDb(query, dbSunriseSunset)

        console.log('IWO:Update forecasst in db')
        await updateForecastDb(query, dbForecast)

        console.log('IWO:Update hourly reference in db')
        await updateHourlyReference(query, dbForecast, dbCoordinates)

        const forecast = {
            ...dbCoordinates,
            ...dbSunriseSunset,
            ...dbForecast,
        }

        return forecast

    } else {
        console.log('IWO:Coordinates exist')
        console.log('IWO:Querying the sunrisesunset collection with: ' + query)
        const collectionSunriseSunset = db.collection('sunriseSunset')
        let dbForecast, dbSunriseSunset, querySunriseSunset
        try {
            const oneDayAgo = moment.utc().subtract(1, 'days').format()
            const filter = {'query': query, 'forecastFrom': {$gt: oneDayAgo}}
            querySunriseSunset = await collectionSunriseSunset.findOne(filter)
        } catch (error) {
            console.error(error)
        }

        if (querySunriseSunset == null) {
            console.log('IWO:Get sunrisesunset')

            let sunriseSunset
            try {
                sunriseSunset = await external.getSunriseSunset(queryCoordinates.lat, queryCoordinates.lon)
            } catch (error) {
                console.error(error)
            }

            dbSunriseSunset = {
                ...{'query': query},
                ...sunriseSunset,
            }

            console.log('IWO:Update sunrisesunset in db')
            await updateSunriseSunsetDb(query, dbSunriseSunset)
        } else {
            console.log('IWO:Sunrisesunset already exists')
            dbSunriseSunset = querySunriseSunset
        }

        console.log('IWO:Querying the forecast collection with: ' + query)
        const collectionForecast = db.collection('forecasts')
        let queryForecast
        try {
            const tenMinutesAgo = moment.utc().subtract(10, 'minutes').format()
            const filter = {'query': query, 'forecastFrom': {$gt: tenMinutesAgo}}
            queryForecast = await collectionForecast.findOne(filter)
        } catch (error) {
            console.error(error)
        }

        if (queryForecast == null) {
            console.log('IWO:Get forecast griddata')
            gridData = await external.getGridData(queryCoordinates, variables)
            if (gridData == 'error') { return 'error' }
    
            console.log('IWO:Get forecast alerts')
            alerts = await external.getAlerts(queryCoordinates, variables)
            if (alerts == 'error') { return 'error' }
    
            const currentTime = moment.utc().format()
            dbForecast = {
                ...{'query': query},
                ...{'forecastFrom': currentTime},
                ...gridData,
                ...alerts,
            }

            console.log('IWO:Update forecasst in db')
            await updateForecastDb(query, dbForecast)

            console.log('IWO:Update hourly reference in db')
            await updateHourlyReference(query, dbForecast, queryCoordinates)
        } else {
            console.log('IWO:Forecast already exists')
            dbForecast = queryForecast
        }

        const forecast = {
            ...queryCoordinates,
            ...dbSunriseSunset,
            ...dbForecast,
        }
        return forecast
    }
}

async function updateCoordinatesDb(query, dbCoordinates) {
    const client = getClient()
    const db = client.db(dbName)

    try {
        const collection = db.collection('coordinates')
        const filter = {'query': query}
        await collection.updateOne(filter, {$set: dbCoordinates}, {'upsert': true})
    } catch (error) {
        console.error(error)
    }
}

async function updateForecastDb(query, dbForecast) {
    const client = getClient()
    const db = client.db(dbName)

    try {
        const filter = {'query': query}
        const collection = db.collection('forecasts')
        await collection.updateOne(filter, {$set: dbForecast}, {'upsert': true})
    } catch(error) {
        console.error(error)
    }
}

async function updateHourlyReference(query, dbForecast, dbCoordinates) {
    const client = getClient()
    const db = client.db(dbName)

    try {
        const collection = db.collection('hourlyReference')
        
        console.log('IWO:Create hourly reference index')
        await collection.createIndex({query: 1, validTime: 1}, {unique: true})
        
        console.log('IWO:Updating hourly reference in MongoDB')
        const tomorrow = moment.utc().add(1, 'days').format()

        for (let i = 0; i < dbForecast.temperature.values.length; i++) {
            const hourlyReference = {
                'query': query,
                'validTime': moment(dbForecast.temperature.values[i].validTime).tz(dbCoordinates.timeZone.zoneName).format(),
                'temperature':dbForecast.temperature.values[i].value
            }

            if (hourlyReference.validTime >= tomorrow) {
                const filter = {"query": query, 'validTime': hourlyReference.validTime}
                await collection.updateOne(filter, {$set: hourlyReference}, {'upsert': true})
            }
        }
    } catch(err) {
        console.error(err)
    }
}

async function updateSunriseSunsetDb(query, dbSunriseSunset) {
    const client = getClient()
    const db = client.db(dbName)

    try {
        const collection = db.collection('sunriseSunset')
        const filter = {'query': query}
        await collection.updateOne(filter, {$set: dbSunriseSunset}, {'upsert': true})
    } catch (error) {
        console.error(error)
    }
}

async function getHighsLows(query, timeZone, dateOffset) {
    const client = getClient()
    const db = client.db(dbName)
    const collection = db.collection('hourlyReference')

    const currentTime = moment.utc().add(dateOffset, 'days').tz(timeZone)
    const morning = currentTime.startOf('day').format()
    const evening = currentTime.endOf('day').format()

    let filter, highsLows, options

    filter = {'query': query, 'validTime': {$gte: morning, $lt: evening}}
    const checkHighLow = await collection.count(filter)
    
    if (checkHighLow == 24) {   
        // High
        options = {sort: {temperature: -1}, limit: 1} // Max = -1, Min = 1
        const high = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

        // Low
        options = {sort: {temperature: 1}, limit: 1} // Max = -1, Min = 1
        const low = await collection.find(filter).sort(options.sort).limit(options.limit).toArray()

        highsLows = {
            ...{'high': high},
            ...{'low': low}
        }
    }

    return highsLows
}

module.exports = {
    getAll,
    getHighsLows,
}