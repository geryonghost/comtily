const express = require('express')
const app = express()
const { render } = require("ejs")

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

// Default home page / index
app.get('', (req, res) => {
  const pageTitle = "Adolescent Behaivor Tracker"
  res.render('index', { pageTitle: pageTitle })
});

// Displays the feedback page
app.get('/feedback', async (req, res) => {
  const pageTitle = 'Feedback / Feature Requests'

  res.render('feedback', { pageTitle: pageTitle })
})

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.redirect('/')
});

module.exports = app
