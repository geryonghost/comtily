const { getClient, dbName } = require('./db')

async function getPosts() {
    const client = getClient()
    const db = client.db(dbName)

    let posts
    try {
        const collection = db.collection('posts')
        const sort = { 'date': -1 }
        posts = await collection.find().sort(sort).toArray()
    } catch(error) {
        console.error('SVN:Error', 'getting posts from DB', error)
        posts = ('SVN:Error', 'getting posts from DB', error)
    }
    return posts
}

module.exports = { 
    getPosts
}
