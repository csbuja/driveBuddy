'use strict';
var React = require('react-native');
var {
    Dimensions,
    Image,
    StyleSheet,
    PropTypes,
    Text,
    View,
    TouchableWithoutFeedback,
    Modal
} = React;

var { height, width } = Dimensions.get('window');


var Tutorial = React.createClass({
    propTypes: {
        tutorialMessages: PropTypes.array.isRequired
    },

    getInitialState: function(){
        return {message_index:0}
    },

    _incrementIndex: function(){
        console.log("hello world")
        this.setState({message_index: this.state.message_index + 1});
    },
    _backgroundColored: function() {
      if(this.props.tutorialMessages.length && this.props.tutorialMessages.length > this.state.message_index) {
        return styles.darkerContainer;
      } else {
        return styles.transparentContainer;
      }
    },    

    render: function() {
        if (this.props.tutorialMessages.length && this.props.tutorialMessages.length > this.state.message_index) {

            var content = (

                <View style={styles.tutorialContainer}>
                <TouchableWithoutFeedback onPress={this._incrementIndex} >
                    
                </TouchableWithoutFeedback>
                </View>
            );
        }

        return (
            <View style={[this._backgroundColored()]}>
            <TouchableWithoutFeedback  onPressIn={this._incrementIndex}>
                
                <Text>{this.props.tutorialMessages[this.state.message_index]}</Text>
            </TouchableWithoutFeedback >
            </View>
        );
    }
});

var styles = StyleSheet.create({
    darkerContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.9,
    backgroundColor: 'black',
    width: width,
    height:height
    },
    transparentContainer: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0,
    backgroundColor: 'white',
    width: width,
    height:height
    }  

});

module.exports = Tutorial;
