'use strict';

var React = require('react-native');

var {
    AppRegistry,
    Component,
    StyleSheet,
    View,
    NavigatorIOS
} = React;


var FoodSwiperContainer = require('../Components/FoodSwiperContainer.js');
var GasSwiperContainer = require('../Components/GasSwiperContainer.js');

var liveView = React.createClass({
    render: function(){
        return( <View style={styles.liveView}>
                <  FoodSwiperContainer
                    style={styles.borderBottom}/>
                <GasSwiperContainer
                    style={styles.borderBottom}/>
 </View>);
    }
});

var styles = StyleSheet.create({
    liveView: {
        backgroundColor:'#FFFFFF',
        paddingTop: 28, // temporary
    },
    borderBottom: {
        borderBottomWidth: 2,
        borderColor: '#000000',
        marginBottom: 10,
        marginLeft: 80,
        marginRight: 80,
    },
    wrapper: {
        flex: 1,
    }
});

module.exports = liveView;