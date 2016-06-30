'use strict'

var KeyboardEvents = require('react-native-keyboardevents');
var NativeMethodsMixin = require('NativeMethodsMixin');
var React = require('react-native');
var SurveySearchResults = require('./SurveySearchResults');

var {
    Dimensions,
    PropTypes,
    View
} = React;

var KeyboardEventEmitter = KeyboardEvents.Emitter;
var { height } = Dimensions.get('window');

var SurveySearchResultsContainer = React.createClass({
    mixins: [NativeMethodsMixin],

    props: {
        enableResults: PropTypes.bool.isRequired,
    },

    getInitialState: function() {
        return {
            keyboardHeight: 0,
            py: 0,
        };
    },

    componentDidMount: function() {
        // component needs to be fully rendered first
        setTimeout(() => {
            this.refs.container.measure((x, y, width, heigh, px, py) => {
                this.setState({py: py});
            });
        }, 0);

        KeyboardEventEmitter.on(KeyboardEvents.KeyboardWillShowEvent, this._updateKeyboardHeight);
    },

    componentWillUnmount: function() {
        KeyboardEventEmitter.off(KeyboardEvents.KeyboardWillShowEvent);
    },

    _updateKeyboardHeight: function(frames) {
        frames.end && this.setState({keyboardHeight: frames.end.height});
    },

    render: function() {
        var results = (
            <SurveySearchResults
                {...this.props}
                height={height - this.state.py - this.state.keyboardHeight}
            />
        );

        return (
            <View ref='container'>
                {this.props.enableResults && results}
            </View>
        );
    },
});

module.exports = SurveySearchResultsContainer;
