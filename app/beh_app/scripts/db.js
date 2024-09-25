const databaseConnectionString = process.env.databaseConnectionString

const { MongoClient } = require('mongodb')

const dbName = 'behavio'

let client

async function connectToDatabase() {
    client = new MongoClient(databaseConnectionString)
    await client.connect()
    console.log('BEH:Info Connected to MongoDB')
}

function getClient() {
    return client
}

module.exports = { connectToDatabase, getClient, dbName }
