'use strict';

var React = require('react-native');
var SearchBar = require('react-native-search-bar');
var SurveyListView = require('../Components/SurveyListView');

var {
    StyleSheet,
    Text,
    View,
} = React;

var RestaurantSurveyView = React.createClass({
    componentDidMount: function() {
        this.refs.searchBar.focus();
    },

    getInitialState: function() {
        return {
            query: '',
            selected: [],
            options: [],
        };
    },

    render: function() {
        return (
            <View style={styles.mainView}>
                <SearchBar
                    ref='searchBar'
                    placeholder='Search'
                    onChangeText={this._onTextChange}
                    onSearchButtonPress={this._onSearchButtonPress}
                    onCancelButtonPress={this._onCancelButtonPress}
                />
                <SurveyListView
                    data={this.state.options}
                />
            </View>
        );
    },

    _onTextChange: function(text) {
        this.setState({query: text});
        // will change lat and lon later
        fetch('http://localhost:3000/yelp/search/37.788022/-122.399797/' + text)
            .then((response) => response.text())
            .then((responseText) => {
                var data = JSON.parse(responseText);
                var arr = Object.keys(data).map(function(k) { return data[k] });

                this.setState({options: arr});
            })
            .catch((error) => {
                // need to add error handling
                console.log('error')
            })
    },

    _onSearchButtonPress: function() {

    },

    _onCancelButtonPress: function() {

    },
});

var styles = StyleSheet.create({
    mainView: {
        backgroundColor: 'red',
        height: 440,
    }
});

module.exports = RestaurantSurveyView;
