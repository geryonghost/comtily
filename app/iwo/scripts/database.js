const { getClient, dbName } = require('./db');

// async function connectMongo(name) {
//     console.log('Connecting to MongoDB')
//     try {
//         mongoClient = await mongoDb.MongoClient.connect(databaseConnectionString)
//         db = mongoClient.db(name)
//         return db
//     } catch (err) {
//         console.error(err)
//         return err
//     }
//     finally {
//         await client.close();
//     }
// }

// async function connectCollection(db, name) {
//     console.log('Setting MongoDB Collection: ' + name)
//     try {
//         collection = db.collection(name)
//         return collection
//     } catch (err) {
//         console.error(err)
//         return err
//     }
// }

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
        console.log('Updating hourly reference in MongoDB')

        const currentTime = new Date().toISOString()

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
            const collection = db.collection('hourlyReference')
            await collection.updateOne(filter, {$set: hourlyReference}, {'upsert': true})
        }
    } catch(err) {
        console.error(err)
    }

    return 'complete'
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
}