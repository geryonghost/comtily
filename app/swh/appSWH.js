console.log('steven.thehillden.us')

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

// Default view of the site
app.get('', async (req, res) => {
    if (statusIWO != 'maintenance') {
        res.render('index')
    } else {
        res.render('maintenance')
    }
})

module.exports = app