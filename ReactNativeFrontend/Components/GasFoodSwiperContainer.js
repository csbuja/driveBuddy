'use strict';

var GasFoodSwiper = require('./GasFoodSwiper');
var React = require('react-native');
var StartRouteGuidanceButton = require('./StartRouteGuidanceButton');

var {
    PropTypes,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} = React;

var GasFoodSwiperContainer = React.createClass({
    propTypes: {
        latitude: PropTypes.number,
        loading: PropTypes.bool.isRequired,
        longitude: PropTypes.number,
        onSwipe: PropTypes.func,
        optionLatitude: PropTypes.string,
        optionLongitude: PropTypes.string,
        options: PropTypes.array.isRequired,
        title: PropTypes.string.isRequired,
    },

    render: function() {
        var swiperWidth = 320;
        var placeContainerOffset = 90;

        return (
            <View style={styles.container}>
                <GasFoodSwiper
                    loading={this.props.loading}
                    onSwipe={this.props.onSwipe}
                    options={this.props.options}
                    placeContainerOffset={placeContainerOffset}
                    swiperWidth={swiperWidth}
                    title={this.props.title}
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
    },
});

module.exports = GasFoodSwiperContainer;
