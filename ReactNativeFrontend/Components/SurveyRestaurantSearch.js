'use strict';

var React = require('react-native');
var SurveySearchBarContainer = require('./SurveySearchBarContainer');
var SurveySearchResultsContainer = require('./SurveySearchResultsContainer');

var {
    PropTypes,
    View,
} = React;

var SurveyRestaurantSearch = React.createClass({
    propTypes: {
        enableResults: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired,
        selected: PropTypes.object.isRequired,
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
                    enableSearchResults={this._enableSearchResults}
                    disableSearchResults={this._disableSearchResults}
                    setOptions={this._setOptions}
                />
                <SurveySearchResultsContainer
                    {...this.props}
                    data={this.state.data}
                    enableResults={this.state.enableResults && this.props.enableResults}
                    onPress={this.props.onPress}
                />
            </View>
        );
    },

    _disableSearchResults: function() {
        this.setState({enableResults: false});
    },

    _enableSearchResults: function() {
        this.setState({enableResults: true});
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
