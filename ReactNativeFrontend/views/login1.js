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



const initialDescription = "Your Personalized Driving Assistant";
var FB_PHOTO_WIDTH = 200;

var Login1 = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: '',
      descriptiontext: initialDescription,
      token: ''
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
 //due to bug filing where users navigate to page, and they are logged in. didn't get to root of issue.
 FBLoginManager.logout(function(){});
         // First set up animation 
 this._animation = Animated.timing(this._animatedValue, {
        toValue: 100,
        duration: 5000
    })
    
  },

  _initiateLoginBehavior: function(){
     this.setState({descriptiontext:"Logging you in!"});
     this._animation.start(); 
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
      var surveyViewTut = {
          name: 'surveyViewTutorial',
          component: surveyViewTutorial,
      };
      console.log('checking survey for user')
      fetch('http://' + config.hostname+ '/api/survey/check/' + userID,{method: 'POST',
                      headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          token : this.state.token})})
      .then((response) => response.text())
      .then((responseText) => {
        Answers.logLogin('Facebook', true); //telemetry
        console.log(responseText)
        console.log(this.state.token)
 
        if (responseText == 'Existing survey') {
          this.props.navigator.push(live);
        }
        else if (responseText == 'Invalid Token') {
          this.onBack();
        }
        else {
          var surveyView = {
          name: 'RestaurantSurveyView',
          component: RestaurantSurveyView,
        };
        this.props.navigator.push(surveyView)
          this.props.navigator.push(surveyView);
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
    var self = this;

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
            <TouchableHighlight style={styles.signin}>
            <View style={styles.signin}>
                <FBLogin style={[styles.signin,styles.fblogin]} onCancel={function(){
                    onBack();
                }}
                onLogin={function(data){
                    // need as callback otherwise userID may not be updated in next view
                    self._initiateLoginBehavior.bind(self)()
                    fetch('http://' + config.hostname+ '/api/login', {
                      method: 'POST',
                      headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                          token : data['credentials']['token'],
                          userid : data['credentials']['userId']
                      })
                    }).then(function(result){
                      self.setState({token: data['credentials']['token']})
              
                      AsyncStorage.setItem('token', data['credentials']['token'])
                      .then(function() {
                        AsyncStorage.getItem('token').then(function(t){
                          
                          setUserID(data['credentials']['userId'], onPressLogin);
                        })
                        
                      })
                      .catch(function(error) {
                          console.log('error saving userID to disc' + error)
                      });
                    });
                    
                }}
                />
            </View>
            </TouchableHighlight>
            <View style={styles.header}>
                <Text>{this.state.descriptiontext}</Text>
            </View>
            <View style={styles.inputs}>

            </View>
            
            
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
        backgroundColor: "#fff",
        padding: 20,
        alignItems: 'center',
        
    },
    fblogin:{
      
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
