'use strict'

var React = require('react-native');
var NavigationBar = require('react-native-navbar');

var {
    NativeModules,
    PropTypes,
} = React;
var { FBLoginManager } = NativeModules;

var NavBar = React.createClass({
    propTypes: {
        navigator: PropTypes.object.isRequired,
    },

    render: function() {
        var leftButtonConfig = {
            title: 'Log out',
            handler: this._logout,
        };

        return (
            <NavigationBar
                leftButton={leftButtonConfig}
                statusBar={{}} // suppress module bug
            />
        );
    },

    _logout: function() {
        FBLoginManager.logout((err, data) => {
            if (err) return;
            this.props.navigator.popToTop();
        });
    },
});

module.exports = NavBar;
