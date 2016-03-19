'use strict';

var React = require('react-native');

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
    getDirections: function(lat, lon) {
        var saddr = this.props.latitude + ',' + this.props.longitude;
        var daddr = lat + ',' + lon;
        var directionsmode = 'driving';
        var url = 'comgooglemaps://?saddr=' + saddr + '&daddr=' + daddr + '&directionsmode=' + directionsmode;
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    },
    render: function(){
        var TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
            TouchableElement = TouchableNativeFeedback;
        }
        return(<Swiper
                    height={114}
                    showsButtons={true}
                    showsPagination={false}
                    width={300}>
                    {this.props.options.map((place) => {
                        return (
                            <View
                                key={i++}
                                style={[styles.col, styles.placeView]}>
                                <View style={styles.row}>
                                    <Image style={styles.image} source={{uri: place.image}}/>
                                    <View style={styles.col}>
                                        <Text style={styles.name}>{place.name}</Text>
                                        {place.price && <Text style={styles.texts} numberOfLines={1}>{place.price}</Text>}
                                        <Text style={styles.texts} numberOfLines={1}>{"More than " + place.distance}</Text>
                                        {place.rating && <Text style={styles.texts} numberOfLines={1}>{place.rating + " Stars"}</Text>}
                                    </View>
                                </View>
                                <TouchableElement
                                    style={styles.button}
                                    onPress={this.getDirections.bind(this, place.lat, place.lon)}>
                                    <View>
                                        <Text style={styles.buttonText}>Start Route Guidance</Text>
                                    </View>
                                </TouchableElement>
                            </View>
                        );
                    })}
                </Swiper>)
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
        var show_swiper_or_error
        if (morethanzerooptions){
            var show_swiper_or_error = <GasFoodSubSwiper 
                                            options={this.props.options}
                                            latitude={this.props.latitude}
                                            longitude={this.props.longitude}/>;
        }
        else{
            var show_swiper_or_error= (<View style={styles.no_options}>
                <Text>{this.state.error_message}</Text>
                </View>)
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
        backgroundColor: '#80ff80',
        borderColor: '#00cc00',
        borderRadius: 2,
        borderStyle: 'solid',
        borderWidth: 1,
        flex: 1,
        marginTop: 8,
        overflow: 'hidden',
        padding: 4,
    },
    buttonText: {
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
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

module.exports = GasFoodSwiper;
