var yelp = require("yelp").createClient({
  consumer_key: "T0VjCY0WkEUOuyC5U46qMw", 
  consumer_secret: "LwzcaQMBcdE2cz-iv5M3KDxHwCk",
  token: "QF86lSA004Z3R5mbKmXLGVFaUGfLSTET",
  token_secret: "HedWTyztvJe_cuVgPL0IwqsHYjs"
});

var driverNeeds = require('./driverNeeds');
var res = [];
var theType = "food";
var lat = 34;
var lon = -118;

driverNeeds.getNeeds(res,theType,lat,lon, yelp);