const express = require('express')
const app = express()
const { render } = require('ejs')

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

// Default home page / index
app.get('', (req, res) => {
    const pageTitle = 'Comtily'
    res.render('index', { pageTitle: pageTitle })
})

// Auto Insurance
// app.get('/autoinsurance', (req, res) => {
//   const pageTitle = 'Auto Insurance'
//   res.render('autoinsurance', { pageTitle: pageTitle })
// });

// How to Contribute
app.get('/howtocontribute', (req, res) => {
    const pageTitle = 'How to Contribute'
    res.render('howtocontribute', { pageTitle: pageTitle })
})

// It's Weather Outside
app.get('/itsweatheroutside', (req, res) => {
    const pageTitle = 'Its Weather Outside'
    res.render('itsweatheroutside', { pageTitle: pageTitle })
})

// Not Scrap Yet
app.get('/notscrapyet', (req, res) => {
    const pageTitle = 'Not Scrap Yet'
    res.render('notscrapyet', { pageTitle: pageTitle })
})

// Skygate Security
// app.get('/skygatesecurity', (req, res) => {
//   const pageTitle = 'Skygate Security'
//   res.render('skygatesecurity', { pageTitle: pageTitle})
// });

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    res.redirect('/')
})

module.exports = app
