'use strict';

var GasFoodSwiperContainer = require('./GasFoodSwiperContainer');
var NavBar = require('./NavBar');
var React = require('react-native');
var SwiperContainerMixin = require('../Mixins/SwiperContainerMixin');
var TimerMixin = require('react-native-timer-mixin');

var {
    Text,
    View,
    Image
} = React;

var FoodSwiperContainer = React.createClass({
    mixins: [TimerMixin, SwiperContainerMixin({ isFoodSwiper: true, })],

    render: function() {
        return (
            <View>
                <NavBar
                    navigator={this.props.navigator}
                    title={"Food"}/>
                <View style={{alignItems: 'flex-end'}}>
                    <Image source={require("../Images/yelp-2c.png")} style={{height:20,width:1.7*20}}/>
                </View>
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

module.exports = FoodSwiperContainer;
