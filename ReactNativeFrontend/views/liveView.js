'use strict';

var React = require('react-native');

var {
    AppRegistry,
    Component,
    StyleSheet,
    View,
    NavigatorIOS,
    TouchableHighlight,
    Text,
     NativeModules
} = React;

// var Login1 = require('./Login1');
var FoodSwiperContainer = require('../Components/FoodSwiperContainer.js');
var GasSwiperContainer = require('../Components/GasSwiperContainer.js');
var MapContainer = require('../Components/MapContainer.js');
var FBLoginTopBar = require('../Components/FBLoginTopBar.js')
var FBLogin = require('react-native-facebook-login');
var { FBLoginManager } = NativeModules;

var liveView = React.createClass({
    watchID: (null: ?number),

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
        var toLoginBack = this.toLoginBack;
        return (
            <View style={styles.liveView}>
                <TouchableHighlight style={styles.circleButton} onPress={this.onBack}>
                    <View style={styles.container}>
                        <FBLoginTopBar
                            navigator={this.props.navigator}
                        />
                    </View>
                </TouchableHighlight>
                <FoodSwiperContainer
                    currentPosition={this.state.currentPosition}
                    lastPosition={this.state.lastPosition}
                    onSetOptions={this._onSetFoodOptions}
                    onSwipe={this._onFoodSwipe}
                    foodIndex={this.state.foodIndex}
                    gasIndex={this.state.gasIndex}
                    style={styles.borderBottom}
                />
                <GasSwiperContainer
                    currentPosition={this.state.currentPosition}
                    lastPosition={this.state.lastPosition}
                    onSetOptions={this._onSetGasOptions}
                    onSwipe={this._onGasSwipe}
                    foodIndex={this.state.foodIndex}
                    gasIndex={this.state.gasIndex}
                    style={styles.borderBottom}
                />
                <MapContainer
                    style={styles.borderBottom}
                    foodOptions={this.state.foodOptions}
                    gasOptions={this.state.gasOptions}
                    foodIndex={this.state.foodIndex}
                    gasIndex={this.state.gasIndex}
                />
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
    container: {
        alignItems: 'center',
    },
    liveView: {
        backgroundColor:'#FFFFFF',
        paddingTop: 28, // temporary
    },
    circleButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        margin: 5,
        borderRadius: 500
    },
    borderBottom: {
        borderBottomWidth: 2,
        borderColor: '#CCCCCC',
        marginBottom: 10,
        marginLeft: 60,
        marginRight: 60,
    },
    wrapper: {
        flex: 1,
    }
});

module.exports = liveView;
