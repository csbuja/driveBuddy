var request = require('request');
var _ = require('underscore')

var MAX_RADIUS = 40000;

module.exports = {
	filterGasFeed: function (data, callback){
		var setOfStations = [];

		if (!data){ 
			console.log('ERROR FILTERING GASFEED'); 
			return setOfStations;
		}

		for (var i = 0; i < data.length; i++){
			if(data[i].reg_price !== "N/A") {
				setOfStations.push({
					name: data[i].station,
					price: data[i].reg_price, 
					latitude: data[i].lat, 
					longitude: data[i].lng
				});
			}
		}

		return setOfStations;
	},

	// returns array of station literals sorted with lowest price first
	//there is no daily limit of api calls specified on the mygasfeed website
	getStations: function (lat, lng, res){
		var self = this

		var GAS_FEED_URL = 'http://api.mygasfeed.com/stations/radius/';
		var GAS_FEED_KEY = 'p1mww4bpb5';
		var radius = 25;//rad || 15; //miles
		request({
			method: 'GET', 
			uri: GAS_FEED_URL + lat + '/' + lng + '/' + radius + '/reg/Price/' + GAS_FEED_KEY + '.json', 
			json: true
		}
		, function (err, response, body){
			if (err){
				console.log('ERROR GETTING STATIONS');
				res.send( JSON.stringify([]));
			}
			else {
			 res.send(JSON.stringify(self.filterGasFeed(body.stations) ) );
	  	    }
	  	  }
		);
	},

	// REQUIRES: foodFavs be a valid string, may be empty string
	// foodFavs as a string with comma seperated categories
	setFoodCategories: function(foodFavs){
		var categories = foodFavs.split(',');

		for (var i = 0; i < categories.length; i++){
			if (categories[i] === 'American') categories[i] = 'tradamerican';
			else if (categories[i] === 'Asian') categories[i] = 'asianfusion';
			else if (categories[i] === 'Bar') categories[i] = 'bars';
			else if (categories[i] === 'Barbeque') categories[i] = 'bbq';
			else if (categories[i] === 'Breakfast') categories[i] = 'breakfast_brunch';
			else if (categories[i] === 'Chinese') categories[i] = 'chinese';
			else if (categories[i] === 'Coffee') categories[i] = 'coffee';
			else if (categories[i] === 'Diner') categories[i] = 'diners';
			else if (categories[i] === 'European') categories[i] = 'modern_european';
			else if (categories[i] === 'Fast Food') categories[i] = 'hotdogs';
			else if (categories[i] === 'Indian') categories[i] = 'indpak';
			else if (categories[i] === 'Korean') categories[i] = 'korean';
			else if (categories[i] === 'Mexican') categories[i] = 'mexican';
			else if (categories[i] === 'Pizza') categories[i] = 'pizza';
			else if (categories[i] === 'Seafood') categories[i] = 'seafood';
			else if (categories[i] === 'Steakhouse') categories[i] = 'steak';
			else if (categories[i] === 'Sushi') categories[i] = 'sushi';
			else if (categories[i] === 'Thai') categories[i] = 'thai';
			else if (categories[i] === 'Vegetarian') categories[i] = 'vegetarian';
			else if (categories[i] === 'Vietnamese') categories[i] = 'vietnamese';
		}

		return categories.join();
	},

	moveThroughYelp: function(data, type){
		var setOfInfo = [];
		for(var i = 0; i< data.businesses.length; ++i){
			if (data.businesses[i].is_closed || (type === 'food' && data.businesses[i].rating<2 ) ) continue;
			var info = {}
			info.rating = data.businesses[i].rating;
			info.rating_img_url_small=  data.businesses[i].rating_img_url_small;
			info.rating_img_url_large = data.businesses[i].rating_img_url_large;
			info.rating_img_url = data.businesses[i].rating_img_url;
			info.address = data.businesses[i].location.address + ' ' + data.businesses[i].location.city + ', ' + data.businesses[i].location.state_code + ' ' +data.businesses[i].location.postal_code
			info.name = data.businesses[i].name;
			setOfInfo.push(info);
		}
	 
		return setOfInfo;
	},

	//note: the limit on yelp api calls is 25,000 per day
	//if we go over this, contact api@yelp.com
	getNeeds : function(res, type, lat, lng, yelp, foodFavs){
		var self = this;
		var categories = "";
		if (foodFavs && _.isString(foodFavs)) categories = this.setFoodCategories(foodFavs);
		if (type === 'food') 
			yelp.search({term: type, ll: lat +',' + lng, category_filter: categories, radius_filter: MAX_RADIUS}, 
				function(err, data){
					if (err) res.send(JSON.stringify([]));
					else res.send(JSON.stringify(self.moveThroughYelp(data, 'food')));
				}
			);
		else{
			self.getStations(lat, lng, res);
		}
	}

}