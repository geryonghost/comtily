const express = require('express')
const app = express()
const { render } = require("ejs")

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

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({ extended: false }));

// Holding Page
app.get('', async(req, res) => {
  const pageTitle = 'Not Scrap Yet'
  res.render('holding', {pageTitle: pageTitle})
})
// Default view of the site
// app.get('', async (req, res) => {
//   const pageTitle = 'Not Scrap Yet'

//   const makes = await nsy_db_functions.getMakes()
//   const adcount = await nsy_db_functions.getAdCount()
//   const dealercount = await nsy_db_functions.getDealerCount()
//   const results = await nsy_db_functions.getResults()

//   res.render('index', { pageTitle: pageTitle, autoMakes: makes, adcount: adcount, dealercount: dealercount, results: results, indexscripts: true})
// })

// Index page make/model Ajax
app.get('/ajax', async (req, res) => {
    const make = req.query.make
    const models = await nsy_db_functions.getModels(make)
    res.json(models)
})

// Displays the listing page
app.get('/listing', async (req, res) => {
  const {id} = req.query
  const results = await nsy_db_functions.getResults(id)
  const pageTitle = results[0].year + ' ' + results[0].make + ' ' + results[0].model
  
  const dealer = await nsy_db_functions.getDealer(results[0].dealer_id)
  console.log(pageTitle)
  res.render('listing', { pageTitle: pageTitle, results: results, dealer: dealer })
})

// Displays the search page
app.get('/search', async (req, res) => {
  const pageTitle = 'Search Results'
  const {make, model, postal, distance} = req.query
  let results, adcount, dealercount, nearbyLocations
  let filter = {}

  if (postal != '') {
    nearbyLocations = await nsy_db_functions.getNearbyLocations(postal, distance)
  }
  if (nearbyLocations == 'empty') {
    results = 'empty'
    
  } else {
    if (make != 0) { filter.make = make }
    console.log(filter)
    if (model !=0 && model != '' && model != undefined) { filter.model = model}
    console.log(filter)
    if (nearbyLocations != undefined && nearbyLocations.length != 0) { filter.dealer_id = {'$in': nearbyLocations} }
    console.log(filter)  

    results = await nsy_db_functions.getSearchResults(filter)
    adcount = await nsy_db_functions.getAdCount(filter)
    dealercount = await nsy_db_functions.getDealerCount(filter)
  }

  res.render('search', { pageTitle: pageTitle, results: results, adcount: adcount, dealercount: dealercount })
})

// Displays the beta page
app.get('/beta', async (req, res) => {
  const pageTitle = 'Beta disclaimer'
  res.render('beta', { pageTitle })
  })

// Displays the dealers index page
app.get('/dealers', async (req, res) => {
  const pageTitle = 'Dealers'
  res.render('dealers', {pageTitle: pageTitle})
})
  
// Displays the dealers/upload/csv page
app.get('/dealers/upload/csv2', async (req, res) => {
  console.log('upload/csv/get')
  const pageTitle = 'Dealers Upload CSV'
  res.render('dealers_upload_csv', {pageTitle: pageTitle})
})

app.post('/dealers/upload/csv', upload.single('dealer_csv_file'), async (req, res) => {
  console.log('upload/csv/post')
  const dealer_id = req.body.dealer_id
  const filePath = req.file.path

  const csvFileContent = await nsy_functions.readFileContent(filePath)
  const csvContent = await nsy_functions.parseFileContent(csvFileContent)

  const results = await nsy_db_dealers.insertCsvContent(dealer_id, csvContent)
  console.log(results)
  const pageTitle = 'Dealers Upload CSV2'
  res.render('dealers_upload_csv', {pageTitle: pageTitle})
})


//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  const pageTitle = '404 Not Found'
  res.render('404', {pageTitle: pageTitle})
});

module.exports = app