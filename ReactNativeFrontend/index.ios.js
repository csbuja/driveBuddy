'use strict';

var React = require('react-native');

var GasFoodSwiper = require('./Components/GasFoodSwiper.js');

var {
    AppRegistry,
    Component,
    StyleSheet,
    View
} = React;

var fakeOptions = [
    {
        name: "Shell",
        image: "http://facebook.github.io/react/img/logo_og.png",
        distance: "23 miles",
        price: "$3.00 / gal",
    },
    {
        name: "In & Out",
        image: "http://facebook.github.io/react/img/logo_og.png",
        distance: "43 miles",
        stars: 4,
    },
];

var noOptions = [];

var App = React.createClass({
    render: function() {
        return (
            <View style={styles.liveView}>
              <GasFoodSwiper
                title="Food"
                options={fakeOptions}
              />
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
