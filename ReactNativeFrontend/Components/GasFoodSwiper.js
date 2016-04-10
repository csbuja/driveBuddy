'use strict';

var Icon = require('react-native-vector-icons/FontAwesome');
var React = require('react-native');
var Spinner = require('react-native-gifted-spinner');
var Swiper = require('react-native-swiper');

var {
    Image,
    StyleSheet,
    PropTypes,
    Text,
    View,
    TouchableHighlight,
    TouchableNativeFeedback
} = React;
var i = 0;

var NextPrevButton = React.createClass({
    PropTypes: {
        name: PropTypes.string.isRequired,
    },

    render: function() {
        return (
            <Icon
                name={this.props.name}
                size={20}
                color={'#CCCCCC'}
            />
        );
    }
});

var GasFoodSubSwiper = React.createClass({
    propTypes: {
        hasNewOptions: PropTypes.bool.isRequired,
        hasSetOptions: PropTypes.func.isRequired,
        onSwipe: PropTypes.func.isRequired,
        options: PropTypes.array.isRequired,
        placeContainerOffset: PropTypes.number.isRequired,
        swiperWidth: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
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
        return (
            <Swiper
                onMomentumScrollEnd={this._onMomentumScrollEnd}
                height={110}
                nextButton={<NextPrevButton name={'chevron-right'} />}
                prevButton={<NextPrevButton name={'chevron-left'} />}
                showsButtons={true}
                showsPagination={false}
                width={this.props.swiperWidth}>
                {this.props.options.map((place) => {
                    return (
                        <View
                            style={[styles.placeContainer, {
                                marginLeft: this.props.placeContainerOffset / 2,
                                marginRight: this.props.placeContainerOffset / 2,
                            }]}
                            key={i++}>
                            <View style={styles.imageContainer}>
                                <Image style={styles.image} source={{uri: place.image}}/>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.name}>{place.name}</Text>
                                {place.price && <Text numberOfLines={1}>{"$" + place.price + " regular"}</Text>}
                                <Text numberOfLines={1}>{place.distance + " miles"}</Text>
                                {place.score && <Text numberOfLines={1}>{place.score + " stars"}</Text>}
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
        hasNewOptions: PropTypes.bool.isRequired,
        hasSetOptions: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        onSwipe: PropTypes.func,
        options: PropTypes.array.isRequired,
        placeContainerOffset: PropTypes.number.isRequired,
        swiperWidth: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
    },

    getInitialState: function(){
        return {error_message:  "Sorry, no options right now!"}
    },

    render: function() {
        var morethanzerooptions = this.props.options.length > 0;
        var isLoading = this.props.loading;
        var show_swiper_or_error;
        if (morethanzerooptions){
            show_swiper_or_error =
                <GasFoodSubSwiper
                    hasNewOptions={this.props.hasNewOptions}
                    hasSetOptions={this.props.hasSetOptions}
                    onSwipe={this.props.onSwipe}
                    options={this.props.options}
                    placeContainerOffset={this.props.placeContainerOffset}
                    swiperWidth={this.props.swiperWidth}
                    title={this.props.title}
                />;
        }
        else{
            if (isLoading == true) {
                show_swiper_or_error= (<View style={styles.no_options}>
                    <Spinner size={'large'} style={styles.spinner}/>
                    </View>)
            } else {
                show_swiper_or_error= (<View style={styles.no_options}>
                    <Text>{this.state.error_message}</Text>
                    </View>)
            }
        }

        return (
            <View style={[styles.container, styles.col]}>
                <Text style={styles.title}>{this.props.title}</Text>{show_swiper_or_error}
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    col: {
        flexDirection: 'column',
    },
    no_options: {
        alignItems: 'center',
        flex: 1,
        height:110,
        justifyContent: 'center',
        width:300,
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    image: {
        height: 100,
        width: 100,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    placeContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
    },
    spinner: {
        alignSelf:'center',
    },
    swiperButton: {
        color: '#CCCCCC',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        color: '#404040',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

module.exports = GasFoodSwiper;
