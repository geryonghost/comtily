const express = require('express')
const app = express()
const { render } = require('ejs')

// Handle file uploads
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
// const papa = require('papaparse')
// const fs = require('fs')

// Handle form post
const bodyParser = require('body-parser')

// Custom functions
const nsy_functions = require('./scripts/functions')
const nsy_db_functions = require('./scripts/db_functions')
const nsy_db_dealers = require('./scripts/db_dealers')

// Connect to MongoDB when the application starts
const { connectToDatabase, closeDatabase } = require('./scripts/db')
connectToDatabase()

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({ extended: false }))

// Default view of the site
app.get('', async (req, res) => {
    const pageTitle = 'Not Scrap Yet'

    const makes = await nsy_db_functions.getMakes()
    const adcount = await nsy_db_functions.getAdCount()
    const dealercount = await nsy_db_functions.getDealerCount()
    const searchRsults = await nsy_db_functions.getSearchResults(0, 0, 0)

    res.render('index', {
        pageTitle: pageTitle,
        autoMakes: makes,
        adcount: adcount,
        dealercount: dealercount,
        results: searchRsults,
        indexscripts: true,
    })
})

// Index page make/model Ajax
app.get('/ajax', async (req, res) => {
    const make = req.query.make
    const models = await nsy_db_functions.getModels(make)
    res.json(models)
})

// Displays the listing page
app.get('/listing', async (req, res) => {
    const { id } = req.query
    const listing = await nsy_db_functions.getListing(id)

    if (listing == null || listing == undefined) {
        res.redirect('/')
    }

    const dealer = await nsy_db_functions.getDealer(listing.dealer_id)

    const pageTitle = listing.year + ' ' + listing.make + ' ' + listing.model
    res.render('listing', {
        pageTitle: pageTitle,
        listing: listing,
        dealer: dealer,
    })
})

// Displays the feedback page
app.get('/feedback', async (req, res) => {
    const pageTitle = 'Feedback / Feature Requests'

    res.render('feedback', { pageTitle: pageTitle })
})

// Displays the releases page
app.get('/releases', async (req, res) => {
    const pageTitle = 'Release Notes'

    res.render('releases', { pageTitle: pageTitle })
})

// Displays the search page
app.get('/search', async (req, res) => {
    const pageTitle = 'Search Results'
    const {
        make,
        model,
        postal,
        distance,
        min_price,
        max_price,
        min_year,
        max_year,
        min_mileage,
        max_mileage,
        page,
        pageSize,
    } = req.query

    if (postal == null || postal == undefined) {
        res.redirect('/')
    }

    const queryString = {
        make: make,
        model: model,
        postal: postal,
        distance: distance,
        min_price: min_price,
        max_price: max_price,
        min_year: min_year,
        max_year: max_year,
        min_mileage: min_mileage,
        max_mileage: max_mileage,
        page: page,
        pageSize: pageSize,
    }

    searchResults = await nsy_db_functions.getSearchResults(
        page,
        pageSize,
        queryString
    )

    const makes = await nsy_db_functions.getMakes()
    const models = await nsy_db_functions.getModels(make)

    res.render('search', {
        pageTitle: pageTitle,
        searchResults: searchResults,
        queryString: queryString,
        makes: makes,
        models: models,
    })
})

// Displays the dealers index page
// app.get('/dealers', async (req, res) => {
//   const pageTitle = 'Dealers'
//   res.render('dealers', {pageTitle: pageTitle})
// })

// Displays the dealers/upload/csv page
// app.get('/dealers/upload/csv2', async (req, res) => {
//   console.log('upload/csv/get')
//   const pageTitle = 'Dealers Upload CSV'
//   res.render('dealers_upload_csv', {pageTitle: pageTitle})
// })

// app.post('/dealers/upload/csv', upload.single('dealer_csv_file'), async (req, res) => {
//   console.log('upload/csv/post')
//   const dealer_id = req.body.dealer_id
//   const filePath = req.file.path

//   const csvFileContent = await nsy_functions.readFileContent(filePath)
//   const csvContent = await nsy_functions.parseFileContent(csvFileContent)

//   const results = await nsy_db_dealers.insertCsvContent(dealer_id, csvContent)
//   console.log(results)
//   const pageTitle = 'Dealers Upload CSV2'
//   res.render('dealers_upload_csv', {pageTitle: pageTitle})
// })

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    const pageTitle = '404 Not Found'
    res.render('404', { pageTitle: pageTitle })
})

module.exports = app
