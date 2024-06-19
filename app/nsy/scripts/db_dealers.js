const mongodb = require('mongodb') // Used to connect to MongoDB
// const ObjectId = require('mongodb').ObjectId //Used to query the _id

const db_connection = 'mongodb://localhost:27017'
const db_name = 'notscrapyet'

async function db_conn() {
    try {
        const mongo_client = await mongodb.MongoClient.connect(db_connection)
        const mongo_db = mongo_client.db(db_name)
        return mongo_db
    } catch (error) {
        console.error('Error connecting to MongoDB', error)
        return 'Error'
    }
}

async function insertCsvContent(dealer_id, csvContent) {
    console.log('Insert CSV Results')

    try {
        const db_name = await db_conn()
        const db_collection = await db_name.collection('ads_upload')

        db_insert_data = csvContent.map((v) => ({ dealer_id: dealer_id, ...v }))

        const results = db_collection.insertMany(db_insert_data)

        return results
    } catch (error) {
        console.error('Error in the insertCsvContent function', error)
        return 'Error'
    }
}

// async function getMakes() {
//     console.log('Get Makes')

//     try {
//         const db_name = await db_conn()
//         const db_collection = await db_name.collection('ads')
//         const makes = db_collection.distinct('make')
//         return makes
//     } catch (error) {
//         console.error('Error in getMakes function', error);
//         return 'Error'
//     }
// }

// async function getModels(make) {
//     console.log('Get Models')

//     try {
//         const db_name = await db_conn()
//         const db_collection = await db_name.collection('ads')
//         const models = db_collection.distinct('model', { 'make': make })
//         return models
//     } catch (error) {
//         console.error('Error in getMakes function', error);
//         return 'Error'
//     }
//   }

// async function getAdCount(filter={}) {
//     console.log('Get Ad Count')

//     try {
//         const db_name = await db_conn()
//         const db_collection = await db_name.collection('ads')
//         const adcount = db_collection.countDocuments(filter)
//         return adcount
//     } catch (error) {
//         console.error('Error in the getAdCount function', error)
//         return 'Error'
//     }
// }

// async function getDealerCount(filter={}) {
//     console.log('Get Dealer Count')

//     // Converts the Dealer ID to MongoDB ObjectIds and removes other filters
//     if (Object.keys(filter).length != 0 ) {
//         if ("dealer_id" in filter) {
//             filter._id = {'$in': filter.dealer_id.$in.map(id => new ObjectId(id))}
//         }

//         for (let key in filter) {
//             if (key !== '_id') {
//                 delete filter[key];
//             }
//         }
//     }

//     try {
//         filter.status = 1
//         const db_name = await db_conn()
//         const db_collection = await db_name.collection('dealers')
//         const dealercount = await db_collection.countDocuments(filter)
//         return dealercount
//     } catch (error) {
//         console.error('Error in the getAdCount function', error)
//         return 'Error'
//     }
//   }

// async function getDealer(id) {
//     console.log('Get Results')

//     try {
//         const db_name = await db_conn()
//         const db_collection = await db_name.collection('dealers')
//         const results = await db_collection.find({'_id': new ObjectId(id)}).toArray()
//         return results

//     } catch (error) {
//         console.error('Error in the getDealer function', error)
//         return 'Error'
//     }
// }

// async function getResults(id=0) {
//     console.log('Get Results')

//     try {
//         const db_name = await db_conn()
//         const db_collection = await db_name.collection('ads')

//         if (id == 0) {
//             const results = await db_collection.aggregate([
//                 { $sample: { size: 12 }}
//             ]).toArray()
//             return results
//         } else {
//             const results = await db_collection.find({'_id': new ObjectId(id)}).toArray()
//             return results
//         }

//     } catch (error) {
//         console.error('Error in the getResults function', error)
//         return 'Error'
//     }
//   }

// async function getSearchResults(filter) {
//     console.log('Get Search Results')
//     console.log(filter)

//     try {
//         const db_name = await db_conn()
//         const db_ads = await db_name.collection('ads')
//         const results = await db_ads.find(filter).toArray()

//         if (results.length == 0) {
//             return 'empty'
//         } else {
//             return results
//         }

//     } catch (error) {
//         console.error('Error in the getSearchResults function', error)
//         return 'Error'
//     }
// }

// async function getNearbyLocations(postal, distance=10) {
//     try {
//         const db_name = await db_conn()
//         const db_dealers = await db_name.collection('dealers')
//         const db_locations = await db_name.collection('locations')

//         // Get Postal Code location for geospatial
//         if (postal != '') {
//             const filter = {'zip_code': Number(postal)}
//             const location = await db_locations.findOne(filter)

//             if (!location) {
//                 console.log('Postal code not found')
//                 return 'Postal code not found'
//             } else {
//                 const coordinates = [location.latitude,location.longitude]
//                 let nearbyLocations = await db_dealers.distinct('_id',{
//                     location: {
//                         $near: {
//                             $geometry: {
//                                 type: "Point",
//                                 coordinates: coordinates
//                             },
//                             $maxDistance: distance * 1609.34  // Convert miles to meters
//                         }
//                     }
//                 })

//                 if (nearbyLocations.length != 0) {
//                     nearbyLocations = nearbyLocations.toString()
//                     nearbyLocations = nearbyLocations.split(",")
//                     return nearbyLocations
//                 } else {
//                     return 'empty'
//                 }
//             }
//         }
//     } catch (error) {
//         console.error('Error in the getNearbyLocations function', error)
//         return 'Error'
//     }
// }

module.exports = {
    insertCsvContent,
    // getMakes,
    // getModels,
    // getAdCount,
    // getDealer,
    // getDealerCount,
    // getResults,
    // getSearchResults,
    // getNearbyLocations,
}
