'use strict';

var React = require('react-native');
var SurveySearchBarContainer = require('./SurveySearchBarContainer');
var SurveySearchResults = require('./SurveySearchResults');

var {
    PropTypes,
    View,
} = React;

var SurveyRestaurantSearch = React.createClass({
    propTypes: {
        enableResults: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired,
    },

    getInitialState: function() {
        return {
            data: {},
            enableResults: false,
        };
    },

    render: function() {
        return (
            <View>
                <SurveySearchBarContainer
                    setOptions={this._setOptions}
                />
                <SurveySearchResults
                    data={this.state.data}
                    enableResults={this.state.enableResults && this.props.enableResults}
                    onPress={this.props.onPress}
                />
            </View>
        );
    },

    _setOptions: function(responseText, enableResults) {
        var data = JSON.parse(responseText);
        this.setState({
            data: data,
            enableResults: enableResults,
        });
    },
});

module.exports = SurveyRestaurantSearch;
