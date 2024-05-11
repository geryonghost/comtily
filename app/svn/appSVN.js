const express = require('express')
const app = express()
const { render } = require("ejs")
const { marked } = require('marked')

const { connectToDatabase, getClient, dbName } = require('./scripts/db')
connectToDatabase()

const logic = require('./scripts/logic')

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))


app.get('', async (req, res) => {
  const pageTitle = "Sven Hillier"
  const posts = await logic.getPosts()
  res.render('index', { pageTitle: pageTitle, marked, posts })
});

app.get('/feedback', async (req, res) => {
  const pageTitle = 'Feedback / Feature Requests'

  res.render('feedback', { pageTitle: pageTitle })
})

app.get('/releases', async (req, res) => {
  const pageTitle = 'Release Notes'

  res.render('releases', { pageTitle: pageTitle })
})

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.redirect('/')
});

module.exports = app
