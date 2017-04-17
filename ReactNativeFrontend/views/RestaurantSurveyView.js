'use strict';

var Button = require('react-native-button');
var Dimensions = require('Dimensions');
var liveViewTutorial = require('./liveViewTutorial');
var NavBar = require('../Components/NavBar');
var React = require('react-native');
var SurveyRestaurantSearch = require('../Components/SurveyRestaurantSearch');
var SurveySelectedRestaurantList = require('../Components/SurveySelectedRestaurantList');
var config = require("../config");

var {
    AsyncStorage,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
    View
} = React;

var Fabric = require('react-native-fabric');
var { Crashlytics, Answers} = Fabric;

var { width, height} = Dimensions.get('window');

var FocusTheSearch= React.createClass({

    toggleShow: function () {
        this.props.handlepress()
    },

    render: function () {
        if (!this.props.searchBarFocused) {
            return (
                <TouchableHighlight  onPress={this.toggleShow} style={styles.focusTheSearch} >
                    <View>
                        <Text style={styles.subtitle}>Start Search Now</Text>
                    </View>
                </TouchableHighlight>
            );
        } else {
            return null;
        }
    }    
});

var RestaurantSurveyView = React.createClass({
    getInitialState: function() {
        return {
            selected: {},
            enableResults: true,
            userID: '',
            searchBarFocused:false,
            ratingsHaventChanged: true

        };
    },

    componentWillMount: function() {
        this._getUserID();
    },  
    _handleClickFocusTheSearch: function(){
        this.setState({
            searchBarFocused: true
        });
    },

    render: function() {
        var selectedInfo = Object.keys(this.state.selected).map((k) => { return this.state.selected[k]; });
        var isNextDisabled = selectedInfo.length < 10 ? true : false;
        var restaurant = (selectedInfo.length == 9) ? " Pitstop" : " Pitstops";
        var nextButtonText = null;

        if (isNextDisabled){
            nextButtonText =  "Select " +  (10 - selectedInfo.length) + restaurant;
        }
        else if(this.state.ratingsHaventChanged){
            nextButtonText = "Please rate a Pitstop!"
        }
        else{
            nextButtonText = "Next!";
        }
        

        return (
            <View style={styles.mainView}>
                <NavBar
                    navigator={this.props.navigator}
                    onLogout={this._onLogout}/>

                <View style={styles.top}>
                    <Text style={styles.title}>Help us recommend food Pistops for you!</Text>
                </View>

                 
                <View style={styles.bottom}>
                    <View
                        style={styles.background}>
                        
                         
                        <SurveyRestaurantSearch
                            enableResults={this.state.enableResults}
                            onPress={this._onRestaurantSelect}
                            selected={this.state.selected}
                            searchBarFocused={this.state.searchBarFocused}
                            dontShowStartSearchNowBox={this._handleClickFocusTheSearch.bind(this)}/>

                        <View style={styles.focusTheSearchWrapper}>
                            <FocusTheSearch  handlepress={this._handleClickFocusTheSearch.bind(this)} searchBarFocused={this.state.searchBarFocused}></FocusTheSearch>
                         </View>
                        <SurveySelectedRestaurantList
                            onRestaurantRemove={this._onRestaurantRemove}
                            onRestaurantSelectRating={this._onRestaurantSelectRating}
                            restaurantInfo={selectedInfo}
                        />
                    </View>


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
        this.setState({ratingsHaventChanged : false});
    },

    _onNextPress: function() {
        // TODO (urlauba): Problems if userID retrieval fails

        if (this.state.ratingsHaventChanged == false){
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
                name: 'liveViewTutorial',
                component: liveViewTutorial,
            });
            Answers.logCustom('Survey Complete', {user: this.state.userID, restaurants:selectedInfo });
            this.props.navigator.popToTop();
        }
        else {

        }
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
    focusTheSearch:{
        width:width/3,
        height:45,
        textAlign: 'center',
        backgroundColor:"#6BCDFD",
        marginTop: height/10
    },

    focusTheSearchWrapper:{
 
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center'
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

module.exports = RestaurantSurveyView;
