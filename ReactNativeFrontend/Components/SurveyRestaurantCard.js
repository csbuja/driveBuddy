'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/FontAwesome');
var SurveyRestaurantCard = require('./SurveyRestaurantCard');

var {
    Image,
    PropTypes,
    StyleSheet,
    Text,
    View,
} = React;

var SurveyRestaurantCard = React.createClass({
    propTypes: {
        onRestaurantRemove: PropTypes.func.isRequired,
        info: PropTypes.object.isRequired,
    },

    render: function() {
        return (
            <View style={styles.mainView}>
                <Image
                    style={styles.thumbnail}
                    resizeMode="cover"
                    source={{uri: this.props.info.image}}
                />
                <View style={styles.infoSec}>
                    <Text style={[styles.text, styles.name]}>
                        {this.props.info.name}
                    </Text>
                    <Text style={styles.text}>
                        {this.props.info.rating + " Stars"}
                    </Text>
                    <Text style={styles.text}>
                        {this.props.info.address}
                    </Text>
                </View>
                <Icon
                    style={styles.closeButton}
                    name="close"
                    size={20}
                    color="#0080ff"
                    onPress={this._onRemovePress}
                />
            </View>
        );
    },

    _onRemovePress: function() {
        this.props.onRestaurantRemove(this.props.info.id);
    },
});

var styles = StyleSheet.create({
    closeButton: {
        alignSelf: 'flex-start',
        flex: 0.08,
        margin: 5,
        overflow: 'hidden',
    },
    mainView: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        width: 350,
    },
    infoSec: {
        flex: 0.92,
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginLeft: 12,
    },
    text: {
        flex: 1,
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    thumbnail: {
        height: 100,
        width: 100,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    }
});

module.exports = SurveyRestaurantCard;
