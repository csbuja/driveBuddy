'use strict';

var React = require('react-native');

var Button = require('react-native-button');
var Dimensions = require('Dimensions');
var SurveyRestaurantSearch = require('../Components/SurveyRestaurantSearch');
var SurveySelectedRestaurantList = require('../Components/SurveySelectedRestaurantList');

var {
    Image,
    StyleSheet,
    Text,
    View,
} = React;

var { width } = Dimensions.get('window');

var RestaurantSurveyView = React.createClass({
    getInitialState: function() {
        return {
            selected: {},
        };
    },

    render: function() {
        var selectedInfo = Object.keys(this.state.selected).map((k) => { return this.state.selected[k]; });
        var isNextDisabled = selectedInfo.length < 10 ? true : false;
        var nextButtonText = isNextDisabled ? "Select 10 Restaurants" : "Next";

        return (
            <View style={styles.mainView}>
                <View style={styles.top}>
                    <Text style={styles.title}>Search resturants you like</Text>
                    <Text style={styles.subtitle}>Select at least 10</Text>
                </View>
                <View style={styles.bottom}>
                    <Image
                        style={styles.background}
                        source={require('../Images/london.jpg')}>
                        <SurveyRestaurantSearch
                            onPress={this._onRestaurantSelect}
                        />
                        <SurveySelectedRestaurantList
                            onRestaurantRemove={this._onRestaurantRemove}
                            restaurantInfo={selectedInfo}
                        />
                    </Image>
                    <Button
                        containerStyle={styles.buttonContainer}
                        disabled={isNextDisabled}
                        style={styles.button}
                        styleDisabled={styles.button}
                        onPress={this._onNextPress}>
                        {nextButtonText}
                    </Button>
                </View>
            </View>
        );
    },

    _onRestaurantSelect: function(info) {
        var selected = this.state.selected;
        selected[info.id] = info;
        this.setState({selected: selected});
    },

    _onRestaurantRemove: function(id) {
        var selected = this.state.selected;
        delete selected[id];
        this.setState({selected: selected});
    },

    _onNextPress: function() {
        // TODO (urlauba): send survey results to server and handle view change
    },
});

var styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        width: width,
    },
    bottom: {
        flex: 0.8,
        flexDirection: 'column',
    },
    buttonContainer: {
        backgroundColor: '#3399ff',
        flex: 0.12,
        justifyContent: 'center',
    },
    buttonText: {
        color: "#FFFFFF",
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
        flex: 0.2,
        flexDirection: 'column',
        justifyContent: 'center',
    },
});

module.exports = RestaurantSurveyView;
