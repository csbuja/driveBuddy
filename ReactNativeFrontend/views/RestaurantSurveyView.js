'use strict';

var React = require('react-native');
var SurveyRestaurantSearch = require('../Components/SurveyRestaurantSearch');
var SurveySelectedRestaurantList = require('../Components/SurveySelectedRestaurantList');

var {
    StyleSheet,
    Text,
    View,
} = React;

var RestaurantSurveyView = React.createClass({
    getInitialState: function() {
        return {
            selected: {},
        };
    },

    render: function() {
        var selectedInfo = Object.keys(this.state.selected).map((k) => { return this.state.selected[k]; });

        return (
            <View style={styles.mainView}>
                <Text style={styles.title}>Search resturants you like</Text>
                <Text style={styles.subtitle}>Select at least 10</Text>
                <View>
                    <SurveyRestaurantSearch
                        onPress={this._onRestaurantSelect}
                        needed={selectedInfo}
                    />
                </View>
                <SurveySelectedRestaurantList
                    onRestaurantRemove={this._onRestaurantRemove}
                    restaurantInfo={selectedInfo}
                />
            </View>
        );
    },

    _onRestaurantSelect: function(info) {
        var selected = this.state.selected;
        selected[info.name] = info;
        this.setState({selected: selected});
    },

    _onRestaurantRemove: function(id) {
        console.log('yo');
    },
});

var styles = StyleSheet.create({
    mainView: {
        backgroundColor: 'red',
        flex: 1,
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
