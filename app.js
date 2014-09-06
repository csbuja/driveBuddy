// Module dependencies.
var express = require('express');
var driverNeeds = require('./driverNeeds') 

var yelp = require("yelp").createClient({
  consumer_key: "T0VjCY0WkEUOuyC5U46qMw", 
  consumer_secret: "LwzcaQMBcdE2cz-iv5M3KDxHwCk",
  token: "QF86lSA004Z3R5mbKmXLGVFaUGfLSTET",
  token_secret: "HedWTyztvJe_cuVgPL0IwqsHYjs"
});

var app = express.createServer();

// Configuration
app.configure( function() {
});

// Routes
app.get('/', function(req, res) {
    res.send('This isn\'t built in yet');
});

app.get('/yelp', function(req, res) {
	var typeParam = req.body.type;
	var lat = req.body.type;
	var lon = req.body.type;

	//sends an http response back to the frontend
	driverNeeds.getNeeds(res,type,lat,lon, yelp);
});


app.listen(3000);
