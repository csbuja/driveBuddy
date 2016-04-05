'use strict';

var React = require('react-native');

var Button = require('react-native-button');
var Dimensions = require('Dimensions');
var FBLoginTopBar = require('../Components/FBLoginTopBar.js')
var liveView = require('./liveView');
var SurveyRestaurantSearch = require('../Components/SurveyRestaurantSearch');
var SurveySelectedRestaurantList = require('../Components/SurveySelectedRestaurantList');

var {
    AsyncStorage,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} = React;

var { width } = Dimensions.get('window');

var RestaurantSurveyView = React.createClass({
    getInitialState: function() {
        return {
            selected: {},
            showSearchResults: true,
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

        return (
            <View style={styles.mainView}>
                <TouchableHighlight style={styles.circleButton} onPress={this.onBack}>
                    <View style={styles.container}>
                        <FBLoginTopBar navigator={this.props.navigator}/>
                    </View>
                </TouchableHighlight>
                <View style={styles.top}>
                    <Text style={styles.title}>Search Favorite Restaurants</Text>
                    <Text style={styles.subtitle}>Select 10</Text>
                </View>
                <View style={styles.bottom}>
                    <Image
                        style={styles.background}
                        source={require('../Images/london.jpg')}>
                        <SurveyRestaurantSearch
                            onPress={this._onRestaurantSelect}
                            showSearchResults={this.state.showSearchResults}
                        />
                        <SurveySelectedRestaurantList
                            onRestaurantRemove={this._onRestaurantRemove}
                            onRestaurantSelectRating={this._onRestaurantSelectRating}
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

    _onRestaurantRemove: function(id) {
        var selected = this.state.selected;
        delete selected[id];
        this.setState({selected: selected});
    },

    _onRestaurantSelect: function(info) {
        var selected = this.state.selected;
        info.rating = 5;
        selected[info.id] = info;
        this.setState({selected: selected});
    },

    _onRestaurantSelectRating: function(id, rating) {
        this.state.selected[id].rating = rating;
    },

    _onNextPress: function() {
        // TODO (urlauba): Problems if userID retrieval fails
        var selectedInfo = Object.keys(this.state.selected).map((k) => { return this.state.selected[k]; });
        fetch('http://73.161.192.135:3000/api/survey', {
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

        this.setState({showSearchResults: false});
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
    circleButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        margin: 5,
        borderRadius: 500
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
    container: {
        alignItems: 'center',
        paddingTop: 22,
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

module.exports = RestaurantSurveyView;
