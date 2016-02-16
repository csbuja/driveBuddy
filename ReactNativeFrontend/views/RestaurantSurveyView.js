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
            selected: {},
            options: [],
        };
    },

    render: function() {
        return (
            <View style={styles.mainView}>
                <Text style={styles.title}>Search resturants you like</Text>
                <Text style={styles.subtitle}>Select at least 10</Text>
                <View>
                    <SearchBar
                        ref='searchBar'
                        placeholder='Search'
                        onChangeText={this._onTextChange}
                        onSearchButtonPress={this._onSearchButtonPress}
                        onCancelButtonPress={this._onCancelButtonPress}
                    />
                    <SurveyListView
                        data={this.state.options}
                        onPress={this._onRestaurantSelect}
                    />
                </View>
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

    _onRestaurantSelect: function(info) {
        this.state.selected[info.name] = info;
        console.log(this.state.selected)
    },
});

var styles = StyleSheet.create({
    mainView: {
        backgroundColor: 'red',
        height: 640,
        paddingTop: 50,
    },
    subtitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    title: {
        color: "#FFFFFF",
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

module.exports = RestaurantSurveyView;
