var driverNeeds = require('../driverNeeds');
var assert = require("assert");
var sinon = require('sinon')

describe('driverNeeds', function(){
  describe('#setFoodCategories()', function(){
    it('should convert catagories into yelp style catagories', function(){
      assert.equal(driverNeeds.setFoodCategories('American'), 'tradamerican');
      assert.equal(driverNeeds.setFoodCategories('Asian,Pizza')[11],','); 
    })
  })
})

describe('driverNeeds', function(){
  describe('#filterGasFeed()', function(){
    it('should create a new list of gas station objects', function(){
      assert.deepEqual(driverNeeds.filterGasFeed([{
					station: 'Exon-Mobil',
					reg_price: '3.65', 
					lat: '45.492367', 
					lng: '-73'
				}]), 
      			[{
					name: 'Exon-Mobil',
					price: '3.65', 
					latitude: '45.492367', 
					longitude: '-73'
				}]);
    })
  })
})

describe('driverNeeds', function(){
  describe('#filterGasFeed()', function(){
    it('should create a new list of gas station objects', function(){
    assert.deepEqual(driverNeeds.filterGasFeed([{
					station: 'Exon-Mobil',
					reg_price: 'N/A', 
					lat: '45.492367', 
					lng: '-73'
				}]), []);
    })
  })
})

describe('driverNeeds', function(){
  describe('#getStations', function(){
    it('should call res.send', function(){
    	var res = {
    		send: function(){}
    	};
    	var mock = sinon.mock(res);
    	mock.expects('send').once().throws();
    	driverNeeds.getStations(45,'-73', mock);
    	mock.verify();
    })
  })
})
      