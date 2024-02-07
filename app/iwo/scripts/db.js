const databaseConnectionString = process.env.databaseConnectionString

const { MongoClient } = require('mongodb')

const dbName = 'weather'

let client

async function connectToDatabase() {
  client = new MongoClient(databaseConnectionString)
  await client.connect();
  console.log('IWO:Connected to MongoDB');
}

function getClient() {
  return client;
}

// async function closeDatabase() {
//   await client.close();
//   console.log('IWO:Disconnected from MongoDB');
// }

// module.exports = { connectToDatabase, getClient, closeDatabase, dbName }
module.exports = { connectToDatabase, getClient, dbName }
