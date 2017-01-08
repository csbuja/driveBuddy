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
    Modal,
    TouchableHighlight
} = React;

var { height, width } = Dimensions.get('window');


var Tutorial = React.createClass({
    propTypes: {
        tutorialMessages: PropTypes.array.isRequired
    },

    getInitialState: function(){
        return {modalVisible: true,message_index:0}
    },

    _incrementIndex: function(){
        this.setState({message_index: this.state.message_index + 1});
    },

    _tutorialText : function()
    {
        return this.props.tutorialMessages.length -1 > (this.state.message_index ) ? "Next Hint" : "Close Tutorial";
    },

  _setModalVisible: function(visible) {
    this.setState({modalVisible: visible});
  },

  render: function() {
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={[{marginTop: 22}, styles.darkerContainer]}>
          <View>
            <Text style={{color: "white"}}>Pitstop Pal Tutorial: </Text>
            <Text style={{color: "white"}}>{this.props.tutorialMessages[this.state.message_index]}</Text>

            <TouchableHighlight onPress={() => {
              if (this.props.tutorialMessages.length -1 == this.state.message_index ) this._setModalVisible(!this.state.modalVisible)
              this._incrementIndex()
            }}>
              <Text style={{color: "white"}}>{this._tutorialText()}</Text>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>
      </View>
    );
  }
});

var styles = StyleSheet.create({
    darkerContainer: {
    opacity: 0.95,
    backgroundColor: 'black',
    }
});

module.exports = Tutorial;
