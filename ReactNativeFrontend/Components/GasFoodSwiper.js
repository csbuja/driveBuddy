'use strict';

var React = require('react-native');

var Swiper = require('react-native-swiper');

var {
    Image,
    StyleSheet,
    PropTypes,
    Text,
    View
} = React;
var i = 0;

var GasFoodSubSwiper = React.createClass({
    render: function(){
        return(<Swiper
                    height={110}
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
                                        {place.price && <Text>{place.price}</Text>}
                                        <Text>{place.distance}</Text>
                                        {place.stars && <Text>{place.stars}</Text>}
                                    </View>
                                </View>
                                <Text style={styles.button}>Start Route Guidance</Text>
                            </View>
                        );
                    })}
                </Swiper>)
    }
})

var GasFoodSwiper = React.createClass({
    propTypes: {
        title: PropTypes.string.isRequired,
    },

    getInitialState: function(){
        return {error_message:  "Holyshit no options bro"}
    },

    render: function() {
        var morethanzerooptions = this.props.options.length > 0;
        var show_swiper_or_error
        if (morethanzerooptions){
            var show_swiper_or_error = <GasFoodSubSwiper options={this.props.options}/>;
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
