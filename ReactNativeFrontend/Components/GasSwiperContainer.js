'use strict';

var GasFoodSwiper = require('./GasFoodSwiper');
var React = require('react-native');

var {PropTypes} = React;

var GasSwiperContainer = React.createClass({
    propTypes: {
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
    },

    getInitialState: function() {
        return {
            options: [],
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this._setOptions(nextProps.latitude, nextProps.longitude);
    },

    componentWillMount: function() {
        this._setOptions(this.props.latitude, this.props.longitude);
    },

    render: function() {
        return (
            <GasFoodSwiper
                latitude={this.props.latitude}
                longitude={this.props.longitude}
                options={this.state.options}
                style={this.props.style}
                title={"Gas"}
            />
        );
    },

    _setOptions: function(lat, lon) {
        // TODO (urlauba): change url path
        fetch('http://localhost:3000/api/gas/' + lat + '/' + lon)
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

module.exports = GasSwiperContainer;
