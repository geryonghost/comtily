appEnvironment = process.env.environment

const express = require('express');
const vhost = require('vhost');

const app = express();

// Define your different apps for each domain
const appCOM = require('./com/appCOM');
const appSGS = require('./sgs/appSGS');

// Use vhost middleware to route requests based on domain
if (appEnvironment == 'dev') {
    app.use(vhost('dev.comtily.com', appCOM));
    app.use(vhost('dev.skygatesecurity.com', appSGS));
} else {
    app.use(vhost('www.comtily.com', appCOM));
    app.use(vhost('www.skygatesecurity.com', appSGS));
}
// Add a default route or handle unrecognized domains

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
