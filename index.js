const express = require('express');
const bodyParser = require('body-parser')
const dotenv = require('dotenv');

// enable enviorment variables
dotenv.config()

// set up express app
const app = express();

app.use(bodyParser.json())
// initialize routes
app.use('/api/v1', require('./routes/api'));

// listen for requests
app.listen(process.env.port || 4000, function(){
    console.log('now listening for requests');
});
