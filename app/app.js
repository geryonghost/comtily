appHost = process.env.host
appEnvironment = process.env.environment

const express = require('express')
const vhost = require('vhost')

const app = express()

// Define your different apps for each domain
const appABT = require('./abt/appABT')
const appCOM = require('./com/appCOM')
const appISC = require('./isc/appISC')
const appIWO = require('./iwo/appIWO')
const appNSY = require('./nsy/appNSY')
const appSWH = require('./swh/appSWH')

// Use vhost middleware to route requests based on domain
if (appEnvironment == 'dev') {
    app.use(vhost('dev.thehillden.com', appABT))
    app.use(vhost('dev.comtily.com', appCOM))
    app.use(vhost('dev.iseecoyotes.com', appISC))
    app.use(vhost('dev.itsweatheroutside.com', appIWO))
    app.use(vhost('dev.notscrapyet.com', appNSY))
    app.use(vhost('dev.thehillden.us', appSWH))
} else {
    app.use(vhost('abt.thehillden.com', appABT))
    app.use(vhost('comtily.com', appCOM))
    app.use(vhost('iseecoyotes.com', appISC))
    app.use(vhost('itsweatheroutside.com', appIWO))
    app.use(vhost('notscrapyet.com', appNSY))
    app.use(vhost('steven.thehillden.us', appSWH))

    app.use(vhost('www.comtily.com', function(req, res){
      res.set('location', 'https://comtily.com');
      res.status(301).send()
    }))
    app.use(vhost('www.iseecoyotes.com', function(req, res){
      res.set('location', 'https://iseecoyotes.com');
      res.status(301).send()
    }))
    app.use(vhost('www.itsweatheroutside.com', function(req, res){
      res.set('location', 'https://itsweatheroutside.com');
      res.status(301).send()
    }))
    app.use(vhost('www.notscrapyet.com', function(req, res){
      res.set('location', 'https://notscrapyet.com');
      res.status(301).send()
    }))
}
// Add a default route or handle unrecognized domains

app.listen(3000, appHost, () => {
  console.log('Server is running on port 3000')
});
