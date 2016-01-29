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

var items = [{title: "food"}, {title: "gas"}];
var i = 0;
var GasFoodSwiper = React.createClass({
    propTypes: {
        title: PropTypes.string.isRequired,
    },

    render: function() {
        var places = [];

        this.props.options.map((place) => {
            places.push(
                <View key={i}>
                    <Image source={{uri: 'http://facebook.github.io/react/img/logo_og.png'}}/>
                    <Text>{place.name}</Text>
                    <Text>{place.price && place.price}</Text>
                    <Text>{place.distance}</Text>
                    <Text>{place.stars && place.stars}</Text>
                </View>
            );
            i++;
        });

        return (
            <View>
                <Text>{this.props.title}</Text>
                <Swiper
                    activeDot={<View />}
                    dot={<View />}
                    style={styles.wrapper}
                    showsButtons={true}>
                    {places}
                </Swiper>
            </View>
        );
    },
});

var styles = StyleSheet.create({
    wrapper: {
},
slide1: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#9DD6EB',
},
slide2: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#97CAE5',
},
slide3: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#92BBD9',
},
text: {
  color: '#fff',
  fontSize: 30,
  fontWeight: 'bold',
}
});

module.exports = GasFoodSwiper;
