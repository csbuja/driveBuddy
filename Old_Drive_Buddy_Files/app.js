// Module dependencies.
var express = require('express');
var driverNeeds = require('./driverNeeds');
var calcDistance = require('./calcDistance')
var request = require('request');
var polyline = require('polyline');
var pg = require('pg')
var port = (process.env.PORT || 3000);
var _ = require('underscore');
var yelp = require("yelp").createClient({
  consumer_key: "T0VjCY0WkEUOuyC5U46qMw",
  consumer_secret: "LwzcaQMBcdE2cz-iv5M3KDxHwCk",
  token: "QF86lSA004Z3R5mbKmXLGVFaUGfLSTET",
  token_secret: "HedWTyztvJe_cuVgPL0IwqsHYjs"
});

//starting server
var app = express();

app.set('views', __dirname + '/views');
var fooddata = [];
var gasdata = []
var sensorData = [];

function toMiles(km){
	return km * 0.621371;
}
// Routes
app.get('/', function(req, res) {
    res.send('This isn\'t built in yet');
});

app.all('/api/fooddatacollection/:lat/:lon/:name', function(req, res){
	var name = req.params.name;
	var lat = req.params.lat;
	var lon = req.params.lon;
	fooddata.push({name: name, lon: lon, lat:lat});
	res.send('Data sent');
	console.log(fooddata.length + 'Data Received');
})
/*
app.all('/api/fooddatacollection', function(req, res){
	res.render('form.html')
	var name = req.body.name;
	var lat = req.body.lat;
	var lon = req.body.lon;
	fooddata.push({name: name, lon: lon, lat:lat});
	console.log(fooddata.length + 'Data Received');
})*/

app.get('/api/fooddatacollection/view', function(req, res){
	res.send(JSON.stringify(fooddata));
})

app.get('/api/gasdatacollection/:lat/:lon/:name', function(req, res){
	var name = req.params.name;
	var lat = req.params.lat;
	var lon = req.params.lon;
	gasdata.push({name: name, lon: lon, lat:lat});
	console.log('Data Received');
	res.send('Data sent');
})

app.get('/api/sensordatacollection/:time/:temp/:lat/:lon/:status', function(req,res) {
  var UTCtime = req.params.time;
  var tempF = req.params.temp;
  var latitude = req.params.lat;
  var longitude = req.params.lon;
  var travelType = req.params.status;

  sensorData.push({UTCtime: UTCtime, tempF: tempF, latitude: latitude, longitude: longitude, travelType: travelType});
  console.log('Received Data');
})

app.get('/api/gasdatacollection', function(req, res){
	res.send(JSON.stringify(gasdata));
	console.log(fooddata.length + ' data sent')
})

app.get('/api/gasdatacollection/view', function(req, res){
	res.send(JSON.stringify(gasdata));
})

//the google maps api call is limited to 100,000 requests per day
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

app.get('/api/:theType/:lat/:lon', function(req, res) {
	var theType = req.params.theType;
	var lat = req.params.lat;
	var lon = req.params.lon;
	console.log('call getNeeds');
	//sends an http response back to the frontend
	driverNeeds.getNeeds(res,theType,lat,lon, yelp);
});

app.get('/api/:theType/:lat/:lon/:foodParams', function(req, res) {
	var theType = req.params.theType;
	var lat = req.params.lat;
	var lon = req.params.lon;
	var foodParams = req.params.foodParams;

	//sends an http response back to the frontend
	driverNeeds.getNeeds(res,theType,lat,lon, yelp, foodParams);
});

console.log('App running on port: ' + port);
app.listen(port);
