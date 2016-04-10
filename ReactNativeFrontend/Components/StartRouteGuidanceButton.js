'use strict';

var React = require('react-native');
var Linking = require('Linking');

var {
    Image,
    StyleSheet,
    Platform,
    PropTypes,
    Text,
    View,
    TouchableHighlight,
    TouchableNativeFeedback
} = React;

var StartRouteGuidanceButton = React.createClass({
    propTypes: {
        itemWidth: PropTypes.number.isRequired,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        optionLatitude: PropTypes.string,
        optionLongitude: PropTypes.string,
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
            <View style={{ width: this.props.itemWidth }}>
                <TouchableElement
                    style={styles.button}
                    onPress={this.getDirections}>
                    <Text style={styles.buttonText}>Start Route Guidance</Text>
                </TouchableElement>
            </View>
        );
    },
});

var styles = StyleSheet.create({
    button: {
        backgroundColor: '#6BCDFD',
        borderColor: '#6BCDFD',
        borderRadius: 2,
        borderStyle: 'solid',
        borderWidth: 1,
        flex: 1,
        marginBottom: 8,
        overflow: 'hidden',
        padding: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

module.exports = StartRouteGuidanceButton;
