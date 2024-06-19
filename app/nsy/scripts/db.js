const databaseConnectionString = process.env.databaseConnectionString

const { MongoClient } = require('mongodb')

const dbName = 'nsy'

let client

async function connectToDatabase() {
    client = new MongoClient(databaseConnectionString)
    await client.connect()
    console.log('NSY:Info Connected to MongoDB')
}

function getClient() {
    return client
}

module.exports = { connectToDatabase, getClient, dbName }
