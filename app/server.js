const express = require('express'); // Used to display HTML pages
// const bodyParser = require('body-parser') // Used to handle HTML post
const { render } = require('ejs')

const app = express()
const app_port = 8080

// Set the view engine to EJS
app.set('view engine', 'ejs')

// Static files
app.use(express.static('public'))

// Handle the form submission
// app.use(bodyParser.urlencoded({ extended: false }))

// Start the server
app.listen(app_port, () => {
  console.log(`Server listening on port ${app_port}`)
})

app.get('/', async (req, res) => {
    res.render('index', {})
})

app.get('/howtocontribute', async(req, res) => {
  res.render('howtocontribute', {})
})
