'use strict';

var GoogleMap = require('@pod-point/react-native-maps');
var React = require('react-native');

var {
    Dimensions,
    Image,
    StyleSheet,
    PropTypes,
    Text,
    View
} = React;

var { height, width } = Dimensions.get('window');

var mockLocation = {
  latitude: '42.291404',
  longitude: '-83.717274',
  zoom: 15,
  size: {
    width: 250,
    height: 250
  }
}

var MapContainer = React.createClass({
    propTypes: {
        foodOptions: PropTypes.array,
        gasOptions: PropTypes.array,
        foodIndex: PropTypes.number,
        gasIndex: PropTypes.number,
    },

    componentDidMount: function() {

        // make API call and set state accordingly
        //this.setState({options: mockLocation});
    },

    render: function() {
        var j = 0;
        var markersOptions = {};

        var gasicon = 'https://cdn3.iconfinder.com/data/icons/map/500/gasstation-512.png';
        var numberOfGasMarkers = this.props.gasOptions.length;
        for (var i = 0; i < numberOfGasMarkers; i++) {
            var place = this.props.gasOptions[i];
            if (i == this.props.gasIndex) {
                console.log('PLACE')
                markersOptions[String(j++)] = {id: place.name, latitude: place.lat, longitude: place.lon, icon: {uri: gasicon, scale: 11.0}, active: true};
            } else {
                markersOptions[String(j++)] = {id: place.name, latitude: place.lat, longitude: place.lon, icon: {uri: gasicon, scale: 11.0}};
            }
        }

        var numberOfFoodMarkers = this.props.foodOptions.length;
        for (var i = 0; i < numberOfFoodMarkers; i++) {
            var place = this.props.foodOptions[i];
            if (i == this.props.foodIndex) {
                markersOptions[String(j++)] = {id: place.name, latitude: place.lat, longitude: place.lon, icon: {uri: place.image, scale: 3.0}, active: true};
            } else {
                markersOptions[String(j++)] = {id: place.name, latitude: place.lat, longitude: place.lon, icon: {uri: place.image, scale: 3.0}};
            }
        }

        return (
            <View style={[styles.container, this.props.style]}>
                <GoogleMap
                    markersSet={markersOptions}
                    style={styles.map}
                    showsUserLocation={true}
                />
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        borderRadius: 5,
        height: height * .32,
        width: width * .85, // needs to match separator in liveView
    },
});

module.exports = MapContainer;
