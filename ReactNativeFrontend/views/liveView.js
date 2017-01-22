'use strict';

var FoodSwiperContainer = require('../Components/FoodSwiperContainer.js');
var GasSwiperContainer = require('../Components/GasSwiperContainer.js');
var MapContainer = require('../Components/MapContainer.js');
var NavBar = require('../Components/NavBar');
var React = require('react-native');
var KDSocialShare = require('NativeModules').KDSocialShare;
var Fabric = require('react-native-fabric');
var { Crashlytics, Answers} = Fabric;

var {
    Dimensions,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} = React;

var { height,width } = Dimensions.get('window');

var liveView = React.createClass({
    watchID: (null: ?number),
    tweet : function() {

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
            SocialLink: "https://csbuja.github.io"
        };
    },

    componentDidMount: function() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    currentPosition: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    },
                });
            },
            (error) => console.log(error),
            // if battery life become a concern disable high accuracy
            // max age corresponds to using cached value within device, set to 5 min
            // arbitrarily set timeout to 10 seconds
            {enableHighAccuracy: true, timeout: 10 * 1000, maximumAge: 5 * 60 * 1000}
        );

        // updates when position changes
        this.watchID = navigator.geolocation.watchPosition((position) => {
            var currentPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            };
            Answers.logCustom('Reached Live View', {position:currentPosition})
            var lastPosition = this.state.currentPosition;

            this.setState({
                currentPosition: currentPosition,
                lastPosition: lastPosition,
            });
        });

        
    },

    componentWillUnmount: function() {
        navigator.geolocation.clearWatch(this.watchID);
    },

    render: function(){
        var foodOptionLatitude = null;
        var foodOptionLongitude = null;
        if (this.state.foodOptions.length) {
            foodOptionLatitude = parseFloat(this.state.foodOptions[this.state.foodIndex].lat);
            foodOptionLongitude = parseFloat(this.state.foodOptions[this.state.foodIndex].lon);
        }

        var gasOptionLatitude = null;
        var gasOptionLongitude = null;
        if (this.state.gasOptions.length) {
            gasOptionLatitude = parseFloat(this.state.gasOptions[this.state.gasIndex].lat);
            gasOptionLongitude = parseFloat(this.state.gasOptions[this.state.gasIndex].lon);
        }
        var tutorialMessages = [
        "Swipe left and right to see Food & Gas Pitstops in sorted order. \nBased on the survey, we recommend Pitstops to get food and will tell you if your best Facebook friends enjoyed these Pitstops.",
        'Click "Start Route Guidance" to get directions to the Pitstop.']
 // <Tutorial tutorialMessages={tutorialMessages}></Tutorial>
        return (
        <View style={styles.liveView}>
        <View style={[styles.shareContainer,{marginTop:height/20}]} >
            <TouchableHighlight onPress={this.tweet}>
              <View style={{alignItems: 'center',justifyContent:'center', width: 150, height: 25,backgroundColor:'#00aced'}}>
               <Text style={{color:'#ffffff',fontWeight:'800',}}>Share on Twitter</Text>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.shareOnFacebook}>
              <View style={{alignItems: 'center',justifyContent:'center', width: 150, height: 25,backgroundColor:'#3b5998'}}>
               <Text style={{color:'#ffffff',fontWeight:'800',}}>Share on Facebook</Text>
              </View>
            </TouchableHighlight>
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
            />
            <View style={styles.separator} />
            <MapContainer
                foodIndex={this.state.foodIndex}
                foodOptions={this.state.foodOptions}
                gasIndex={this.state.gasIndex}
                gasOptions={this.state.gasOptions}
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
