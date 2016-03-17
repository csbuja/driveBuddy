var request = require('request');
var _ = require('underscore');
var calcDistance = require('./calcDistance.js');

var MAX_RADIUS = 40000;

module.exports = {
	filterGasFeed: function (data, lat, lon){
		var setOfStations = [];

		if (!data){
			console.log('ERROR FILTERING GASFEED');
			return setOfStations;
		}

		for (var i = 0; i < data.length; i++){
            var distance = calcDistance(data[i].lat, data[i].lng, lat, lon);
			if(data[i].reg_price !== "N/A" && distance <= 25) {
				setOfStations.push({
					name: data[i].station,
					price: data[i].reg_price,
					latitude: data[i].lat,
					longitude: data[i].lng,
                    distance: distance,
				});
			}
		}

		return setOfStations;
	},

	// returns array of station literals sorted with lowest price first
	//there is no daily limit of api calls specified on the mygasfeed website
	getStations: function (lat, lon, radius, res){
		console.log('get Station is running');
		var self = this

		var GAS_FEED_URL = 'http://api.mygasfeed.com/stations/radius/';
		var GAS_FEED_KEY = 'p1mww4bpb5';
		request({
			method: 'GET',
			uri: GAS_FEED_URL + lat + '/' + lon + '/' + radius + '/reg/Price/' + GAS_FEED_KEY + '.json',
			json: true
		}
		, function (err, response, body){
			if (err){
				console.log('ERROR GETTING STATIONS');
				res.send( JSON.stringify([]));
			}
			else {
			 res.send(JSON.stringify(self.filterGasFeed(body.stations, lat, lon)));
	  	    }
	  	  }
		);
	},

    getYelpBusinesses: function(data, lat, lon) {
        var businesses = {};

        for(var i = 0; i< data.businesses.length; ++i){
			var info = {}
			info.rating = data.businesses[i].rating;
			info.id = data.businesses[i].id;
			info.address = data.businesses[i].location.address + ' ' + data.businesses[i].location.city + ', ' + data.businesses[i].location.state_code + ' ' +data.businesses[i].location.postal_code;
			info.name = data.businesses[i].name;
			info.lat = data.businesses[i].location.coordinate.latitude;
			info.lon = data.businesses[i].location.coordinate.longitude;
            info.image = data.businesses[i].image_url;
            info.distance = calcDistance(lat, lon, info.lat, info.lon);

			businesses[info.id] = info;
		}

        return businesses;
    },

	//note: the limit on yelp api calls is 25,000 per day
	//if we go over this, contact api@yelp.com
	getNeeds : function(res, type, lat, lng, yelp, foodFavs){
		console.log('getNeeds is running');
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
			self.getStations(lat, lng, radius, res);
		}
	},

	encodeFoodType:function(categories){
		var foodtype =[ 'afghani','african','andalusian','arabian','argentine','armenian','asianfusion','asturian',
		'australian','austrian','baguettes','bangladeshi','basque','bavarian','bbq',
		'beergarden','beerhall','beisl','belgian','bistros','blacksea','brasseries','brazilian','breakfast_brunch',
		'british','buffets','bulgarian','burgers','burmese','cafes','cafeteria','cajun','cambodian','canteen','caribbean',
		'catalan','cheesesteaks','chicken_wings','chickenshop','chilean','chinese','comfortfood','corsican','creperies',
		'cuban','currysausage','cypriot','czech','czechslovakian','danish','delis','diners','dumplings','eastern_european',
		'ethiopian','filipino','fischbroetchen','fishnchips','flatbread','fondue','food_court','foodstands','french','galician',
		'gastropubs','georgian','german','giblets','gluten_free','greek','halal','hawaiian','heuriger','himalayan','hkcafe',
		'hotdog','hotdogs','hotpot','hungarian','iberian','indonesian','indpak','international','irish','island_pub','israeli',
		'italian','japanese','jewish','kebab','kopitiam','korean','kosher','kurdish','laos','laotian','latin','lyonnais',
		'malaysian','meatballs','mediterranean','mexican','mideastern','milkbars','modern_australian','modern_european',
		'mongolian','moroccan','newamerican','newcanadian','newzealand','nightfood','norcinerie','norwegian','opensandwiches',
		'oriental','pakistani','parma','persian','peruvian','pfcomercial','pita','pizza','polish','portuguese','potatoes',
		'poutineries','pubfood','raw_food','riceshop','romanian','rotisserie_chicken','rumanian','russian','salad',
		'sandwiches','scandinavian','scottish','seafood','serbocroatian','signature_cuisine','singaporean','slovakian',
		'soulfood','soup','southern','spanish','srilankan','steak','sud_ouest','supperclubs','sushi','swabian',
		'swedish','swissfood','syrian','tabernas','taiwanese','tapas',
		'tapasmallplates','tex-mex','thai','tradamerican','traditional_swedish','trattorie','turkish',
		'ukrainian','uzbek','vegan','vegetarian','venison','vietnamese','wok','wraps','yugoslav']
		for(var i = 0; i < categories.length; ++i){

		}
	}
}
