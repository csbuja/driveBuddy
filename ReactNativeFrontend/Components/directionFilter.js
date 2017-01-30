var math = require("mathjs");
var DirectionUtilities = require("./directionUtilities");
var un = require('underscore');

//Direction Filter uses a  VelocityEstimator

//direction is a vector in R^2 of <north-south,east-west>
var DirectionFilter = function(velocityEstimator)
{
    var du = DirectionUtilities();
    var o = {
        filter: function(arr,current_pos_lat,current_pos_lon,direction){
            var self = this;
            var filtered = un.filter(arr,function(d){ 
                return self.isAheadWithLatLons(d.lat,d.lon,current_pos_lat,current_pos_lon, direction);
            });  
            return {
                "ahead": filtered,
                "all":arr
            };   
        },
        //business is vector in R^2 of <north-south,east-west>
        isAheadWithLatLons: function(bus_lat,bus_lon,current_pos_lat,current_pos_lon,direction){
            return this.isAheadWithBusinessPositionVector(this.convertLatLonToPositionVector(bus_lat,bus_lon,current_pos_lat,current_pos_lon),direction);
        },
        isAheadWithBusinessPositionVector : function(business,direction){
            //dot product is positive
            if(!direction) direction = velocityEstimator.estimateVelocity()[0];
            return math.dot(business, direction) > 0;
        },
        convertLatLonToPositionVector : function(bus_lat,bus_lon,current_pos_lat,current_pos_lon){
            return math.subtract(du.LLtoECEF(bus_lat,bus_lon), du.LLtoECEF(current_pos_lat,current_pos_lon))
        }
    }
    return o;
}

//TODO - Move this to the automated tests area
/*
var la_lat = 34.0522;
var la_lon = -118.2437;
var sf_lat = 37.7749;
var sf_lon = -122.4194;
var sea_lat = 47.6062;
var sea_lon = -122.3321;
var df = DirectionFilter(null);
//TEST CASE 1-- Is San Francisco on the way to Seattle from LA?
var r_latoseattle = df.convertLatLonToPositionVector(sea_lat,sea_lon,la_lat,la_lon)
console.log(df.isAheadWithLatLons(sf_lat,sf_lon,la_lat,la_lon,r_latoseattle));//returned true correctly
//TEST CASE 2 -- Is LA on the way during the drive from SF to Seattle?
var r_sftoseattle = df.convertLatLonToPositionVector(sea_lat,sea_lon,sf_lat,sf_lon)
console.log(df.isAheadWithLatLons(la_lat,la_lon,sf_lat,sf_lon,r_sftoseattle));//returns false correctly

//TEST CASE 3 - IS Oklahoma city between SF and NYC?
var okc_lat = 35.4676
var okc_lon = -97.5164
var nyc_lat = 40.7128;
var nyc_lon = -74.0059;
var r_sftonyc = df.convertLatLonToPositionVector(nyc_lat,nyc_lon,sf_lat,sf_lon);
console.log(df.isAheadWithLatLons(okc_lat,okc_lon,sf_lat,sf_lon,r_sftoseattle)); //returns true correctly
*/

module.exports = DirectionFilter