'use strict';

var GoogleMap = require('@pod-point/react-native-maps');
var React = require('react-native');

var {
    Image,
    StyleSheet,
    PropTypes,
    Text,
    View
} = React;

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
    },

    componentDidMount: function() {

        // make API call and set state accordingly
        //this.setState({options: mockLocation});
    },

    render: function() {
        var markersOptions = {};

        var numberOfGasMarkers = this.props.gasOptions.length;
        for (var i = 0; i < numberOfGasMarkers; i++) {
            var place = this.props.gasOptions[i];
            markersOptions[String(place.name)] = {id: place.name, latitude: place.lat, longitude: place.lon};
        }

        var numberOfFoodMarkers = this.props.foodOptions.length;
        for (var i = 0; i < numberOfFoodMarkers; i++) {
            var place = this.props.foodOptions[i];
            markersOptions[String(place.name)] = {id: place.name, latitude: place.lat, longitude: place.lon};
        }

        return (
            <View style={styles.container}>
                <GoogleMap 
                    markersSet={markersOptions}
                    style={styles.map}
                    cameraPosition={{auto: true, zoom: 13}}
                    showsUserLocation={true}
                />
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    map: {
        height: 250,
        width: 250,
        borderWidth: 1,
        borderColor: '#000000',
    },
});

module.exports = MapContainer;