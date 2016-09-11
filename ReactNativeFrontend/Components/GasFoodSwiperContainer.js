'use strict';

var GasFoodSwiper = require('./GasFoodSwiper');
var React = require('react-native');
var StartRouteGuidanceButton = require('./StartRouteGuidanceButton');

var {
    Dimensions,
    PropTypes,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} = React;

var { width } = Dimensions.get('window');

var GasFoodSwiperContainer = React.createClass({
    propTypes: {
        hasNewOptions: PropTypes.bool.isRequired,
        hasSetOptions: PropTypes.func.isRequired,
        latitude: PropTypes.number,
        loading: PropTypes.bool.isRequired,
        longitude: PropTypes.number,
        onSwipe: PropTypes.func,
        optionLatitude: PropTypes.number,
        optionLongitude: PropTypes.number,
        options: PropTypes.array.isRequired,
    },

    render: function() {
        var swiperWidth = width * .9;
        var placeContainerOffset = width * .2;

        return (
            <View style={[styles.container, this.props.style]}>
                <GasFoodSwiper
                    hasNewOptions={this.props.hasNewOptions}
                    hasSetOptions={this.props.hasSetOptions}
                    loading={this.props.loading}
                    onSwipe={this.props.onSwipe}
                    options={this.props.options}
                    placeContainerOffset={placeContainerOffset}
                    swiperWidth={swiperWidth}
                />
                <StartRouteGuidanceButton
                    itemWidth={swiperWidth - placeContainerOffset}
                    latitude={this.props.latitude}
                    longitude={this.props.longitude}
                    optionLatitude={this.props.optionLatitude}
                    optionLongitude={this.props.optionLongitude}
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
});

module.exports = GasFoodSwiperContainer;
