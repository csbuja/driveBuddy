'use strict';

var React = require('react-native');
var SurveySearchBar = require('./SurveySearchBar');

var {
    PropTypes,
    View,
} = React;

var SurveySearchBarContainer = React.createClass({
    watchID: (null: ?number),

    propTypes: {
        enableSearchResults: PropTypes.func.isRequired,
        disableSearchResults: PropTypes.func.isRequired,
        setOptions: PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            latitude: 0,
            longitude: 0,
        };
    },

    componentDidMount: function() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => console.log(error),
            // if battery life become a concern disable high accuracy
            // max age corresponds to using cached value within device, set to 5 min
            // arbitrarily set timeout to 10 seconds
            {enableHighAccuracy: true, timeout: 10 * 1000, maximumAge: 5 * 60 * 1000}
        );

        // updates when position changes
        this.watchID = navigator.geolocation.watchPosition((position) => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        });
    },

    componentWillUnmount: function() {
        navigator.geolocation.clearWatch(this.watchID);
    },

    render: function() {
        return (
            <SurveySearchBar
                {...this.props}
                latitude={this.state.latitude}
                longitude={this.state.longitude}
            />
        );
    },
});

module.exports = SurveySearchBarContainer;
