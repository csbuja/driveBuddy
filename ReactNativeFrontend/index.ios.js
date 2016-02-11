'use strict';

var React = require('react-native');

var FoodSwiperContainer = require('./Components/FoodSwiperContainer.js');
var GasSwiperContainer = require('./Components/GasSwiperContainer.js');

var {
    AppRegistry,
    Component,
    StyleSheet,
    View,
    Navigator
} = React;

var fakeOptions = [
    {
        name: "Shell",
        image: "http://facebook.github.io/react/img/logo_og.png",
        distance: "23 miles",
        price: "$3.00 / gal",
    },
    {
        name: "In & Out",
        image: "http://facebook.github.io/react/img/logo_og.png",
        distance: "43 miles",
        stars: 4,
    },
];

var LoginScreen = require('./views/login1');
var noOptions = [];

var loginroute = {
        component: LoginScreen,
        title: 'My View Title',
        passProps: {}
}

var App = React.createClass({
    render: function() {
        return (    
             <Navigator
    initialRoute={loginroute}   
    renderScene={(route, navigator) =>
      <LoginScreen
        name={route.title}
        onForward={() => {
          var nextIndex = route.index + 1;
          navigator.push({
            name: 'Scene ' + nextIndex,
            index: nextIndex,
          });
        }}
        onPressLogin={ () => {
            var next = {
            name: 'liveView',
            component: liveView
            };
            console.log(next);
            this.props.navigator.push(next);
        }}
        onBack={() => {
          if (route.index > 0) {
            navigator.pop();
          }
        }}
      />
    }/>);
    }
});



var liveView = React.createClass({
    render: function(){
        return( <View style={styles.liveView}>
<FoodSwiperContainer
                    style={styles.borderBottom}
                />
                <GasSwiperContainer
                    style={styles.borderBottom}
                />
 </View>);
    }
});
/*

*/
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
    }
});

AppRegistry.registerComponent('dri', () => App);
