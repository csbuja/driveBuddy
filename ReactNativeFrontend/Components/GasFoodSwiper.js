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

var GasFoodSubSwiper = React.createClass({
    getInitialState: function() {
        return {
            option: this.props.options[0],
        };
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (nextProps !== this.props) {
            return true;
        }
        return false;
    },

    _onMomentumScrollEnd: function (e, swiperState, context) {
        this.setState({option: this.props.options[swiperState.index]});
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
        var isFood = false;
        if (this.props.title === 'Food') {
            isFood = true;
        }
        if (Platform.OS === 'android') {
            TouchableElement = TouchableNativeFeedback;
        }
        return (
            <View style={styles.container}>
                <Swiper onMomentumScrollEnd={this._onMomentumScrollEnd}
                    height={90}
                    showsButtons={true}
                    buttonWrapperStyle={styles.buttonWrapper}
                    showsPagination={false}
                    nextButton={
                        <Icon
                            name={'chevron-right'}
                            size={20}
                            color={'#CCCCCC'}
                        />
                    }
                    prevButton={
                        <Icon
                            name={'chevron-left'}
                            size={20}
                            color={'#CCCCCC'}
                        />
                    }
                    width={300}>
                    {this.props.options.map((place) => {
                        return (
                            <View
                                key={i++}
                                style={[styles.col, styles.placeView]}>
                                <View style={styles.row}>
                                    {isFood && <Image style={styles.image} source={{uri: place.image}}/>}
                                    <View style={styles.col}>
                                        <Text style={styles.name}>{place.name}</Text>
                                        {place.price && <Text style={isFood && styles.texts} numberOfLines={1}>{place.price + " dollars"}</Text>}
                                        <Text style={isFood && styles.texts} numberOfLines={1}>{"More than " + place.distance + " miles"}</Text>
                                        {place.rating && <Text style={isFood && styles.texts} numberOfLines={1}>{place.rating + " Stars"}</Text>}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </Swiper>
                <View>
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
    },

    getInitialState: function(){
        return {error_message:  "Holyshit no options bro"}
    },

    render: function() {
        var morethanzerooptions = this.props.options.length > 0;
        var isLoading = this.props.loading;
        var show_swiper_or_error
        if (morethanzerooptions){
            var show_swiper_or_error = <GasFoodSubSwiper
                                            options={this.props.options}
                                            title={this.props.title}
                                            latitude={this.props.latitude}
                                            longitude={this.props.longitude}/>;
        }
        else{
            if (isLoading == true) {
                var show_swiper_or_error= (<View style={styles.no_options}>
                    <Spinner />
                    </View>)
            } else {
                var show_swiper_or_error= (<View style={styles.no_options}>
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
    buttonWrapper: {
        paddingHorizontal: 0,
    },
    col: {
        flexDirection: 'column',
    },
    container: {
        alignItems: 'center',
    },
    no_options: {
        height:110,
        width:300
    },
    image: {
        height: 60,
        marginRight: 28,
        width: 60,
    },
    name: {
        fontSize: 16,
        width: 120,
    },
    texts: {
        width: 120,
    },
    placeView: {
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 8,
    },
    row: {
        flexDirection: 'row',
    },
    swiperButton: {
        color: '#CCCCCC',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

module.exports = GasFoodSwiper;
