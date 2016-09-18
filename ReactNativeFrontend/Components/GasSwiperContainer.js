'use strict';

var GasFoodSwiperContainer = require('./GasFoodSwiperContainer');
var React = require('react-native');
var SwiperContainerMixin = require('../Mixins/SwiperContainerMixin');
var TimerMixin = require('react-native-timer-mixin');

var {StyleSheet, Text, View } = React;

var GasSwiperContainer = React.createClass({
    mixins: [TimerMixin, SwiperContainerMixin({ isFoodSwiper: false, })],

    render: function() {
        return (
            <View>
                <Text style={styles.title}>Gas</Text>
                <GasFoodSwiperContainer
                    {...this.props}
                    hasNewOptions={this.state.hasNewOptions}
                    hasSetOptions={this._hasSetOptions}
                    latitude={this.props.currentPosition.latitude}
                    loading={this.state.loading}
                    longitude={this.props.currentPosition.longitude}
                    onSwipe={this.props.onSwipe}
                    optionLatitude={this.props.optionLatitude}
                    optionLongitude={this.props.optionLongitude}
                    options={this.props.options}
                />
            </View>
        );
    },
});

var styles = StyleSheet.create({
    title: {
        color: '#404040',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 7,
        textAlign: 'center',
    },
});

module.exports = GasSwiperContainer;
