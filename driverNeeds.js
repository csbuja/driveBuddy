var MAX_RADIUS = 40000;
var _ = require('underscore')

//returns a object - business name, type of place, rating, and address, 
function moveThroughYelp(data, type){
	var setOfInfo = []
	for(var i = 0; i< data.businesses.length; ++i){
		var info = {}
		if (!data.businesses[i].is_closed || (type === 'food' && data.businesses[i].rating<2 ) ) continue;
		info.rating = data.businesses[i].rating;
		info.rating_img_url_small=  data.businesses[i].rating_img_url_small;
		info.rating_img_url_large = data.businesses[i].rating_img_url_large;
		info.rating_img_url = data.businesses[i].rating_img_url;
		info.address = data.businesses[i].location.address + ' ' + data.businesses[i].location.city + ', ' + data.businesses[i].location.state_code + ' ' +data.businesses[i].location.postal_code
		info.name = data.businesses[i].name;
		setOfInfo.push(info);
	}

	return setOfInfo;
}

module.exports.getNeeds = function(res, type, lat, lon, yelp){
	yelp.search({term: type, ll: lat +','+ lon, radius_filter: MAX_RADIUS, sort: 2}, //get highest rated which is a 2
		function(err, data){
			//console.log(data.businesses)
			if (err) console.log('ERROR!');
			res.send(moveThroughYelp(data,type));
		}
	);
};