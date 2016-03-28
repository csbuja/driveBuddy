'use strict';

var GasFoodSwiper = require('./GasFoodSwiper');
var React = require('react-native');

var {PropTypes} = React;

var FoodSwiperContainer = React.createClass({
    propTypes: {
        currentPosition: PropTypes.shape({
            latitude: PropTypes.number,
            longitude: PropTypes.number,
        }).isRequired,
        lastPosition: PropTypes.shape({
            latitude: PropTypes.number,
            longitude: PropTypes.number,
        }).isRequired,
    },

    getInitialState: function() {
        return {
            options: [],
            loading: false,
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this._setOptions(
            nextProps.currentPosition,
            nextProps.lastPosition
        );
    },

    componentWillMount: function() {
        this._setOptions(
            this.props.currentPosition,
            this.props.lastPosition
        );
    },

    render: function() {
        return (
            <GasFoodSwiper
                latitude={this.props.currentPosition.latitude}
                longitude={this.props.currentPosition.longitude}
                options={this.state.options}
                loading={this.state.loading}
                style={this.props.style}
                title={"Food"}
            />
        );
    },

    _setOptions: function(currentPosition, lastPosition) {
        var current = JSON.stringify(currentPosition);
        var last = JSON.stringify(lastPosition);

        this.setState({loading: true});
        if (currentPosition.latitude && currentPosition.longitude) {
            // TODO (urlauba): change url path
            fetch('http://localhost:3000/api/yelp/' + current + '/' + last)
                .then((response) => response.text())
                .then((responseText) => {
                    var data = JSON.parse(responseText);
                    var options = Object.keys(data).map(function(k) { return data[k] });
                    this.setState({options: options, loading: false});
                })
                .catch((error) => {
                    // TODO (urlauba): handle error state
                    console.log('error')
                    this.setState({loading: false});
                });
        }
    },
});

module.exports = FoodSwiperContainer;
