'use strict';

var React = require('react-native');

var GasFoodSwiper = require('./GasFoodSwiper');

var fakeOptions = [
    {
        name: "In & Out",
        image: "http://facebook.github.io/react/img/logo_og.png",
        distance: "43 miles",
        stars: 4,
    },
    {
        name: "No Thai",
        image: "http://facebook.github.io/react/img/logo_og.png",
        distance: "13 miles",
        stars: 3,
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
                title={"Food"}
            />
        );
    },
});

module.exports = FoodSwiperContainer;
