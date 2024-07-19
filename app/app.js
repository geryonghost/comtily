appHost = process.env.host
appEnvironment = process.env.environment

const express = require('express')
const vhost = require('vhost')

const app = express()

// Define your different apps for each domain
const appBEH = require('./beh/appBEH')
const appIWO = require('./iwo/appIWO')
const appSWH = require('./swh/appSWH')

// Use vhost middleware to route requests based on domain
if (appEnvironment == 'dev') {
    app.use(vhost('dev.behaivio.cc', appBEH))
    app.use(vhost('dev.itsweatheroutside.com', appIWO))
    app.use(vhost('dev.thehillden.us', appSWH))
} else {
    app.use(vhost('behavio.cc', appBEH))
    app.use(vhost('itsweatheroutside.com', appIWO))
    app.use(vhost('steven.thehillden.us', appSWH))

    app.use(
        vhost('www.behaivo.cc', function (req, res) {
            res.set('location', 'https://behaivo.cc')
            res.status(301).send()
        })
    )
    app.use(
        vhost('www.itsweatheroutside.com', function (req, res) {
            res.set('location', 'https://itsweatheroutside.com')
            res.status(301).send()
        })
    )
}
// Add a default route or handle unrecognized domains
app.listen(3000, appHost, () => {
    console.log('Server is running on port 3000')
})
