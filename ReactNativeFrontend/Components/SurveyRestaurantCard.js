'use strict';

var Icon = require('react-native-vector-icons/FontAwesome');
var React = require('react-native');
var StarRating = require('react-native-star-rating').default;
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
        info: PropTypes.object.isRequired,
        onRestaurantRemove: PropTypes.func.isRequired,
        onRestaurantSelectRating: PropTypes.func.isRequired,
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
                    <View>
                        <Text
                            numberOfLines={1}
                            style={styles.name}>
                            {this.props.info.name}
                        </Text>
                        <Text numberOfLines={1}>
                            {this.props.info.address}
                        </Text>
                    </View>
                    <StarRating
                        rating={this.props.info.rating}
                        selectedStar={this._onSelectRating}
                        starColor={'#FF3366'}
                        starSize={25}
                    />
                </View>
                <Icon
                    style={styles.closeButton}
                    name="close"
                    size={20}
                    color={'#CCCCCC'}
                    onPress={this._onRemovePress}
                />
            </View>
        );
    },

    _onRemovePress: function() {
        this.props.onRestaurantRemove(this.props.info.id);
    },

    _onSelectRating: function(rating) {
        this.props.onRestaurantSelectRating(this.props.info.id, rating);
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
        height: 80,
        justifyContent: 'space-around',
        marginLeft: 12,
    },
    thumbnail: {
        height: 100,
        width: 100,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

module.exports = SurveyRestaurantCard;
