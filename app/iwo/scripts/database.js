const databaseConnectionString = process.env.databaseConnectionString

const mongoDb = require('mongodb')

async function getAll(query) {
    // Connect to MongoDB
    let mongoClient, db, collection, weatherForecast
    try {
        console.log('Connecting to MongoDB');
        mongoClient = await mongoDb.MongoClient.connect(databaseConnectionString)
        console.log('Connected to MongoDB')
        db = mongoClient.db('weather');
        console.log('MongoDB DB is set');
        collection = db.collection('forecasts');
        console.log('MongoDB Collection is set');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }

    console.log('Querying the collection with: ' + query);
    try {
        weatherForecast = await collection.findOne({'query': query})
    } catch (err) {
        console.error(err)
        weatherForecast = []
    }

    return weatherForecast
}

async function addWeatherForecastDb(type, query, dbData) {
    try {
        mongoClient = await mongoDb.MongoClient.connect(databaseConnectionString)
        db = mongoClient.db('weather')
        collection = db.collection('forecasts')    
    } catch (err) {
        console.error(err)
    }

    if (type == 'new') {
        try {
            console.log('Inserting forecast into MongoDB');
            await collection.insertOne(dbData)
        } catch(err) {
            console.error(err)
        }
    } else if (type == 'update') {
        try {
            console.log('Updating forecast in MongoDB');
            const filter = { "query": query }
            await collection.replaceOne(filter, dbData);
    
        } catch (err) {
            console.error(err)
        }
    }
    return 'complete'
}

// Hourly Reference for High/Low functions
async function getHourlyReference(query) {
    try {
        mongoClient = await mongoDb.MongoClient.connect(databaseConnectionString)
        db = mongoClient.db('weather')
        collection = db.collection('hourlyReference')    
    } catch (err) {
        console.error(err)
    }

    console.log('Querying the collection with: ' + query);
    try {
        hourlyReference = await collection.find({'query': query}).toArray()
    } catch (err) {
        console.error(err)
        hourlyReference = []
    }

    return hourlyReference
}

async function addHourlyReference(hourlyReference) {
    try {
        mongoClient = await mongoDb.MongoClient.connect(databaseConnectionString)
        db = mongoClient.db('weather')
        collection = db.collection('hourlyReference')    
    } catch (err) {
        console.error(err)
    }

    try {
        // console.log('Inserting hourlyReference into MongoDB')
        await collection.insertOne(hourlyReference)
    } catch(err) {
        console.error(err)
    }
}

async function updateHourlyReference(hourlyReference) {
    try {
        mongoClient = await mongoDb.MongoClient.connect(databaseConnectionString)
        db = mongoClient.db('weather')
        collection = db.collection('hourlyReference')    
    } catch (err) {
        console.error(err)
    }

    try {
        // console.log('Updating hourlyReference into MongoDB')
        const filter = { "query": hourlyReference.query }
        await collection.replaceOne(filter, hourlyReference)
    } catch(err) {
        console.error(err)
    }
}

// {query: "60532", "startTime": {$gte: '2024-01-18T00:00:00.000Z', $lt: '2024-01-18T23:59:59.999Z'}}
// Max
// db.teams.find().sort({"field":-1}).limit(1)
// Min
// db.teams.find().sort({"field":1}).limit(1)


module.exports = {
    getAll,
    addWeatherForecastDb,
    getHourlyReference,
    addHourlyReference,
    updateHourlyReference,
}