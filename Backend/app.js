// Module dependencies.
var child_process = require('child_process');
var express = require('express');
var bodyParser = require('body-parser');
var driverNeeds = require('./driverNeeds');
var calcDistance = require('./calcDistance')
var request = require('request');
var polyline = require('polyline');
var pg = require('pg')
var port = (process.env.PORT || 3000);
var moment = require('moment');
var _ = require('underscore');
var fs = require('fs');
var Q = require('q')

var Yelp = require('yelp');
var yelp = new Yelp({
  consumer_key: "T0VjCY0WkEUOuyC5U46qMw",
  consumer_secret: "LwzcaQMBcdE2cz-iv5M3KDxHwCk",
  token: "rFX5f23ObBPeznE6DQdkyb_8Y8UNXw0q",
  token_secret: "5kBF1E8lkxcGwUATNyElljvhZBo"
});
var db = require('./db');


//starting server
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//simple test
/*
driverNeeds.write_file(1, 'angs-korean-restaurant-ann-arbor-2')
.then(function(data){
	if (data[0]){
		consol.log(data[1]);
	}
	else{
		filename = data[1]
		child_process.exec('python PredictRatings.py ' + filename, function (err, data) {
				console.log(data);
				child_process.exec('rm ' + filename, function () {});
		});

	}
});

*/
function toMiles(km){
	return km * 0.621371;
}

//list should be 2d array that contains restaurantID, lat, long in
//each element. time1 and time2 will be timestamps formated per sql syntax
//Range is in km and lookAheadTime is in minutes
function directionFilter(list, lat1, long1, time1, lat2, long2, time2, range,
    lookAheadTime){
      var distance = calcDistance(lat1, long1, lat2, long2);
      var time1Moment = moment(time1);
      var time2Moment = moment(time2);
      var secDiff = time2Moment.diff(time1Moment, 'seconds');
      var secondsInLookAhead = 60*5;
      var speed = distance/secDiff;
      var travelDistInLookAhead = speed * secondsInLookAhead;
      var diffLat = lat2 - lat1;
      var diffLong = long2 - long1;
      var diffTo5MinRatio = secondsInLookAhead / secDiff;
      var futureDiffLat = diffTo5MinRatio * diffLat;
      var futureDiffLong = diffTo5MinRatio * diffLong;
      var futureLat = futureDiffLat + lat2;
      var futureLong = futureDiffLong + long2;
      var listLength = list.length;
      var results = [];

      for (var i = 0; i < listLength; i++) {
        var restLong = list[i][2];
        var restLat = list[i][1];
        var restID = list[i][0];
        var restToFutureOriginDist = calcDistance(restLat, restLong, futureLat,
          futureLong);
        var restToCurrentPosDist = calcDistance(restLat, restLong, lat2, long2);

        //Uses pythagorean theorem to determine if the resturant is past the
        //line perpindicular to the path of travel
        if ((pow(restToFutureOriginDist, 2) + pow(restToCurrentPosDist, 2)) >
          pow(travelDistInLookAhead, 2)) {
            if (restToFuturePosDist <= range) {
              results.push(restID);
            }
        }
  }
  return results;
}



app.all('/api/check/survey/:userid', function(req, res){
	db.query('SELECT * from survey where userid = ?', req.params.userid, function(err, result) {
		if (err){
			throw err
		}else{
			if(result.length == 0){
				res.send('No survey');
			}else{
				res.send('Existing survey');
			}
		}
	});
});


app.all('/api/survey', function(req,res){
	console.log('Start Initializing');
	var post = {userid: req.body.userID};
	db.query('INSERT INTO user SET ?', post, function(err, result) {
		if (err) throw err;
		else console.log('Registered');
	});

	for(var i = 0; i < (req.body.restaurants).length; ++i){

		var data = req.body.restaurants[i];
		var term = {
			userid: req.body.userID,
			restaurant_id: data.id,
			name: data.name,
			rate: data.rating,
			foodtype: (data.categories).toString()
		};
		driverNeeds.check_add(term);
	}
	console.log('Initialization Complete');
});
app.all('/api/rerate/:userid', function(req, res){

	db.query('select * from rate where userid = ?', req.params.userid, function(err, survey){
		if (err) throw err;
		else{
			res.send({"method1" :driverNeeds.rate_cosine(req.body.businesses, survey),
			"method2":driverNeeds.rate_sim(req.body.businesses, survey),
			"method3":driverNeeds.rate_weigh(req.body.businesses, survey) });
		}
	});
});

app.all('/api/rate/:userid/:restaurant/:rate', function(req,res){
	var term = {
		userid: req.params.userid,
		restaurant_id: req.params.restaurant,
		rate: req.params.rate
	};
	var dup = {
		rate: req.params.rate
	};
	db.query('INSERT INTO rate SET ? ON DUPLICATE KEY UPDATE rate=VALUES(rate)', term, function(err, result) {
		if (err) throw err;
		else res.send('Data sent');
	});

});

