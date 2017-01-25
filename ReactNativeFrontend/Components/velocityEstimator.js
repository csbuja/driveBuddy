var math = require("mathjs");
var un = require('underscore');
var DirectionUtilities = require("./directionUtilities");
var haversine = require("haversine")
    


 //Assumes: number_of_locations_in_mem = 10
var VelocityEstimator = function(first_loc, number_of_locations_in_mem,sampling_period_in_seconds){
    var du = DirectionUtilities();
    var o = {
        // //Assumes: this.locations >= 2
        // //return a unit vector of the direction traveled in 3d and velocity in miles per hour
        // //We could weight by the haversine 
        estimateVelocity:function(){
            var self = this;
            var ones = new Array(this.locations.length-1);
            var w = null;
            // //get position vectors
            for(var i =0; i<this.array_of_r.length; i++)
            {
                ones[i] = 1;
            }
            var array_of_x = this.array_of_r.map(function(d){return d[0]})
            var array_of_y = this.array_of_r.map(function(d){return d[1]})
            var array_of_z = this.array_of_r.map(function(d){return d[2]})
            
            //estimate weights for each distance
            var w = this.estimateDistanceWeights(this.distances);
            var x = math.dot(array_of_x,w);
            var y = math.dot(array_of_y,w);
            var z = math.dot(array_of_z,w);

            var NUMBER_OF_R_FOR_ESTIMATING_V = 2
            var v = self.array_of_v.length > NUMBER_OF_R_FOR_ESTIMATING_V ? math.dot(ones,self.array_of_v)/self.array_of_v.length : 0 ;

            r = [x,y,z]
            //return unit vector
            return [du.toUnitVector(r),v];
        },
        getCurrentLocation:function(){
            return this.locations[this.locations.length - 1];
        },
        // //loc is an object that has a latitude and a longitude as member variables
        // //Modifies this.locations
        setCurrentLocation:function(loc){
            var self = this;
            this.locations.push(loc);
            if (this.locations.length > this.number_of_locations_in_mem) {
                this.locations.shift();
                this.distances.shift();
                this.array_of_r.shift();
                this.array_of_v.shift();
            }
            if (this.locations.length >=2) {
                i = this.locations.length -2;
                this.array_of_r.push(math.subtract( du.LLtoECEF(self.locations[i+1].latitude,self.locations[i+1].longitude), du.LLtoECEF(self.locations[i].latitude,self.locations[i].longitude)));
                this.distances.push(haversine(this.locations[i], this.locations[i+1], {unit: 'mile'}));
                this.array_of_v.push(this.distances[i]/(this.sampling_period_in_seconds/3600));
            }
        },
        setLocations:function(locs){
            this.locations = new Array();
            this.array_of_r = new Array()
            this.array_of_v = new Array();
            this.distances = new Array();
            for(var i = 0; i<locs.length;++i)
            {
                this.setCurrentLocation(locs[i]);   
            }
        },
        // //weights result is convex combination of locations where the last is the most important -- works best for 10 points by the wikipedia document
        estimateDistanceWeights:function(distances){
            if (distances.length == 1 ) return 1;
            var alpha = 0.7;
            var beta = 2;
            var n = distances.length;
            return (un.range(n-1, -1, -1)).map(function(d){return du.BetaBinom(alpha,beta,n-1,d)});
            
        },
        locations: new Array(),
        distances: new Array(),
        array_of_r: new Array(),
        array_of_v: new Array(),
        sampling_period_in_seconds : sampling_period_in_seconds,
        number_of_locations_in_mem: number_of_locations_in_mem


    }
    o.setCurrentLocation(first_loc);
    o.setCurrentLocation(first_loc);

    return o;
}



module.exports = VelocityEstimator;






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
var de = VelocityEstimator(la_loc,10,10) //it's 10 seconds in the live view
de.setLocations( locations);

*/