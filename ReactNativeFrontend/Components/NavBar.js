'use strict'

var React = require('react-native');
var NavigationBar = require('react-native-navbar');

var {
    NativeModules,
    PropTypes,
    StyleSheet,
    Text,
} = React;
var { FBLoginManager } = NativeModules;

var NavBar = React.createClass({
    propTypes: {
        navigator: PropTypes.object.isRequired,
        onLogout: PropTypes.func,
        showLogout: PropTypes.bool,
        title: PropTypes.string,
    },

    getDefaultProps: function() {
        return {
            showLogout: true,
        }
    },

    render: function() {
        var title = <Text style={styles.title}>{this.props.title}</Text>;

        var leftButtonConfig = this.props.showLogout
            ? {
                title: 'Log out',
                handler: this._logout,
              }
            : {};

        return (
            <NavigationBar
                leftButton={leftButtonConfig}
                statusBar={{}} // suppress module bug
                style={this.props.style}
                title={title}
            />
        );
    },

    _logout: function() {
        FBLoginManager.logout((err, data) => {
            if (err) return;
            this.props.onLogout && this.props.onLogout();
            this.props.navigator.popToTop();
        });
    },
});

var styles = StyleSheet.create({
    title: {
        color: '#404040',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

module.exports = NavBar;
