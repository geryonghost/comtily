const statusIWO = process.env.statusIWO

const express = require('express')
const app = express()

const appDomain = 'itsweatheroutside.com'
const appEmail = 'webmaster@itsweatheroutside.com'
const userAgent = '(' + appDomain + ',' + appEmail + ')'

const variables = {
    units: 'us',
    appEmail: appEmail,
    userAgent: userAgent,
}

// Custom functions
const db = require('./scripts/db.js')
const forecasts = require('./scripts/forecasts')

// Connect to MongoDB when the application starts
db.connectToDatabase()

// Set express environment
app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

// Default view of the site
app.get('', async (req, res) => {
    if (statusIWO != 'maintenance') {
        const query = req.query.q

        if (query == '' || query == undefined) {
            res.render('index', {})
        } else {
            const timerStart = new Date()

            const location = await db.getLocation(query, variables)
            if (location == 'error') {
                res.render('index', { 'locationError': true })
            }
            const forecast = await db.getForecast(location, variables)
            if (forecast == 'error') {
                res.render('index', { 'forecastError': true })
            }
            const twilight = await db.getTwilight(location, variables)
            const weather = await forecasts.getWeather(location, forecast, twilight, variables)

            const currentForecast = weather.currentForecast
            const hourlyForecast = weather.hourlyForecast
            const dailyForecast = weather.dailyForecast

            const timerEnd = new Date()
            const timerTotal = timerEnd - timerStart
            console.log("IWO:Info", "The script took", timerTotal, "ms")

            res.render('index', {
                currentForecast,
                hourlyForecast,
                dailyForecast,
                timerTotal,
            })
        }
    } else {
        res.render('maintenance')
    }
})

// React Tic Tac Toe
const appTTT = require('../ttt/appTTT')
app.use('/tictactoe', appTTT)

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    res.redirect('/')
})

module.exports = app
