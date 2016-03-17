'use strict';

var React = require('react-native');

var {
    AppRegistry,
    Component,
    StyleSheet,
    View,
    NavigatorIOS
} = React;

var LoginScreen = require('./views/login1');
var noOptions = [];

var App = React.createClass({
    render: function() {
        return (
             <NavigatorIOS style={styles.wrapper}
    initialRoute={{component: LoginScreen,title: 'LoginScreen',passProps: {} }}
    navigationBarHidden={true}  />);
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
