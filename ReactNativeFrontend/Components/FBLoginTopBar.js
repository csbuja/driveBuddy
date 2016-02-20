var React = require('react-native');

var {
	NativeModules,
	StyleSheet
} = React;

var Login1 = require('../views/login1');

var FBLogin = require('react-native-facebook-login');
var { FBLoginManager } = NativeModules;

var FBLoginTopBar = React.createClass({

	//we must add navigator to props
	toLoginBack:function(){
        this.props.navigator.popToTop(); 
    },
	render: function(){
		var toLoginBack = this.toLoginBack;
		return(<FBLogin style={styles.button} onLogout={function(){
                    console.log('CANNCCELLLLEd');
                    toLoginBack();
          }}/>);
	}
});

var styles = StyleSheet.create({
    button: {
        backgroundColor:'#FFFFFF'
    }
});


module.exports = FBLoginTopBar;