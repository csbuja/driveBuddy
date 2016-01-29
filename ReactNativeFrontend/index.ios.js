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
    distance: "23 miles",
    price: "$3.00 / gal",
},
{
    name: "In & Out",
    distance: "43 miles",
    stars: 4,
},
]

var App = React.createClass({
    render: function() {
        return (
            <View>
                <GasFoodSwiper
                    title="Food"
                    options={fakeOptions}
                />
            </View>
      );
    }
});

var styles = StyleSheet.create({

});

AppRegistry.registerComponent('dri', () => App);