app.all('/api/get_rate/:userid', function (req,res) { //TODO - spencer and jing
	var results = [];
	var makeQueries = function (){
		var deferred = Q.defer();
		for(var i = 0; i < req.body.restaurants.length; i++){
			driverNeeds.write_file(req.params.userid, req.body.restaurants[i])
			.then(function(data){
				results.push(data);
				if (results.length == req.body.restaurants.length) deferred.resolve(results);
			});
		}
		return deferred.promise;
	}
	makeQueries().then(function(results){
		//result will be a JSON string
		res.send(JSON.stringify(results));


	});

});

app.all('/api/test/:restaurant', function(req,res){
	var name = req.params.restaurant
	yelp.search({radius_filter: 40000, location: "Ann Arbor", term: name},function(err, data){
		if (err){
			res.send(JSON.stringify([]));
		}else{
			res.send(driverNeeds.getYelpBusinesses(data, 'food'));
		}
	});

});

//TO DELETE ****
/*
app.all('/api/fooddata/:restaurant/:userid', function(req, res){
	db.query('SELECT restaurant_id from restaurant where restaurant_id = ?', req.params.restaurant, function(err, result) {
		if (err){
			throw err
		}else{
			if(result.length == 0){
				yelp.business(req.params.restaurant,
				function(err, data){
					if (err){
						res.send(JSON.stringify([]));
					}else{
						for(var i = 0; i < (data.categories).length; ++i){
							data.categories[i] = (data.categories[i])[1];
						}
						var term = {
							restaurant_id: data.id,
							name: data.name,
							rate: data.rating,
							foodtype: (data.categories).toString()
						};
						db.query('INSERT INTO restaurant SET ?', term,function(err, result) {
							if (err) throw err;
						});
						var post = {userid: req.params.userid, restaurant_id:req.params.restaurant};
						db.query('INSERT INTO user_res SET ?', post, function(err, result) {
							if (err) throw err;
						});
					}
				});
			}else{
				var post = {userid: req.params.userid, restaurant_id:req.params.restaurant};
				db.query('INSERT INTO user_res SET ?', post, function(err, result) {
					if (err) throw err;
				});
			}


		}
	});
	res.send('Data sent');

});
*/
//insert sensor data into sensordata table
app.all('/api/sensordata/:lat/:lon/:status/:userid', function(req,res) {
	//for speed maybe
	var post = {userid: req.params.userid,lon:req.params.lon, lat:req.params.lat, status:req.params.status};
	var query = db.query('INSERT INTO sensordata SET ?', post, function(err, result) {
	if (err) throw err;
	});
	res.send('Data sent');
});


app.get('/api/search/:lat/:lon/:name/:location?', (req, res) => {
    var lat = req.params.lat;
    var lon = req.params.lon;
    var location = req.params.location;
    var search = 'food+' + req.params.name;
    var params = {
        term: search,
    };

    if (location) {
        params.location = location;
    }
    else {
        params.ll = (lat + ',' + lon);
    }

    yelp.search(params)
    .then((data) => {
        // need further error checking, succesful request but failed response
        // getYelpBusinesses data retrieval may need to be changed
        res.send(JSON.stringify(driverNeeds.getYelpBusinesses(data, lat, lon)));
    })
    .catch((error) => {
        res.status(500).send(error);
    });
});

// both currentPosition and lastPosition are objects with latitude and longitude
// latitude and longitude may be null
//return the restaurant within radius = 40000
app.get('/api/yelp/:currentPosition/:lastPosition/:userid',function (req, res) {
	var currentPosition = JSON.parse(req.params.currentPosition);
	var radius = 40000; //max 40000 meters

	var makeQueries = function (restaurants,userid){
		var deferred = Q.defer();
		var results = {};
		for(var i = 0; i < restaurants.length; i++){
			driverNeeds.write_file(userid, restaurants[i],i)
			.then(function(data){
				index = data[1];
				data = data[0];
				key = _.keys(data)[0]
				results[key] = data[key];
				if (index == (restaurants.length -1) ){
					deferred.resolve(results);
				}
			});
		}
		return deferred.promise;
	}

	yelp.search({
            term: "restaurants",
            ll: currentPosition.latitude +',' + currentPosition.longitude,
            radius_filter: radius
        },
		function(err, data){
			if (err) res.send(JSON.stringify([]));
			else {
					yelpdata = driverNeeds.getYelpBusinesses(
	                    data,
	                    currentPosition.latitude,
	                    currentPosition.longitude
	                );
					restaurants = _.map(yelpdata,function(v,key){
						return key;
					});

					var userid = req.params.userid;
					makeQueries(restaurants,userid).then(function(CFscores){
					//result will be a JSON string
						_.each(yelpdata, function(v,key){
							yelpdata[key]['score'] = CFscores[key];
						});
						res.send(JSON.stringify(yelpdata));
					});
				}

		}
	);
});

// both currentPosition and lastPosition are objects with latitude and longitude
// latitude and longitude may be null
//return the gas station within radius = 25 miles
app.get('/api/gas/:currentPosition/:lastPosition',function (req, res) {
    var currentPosition = JSON.parse(req.params.currentPosition);
	var radius = 25;//rad || 15; //miles

	driverNeeds.getStations(
        currentPosition.latitude,
        currentPosition.longitude,
        radius,
        res
    );
});


//use http://www.worldweatheronline.com/api/
//5 query per second
//250 query per day
/*
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
*/
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
