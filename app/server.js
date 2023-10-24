const express = require('express'); // Used to display HTML pages
const bodyParser = require('body-parser'); // Used to handle HTML post
const { render } = require('ejs');

const app = express();
const app_port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Static files
app.use(express.static('public'));

// Handle the form submission
app.use(bodyParser.urlencoded({ extended: false }));

// Start the server
app.listen(app_port, () => {
  console.log(`Server listening on port ${app_port}`);
});

app.get('/', async (req, res) => {
    res.render('index', {});
});

app.post('/', async (req, res) => {
  let vin_number = req.body.search;
  
  // VALIDATE VIN USING REGEX

  if (query != '') {
    try {
      forecast = await getWeatherNoDB(query);
      // Process the data to only pass the necessary data??
      // Create both Celsius and Farenheit which should make it easier on the other side to not require conversion
      
      res.render('index', {forecast});
    }
    catch (error) {
      console.error(error)
      res.status(500).json({ success: false, error: error.message });
    } 
  }
});
