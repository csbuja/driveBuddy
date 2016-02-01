'use strict';

var React = require('react-native');

var FoodSwiperContainer = require('./Components/FoodSwiperContainer.js');
var GasSwiperContainer = require('./Components/GasSwiperContainer.js');

var {
    AppRegistry,
    Component,
    StyleSheet,
    View
} = React;

var App = React.createClass({
    render: function() {
        return (
            <View style={styles.liveView}>
              <FoodSwiperContainer />
              <GasSwiperContainer />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    liveView: {
        backgroundColor:'#FFFFFF',
        paddingTop: 28, // temporary
    },
});

AppRegistry.registerComponent('dri', () => App);
