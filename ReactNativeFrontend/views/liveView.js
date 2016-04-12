'use strict';

var FoodSwiperContainer = require('../Components/FoodSwiperContainer.js');
var GasSwiperContainer = require('../Components/GasSwiperContainer.js');
var MapContainer = require('../Components/MapContainer.js');
var NavBar = require('../Components/NavBar');
var React = require('react-native');

var {
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} = React;

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

        return (
            <View style={styles.liveView}>
                <NavBar
                    navigator={this.props.navigator}
                />
                <FoodSwiperContainer
                    currentPosition={this.state.currentPosition}
                    foodIndex={this.state.foodIndex}
                    gasIndex={this.state.gasIndex}
                    lastPosition={this.state.lastPosition}
                    onSetOptions={this._onSetFoodOptions}
                    onSwipe={this._onFoodSwipe}
                    optionLatitude={foodOptionLatitude}
                    optionLongitude={foodOptionLongitude}
                    style={styles.borderBottom}
                />
                <GasSwiperContainer
                    currentPosition={this.state.currentPosition}
                    foodIndex={this.state.foodIndex}
                    gasIndex={this.state.gasIndex}
                    lastPosition={this.state.lastPosition}
                    onSetOptions={this._onSetGasOptions}
                    onSwipe={this._onGasSwipe}
                    optionLatitude={gasOptionLatitude}
                    optionLongitude={gasOptionLongitude}
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
