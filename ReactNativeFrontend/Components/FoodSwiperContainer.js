'use strict';

var GasFoodSwiperContainer = require('./GasFoodSwiperContainer');
var React = require('react-native');
var TimerMixin = require('react-native-timer-mixin');

var {
    AsyncStorage,
    PropTypes
} = React;

var FoodSwiperContainer = React.createClass({
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
        onSwipe: PropTypes.func,
        onSetOptions: PropTypes.func,
        optionLatitude: PropTypes.number,
        optionLongitude: PropTypes.number,
    },

    getInitialState: function() {
        return {
            options: [],
            loading: false,
            userID: '',
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
        this._getUserID();

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
            <GasFoodSwiperContainer
                hasNewOptions={this.state.hasNewOptions}
                hasSetOptions={this._hasSetOptions}
                latitude={this.props.currentPosition.latitude}
                loading={this.state.loading}
                longitude={this.props.currentPosition.longitude}
                onSwipe={this.props.onSwipe}
                optionLatitude={this.props.optionLatitude}
                optionLongitude={this.props.optionLongitude}
                options={this.state.options}
                title={"Food"}
            />
        );
    },

    _hasSetOptions: function() {
        this.setState({hasNewOptions: false});
    },

    _setOptions: function(currentPosition, lastPosition) {
        var current = JSON.stringify(currentPosition);
        var last = JSON.stringify(lastPosition);

        this.setState({loading: true, hasNewOptions: true});
        if (currentPosition.latitude && currentPosition.longitude) {
            // TODO (urlauba): change url path
            fetch('http://localhost:3000/api/yelp/'
                + current + '/' + last + '/' + this.state.userID)
                .then((response) => response.text())
                .then((responseText) => {
                    var data = JSON.parse(responseText);
                    var options = Object.keys(data).map(function(k) { return data[k] });
                    options.sort((a, b) => { return (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0); });
                    this.setState({options: options, loading: false});
                    this.props.onSetOptions(options);
                })
                .catch((error) => {
                    // TODO (urlauba): handle error state
                    console.log(error)
                    this.setState({loading: false, hasNewOptions: false});
                });
        }
    },

    _getUserID: function() {
        AsyncStorage.getItem('userID')
            .then(function(userID) {
                this.setState({userID: userID});
            }.bind(this))
            .catch(function(error) {
                console.log('error retrieving userID from disc' + error);
            });
    },
});

module.exports = FoodSwiperContainer;
