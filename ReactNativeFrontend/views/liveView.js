'use strict';

var React = require('react-native');

var {
    AppRegistry,
    Component,
    StyleSheet,
    View,
    NavigatorIOS,
    TouchableHighlight,
    Text,
     NativeModules
} = React;


var FoodSwiperContainer = require('../Components/FoodSwiperContainer.js');
var GasSwiperContainer = require('../Components/GasSwiperContainer.js');
var FBLogin = require('react-native-facebook-login');
var { FBLoginManager } = NativeModules;
var liveView = React.createClass({

    onBack : function() {
            this.props.navigator.pop();
    },
  
    render: function(){
        return( 
             
            <View style={styles.liveView}>
            <TouchableHighlight style={styles.circleButton} onPress={this.onBack}>
                <View>
                 <FBLogin />
                 </View>
             </TouchableHighlight>
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
    circleButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        margin: 5,
        borderRadius: 500
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