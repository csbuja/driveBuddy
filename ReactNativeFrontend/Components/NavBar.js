'use strict'

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var config = require("../config");
var {
    NativeModules,
    PropTypes,
    StyleSheet,
    AsyncStorage,
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
            userID : ""
        }
    },
    componentWillMount: function() {
        this._getToken();
    },
    getInitialState: function() {
        return {
            token: ''
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
                title={title}/>
        );
    },

    _logout: function() {
        this._getToken();
        var self = this;
        FBLoginManager.logout((err, data) => {
            if (err) return;
            this.props.onLogout && this.props.onLogout();
            this.props.navigator.popToTop();
            //console.log(this.state.token)
            fetch('http://' + config.hostname+ '/api/logout', {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      token : self.state.token
                   })
            })
        });
    },
    _getToken: function() {
        AsyncStorage.getItem('token').then(function(token) {
            this.setState({token: token});
        }.bind(this)).catch(function(error) {
            console.log('error retrieving token from disc' + error);
        });
    }
});

var styles = StyleSheet.create({
    title: {
        color: '#404040',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

module.exports = NavBar;
