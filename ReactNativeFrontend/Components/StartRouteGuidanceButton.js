'use strict';

var React = require('react-native');
var Linking = require('Linking');

var {
    Dimensions,
    Image,
    StyleSheet,
    Platform,
    PropTypes,
    Text,
    View,
    TouchableHighlight,
    TouchableNativeFeedback
} = React;

var { height } = Dimensions.get('window');

var StartRouteGuidanceButton = React.createClass({
    propTypes: {
        itemWidth: PropTypes.number.isRequired,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        optionLatitude: PropTypes.number,
        optionLongitude: PropTypes.number,
    },

    getDirections: function() {
        var saddr = this.props.latitude + ',' + this.props.longitude;
        var daddr = this.props.optionLatitude + ',' + this.props.optionLongitude;
        var directionsmode = 'driving';
        var url = 'comgooglemaps://?saddr=' + saddr + '&daddr=' + daddr + '&directionsmode=' + directionsmode;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    },

    render: function() {
        if (!this.props.optionLatitude || !this.props.optionLongitude) return null;

        var TouchableElement = TouchableHighlight;

        if (Platform.OS === 'android') {
            TouchableElement = TouchableNativeFeedback;
        }

        return (
            <TouchableElement
                underlayColor='#0387c9'
                style={[styles.button, { width: this.props.itemWidth}]}
                onPress={this.getDirections}>
                <Text style={styles.buttonText}>Start Route Guidance</Text>
            </TouchableElement>
        );
    },
});

var styles = StyleSheet.create({
    button: {
        backgroundColor: '#6BCDFD',
        borderRadius: 4,
        height: Math.min(height * .075, 44),
        justifyContent: 'center',
        overflow: 'hidden',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

module.exports = StartRouteGuidanceButton;
