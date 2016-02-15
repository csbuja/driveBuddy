'use strict';

var React = require('react-native');
var SearchBar = require('react-native-search-bar');

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
            </View>
        );
    },

    _onTextChange: function(text) {
        this.setState({query: text});
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
