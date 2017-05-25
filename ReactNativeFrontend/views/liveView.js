'use strict';

var FoodSwiperContainer = require('../Components/FoodSwiperContainer.js');
var VelocityEstimator = require('../Components/velocityEstimator.js');
var DirectionFilter = require('../Components/directionFilter.js');
var GasSwiperContainer = require('../Components/GasSwiperContainer.js');
var MapContainer = require('../Components/MapContainer.js');
var NavBar = require('../Components/NavBar');
var React = require('react-native');
var KDSocialShare = require('NativeModules').KDSocialShare;
var Fabric = require('react-native-fabric');
var un = require('underscore');
var { Crashlytics, Answers} = Fabric;


var {
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} = React;

const LOCATION_SAMPLING_PERIOD_IN_SECONDS = 3.5;
const NUMBER_OF_LATLONS_STORED_WHEN_ESTIMATING_DIRECTION = 10;

var { height,width } = Dimensions.get('window');

var liveView = React.createClass({
    watchID: (null: ?number),

    changeMarketingCopyToFacebook: function(){
        this.setState({
            SocialMarketingCopy: "It can't get any easier to find a place to eat while driving. I'm really excited to make a Pitstop at " + this.state.foodOptions[this.state.foodIndex].name + " using the Pitstop Pal app on my iPhone!"
        })
    },
    changeMarketingCopyToTwitter: function(){
        this.setState({
            SocialMarketingCopy: "I'm really excited to make a Pitstop at " + this.state.foodOptions[this.state.foodIndex].name + " using the Pitstop Pal app on my iPhone!"
        })
    },

    tweet : function() {
    this.changeMarketingCopyToTwitter();
    KDSocialShare.tweet({
        'text':this.state.SocialMarketingCopy,
        'link':this.state.SocialLink
      },
      (results) => { //TODO - delete
        console.log(results);
      }
    );
  },

  shareOnFacebook : function() {

    this.changeMarketingCopyToFacebook();
    KDSocialShare.shareOnFacebook({
        'text':this.state.SocialMarketingCopy,
        'link':this.state.SocialLink
      },
      (results) => { //TODO - delete
        console.log(results);
      }
    );
  },

    getInitialState: function() {
        return {
            currentPosition: {
                latitude: null,
                longitude: null,
            },
            lastPosition: {
                latitude: null,
                longitude: null,
            },
            foodOptions: [],
            gasOptions: [],
            foodIndex: 0,
            gasIndex: 0,
            SocialMarketingCopy: 'Spencer Buja is the greatest man in the world.',
            SocialLink: "https://csbuja.github.io/#PitstopPalSection",
            highwaymode: "Off",
            minHighwaySpeedInMPH: 13.0, //a hack since the units are wrong right now
            ve : null,
            df : null,
            direction: null,//is a unit vector
            speed: 0,
            unfilteredFoodOptions:[],
            unfilteredGasOptions:[],
            sortByPrice: true,
            MAX_NUMBER_GAS_STATIONS_IN_PRICE_MODE: 200
            
        };
    },


    _directionFilter: function(){
        if (this.state.ve !== null && this.state.df !== null) { //these two booleans always take on the same value for now
                var currentPosition = this.state.currentPosition;
                this.state.ve.setCurrentLocation(currentPosition);
                var v = this.state.ve.estimateVelocity();
                Answers.logCustom('Driving Telemetry', 
                    {direction: v[0],
                    speed: v[1],
                    latitude: currentPosition.latitude,
                    longitude: currentPosition.longitude
                });


                var isonhighway = v[1] > this.state.minHighwaySpeedInMPH 

                this.setState({
                    highwaymode: isonhighway ? "On": "Off",
                    direction: v[0],
                    speed: v[1]
                });

                //filtering options code
                //Future Work: if we get more option types, then have this work on data structures of options
                if (this.state.foodOptions.length !== 0 && this.state.gasOptions.length !== 0 && this.state.highwaymode === "On") { // if we don't have any options, then don't filter
                    if ( (this.state.unfilteredGasOptions.length !== 0  && this.state.unfilteredFoodOptions.length !== 0 && un.intersection(this.state.unfilteredGasOptions,this.state.gasOptions).length !== 0  && un.intersection(this.state.unfilteredFoodOptions,this.state.foodOptions).length !== 0 ) )  {
                        var food = this.state.df.filter(this.state.unfilteredFoodOptions,currentPosition.latitude,currentPosition.longitude,this.state.direction);
                        var gas = this.state.df.filter(this.state.unfilteredGasOptions,currentPosition.latitude,currentPosition.longitude,this.state.direction);
                        this.setState({
                            foodOptions:food["ahead"],
                            gasOptions:gas["ahead"]
                        }); 
                    }
                    else { //filtering on the initial data or on newly refreshed data
                        var food = this.state.df.filter(this.state.foodOptions,currentPosition.latitude,currentPosition.longitude,this.state.direction);
                        var gas = this.state.df.filter(this.state.gasOptions,currentPosition.latitude,currentPosition.longitude,this.state.direction);
                        this.setState({
                            foodOptions:food["ahead"],
                            gasOptions:gas["ahead"],
                            unfilteredFoodOptions:food["all"],
                            unfilteredGasOptions: gas["all"]
                        }); 
                    } 
                }

                if (this.state.highwaymode === "Off" && this.state.unfilteredGasOptions.length !== 0  && this.state.unfilteredFoodOptions.length !== 0 && un.intersection(this.state.unfilteredGasOptions,this.state.gasOptions).length !== 0  && un.intersection(this.state.unfilteredFoodOptions,this.state.foodOptions).length !== 0 ) {
                    this.setState({
                        foodOptions:this.state.unfilteredFoodOptions,
                        gasOptions: this.state.unfilteredGasOptions
                     }); 
                }   
        }
    },
    componentDidMount: function() {
        Answers.logCustom('Reached Live View', {})

        navigator.geolocation.getCurrentPosition(
            (position) => {
                var currentPosition = { 
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                } 
                this.setState({
                    currentPosition: currentPosition
                });

                this.state.ve = VelocityEstimator(currentPosition,NUMBER_OF_LATLONS_STORED_WHEN_ESTIMATING_DIRECTION,LOCATION_SAMPLING_PERIOD_IN_SECONDS);
                this.state.df = DirectionFilter(this.state.ve);
        
            },
            (error) => console.log(error),
            // if battery life become a concern disable high accuracy
            // max age corresponds to using cached value within device, set to 5 min
            // arbitrarily set timeout to 10 seconds
            {enableHighAccuracy: true, timeout: LOCATION_SAMPLING_PERIOD_IN_SECONDS * 1000, maximumAge: 5 * 60 * 1000}
        );
        var self = this;
        setTimeout(function(){
            this.watchID = navigator.geolocation.watchPosition((position) => {
            var currentPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            
            var lastPosition = this.state.currentPosition;

            this.setState({
                currentPosition: currentPosition,
                lastPosition: lastPosition,
            });

            this._directionFilter();            
        });
        }.bind(self),200)

    },
    _updateGasDataInContainer: function(gas,sortByPrice){
        this.setState({
            unfilteredGasOptions: gas,
            gasOptions: gas,
            sortByPrice: sortByPrice
        })
    },

    componentWillUnmount: function() {
        navigator.geolocation.clearWatch(this.watchID);
    },

    render: function(){
        var priceFilteredGasOptions = [];
        var foodOptionLatitude = null;
        var foodOptionLongitude = null;
        if (this.state.foodOptions.length  && !un.isUndefined( this.state.foodOptions[this.state.foodIndex])) {
            foodOptionLatitude = parseFloat(this.state.foodOptions[this.state.foodIndex].lat);
            foodOptionLongitude = parseFloat(this.state.foodOptions[this.state.foodIndex].lon);
        }

        var gasOptionLatitude = null;
        var gasOptionLongitude = null;
        if (this.state.gasOptions.length && !un.isUndefined(this.state.gasOptions[this.state.gasIndex]) ) {
            gasOptionLatitude = parseFloat(this.state.gasOptions[this.state.gasIndex].lat);
            gasOptionLongitude = parseFloat(this.state.gasOptions[this.state.gasIndex].lon);
            var priceFilteredGasOptions = this.state.gasOptions;
            if(this.state.sortByPrice) priceFilteredGasOptions = priceFilteredGasOptions.slice(0,this.state.MAX_NUMBER_GAS_STATIONS_IN_PRICE_MODE);
        }
        console.log(this.state.sortByPrice);
        var socialheight = 35;
        var socialwidth = width/3;
        var directionFilterText = this.state.highwaymode === "On" ? "Looking Ahead" : "Looking Around";
        
        return (
        <View style={styles.liveView}>
        <View style={[styles.shareContainer,{marginTop:height/20}]} >
            <TouchableHighlight onPress={this.tweet}>
              <View style={{alignItems: 'center',justifyContent:'center', width: socialwidth, height: socialheight,backgroundColor: "rgba(0, 172, 237,1)"}}>
               <Text style={{color:'#ffffff',fontWeight:'800',}}>Share on Twitter</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.shareOnFacebook}>
              <View style={{alignItems: 'center',justifyContent:'center', width: socialwidth, height: socialheight,backgroundColor:'#3b5998'}}>
               <Text style={{color:'#ffffff',fontWeight:'800',}}>Share on Facebook</Text>
              </View>
            </TouchableHighlight>
            <View style={{alignItems: 'center',justifyContent:'center',width: socialwidth, height: socialheight,backgroundColor: "rgba(0, 172, 237,.25)"}}>
                <Text style={{color:"#3b5998",fontWeight:'800',justifyContent:'center'}}>{directionFilterText}</Text>
            </View>

        </View>
            
            <FoodSwiperContainer
                currentPosition={this.state.currentPosition}
                foodIndex={this.state.foodIndex}
                gasIndex={this.state.gasIndex}
                lastPosition={this.state.lastPosition}
                navigator={this.props.navigator}
                onSetOptions={this._onSetFoodOptions}
                onSwipe={this._onFoodSwipe}
                optionLatitude={foodOptionLatitude}
                optionLongitude={foodOptionLongitude}
                options={this.state.foodOptions}
                style={styles.swiper}
            />
            <View style={styles.separator} />
            <GasSwiperContainer
                currentPosition={this.state.currentPosition}
                foodIndex={this.state.foodIndex}
                gasIndex={this.state.gasIndex}
                lastPosition={this.state.lastPosition}
                onSetOptions={this._onSetGasOptions}
                onSwipe={this._onGasSwipe}
                optionLatitude={gasOptionLatitude}
                optionLongitude={gasOptionLongitude}
                options={this.state.gasOptions}
                style={styles.swiper}
                updateGasFunc={this._updateGasDataInContainer.bind(this)}
                MAX_NUMBER_GAS_STATIONS_IN_PRICE_MODE={this.state.MAX_NUMBER_GAS_STATIONS_IN_PRICE_MODE}
            />
            <View style={styles.separator} />
            <MapContainer
                foodIndex={this.state.foodIndex}
                foodOptions={this.state.foodOptions}
                gasIndex={this.state.gasIndex}
                gasOptions={priceFilteredGasOptions}
                style={styles.map}
            />
            <View style={styles.separatorEmpty} />
           
        </View>
        );
    },

    _onSetFoodOptions: function(options) {
        this.setState({foodOptions: options});
    },

    _onSetGasOptions: function(options) {
        this.setState({gasOptions: options});
    },

    _onFoodSwipe: function(index) {
        this.setState({foodIndex: index});
    },

    _onGasSwipe: function(index) {
        this.setState({gasIndex: index});
    }

});

var styles = StyleSheet.create({
    liveView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    separator: {
        alignSelf: 'center',
        backgroundColor: '#CCCCCC',
        height: 2,
        width: width * .85, // needs to match MapContainer
    },
    separatorEmpty: {
        height: 2,
    },
    wrapper: {
        flex: 1,
    },
    shareContainer:{
        flex:1,
        flexDirection:'row'
    }
});

module.exports = liveView;
