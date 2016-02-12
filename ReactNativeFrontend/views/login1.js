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

var liveView= require('./liveView');

var FBLogin = require('react-native-facebook-login');
//var FBLoginMock = require('./facebook/FBLoginMock.js');
var { FBLoginManager } = NativeModules;

console.log(FBLoginManager)

var FB_PHOTO_WIDTH = 200;

var Login1 = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      password: ''
    }
  },

  onForward: function() {
          var nextIndex = route.index + 1;
          this.props.navigator.push({
            name: 'Scene ' + nextIndex,
            index: nextIndex,
          });
        },

  onPressLogin : function() {
      var next = {
      name: 'liveView',
      component: liveView
      };
      
      this.props.navigator.push(next);
      this.props.navigator.popToTop();
      //console.log(this.props.navigator.getCurrentRoutes());
  },

  onBack : function() {
    if (route.index > 0) {
      this.props.navigator.pop();
    }
  },
  render: function() {
    return (
        <View style={styles.container}>
            <Image style={styles.bg} source={{uri: 'http://i.imgur.com/xlQ56UK.jpg'}} />
            <View style={styles.header}>
                <Image style={styles.mark} source={{uri: 'http://i.imgur.com/da4G0Io.png'}} />
            </View>
            <View style={styles.inputs}>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputUsername} source={{uri: 'http://i.imgur.com/iVVVMRX.png'}}/>
                    <TextInput 
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Username"
                        placeholderTextColor="#FFF"
                        value={this.state.username}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputPassword} source={{uri: 'http://i.imgur.com/ON58SIG.png'}}/>
                    <TextInput
                        password={true}
                        style={[styles.input, styles.whiteFont]}
                        placeholder="Pasword"
                        placeholderTextColor="#FFF"
                        value={this.state.password}
                    />
                </View>
                <View style={styles.forgotContainer}>
                    <Text style={styles.greyFont}>Forgot Password</Text>
                </View>
            </View>
            <TouchableHighlight onPress={() => this.onPressLogin()}>
            <View style={styles.signin}>
                <FBLogin style={{ marginBottom: 10, }}/>
            </View>
            </TouchableHighlight>
            <View style={styles.signup}>
                <Text style={styles.greyFont}>No account?<Text style={styles.whiteFont}>  Sign Up</Text></Text>
            </View>
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