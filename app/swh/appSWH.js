const statusSWH = process.env.statusSWH

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

// Default view of the site
app.get('', async (req, res) => {
    if (statusSWH != 'maintenance') {
        const pageTitle = "The Home of Steven Hill"
        res.render('index', {pageTitle})
    } else {
        res.render('maintenance')
    }
})

module.exports = app
