// Module dependencies.
var express = require('express');
var driverNeeds = require('./driverNeeds');
var request = require('request');
var polyline = require('polyline');
var port = (process.env.PORT || 3000);
var _ = require('underscore');

var yelp = require("yelp").createClient({
  consumer_key: "T0VjCY0WkEUOuyC5U46qMw", 
  consumer_secret: "LwzcaQMBcdE2cz-iv5M3KDxHwCk",
  token: "QF86lSA004Z3R5mbKmXLGVFaUGfLSTET",
  token_secret: "HedWTyztvJe_cuVgPL0IwqsHYjs"
});

var app = express();
//comment


function calcDistance(lat1,lon1,lat2,lon2){
var R = 6371; // km
var pi = 3.141592653589793238462643383279502884;
var φ1 = lat1*(pi/180);
var φ2 = lat2*(pi/180)
var Δφ = (lat2-lat1)*(pi/180);
var Δλ = (lon2-lon1)* (pi/180);

var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

var d = R * c;
return d;
}

function toMiles(km){
	return km * 0.621371;
}
// Routes
app.get('/', function(req, res) {
    res.send('This isn\'t built in yet');
});



app.get('/googlemaps/:lat1/:lon1/:lat2/:lon2/:interval', function(req,res){
	var lon1 = req.params.lon1;
	var lat1 = req.params.lat1;
	var lon2 = req.params.lon2;	
	var lat2 = req.params.lat2;
	var mileInterval = req.params.interval;
	var API_KEY = "AIzaSyDv_GaD1jG3T4iKWyxksqVnrFJ1f-Mphh8";

	request({
		method: 'GET', 
		uri: "https://maps.googleapis.com/maps/api/directions/json?origin= " +  lat1 + "," + lon1 + "&destination=" +  lat2 + "," + lon2 + "&key=" + API_KEY , 
		json: true
	}
	, function (err, response, body){
		if(err) console.log(body.error_message);
		var distance = 0;
		
		var latLons = polyline.decode(body.routes[0].overview_polyline.points);
		_.each(latLons, function(v,i){
			if (i!=(latLons.length -1)) {
				distance += calcDistance(v[0],v[1],latLons[i+1][0],latLons[i+1][1]);
			}
		});

		var numPlaces = (toMiles(distance)/ mileInterval );
		var numPitstops = numPlaces -1;

		var index = Math.floor(latLons.length/numPitstops);
		var curr_index = index;
		var pitstops = [];
		while(curr_index < (latLons.length-1)){
			pitstops.push(latLons[curr_index]);
			curr_index += index;
		}

		res.send(JSON.stringify({ 'pitstops': pitstops, 'body' : body }) );

  	  }
	);
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
