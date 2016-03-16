'use strict';

var GasFoodSwiper = require('./GasFoodSwiper');
var React = require('react-native');

var FoodSwiperContainer = React.createClass({
    componentDidMount: function() {
        this._setOptions();
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

    _setOptions: function() {
        // TODO (urlauba): change url path
        fetch('http://localhost:3000/api/yelp/37.788022/-122.399797')
            .then((response) => response.text())
            .then((responseText) => {
                var data = JSON.parse(responseText);
                var options = Object.keys(data).map(function(k) { return data[k] });

                this.setState({options: options});
            })
            .catch((error) => {
                // TODO (urlauba): handle error state
                console.log('error')
            });
    },
});

module.exports = FoodSwiperContainer;
