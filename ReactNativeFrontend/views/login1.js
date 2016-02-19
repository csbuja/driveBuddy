'use strict';
var React = require('react-native');
var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var {
  AppRegistry,
  StyleSheet,
  View,
  PropTypes,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
  NativeModules
} = React;

var RestaurantSurveyView= require('./RestaurantSurveyView');

var FBLogin = require('react-native-facebook-login');
//var FBLoginMock = require('./facebook/FBLoginMock.js');
var { FBLoginManager } = NativeModules;

var FB_PHOTO_WIDTH = 200;

var Login1 = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: ''
    }
  },
  onBack : function() {
            this.props.navigator.pop();
  },

  onPressLogin : function() {
      this.props.navigator.push({
          name: 'RestaurantSurveyView',
          component: RestaurantSurveyView,
      });
      this.props.navigator.popToTop();
  },

  render: function() {
    var onBack = this.onBack;
    return (
        <View style={styles.container}>
            <Image style={styles.bg} source={{uri: 'http://i.imgur.com/xlQ56UK.jpg'}} />
            <View style={styles.header}>
                <Text>Pitstop Pal</Text>
            </View>
            <View style={styles.inputs}>

            </View>
            <TouchableHighlight onPress={() => this.onPressLogin()}>
            <View style={styles.signin}>
                <FBLogin style={styles.signin} onCancel={function(){
                    console.log('CANNCCELLLLEd');
                    onBack();
          }}/>
            </View>
            </TouchableHighlight>
        </View>
    );
  }
});



var styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .5,
        backgroundColor: 'transparent'
    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#FF3366',
        padding: 20,
        alignItems: 'center'
    },
    signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15
    },
    inputs: {
        marginTop: 10,
        marginBottom: 10,
        flex: .25
    },
    inputPassword: {
        marginLeft: 15,
        width: 20,
        height: 21
    },
    inputUsername: {
      marginLeft: 15,
      width: 20,
      height: 20
    },
    inputContainer: {
        padding: 10,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent'
    },
    input: {
        position: 'absolute',
        left: 61,
        top: 12,
        right: 0,
        height: 20,
        fontSize: 14
    },
    forgotContainer: {
      alignItems: 'flex-end',
      padding: 15,
    },
    greyFont: {
      color: '#D8D8D8'
    },
    whiteFont: {
      color: '#FFF'
    }
})


module.exports = Login1;
