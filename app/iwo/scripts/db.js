const databaseConnectionString = process.env.databaseConnectionString

const { MongoClient } = require('mongodb')
const apis = require('./apis')
const convert = require('./conversions')
const dbName = 'iwo'
let client

async function connectToDatabase() {
    client = new MongoClient(databaseConnectionString)
    await client.connect()
    console.log('IWO:Info Connected to MongoDB')
}

function getClient() {
    return client
}

async function getLocation(query, variables) {
    const client = getClient()
    const db = client.db(dbName)
    const collection = db.collection('locations')

    console.log('IWO:Info', 'Querying the locations for', query)
    try {
        const filter = { query: query }
        let location = await collection.findOne(filter)
        if (location == null) {
            console.log('IWO:Info', 'Query does not exist in locations collection')
            const coordinates = await apis.getCoordinates(query, variables)
            const forecastUrl = await apis.getForecastUrl(coordinates, variables)
            const timeZone = await apis.getTimeZone(coordinates, variables)

            if (coordinates != 'error' && forecastUrl != 'error' && timeZone != 'error') {
                location = {
                    query: query,
                    addressName: coordinates.addressname,
                    addressType: coordinates.addresstype,
                    lat: coordinates.lat,
                    lon: coordinates.lon,
                    forecastUrl: forecastUrl,
                    timeZone: timeZone,
                }
            }
            updateLocation(query, location)
        }
        return location
    } catch (error) {
        console.log('IWO:Error', 'Querying forecast from DB', error)
        return 'error'
    }
}

async function getForecast(location, variables) {
    console.log('IWO:Info', 'Getting forecast for', location.query)

    const client = getClient()
    const db = client.db(dbName)

    try {
        const collection = db.collection('forecasts')
        // Update the filter to only refresh every 10 minutes
        const filter = { query: location.query }
        let gridData
        let forecast = await collection.find(filter).toArray()

        // if (forecast.length == 0) {
        if (forecast.length != -1) {
            console.log('IWO:Info', 'Forecast in DB is empty')
            // Get Alerts
            // alerts = await apis.getAlerts(location, variables)
            // Get GridData
            gridData = await apis.getGridData(location, variables)
            // Process GridData
            const processedGridData = convert.processGridData(gridData, location)

            console.log('IWO:Info', 'Updating forecast in DB')
            for (let i = 0; i < processedGridData.length; i++) {
                await updateForecast(processedGridData[i])
            }
            forecast = processedGridData
        }
        return forecast
    } catch (error) {
        console.log('IWO:Error', 'Querying forecast from DB', error)
        return 'error'
    }
}

async function getTwilight(location, variables) {
    console.log('IWO:Info', 'Getting twilight for', location.query)

    const client = getClient()
    const db = client.db(dbName)

    try {
        const collection = db.collection('twilight')
        const filter = { query: location.query }
        const results = await collection.findOne(filter)

        // Add logic to only obtain when older than a day
        // if (results == null) {
        if (results != -1) {
            const twilight = await apis.getTwilight(location)
            if (twilight != null) {
                console.log('IWO:Info', 'Updating twilight in DB')
                updateTwilight(location.query, twilight)
            }
            return twilight
        } else {
            return results
        }
    } catch (error) {
        console.log('IWO:Error', 'Getting twilight from DB', error)
    }
}
////////////////////////////////////////////////////////////////////////////////////////
// UPDATE FUNCTIONS
////////////////////////////////////////////////////////////////////////////////////////
async function updateForecast(forecast) {
    const client = getClient()
    const db = client.db(dbName)

    try {
        const filter = {
            query: forecast.query,
            validTime: forecast.validTime,
        }
        const collection = db.collection('forecasts')
        await collection.updateOne(filter, { $set: forecast }, { upsert: true })
    } catch (error) {
        console.log('IWO:Error', 'Adding forecast to the DB', error)
    }
}

async function updateLocation(query, location) {
    console.log('IWO:Info', 'Updating location in DB')

    const client = getClient()
    const db = client.db(dbName)

    try {
        const collection = db.collection('locations')
        const filter = { query: query }
        await collection.updateOne(filter, { $set: location }, { upsert: true })
    } catch (error) {
        console.log('IWO:Error', 'updating the location in the DB', error)
    }
}

async function updateTwilight(query, twilight) {
    const client = getClient()
    const db = client.db(dbName)

    try {
        const collection = db.collection('twilight')
        const filter = { query: query }
        await collection.updateOne(filter, { $set: twilight }, { upsert: true })
    } catch (error) {
        console.log('IWO:Error', 'Updating twilight in DB', error)
    }
}

module.exports = {
    connectToDatabase,
    getClient,
    dbName,
    getForecast,
    getLocation,
    getTwilight,
}
