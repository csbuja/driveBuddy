'use strict';

var React = require('react-native');

var GasFoodSwiper = require('./GasFoodSwiper');

var fakeOptions = [
    {
        name: "Shell",
        image: "http://facebook.github.io/react/img/logo_og.png",
        distance: "23 miles",
        price: "$3.00 / gal",
    },
    {
        name: "Marathon",
        image: "http://facebook.github.io/react/img/logo_og.png",
        distance: "3 miles",
        price: "$2.90 / gal",
    },
];

var FoodSwiperContainer = React.createClass({
    componentDidMount: function() {

        // make API call and set state accordingly
        this.setState({options: fakeOptions});
    },

    getInitialState: function() {
        return {
            options: [],
        };
    },

    render: function() {
        return (
            <GasFoodSwiper
                options={this.state.options}
                style={this.props.style}
                title={"Gas"}
            />
        );
    },
});

module.exports = FoodSwiperContainer;
