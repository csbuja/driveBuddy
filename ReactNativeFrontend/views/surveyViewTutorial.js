'use strict';


var NavBar = require('../Components/NavBar');
var React = require('react-native');
var liveView = require('./liveView');
var RestaurantSurveyView= require('./RestaurantSurveyView');

var {
    Dimensions,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    Image
} = React;

var { height, width } = Dimensions.get('window');

var liveViewTutorial = React.createClass({
    watchID: (null: ?number),

    getInitialState: function() {
        return {

        };
    },




    render: function(){
        
        return (
        <View style={styles.liveViewTutorialImageContainer}>     
        <TouchableWithoutFeedback onPressOut= {this._goToSurveyView } style={styles.liveViewTutorialImageContainer}>
            <Image source={require('../Images/SurveyViewTutorial.png')} style={styles.liveViewTutorialImageContainer} />
        </TouchableWithoutFeedback>
        </View>
        
        );
    },
    _goToSurveyView: function(){
        var surveyView = {
          name: 'RestaurantSurveyView',
          component: RestaurantSurveyView,
        };
        this.props.navigator.push(surveyView)
        this.props.navigator.popToTop();
    }
});

var styles = StyleSheet.create({
    liveViewTutorialImageContainer: {
        height: height,
        width: width
    }
});

module.exports = liveViewTutorial;