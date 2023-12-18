const express = require('express');
const app = express();

const { render } = require("ejs")

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)
app.use(express.static(`${__dirname}/public`))

// Default home page / index
app.get('', (req, res) => {
  const pageTitle = "Skygate Security"
  res.render('index', { pageTitle: pageTitle })
});

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res){
  res.redirect('/')
});

module.exports = app;
