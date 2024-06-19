const statusISC = process.env.statusISC

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

// Default view of the site
app.get('', async (req, res) => {
    if (statusISC != 'maintenance') {
        res.render('index')
    } else {
        res.render('maintenance')
    }
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

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    res.redirect('/')
})

module.exports = app
