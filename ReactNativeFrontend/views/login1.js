'use strict';
var React = require('react-native');
var { FBLogin, FBLoginManager } = require('react-native-facebook-login');

var Dimensions = require('Dimensions');
var windowSize = Dimensions.get('window');

var {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  View,
  PropTypes,
  Text,
  TextInput,
  TouchableHighlight,
  Image,
} = React;

var RestaurantSurveyView= require('./RestaurantSurveyView');
var liveView = require('./liveView');

//var FBLoginMock = require('./facebook/FBLoginMock.js');

var FB_PHOTO_WIDTH = 200;

var Login1 = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: ''
    }
  },
  onBack : function() {
            console.log('should be poppping')
            this.props.navigator.popToTop();
  },

  onPressLogin : function(userID) {
      var surveyView = {
          name: 'RestaurantSurveyView',
          component: RestaurantSurveyView,
      };
      var live = {
          name: 'liveView',
          component: liveView,
      };
      fetch('http://localhost:3000/api/check/survey/' + userID)
      .then((response) => response.text())
      .then((responseText) => {
        if (responseText == 'Existing survey') {
          this.props.navigator.push(live);
        }
        else {
          this.props.navigator.push(surveyView);
        }
      })
      .catch((error) => {
      // TODO (urlauba): handle error state
        console.log('error getting response for existence of survey');
        this.props.navigator.push(surveyView);
     });
      this.props.navigator.popToTop();
  },

  setUserID: function(userID, callback) {
      AsyncStorage.setItem('userID', '' + userID + '')
          .then(function() {
              callback(userID);
          })
          .catch(function(error) {
              console.log('error saving userID to disc' + error)
          });
  },

  render: function() {
    var onBack = this.onBack;
    var onPressLogin = this.onPressLogin;
    var setUserID = this.setUserID;

    return (
        <View style={styles.container}>
            <Image style={styles.bg} source={{uri: 'http://i.imgur.com/xlQ56UK.jpg'}} />
            <View style={styles.header}>
                <Text>Pitstop Pal</Text>
            </View>
            <View style={styles.inputs}>

            </View>
            <TouchableHighlight>
            <View style={styles.signin}>
                <FBLogin style={styles.signin} onCancel={function(){
                    onBack();
                }}
                onLogin={function(data){
                    // need as callback otherwise userID may not be updated in next view
                    setUserID(data['credentials']['userId'], onPressLogin);
                }}
                onLoginFound={function(data) { // may not need onLoginFound, useful for developing
                    setUserID(data['credentials']['userId'], onPressLogin);
                }}
                />
            </View>
            </TouchableHighlight>
        </View>
    );
  },
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
