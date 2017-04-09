'use strict';
var React = require('react-native');
var { FBLogin, FBLoginManager } = require('react-native-facebook-login');
var config = require("../config");
var Fabric = require('react-native-fabric');
 
var { Crashlytics, Answers} = Fabric;

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
  Animated,
  Easing
} = React;


//TO DO - remove unneccessary requirements
var RestaurantSurveyView= require('./RestaurantSurveyView');
var liveView = require('./liveView');
var surveyViewTutorial = require('./surveyViewTutorial');
//var FBLoginMock = require('./facebook/FBLoginMock.js');


const initialDescription = "Your Personalized Driving Assistant";
var FB_PHOTO_WIDTH = 200;

var Login1 = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
      descriptiontext: initialDescription
    }
  },
  onBack : function() {
            console.log('should be poppping')
            this.props.navigator.popToTop();
  },
componentWillMount:function(){
this._animatedValue = new Animated.Value(0);

},
  componentDidMount:function(){
         // First set up animation 
 this._animation = Animated.timing(this._animatedValue, {
        toValue: 100,
        duration: 5000
    })
    
  },

  onPressLogin : function(userID) {
    this.setState({descriptiontext:"Loading your data!"});
    this._animation.start(); 
    
      var surveyView = {
          name: 'RestaurantSurveyView',
          component: RestaurantSurveyView,
      };
      var live = {
          name: 'liveView',
          component: liveView,
      };
      var surveyViewTut = {
          name: 'surveyViewTutorial',
          component: surveyViewTutorial,
      };

      fetch('http://' + config.hostname+ '/api/check/survey/' + userID)
      .then((response) => response.text())
      .then((responseText) => {
        Answers.logLogin('Facebook', true); //telemetry

 
        if (responseText == 'Existing survey') {
          console.log("there is a survey")
          this.props.navigator.push(live);
        }
        else {
          this.props.navigator.push(surveyViewTut);
        }
        var self = this;
        setTimeout(function(){self.setState({descriptiontext:initialDescription})},1000);
      })
      .catch((error) => {
      // TODO (urlauba): handle error state
        console.log('error getting response for existence of survey');
        this.props.navigator.push(surveyViewTut);
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
     

     var interpolatedRotateAnimation = this._animatedValue.interpolate({
        inputRange: [0, 100],
      outputRange: ['0deg', '1080deg']
    });
    return (
        <View style={styles.container}>
            
            <View style={styles.bg}  />
            <Image source={require('../Images/PitstopPalLogoPNG.png')} style={{backgroundColor:"#FFFFFF", paddingTop:windowSize.height/3,borderRadius:10,width: windowSize.width,  flex: 1} }/>
            <View style={{flex:1,
        alignItems:'center'}}>
            <Animated.Image
            style={{transform: [{rotate: interpolatedRotateAnimation}] }}
            source={require('../Images/Icon-76.png')} />
            </View>
            <View style={styles.header}>
                <Text>{this.state.descriptiontext}</Text>
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
                    //console.log(data['credentials']);
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

var salmon = '#FF3366'

var styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
    },
    bg: {
        position: 'absolute',
        backgroundColor: salmon,
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
        backgroundColor: salmon,
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
