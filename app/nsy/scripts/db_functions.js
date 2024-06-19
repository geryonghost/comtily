// const { query } = require('express')
// const { options } = require('../appNSY')
const { getClient, dbName } = require('./db')

// const mongodb = require('mongodb') // Used to connect to MongoDB
const ObjectId = require('mongodb').ObjectId //Used to query the _id

// const db_connection = 'mongodb://localhost:27017'
// const db_name = 'notscrapyet'

// async function db_conn() {
//     try {
//         const mongo_client = await mongodb.MongoClient.connect(db_connection)
//         const mongo_db = mongo_client.db(db_name)
//         return mongo_db
//     } catch (error) {
//         console.error('Error connecting to MongoDB', error)
//         return 'Error'
//     }
// }

async function getMakes() {
    console.log('NSY:Info Get Makes')

    const client = getClient()
    const db = client.db(dbName)
    try {
        const dbTable = await db.collection('ads')
        const makes = await dbTable.distinct('make')
        return makes
    } catch (error) {
        console.error('Error in getMakes function', error)
        return 'Error'
    }
}

async function getModels(make) {
    console.log('NSY:Info Get Models')

    const client = getClient()
    const db = client.db(dbName)
    try {
        const dbTable = await db.collection('ads')
        const models = await dbTable.distinct('model', { make: make })
        return models
    } catch (error) {
        console.error('Error in getMakes function', error)
        return 'Error'
    }
}

async function getAdCount(filter = {}) {
    console.log('NSY:Info Get Ad Count')

    const client = getClient()
    const db = client.db(dbName)
    try {
        const dbTable = await db.collection('ads')
        const adcount = dbTable.countDocuments(filter)
        return adcount
    } catch (error) {
        console.error('Error in the getAdCount function', error)
        return 'Error'
    }
}

async function getDealerCount() {
    console.log('NSY:Info Get Dealer Count')

    // // Converts the Dealer ID to MongoDB ObjectIds and removes other filters
    // if (Object.keys(filter).length != 0 ) {
    //     if ("dealer_id" in filter) {
    //         filter._id = {'$in': filter.dealer_id.$in.map(id => new ObjectId(id))}
    //     }

    //     for (let key in filter) {
    //         if (key !== '_id') {
    //             delete filter[key];
    //         }
    //     }
    // }
    // console.log(filter)
    const client = getClient()
    const db = client.db(dbName)
    try {
        // filter.status = 1
        const dbTable = await db.collection('dealers')
        const filter = { status: 'active' }
        const dealercount = await dbTable.countDocuments(filter)
        return dealercount
    } catch (error) {
        console.error('Error in the getAdCount function', error)
        return 'Error'
    }
}

async function getDealer(id) {
    console.log('NSY:Info Get Results')

    const client = getClient()
    const db = client.db(dbName)
    try {
        const dbTable = await db.collection('dealers')
        const results = await dbTable.find({ _id: new ObjectId(id) }).toArray()
        return results
    } catch (error) {
        console.error('Error in the getDealer function', error)
        return 'Error'
    }
}

async function getListing(id) {
    console.log('NSY:Info Get Listing')

    const client = getClient()
    const db = client.db(dbName)
    try {
        const dbTable = await db.collection('ads')

        // if (id == 0) {
        //     const results = await dbTable.aggregate([
        //         { $sample: { size: 12 }}
        //     ]).toArray()
        //     return results
        // } else {
        // const results = await dbTable.find({'_id': new ObjectId(id)}).toArray()
        const filter = { _id: new ObjectId(id) }
        const results = await dbTable.findOne(filter)
        return results
        // }
    } catch (error) {
        console.log('NSY:Error Error in the getListing function')
        return 'Error'
    }
}

async function getSearchResults(page = 1, pageSize = 24, queryString) {
    console.log('NSY:Info Get Search Results')

    const client = getClient()
    const db = client.db(dbName)
    const dbAds = await db.collection('ads')

    try {
        if (queryString == 0) {
            const results = await dbAds
                .aggregate([{ $sample: { size: 12 } }])
                .toArray()
            return results
        }

        const nearbyLocations = await getNearbyLocations(
            queryString.postal,
            queryString.distance
        )

        if (nearbyLocations != 'empty') {
            const dealerCount = nearbyLocations.length
            const skip = (page - 1) * pageSize

            if (queryString.model == 0) {
            }
            const filter = {
                year: {
                    $gte: queryString.min_year,
                    $lte: queryString.max_year,
                },
                price: {
                    $gte: Number(queryString.min_price),
                    $lt: Number(queryString.max_price),
                },
                odometer: {
                    $gte: Number(queryString.min_mileage),
                    $lt: Number(queryString.max_mileage),
                },
                dealer_id: { $in: nearbyLocations },
            }
            if (queryString.make != 0) {
                filter['make'] = queryString.make
            }
            if (queryString.model != 0) {
                filter['model'] = queryString.model
            }
            console.log(filter)

            const results = await dbAds
                .aggregate([
                    { $match: filter },
                    {
                        $facet: {
                            metadata: [
                                { $count: 'adCount' },
                                {
                                    $addFields: {
                                        dealerCount: dealerCount,
                                        page: page,
                                        pageSize: pageSize,
                                    },
                                },
                            ],
                            data: [
                                { $skip: skip },
                                { $limit: Number(pageSize) },
                            ],
                        },
                    },
                ])
                .toArray()

            if (results.length == 0) {
                return 'empty'
            } else {
                return results
            }
        } else {
            return 'empty'
        }
    } catch (error) {
        console.error('Error in the getSearchResults function', error)
        return 'Error'
    }
}

async function getNearbyLocations(postal, distance = 10) {
    console.log('NSY:Info Get nearby locations')

    const client = getClient()
    const db = client.db(dbName)
    try {
        const dbDealers = await db.collection('dealers')
        const dbLocations = await db.collection('locations')

        // Get Postal Code location for geospatial
        if (postal != '') {
            const filter = { zip_code: Number(postal) }
            const location = await dbLocations.findOne(filter)

            if (!location) {
                console.log('Postal code not found')
                return 'Postal code not found'
            } else {
                const coordinates = [location.longitude, location.latitude]
                const filter = {
                    location: {
                        $near: {
                            $geometry: {
                                type: 'Point',
                                coordinates: coordinates,
                            },
                            $maxDistance: distance * 1609.34, // Convert miles to meters
                        },
                    },
                    status: 'active',
                }

                let nearbyLocations = await dbDealers.distinct('_id', filter)
                if (nearbyLocations.length != 0) {
                    nearbyLocations = nearbyLocations.toString()
                    nearbyLocations = nearbyLocations.split(',')
                    return nearbyLocations
                } else {
                    return 'empty'
                }
            }
        }
    } catch (error) {
        console.error('Error in the getNearbyLocations function', error)
        return 'Error'
    }
}

module.exports = {
    getMakes,
    getModels,
    getAdCount,
    getDealer,
    getDealerCount,
    // getResults,
    getListing,
    getSearchResults,
    getNearbyLocations,
}
