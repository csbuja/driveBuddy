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

var Swiper = require('react-native-swiper');
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
        return this.props.tutorialMessages.length -1 > (this.state.message_index ) ? "Next Hint" : "Get Started!";
    },

  _setModalVisible: function(visible) {
    this.setState({modalVisible: visible});
  },


  render: function() {
    return (
      <View style={styles.darkerContainer}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}

          >
          <Swiper
                height={height}
                width={width}
                nextButton={<Text style={styles.swiperButton}>›</Text>}
                prevButton={<Text style={styles.swiperButton}>‹</Text>}
                showsButtons={true}
                showsPagination={true}>
         <View style={[{marginTop: 22}, styles.darkerContainer]}>
          <View>
            <Text style={{color: "white"}}>Pitstop Pal Tutorial: </Text>
            <Text style={{color: "white"}}>{this.props.tutorialMessages[this.state.message_index]}</Text>
            <Image source={require('../Images/gsd2.gif')} />
            <TouchableHighlight onPress={() => {
              if (this.props.tutorialMessages.length -1 == this.state.message_index ) this._setModalVisible(!this.state.modalVisible)
              this._incrementIndex()
            }}>
              <Text style={{color: "white"}}>{this._tutorialText()}</Text>
            </TouchableHighlight>

          </View>
         </View>
         <View style={[{marginTop: 22}, styles.darkerContainer]}>
          <View>
            <Text style={{color: "white"}}>Pitstop Pal Tutorial: </Text>
            <Text style={{color: "white"}}>{this.props.tutorialMessages[this.state.message_index]}</Text>
            <Image source={require('../Images/gsd2.gif')} />
            <TouchableHighlight onPress={() => {
              if (this.props.tutorialMessages.length -1 == this.state.message_index ) this._setModalVisible(!this.state.modalVisible)
              this._incrementIndex()
            }}>
              <Text style={{color: "white"}}>{this._tutorialText()}</Text>
            </TouchableHighlight>

          </View>
         </View>
         </Swiper>
        </Modal>
      </View>
    );
  }
});

var salmon = '#FF3366'

var styles = StyleSheet.create({
    darkerContainer: {
    opacity: 0.95,
    backgroundColor: salmon,
   
    },
    putInCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    }
});

module.exports = Tutorial;
