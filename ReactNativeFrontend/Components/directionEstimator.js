var math = require("mathjs")

//number_of_locations_in_mem = 60, and sample once every second
var DirectionEstimator = function(first_loc, number_of_locations_in_mem)
{
	var o= {
		getCurrentLocation:function(){
			return this.locations[this.locations.length - 1]
		},
		setCurrentLocation:function(loc){
			if(this.locations.length > number_of_locations_in_mem) {
				this.location.shift();
			}

			locations.push(loc);
		},
		estimateDirection:function(){
			//convex combination of locations where the last is the most important
		},
		toUnitVector:function(v){ //in 2 norm
			return v.map(function(z){return z/math.sqrt(math.dot(v,v)) })
		}

		locations: []
		

	}
	o.setCurrentLocation(first_loc);

	return o;
}



module.exports = DirectionEstimator