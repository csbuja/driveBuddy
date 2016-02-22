// Module dependencies.
var express = require('express');
var driverNeeds = require('./driverNeeds');
var calcDistance = require('./calcDistance')
var request = require('request');
var polyline = require('polyline');
var pg = require('pg')
var port = (process.env.PORT || 3000);
var _ = require('underscore');

var Yelp = require('yelp');
var yelp = new Yelp({
  consumer_key: "T0VjCY0WkEUOuyC5U46qMw",
  consumer_secret: "LwzcaQMBcdE2cz-iv5M3KDxHwCk",
  token: "QF86lSA004Z3R5mbKmXLGVFaUGfLSTET",
  token_secret: "HedWTyztvJe_cuVgPL0IwqsHYjs"
});
var db = require('./db');


//starting server
var app = express();

function toMiles(km){
	return km * 0.621371;
}

//insert the userid into user table
app.all('/api/user/:userid', function(req,res) {
	var post = {userid: req.params.userid};
	var query = db.query('SELECT userid from user where userid = ?', req.params.userid, function(err, result) {
		if (err){
			throw err
		}else{
			if(result.length == 0){
				var query2 = db.query('INSERT INTO user SET ?', post, function(err, result) {
					if (err) throw err;
				});
				res.send('Registered');
			}else{
				res.send('Alreay exists');
			}
		}
	});
});

//insert resturant info into resturant table
//insert user visted info into user_res table
app.all('/api/fooddata/:resturant/:userid', function(req, res){
	db.query('SELECT resturant_id from resturant where resturant_id = ?', req.params.resturant, function(err, result) {
		if (err){
			throw err
		}else{
			if(result.length == 0){
				yelp.business(req.params.resturant,
				function(err, data){
					if (err){
						res.send(JSON.stringify([]));
					}else{
						var term = {
							resturant_id: data.id,
							name: data.name,
							rate: data.rating,
							foodtype: (data.categories).toString()
						};
						console.log(data.categories);
						db.query('INSERT INTO resturant SET ?', term,function(err, result) {
							if (err) throw err;
						});
						var post = {userid: req.params.userid, resturant_id:req.params.resturant};
						db.query('INSERT INTO user_res SET ?', post, function(err, result) {
							if (err) throw err;
						});
					}
				});
			}else{
				var post = {userid: req.params.userid, resturant_id:req.params.resturant};
				db.query('INSERT INTO user_res SET ?', post, function(err, result) {
					if (err) throw err;
				});
			}
			

		}
	});
	res.send('Data sent');
	
});

//insert sensor data into sensordata table
app.all('/api/sensordata/:lat/:lon/:status/:userid', function(req,res) {
	var post = {userid: req.params.userid,lon:req.params.lon, lat:req.params.lat, status:req.params.status};
	var query = db.query('INSERT INTO sensordata SET ?', post, function(err, result) {
	if (err) throw err;
	});
	res.send('Data sent');
});


/*
app.get('/yelp/search/:lat/:lon/:name', (req, res) => {
    var location = req.params.lat + ',' + req.params.lon;
    var search = 'food+' + req.params.name;
    yelp.search({term: search, ll: location})
    .then((data) => {
        // need further error checking, succesful request but failed response
        // getYelpBusinesses data retrieval may need to be changed
        res.send(JSON.stringify(driverNeeds.getYelpBusinesses(data)));
    })
    .catch((error) => {
        // need further error checking, failed request
    });
});
*/

//return the resturant within radius = 40000 
app.get('/api/yelp/:lat/:lon',function (req, res) {
	var lat = req.params.lat;
	var lon = req.params.lon;
	var radius = 40000; //max 40000 meters
	yelp.search({term: "food", ll: lat +',' + lon, radius_filter: radius},
		function(err, data){
			if (err) res.send(JSON.stringify([]));
			else res.send(JSON.stringify(driverNeeds.getYelpBusinesses(data, 'food')));
		}
	);
});

//return the gas station within radius = 25 miles
app.get('/api/gas/:lat/:lon',function (req, res) {
	var lat = req.params.lat;
	var lon = req.params.lon;
	var radius = 25;//rad || 15; //miles
	driverNeeds.getStations(lat, lon, radius,res);
});


//use http://www.worldweatheronline.com/api/
//5 query per second
//250 query per day
app.get('/api/weather/:lat/:lon',function (req, res) {
	var API_KEY = "e189ac7eb58172bc86f984c5eadd2";
	var lon = req.params.lon;
	var lat = req.params.lat;
	uri = "http://api.worldweatheronline.com/free/v2/weather.ashx?key=" + API_KEY + "&q=" + lat + "," + lon + "&num_of_days=1&format=json&fx=no";
	request({
		method: 'GET',
		uri: uri,
	}
	, function (err, response, body){
		if(err){
			res.send("error");
		}
		else{
			res.send(body);

		}
	});
	
});

/*
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

*/
console.log('App running on port: ' + port);
app.listen(port);
