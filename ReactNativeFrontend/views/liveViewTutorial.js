'use strict';


var NavBar = require('../Components/NavBar');
var React = require('react-native');
var liveView = require('./liveView');

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

    componentDidMount: function() {
        

        

        
    },

    componentWillUnmount: function() {
    
    },



    render: function(){
        
        return (
        <View style={styles.liveViewTutorialImageContainer}>     
        <TouchableWithoutFeedback onPressOut= {this._goToLiveView } style={styles.liveViewTutorialImageContainer}>
            <Image source={require('../Images/LiveViewTutorial.png')} style={styles.liveViewTutorialImageContainer} />
        </TouchableWithoutFeedback>
        </View>
        
        );
    },
    _goToLiveView: function(){
        var live = {
          name: 'liveView',
          component: liveView,
        };
        console.log('getting pressed')
        this.props.navigator.push(live)
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