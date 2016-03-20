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
    componentDidMount: function() {

        // make API call and set state accordingly
        //this.setState({options: mockLocation});
    },

    render: function() {
        return (
            <View style={styles.container}>
                <GoogleMap 
                    /*markers={[
                        {
                            id: 'marker-100',
                            latitude: 42.277790,
                            longitude: -83.742705
                        },
                        {
                            id: 'marker-200',
                            latitude: 42.277743,
                            longitude: -83.742705
                        },
                    ]}*/
                    style={styles.map}
                    cameraPosition={{auto: true, zoom: 15}}
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