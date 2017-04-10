'use strict'

//var Button = require('react-native-button');
//var liveView = require('./liveView');
var NavBar = require('../Components/NavBar');
var React = require('react');
var config = require("../config");
//var SurveyRestaurantSearch = require('../Components/SurveyRestaurantSearch');
//var SurveySelectedRestaurantList = require('../Components/SurveySelectedRestaurantList');

var TSurveySearchBarContainer = require('../Components/TSurveySearchBarContainer');
var TSurveyArea = require('../Components/TSurveyArea');

var {
    AsyncStorage,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} = require('react-native');

var { width } = Dimensions.get('window');

var TSurveyView = React.createClass({
    getInitialState: function() {
        return {
            options: {},
            selected: {},
            enableResults: true,
            userID: '',
        };
    },

    componentWillMount: function() {
        this._getUserID();
    },

    render: function() {
        var selectedInfo = Object.keys(this.state.selected).map((k) => { return this.state.selected[k]; });
        var isNextDisabled = selectedInfo.length < 10 ? true : false;
        var restaurant = (selectedInfo.length == 9) ? " Restaurant" : " Restaurants";
        var nextButtonText = isNextDisabled ? "Select " +  (10 - selectedInfo.length) + restaurant : "Next";

        var options = Object.keys(this.state.options).map((k) => { return this.state.options[k]; });

        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
            }}>
                <NavBar
                    navigator={this.props.navigator}
                    onLogout={this._onLogout}
                />
                <View>
                    <Text style={styles.title}>Search Favorite Restaurants</Text>
                    <Text style={styles.subtitle}>Select 10</Text>
                </View>
                <TSurveySearchBarContainer
                    setOptions={this._setSearchOptions}
                />
                <Text> hello</Text>
                <TSurveyArea
                    options={options}
                    selected={selectedInfo}
                />
            </View>
        );
    },

    _setSearchOptions: function(data) {
        var options = JSON.parse(data);
        this.setState({options: options});
    },

    _onLogout: function() {
        this.setState({enableResults: false});
    },

    _onRestaurantRemove: function(id) {
        var selected = this.state.selected;
        delete selected[id];
        this.setState({selected: selected});
    },

    _onRestaurantSelect: function(info) {
        var selected = this.state.selected;

        if (info.id in selected) {
            delete selected[info.id];
        } else {
            info.rating = 5;
            selected[info.id] = info;
        }

        this.setState({selected: selected});
    },

    _onRestaurantSelectRating: function(id, rating) {
        this.state.selected[id].rating = rating;
    },

    _onNextPress: function() {
        // TODO (urlauba): Problems if userID retrieval fails
        var selectedInfo = Object.keys(this.state.selected).map((k) => { return this.state.selected[k]; });
        fetch('http://' + config.hostname+ '/api/survey', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'restaurants': selectedInfo,
                'userID': this.state.userID,
            })
        });

        this.setState({enableResults: false});
        this.props.navigator.push({
            name: 'liveView',
            component: liveView,
        });
        this.props.navigator.popToTop();
    },

    _getUserID: function() {
        AsyncStorage.getItem('userID')
            .then(function(userID) {
                this.setState({userID: userID});
            }.bind(this))
            .catch(function(error) {
                console.log('error retrieving userID from disc' + error);
            });
    },
});

var styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        width: width,
    },
    bottom: {
        flex: 0.88,
        flexDirection: 'column',
    },
    button: {
        color: "#FFFFFF",
    },
    buttonContainer: {
        backgroundColor: '#6BCDFD',
        flex: 0.12,
        justifyContent: 'center',
    },
    mainView: {
        backgroundColor: '#FFFFFF',
        flex: 1,
        flexDirection: 'column',
    },
    sec: {
        backgroundColor: 'blue',
        flex: 1,
        flexDirection: 'column',
    },
    subtitle: {
        color: "#333333",
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    title: {
        color: "#333333",
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    top: {
        flex: 0.12,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

module.exports = TSurveyView;
