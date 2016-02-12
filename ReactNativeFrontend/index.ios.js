'use strict';

var React = require('react-native');

var {
    AppRegistry,
    Component,
    StyleSheet,
    View,
    NavigatorIOS
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

var LoginScreen = require('./views/login1');
var noOptions = [];

var App = React.createClass({
    render: function() {
        return (    
             <NavigatorIOS style={styles.wrapper}
    initialRoute={{component: LoginScreen,title: 'LoginScreen',passProps: {} }}   />);
    }
});

/*

*/
var styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    }
});

AppRegistry.registerComponent('dri', () => App);
