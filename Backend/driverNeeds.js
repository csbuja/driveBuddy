var request = require('request');
var child_process = require('child_process');
var _ = require('underscore');
var fs = require("fs");
var calcDistance = require('./calcDistance.js');

var MAX_RADIUS = 40000;
var db = require('./db');
var Q = require('q')
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
					lat: data[i].lat,
					lon: data[i].lng,
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
			info.categories = [];
			for(var j = 0; j < data.businesses[i].categories.length; ++j){
				info.categories.push(data.businesses[i].categories[j][1]);
			}
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

	re_rate: function(businesses, survey){
		var count = [];
		var max_count = survey.length + 1;
		for(var i = 0; i < businesses.length; ++i){
			var same = 1;
			var rating = businesses[i].rating;
			for(var j = 0; j < survey.length; ++j){
				if(survey[j].restaurant_id == businesses[i].id){
					same = max_count;
					break;
				}
				else{
					var str = survey[j].foodtype;
					var intersect = _.intersection(businesses[i].categories, str.split(','));
					if(intersect.length){
						same += 1;
					}

				}

			}
			if(same == max_count){
				rating = 5;
			}
			else{
				rating = rating * (same / max_count);
			}
			count.push({id:businesses[i].id, rating: rating});
		}
		count.sort(function(a, b) {
			return (a.rating - b.rating) < 0;
		});
		return count;
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

	check_add: function (term) {
		//console.log('check and add');
		db.query('SELECT restaurant_id from restaurant where restaurant_id = ?', term.restaurant_id, function(err, result) {
			if (err){
				throw err
			}else{
				if(result.length == 0){
					db.query('INSERT INTO survey SET ?', term,function(err, result) {
						if (err) throw err;
					});
				}
				console.log('insert the restuarant ');
			}
		});
	},

	register: function(result, post){
		console.log('check userid');
		if(result.length == 0){
			console.log(result.length);
			db.query('INSERT INTO user SET ?', post, function(err, result) {
				if (err) throw err;
				else console.log('Registered');
			});
		}else{
			console.log("Alreay exists");

		}

	},

	write_file: function(userid, restaurant_id){
		var deferred = Q.defer();
		db.query('select * from rate where userid = ' + userid +' and restaurant_id = \"' + restaurant_id + '\"',
		function(err, result){
			if (err) throw err;
			else{
				if (result.length != 0){
					data = result[0].rate;
					var dict = {};
					dict[restaurant_id] = data;
					deferred.resolve(dict);
				}
				else{
					var query_sub = 'select distinct userid from rate where userid =' + userid +' or userid in (select R1.userid from rate R1, rate R2 where R1.restaurant_id= \"' + restaurant_id + '\" and R2.restaurant_id in (select restaurant_id from rate where userid = ' + userid + ') and R1.userid = R2.userid) order by userid';
					db.query(query_sub, function(err, result_sub){
						var query = 'select * from rate where userid =' + userid +' or userid in (select R1.userid from rate R1, rate R2 where R1.restaurant_id= \"' + restaurant_id + '\" and R2.restaurant_id in (select restaurant_id from rate where userid = ' + userid + ') and R1.userid = R2.userid) order by restaurant_id, userid';
						db.query(query, function (err,result) {
							if (err) throw err;
							else{
								var name = result[0].restaurant_id;
								var count = 0;
								var j = 0;
								var data = "";
								var find = 0;
								if(name == restaurant_id){
									find = 1;
								}
								for(var i = 0; i < result.length; ++i){
									if(result[i].restaurant_id == name){
										while(result[i].userid != result_sub[j].userid){
											data = data + ',';
											j ++;
										}
										data = data + result[i].rate + ",";
										j++;
									}
									else{
										name = result[i].restaurant_id;
										while (j <result_sub.length){
											data = data + ",";
											j = j + 1;
										}
										data = data + '\n';
										if(name != restaurant_id && find == 0){
											count += 1;
										}
										if(name == restaurant_id){
											count += 1;
											find = 1;
										}
										j = 0;
										while(result[i].userid != result_sub[j].userid){
											data = data + ',';
											j ++;
										}
										data = data + result[i].rate + ",";
										j++;

									}
								}
								var i = 0;
								while(i < result_sub.length){
									if(result_sub[i].userid == userid){
										data = i + ',' + count + '\n' + data;
										break;
									}
									i ++;
								}
								var filename = "./tmp/" +Date.now().toString() + "-"+userid + "-" + restaurant_id + ".txt";
								fs.writeFile(filename, data, function(err){
									if (err) {
									   throw err;
									 } else {

									 }
								});
								var dict = {};
								child_process.exec('python PredictRatings.py ' + filename, function (err, data) {
									dict[restaurant_id] = parseFloat(data);
									child_process.exec('rm ' + filename, function () {});
									deferred.resolve(dict);
								})
							}
						});
					});
				}
			}
		});
		return deferred.promise
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
		'ukrainian','uzbek','vegan','vegetarian','venison','vietnamese','wok','wraps','yugoslav'];
	},

}
