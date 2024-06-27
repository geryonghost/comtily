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
            const location = await db.getLocation(query, variables)
            const forecast = await db.getForecast(location, variables)
            const twilight = await db.getTwilight(location, variables)
            const weather = await forecasts.getWeather(location, forecast, twilight, variables)

            const currentForecast = weather.currentForecast
            const hourlyForecast = weather.hourlyForecast
            const dailyForecast = weather.dailyForecast

            res.render('index', {
                currentForecast,
                hourlyForecast,
                dailyForecast,
            })
        }
    } else {
        res.render('maintenance')
    }
})

app.get('/feedback', async (req, res) => {
    const pageTitle = 'Feedback / Feature Requests'

    res.render('feedback', { pageTitle: pageTitle })
})

app.get('/releases', async (req, res) => {
    const pageTitle = 'Release Notes'

    res.render('releases', { pageTitle: pageTitle })
})

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    res.redirect('/')
})

module.exports = app
