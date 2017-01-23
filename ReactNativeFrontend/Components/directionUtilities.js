var math = require("mathjs");
var betaln = require( 'compute-betaln' );

var DirectionUtilities = function(){
    var o = {
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
        },
        toUnitVector:function(v){ //in 2 norm
            return v.map(function(z){return z/math.sqrt(math.dot(v,v)) })
        },
        BetaBinom : function(alpha,beta,n,k) {
            var part_1 = math.combinations(n,k)
            var part_2 = betaln(k+alpha,n-k+beta)
            var part_3 = betaln(alpha,beta)
            
            var result = (math.log(part_1) + part_2)- part_3
            
            return math.exp(result)
        }
    }
    return o;
}

module.exports = DirectionUtilities


//TODO - Move this to the automated tests area
/*
var du = DirectionUtilities()
console.log(du.BetaBinom(1,1,2,1))  //should  be 1/3
*/