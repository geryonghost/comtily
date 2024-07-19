const express = require('express')
const app = express()
const path = require('path')
const { render } = require('ejs')

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))
// app.use('tictactoe', )

const appTTT = require('../ttt/appTTT')

// Default home page / index
app.get('', (req, res) => {
    const pageTitle = 'Comtily'
    res.render('index', { pageTitle: pageTitle })
})

// React Tic Tac Toe
// console.log(path.join(__dirname, '../ttt/build'))
app.use('/tictactoe', appTTT)

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function (req, res) {
    res.redirect('/')
})

module.exports = app
