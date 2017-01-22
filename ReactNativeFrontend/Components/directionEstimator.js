var math = require("mathjs");
var un = require('underscore');
var DirectionUtilities = require("./directionUtilities");
    


 //Assumes: number_of_locations_in_mem = 10
var DirectionEstimator = function(first_loc, number_of_locations_in_mem,sampling_period_in_seconds)
{
    var du = directionUtilities();
    var o= {
        //Assumes: this.locations >= 2
        //return a unit vector of the direction traveled in 3d and velocity in miles per hour
        //We could weight by the haversine 
        estimateDirectionAndVelocity:function(){
            var array_of_r = new Array(this.locations.length-1);
            var distances =  new Array(this.locations.length-1);
            var array_of_v = new Array(this.locations.length-1);
            var ones = new Array(this.locations.length-1);
            var w = null;
            //get position vectors
            for(var i =0; i<array_of_r.length; i++)
            {
                array_of_r[i] = (du.LLtoECEF(this.locations[i+1].latitude,this.locations[i+1].longitude) - du.LLtoECEF(this.locations[i]latitude,this.locations[i].longitude));
                distances[i] = haversine(this.locations[i], this.locations[i+1], {unit: 'mile'});
                array_of_v[i] = distances[i]/(sampling_period_in_seconds * 3600)
                ones[i] = 1;
            }
            var array_of_x = array_of_r.map(function(d){return d[0]})
            var array_of_y = array_of_r.map(function(d){return d[1]})
            var array_of_z = array_of_r.map(function(d){return d[2]})
            
            //estimate weights for each distance
            var w = this.estimateDistanceWeights(distances);
            var x = math.dot(array_of_x,w);
            var y = math.dot(array_of_y,w);
            var z = math.dot(array_of_z,w);

            var NUMBER_OF_R_FOR_ESTIMATING_V = 5
            var v = v.length > NUMBER_OF_R_FOR_ESTIMATING_V ? math.dot(ones,array_of_v)/array_of_v.length : 0 ;

            r = [x,y,z]
            //return unit vector
            return [du.toUnitVector(r),v];
        },
        getCurrentLocation:function(){
            return this.locations[this.locations.length - 1];
        },
        //loc is an object that has a latitude and a longitude as member variables
        setCurrentLocation:function(loc){
            locations.push(loc);
            if (this.locations.length > number_of_locations_in_mem) {
                this.locations.shift();
            }
        },
        //weights result convex combination of locations where the last is the most important -- works best for 10 points by the wikipedia document
        estimateDistanceWeights:function(distances){
            if (distances.length == 1 ) return 1;
            var alpha = 0.7;
            var beta = 2;
            var n = distances.length;
            return (un.range(n-1, -1, -1)).map(function(d){return du.BetaBinom(alpha,beta,n-1,d)});
            
        },
        locations: []

    }
    o.setCurrentLocation(first_loc);
    o.setCurrentLocation(first_loc);

    return o;
}



module.exports = DirectionEstimator;






/*
//TODO - move these to the testing area
var la_lat = 34.0522;
var la_lon = -118.2437;
var sf_lat = 37.7749;
var sf_lon = -122.4194;
var sea_lat = 47.6062;
var sea_lon = -122.3321;
var la_loc = {latitude: la_lat , longitude: la_lon}
var sf_loc  = {latitude: sf_lat, longitude:sf_lon}
var sea_loc = {latitude: sea_lat, longitude: sea_lon}
var locations = [la_loc,sf_loc,sea_loc]
var de = DirectionEstimator(la_lat,10,10) //it's 10 seconds in the live view

*/