var MAX_RADIUS = 40000;

module.exports.getNeeds = function(res, type, lat, lon, yelp){
	yelp.search({term: type, ll: {'lat' : lat, 'lon': lon}, radius_filter: MAX_RADIUS}, 
		function(err, data){
			if (err) console.log('ERROR!');
			res.send(data);
		}
	);
};