// Module dependencies.
var express = require('express');
var driverNeeds = require('./driverNeeds') 
var port = (process.env.PORT || 3000)

var yelp = require("yelp").createClient({
  consumer_key: "T0VjCY0WkEUOuyC5U46qMw", 
  consumer_secret: "LwzcaQMBcdE2cz-iv5M3KDxHwCk",
  token: "QF86lSA004Z3R5mbKmXLGVFaUGfLSTET",
  token_secret: "HedWTyztvJe_cuVgPL0IwqsHYjs"
});

var app = express();
//comment

// Routes
app.get('/', function(req, res) {
    res.send('This isn\'t built in yet');
});

app.get('/yelp/:theType/:lat/:lon', function(req, res) {
	var theType = req.params.theType;
	var lat = req.params.lat;
	var lon = req.params.lon;

	//sends an http response back to the frontend
	driverNeeds.getNeeds(res,theType,lat,lon, yelp);
});

app.get('/yelp/:theType/:lat/:lon/:foodParams', function(req, res) {
	var theType = req.params.theType;
	var lat = req.params.lat;
	var lon = req.params.lon;

	//sends an http response back to the frontend
	driverNeeds.getNeeds(res,theType,lat,lon, yelp, foodParams);
});

console.log('App running on port: ' + port);
app.listen(port);
