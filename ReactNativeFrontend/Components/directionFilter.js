var math = require("mathjs")


//Direction Filter uses a direction estimator

//direction is a vector in R^2 of <north-south,east-west>
var DirectionFilter = function(directionEstimator)
{
    var o = {
        //business is vector in R^2 of <north-south,east-west>
        isAheadWithLatLons: function(bus_lat,bus_lon,current_pos_lat,current_pos_lon,direction){
            return this.isAheadWithBusinessPositionVector(this.convertLatLonToPositionVector(bus_lat,bus_lon,current_pos_lat,current_pos_lon),direction);
        },
        isAheadWithBusinessPositionVector : function(business,direction){
            //dot product is positive
            if(!direction) direction = directionEstimator.estimateDirection();
            return math.dot(business, direction) > 0;
        },
        convertLatLonToPositionVector : function(bus_lat,bus_lon,current_pos_lat,current_pos_lon){
            return math.subtract(this.LLtoECEF(bus_lat,bus_lon), this.LLtoECEF(current_pos_lat,current_pos_lon))
        },
        //returns in units of miles
        LLtoECEF: function(lat, lon){
            lat = this.degreesToRadians(lat);
            lon = this.degreesToRadians(lon); // from http://stackoverflow.com/questions/10473852/convert-latitude-and-longitude-to-point-in-3d-space - CodingAway
            var radius = (6378137.0);       // Radius of the Earth (in meters)
            var f = 1.0/298.257223563  // Flattening factor WGS84 Model
            var cosLat = math.cos(lat);
            var sinLat = math.sin(lat);
            var FF     = math.square(1.0-f);
            var C      = 1/math.sqrt(math.square(cosLat) + FF * math.square(sinLat));
            var S      = C * FF;
            var x = (radius * C )*cosLat * math.cos(lon);
            var y = (radius * C )*cosLat * math.sin(lon);
            var z = (radius * S )*sinLat;

            return [x, y, z].map(this.metersToMiles);
        },
        degreesToRadians: function(degrees){
            return degrees * (math.pi/180);
        },
        metersToMiles: function(meters){
            return  0.000621371192237*meters;
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