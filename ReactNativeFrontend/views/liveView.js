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
            latitude: 0,
            longitude: 0,
        };
    },

    componentDidMount: function() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
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
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
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
                    <View>
                        <FBLoginTopBar
                            navigator={this.props.navigator}
                        />
                    </View>
                </TouchableHighlight>
                <FoodSwiperContainer
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                    style={styles.borderBottom}
                />
                <GasSwiperContainer
                    latitude={this.state.latitude}
                    longitude={this.state.longitude}
                    style={styles.borderBottom}
                />
                <MapContainer
                    style={styles.borderBottom}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
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
        borderColor: '#000000',
        marginBottom: 10,
        marginLeft: 80,
        marginRight: 80,
    },
    wrapper: {
        flex: 1,
    }
});

module.exports = liveView;
