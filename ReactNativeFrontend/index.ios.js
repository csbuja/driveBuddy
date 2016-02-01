'use strict';

var React = require('react-native');

var FoodSwiperContainer = require('./Components/FoodSwiperContainer.js');
var GasSwiperContainer = require('./Components/GasSwiperContainer.js');

var {
    AppRegistry,
    Component,
    StyleSheet,
    View
} = React;

var App = React.createClass({
    render: function() {
        return (
            <View style={styles.liveView}>
                <FoodSwiperContainer
                    style={styles.borderBottom}
                />
                <GasSwiperContainer
                    style={styles.borderBottom}
                />
            </View>
        );
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
        marginTop: 10,
        marginLeft: 80,
        marginRight: 80,
    }
});

AppRegistry.registerComponent('dri', () => App);
