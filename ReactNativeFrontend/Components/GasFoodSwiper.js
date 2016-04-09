'use strict';

var Icon = require('react-native-vector-icons/FontAwesome');
var React = require('react-native');
var Spinner = require('react-native-gifted-spinner');
var Swiper = require('react-native-swiper');
var Linking = require('Linking');

var {
    Image,
    StyleSheet,
    PropTypes,
    Text,
    View,
    Platform,
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
        foodIndex: PropTypes.number,
        gasIndex: PropTypes.number,
        image: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        onSwipe: PropTypes.func.isRequired,
        options: PropTypes.array.isRequired,
        title: PropTypes.string.isRequired,
    },

    getInitialState: function() {
        return {
            option: this.props.options[0],
            foodIndex: 0,
            gasIndex: 0,
        };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (nextProps !== this.props) {
            if (nextProps.foodIndex === this.state.foodIndex && nextProps.gasIndex === this.state.gasIndex) {
                return true;
            } else {
                this.setState({foodIndex: nextProps.foodIndex, gasIndex: nextProps.gasIndex});
            }
        }
        return false;
    },

    _onMomentumScrollEnd: function (e, swiperState, context) {
        var index = swiperState.index;
        this.setState({option: this.props.options[index]});
        this.props.onSwipe(index);
    },

    getDirections: function() {
        var saddr = this.props.latitude + ',' + this.props.longitude;
        var daddr = this.state.option.lat + ',' + this.state.option.lon;
        var directionsmode = 'driving';
        var url = 'comgooglemaps://?saddr=' + saddr + '&daddr=' + daddr + '&directionsmode=' + directionsmode;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    },
    render: function(){
        var TouchableElement = TouchableHighlight;

        if (Platform.OS === 'android') {
            TouchableElement = TouchableNativeFeedback;
        }

        var swiperWidth = 320;
        var itemWidth = swiperWidth - 90;
        return (
            <View style={styles.container}>
                <Swiper onMomentumScrollEnd={this._onMomentumScrollEnd}
                    height={110}
                    nextButton={<NextPrevButton name={'chevron-right'} />}
                    prevButton={<NextPrevButton name={'chevron-left'} />}
                    showsButtons={true}
                    showsPagination={false}
                    style={[
                        styles.swiper,
                        {width: itemWidth}
                    ]}
                    width={swiperWidth}>
                    {this.props.options.map((place) => {
                        var source = this.props.image || {uri: place.image};

                        return (
                            <View
                                key={i++}
                                style={[
                                    styles.placeContainer,
                                    {width: itemWidth}
                                ]}>
                                <Image style={styles.image} source={source}/>
                                <View style={styles.col}>
                                    <Text style={styles.name}>{place.name}</Text>
                                    {place.price && <Text style={styles.texts} numberOfLines={1}>{place.price + " dollars"}</Text>}
                                    <Text style={styles.texts} numberOfLines={1}>{place.distance + " miles"}</Text>
                                    {place.rating && <Text style={styles.texts} numberOfLines={1}>{place.rating + " stars"}</Text>}
                                </View>
                            </View>
                        );
                    })}
                </Swiper>
                <View style={{width: itemWidth}}>
                    <TouchableElement
                        style={styles.button}
                        onPress={this.getDirections}>
                        <View>
                            <Text style={styles.buttonText}>Start Route Guidance</Text>
                        </View>
                    </TouchableElement>
                </View>
            </View>
        );
    }
});

var GasFoodSwiper = React.createClass({
    propTypes: {
        title: PropTypes.string.isRequired,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
        onSwipe: React.PropTypes.func,
        foodIndex: React.PropTypes.number,
        gasIndex: React.PropTypes.number,
    },

    getInitialState: function(){
        return {error_message:  "Sorry, no options right now!"}
    },

    render: function() {
        var morethanzerooptions = this.props.options.length > 0;
        var isLoading = this.props.loading;
        var show_swiper_or_error;
        if (morethanzerooptions){
            show_swiper_or_error = <GasFoodSubSwiper {...this.props} />;
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
            <View style={[this.props.style, styles.container, styles.col]}>
                <Text style={styles.title}>{this.props.title}</Text>{show_swiper_or_error}
            </View>
        );
    },
});

var styles = StyleSheet.create({
    button: {
        backgroundColor: '#6BCDFD',
        borderColor: '#6BCDFD',
        borderRadius: 2,
        borderStyle: 'solid',
        borderWidth: 1,
        flex: 1,
        marginBottom: 8,
        overflow: 'hidden',
        padding: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    col: {
        flexDirection: 'column',
    },
    container: {
        alignItems: 'center',
    },
    no_options: {
        height:110,
        width:300,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 100,
        width: 100,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 120,
    },
    texts: {
        width: 120,
    },
    placeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row',
    },
    swiper: {
        alignSelf: 'center',
    },
    spinner: {
        alignSelf:'center',
    },
    swiperButton: {
        color: '#CCCCCC',
    },
    title: {
        color: '#404040',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

module.exports = GasFoodSwiper;
