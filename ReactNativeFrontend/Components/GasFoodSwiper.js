'use strict';

var React = require('react-native');
var Spinner = require('react-native-gifted-spinner');
var Swiper = require('react-native-swiper');

var {
    Dimensions,
    Image,
    StyleSheet,
    PropTypes,
    Text,
    View,
    TouchableHighlight,
    TouchableNativeFeedback
} = React;

var { height, width } = Dimensions.get('window');

var i = 0;

var GasFoodSubSwiper = React.createClass({
    propTypes: {
        hasSetOptions: PropTypes.func.isRequired,
        onSwipe: PropTypes.func.isRequired,
        options: PropTypes.array.isRequired,
        placeContainerOffset: PropTypes.number.isRequired,
        swiperWidth: PropTypes.number.isRequired,
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (nextProps.hasNewOptions) {
            this.props.hasSetOptions();
            return true;
        }
        return false;
    },

    _onMomentumScrollEnd: function (e, swiperState, context) {
        var index = swiperState.index;
        this.props.onSwipe(index);
    },

    render: function(){
        var imageSize = width * .2;

        return (
            <Swiper
                onMomentumScrollEnd={this._onMomentumScrollEnd}
                height={imageSize}
                nextButton={<Text style={styles.swiperButton}>›</Text>}
                prevButton={<Text style={styles.swiperButton}>‹</Text>}
                showsButtons={true}
                showsPagination={false}
                width={this.props.swiperWidth}>
                {this.props.options.map((place) => {
                    var price = (
                        <Text numberOfLines={1} style={styles.subText}>
                            {"$" + place.price + " regular"}
                        </Text>
                    );

                    var score = (
                        <Text numberOfLines={1} style={styles.subText}>
                            {place.score + " stars"}
                        </Text>
                    );

                    var numberOfTitleLines = height < 600
                        ? 1
                        : 2;

                    return (
                        <View
                            style={[styles.placeContainer, {
                                marginLeft: this.props.placeContainerOffset / 2,
                                marginRight: this.props.placeContainerOffset / 2,
                            }]}
                            key={i++}>
                            <Image
                                style={[styles.image, { height: imageSize, width: imageSize, }]}
                                source={{uri: place.image}}
                            />
                            <View style={styles.textContainer}>
                                <Text style={styles.name} numberOfLines={numberOfTitleLines}>{place.name}</Text>
                                {place.price && price}
                                {place.score && score}
                                <Text numberOfLines={1} style={styles.subText}>{place.distance + " miles"}</Text>
                            </View>
                        </View>
                    );
                })}
            </Swiper>
        );
    }
});

var GasFoodSwiper = React.createClass({
    propTypes: {
        hasSetOptions: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        onSwipe: PropTypes.func,
        options: PropTypes.array.isRequired,
        placeContainerOffset: PropTypes.number.isRequired,
        swiperWidth: PropTypes.number.isRequired,
    },

    getInitialState: function(){
        return {error_message:  "Sorry, no PitstOptions right now!"}
    },

    render: function() {
        var content = (
            <GasFoodSubSwiper
                hasNewOptions={this.props.hasNewOptions}
                hasSetOptions={this.props.hasSetOptions}
                onSwipe={this.props.onSwipe}
                options={this.props.options}
                placeContainerOffset={this.props.placeContainerOffset}
                swiperWidth={this.props.swiperWidth}
            />
        );

        if (this.props.loading) {
            content = (
                <View style={styles.spinnerContainer}>
                    <Spinner size={'large'} />
                </View>
            );
        } else if (!this.props.options.length) {
            content = (
                <View style={styles.spinnerContainer}>
                    <Text>{this.state.error_message}</Text>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                {content}
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingBottom: 6
    },
    image: {
        borderRadius: 5,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    placeContainer: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    spinnerContainer: {
        // match StartRouteGuidanceButton height + Swiper height
        height: Math.min(height * .075, 44) + (width * .2),
        justifyContent: 'center',
    },
    subText: {
        fontSize: 16,
    },
    swiperButton: {
        color: '#cccccc',
        fontFamily: 'Arial',
        fontSize: 50,
    },
    textContainer: {
        alignSelf: 'stretch',
        flexDirection: 'column',
        justifyContent: 'center',
        width: width * .45,
    },
});

module.exports = GasFoodSwiper;
