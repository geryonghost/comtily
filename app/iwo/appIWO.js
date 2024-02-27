const statusIWO = process.env.statusIWO

const mongoDb = require('mongodb')
const express = require('express')
const app = express()
// const render = require("ejs")

const moment = require('moment-timezone')

const appDomain = "itsweatheroutside.com"
const appEmail = "webmaster@itsweatheroutside.com"
const userAgent = "(" + appDomain + "," + appEmail + ")"

// Custom functions
const database = require('./scripts/database')
// const nominatim = require('./scripts/nominatim')
// const nws = require('./scripts/nws')
const conversions = require('./scripts/conversions')
const forecasts = require('./scripts/forecasts')

// Connect to MongoDB when the application starts
const { connectToDatabase, closeDatabase } = require('./scripts/db')
connectToDatabase()

// Set express environment
app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

// Default view of the site
app.get('', async (req, res) => {
    if (statusIWO != 'maintenance') {
        // const acceptlanguageheader = req.get('Accept-Language')
        // const preferredlocales = parseAcceptLanguageHeader(acceptlanguageheader)
        // clientlocale = preferredlocales[0] || 'en-US'
        let forecast
        const query = req.query.q;
        
        if (query == "" || query == undefined) {
            res.render('index', {})
        } else {
            const units = 'us' // us (imperial) or si (metric)
            
            const variables = {
                'units': units,
                'appEmail': appEmail,
                'userAgent': userAgent,
            }

            // forecast = await forecasts.getAll(query, units, appEmail, userAgent)
            forecast = await database.getAll(query, variables)
            // console.log(forecast.weather.values[7].value)
            switch (forecast) {
                case 'e001':
                    res.render('error', {query})
                    break
                case 'e002':
                    res.render('error', {query})
                    break
                case 'e003':
                    res.render('error', {query})
                    break
                case 'e004':
                    res.render('error', {query})
                    break
                default:
                    break
            }

            const currentForecast = await forecasts.currentForecast(units, forecast)
            const hourlyForecast = await forecasts.hourlyForecast(units, forecast)
            
            res.render('index', {
                currentForecast,
                hourlyForecast,
            })
        }
    } else {
        res.render('maintenance')
    }
})

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.redirect('/')
})

module.exports = app
