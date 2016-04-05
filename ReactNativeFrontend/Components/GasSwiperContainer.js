'use strict';

var GasFoodSwiper = require('./GasFoodSwiper');
var React = require('react-native');
var TimerMixin = require('react-native-timer-mixin');

var {PropTypes} = React;

var GasSwiperContainer = React.createClass({
    mixins: [TimerMixin],

    propTypes: {
        currentPosition: PropTypes.shape({
            latitude: PropTypes.number,
            longitude: PropTypes.number,
        }).isRequired,
        lastPosition: PropTypes.shape({
            latitude: PropTypes.number,
            longitude: PropTypes.number,
        }).isRequired,
        onSetOptions: React.PropTypes.func,
    },

    getInitialState: function() {
        return {
            options: [],
            loading: false,
            transferredUp: false,
        };
    },

    componentWillReceiveProps: function(nextProps) {
        // option refresh set in componentWillMount but initially
        // currentPosition is null, this refreshes once when no longer null
        if (!this.props.currentPosition.latitude
            && !this.props.currentPosition.longitude
            && nextProps.currentPosition.latitude
            && nextProps.currentPosition.longitude
        ) {
            this._setOptions(nextProps.currentPosition, nextProps.lastPosition);
        }
    },

    componentWillMount: function() {
        this._setOptions(
            this.props.currentPosition,
            this.props.lastPosition
        );

        this.setInterval(
            this._setOptions(
                this.props.currentPosition,
                this.props.lastPosition
            ), 5 * 60 * 1000 // 5 minutes
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
                title={"Gas"}
            />
        );
    },

    _setOptions: function(currentPosition, lastPosition) {
        var current = JSON.stringify(currentPosition);
        var last = JSON.stringify(lastPosition);

        this.setState({loading: true});
        if (currentPosition.latitude && currentPosition.longitude) {
            var transferredUp = this.state.transferredUp;
            // TODO (urlauba): change url path
            fetch('http://73.161.192.135:3000/api/gas/' + current + '/' + last)
                .then((response) => response.text())
                .then((responseText) => {
                    var data = JSON.parse(responseText);
                    var options = Object.keys(data).map(function(k) { return data[k] });
                    this.setState({options: options, transferredUp: !transferredUp, loading: false});
                    if (transferredUp == false) {
                        this.props.onSetOptions(options);
                    }
                })
                .catch((error) => {
                    // TODO (urlauba): handle error state
                    console.log('error')
                    this.setState({loading: false});
                });
        }
    },
});

module.exports = GasSwiperContainer;
