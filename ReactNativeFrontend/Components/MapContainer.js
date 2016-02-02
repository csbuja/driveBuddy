'use strict';

var GoogleStaticMap = require('react-native-google-static-map').default;

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

    getInitialState: function() {
        return {
          //if there are any member variables
        };
    },

    render: function() {
        return (
          <View style={[this.props.style, styles.container, styles.col]}>
            <Text style={styles.title} >Businesses Locations</Text>
            <GoogleStaticMap style={styles.map} {...mockLocation} />
          </View>
        );
        //return null;
    },
});
var styles = StyleSheet.create({
    button: {
        backgroundColor: '#80ff80',
        borderColor: '#00cc00',
        borderRadius: 2,
        borderStyle: 'solid',
        borderWidth: 1,
        flex: 1,
        marginTop: 8,
        overflow: 'hidden',
        padding: 4,
        textAlign: 'center',
    },
    col: {
        flexDirection: 'column',
    },
    container: {
        alignItems: 'center',
    },
    no_options: {
        height:110, 
        width:300
    },
    image: {
        height: 60,
        marginRight: 28,
        width: 60,
    },
    name: {
        fontSize: 16,
    },
    placeView: {
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 8,
    },
    row: {
        flexDirection: 'row',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});


module.exports = MapContainer;