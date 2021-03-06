'use strict';

var Icon = require('react-native-vector-icons/FontAwesome');
var React = require('react-native');
var config = require("../config");
var Q = require('q')

var {
    PropTypes,
    StyleSheet,
    TextInput,
    View,
    AsyncStorage,
} = React;



var SurveySearchBar = React.createClass({
    propTypes: {
        disableSearchResults: PropTypes.func.isRequired,
        enableSearchResults: PropTypes.func.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        setOptions: PropTypes.func.isRequired,
    },

    componentDidUpdate: function() {
        if(this.props.searchBarFocused && !this.state.hasBeenFocusedByButton){
            this.setState({
                hasBeenFocusedByButton:true
            });
            this.refs.searchBar.focus();
        }
    },

    getInitialState: function() {
        return {
            isSearchBehind: false,
            isSearching: false,
            locationText: '',
            searchText: '',
            hasBeenFocusedByButton:false,
            token: ''
        };
    },

    render: function() {
        return (
            <View style={styles.container}>
                <View
                    style={[styles.textInputContainer, styles.searchContainer]}>
                    <Icon
                        color={'#B3B3B3'}
                        name="search"
                        size={15}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        clearButtonMode={'always'}
                        onChangeText={this._onSearchTextChange}
                        onFocus={this._onKeyboardFocusSearchBar}
                        onKeyPress={this._onKeyboardEnter}
                        placeholder='Search Restaurants Near'
                        ref="searchBar"
                        returnKeyType={'done'}
                        selectionColor={'#6BCDFD'}
                        style={styles.textInput}
                        value={this.state.searchText}
                    />
                </View>
                <View
                    style={[styles.textInputContainer, styles.locationContainer]}>
                    <TextInput
                        clearButtonMode={'always'}
                        onChangeText={this._onLocationTextChange}
                        onFocus={this._onKeyboardFocus}
                        onKeyPress={this._onDone}
                        onKeyPress={this._onKeyboardEnter}
                        placeholder='Current Location'
                        returnKeyType={'done'}
                        selectionColor={'#6BCDFD'}
                        style={styles.textInput}
                        value={this.state.locationText}
                    />
                </View>
            </View>
        );
    },

    _onKeyboardFocus: function() {
        this.state.searchText.length && this.props.enableSearchResults();
    },
    _onKeyboardFocusSearchBar: function(){
        this._onKeyboardFocus();
        if(!this.state.hasBeenFocusedByButton){
            this.setState({
                hasBeenFocusedByButton:true
            });
            this.props.dontShowStartSearchNowBox();
        }
        
    },

    _onKeyboardEnter: function(e) {
        (e.nativeEvent.key === 'Enter') && this.props.disableSearchResults();
    },
    componentWillMount: function() {
        this._getToken();

    },

    _onLocationTextChange: function(text) {
        // order matters, otherwise can search
        // old location after it has been cleared
        this.setState({locationText: text});
        this._search(this.state.searchText);
    },

    _onSearchTextChange: function(text) {
        this._search(text);
        this.setState({searchText: text});
    },
    _getToken: function() {
        AsyncStorage.getItem('token').then(function(token) {
            this.setState({token: token});
        }.bind(this)).catch(function(error) {
            console.log('error retrieving token from disc' + error);
        });
    },

    _search: function(text) {
        // reset options and avoid API call that will fail
        if (!text.length) {
            // cancel search, needed if user hits cancel button
            this.setState({isSearching: false});
            this.props.setOptions('{}', false);
            return;
        }

        // don't allow searching while still waiting results
        // avoids textInput from getting ahead of js _search
        // otherwise event stack would be way off from user perspective
        // due to time for API call, which is seen when typing quickly
        if (this.state.isSearching) {
            this.setState({isSearchBehind: true});
            return;
        }
        var self = this;
        (function(){
        var deferred = Q.defer();
        if(self.state.token==''){
            AsyncStorage.getItem('token').then(function(token) {
            self.setState({token: token});
            deferred.resolve(true);
        }.bind(this)).catch(function(error) {
            console.log('error retrieving token from disc' + error);
        });
        }
        else {
            deferred.resolve(true)
        }
        return deferred.promise;
        })().then(function(){
            console.log('api search')
            this.setState({isSearching: true});
            var url = 'http://' + config.hostname+ '/api/search/'
            + this.props.latitude + '/' + this.props.longitude + '/'
            + text + '/' + this.state.locationText;
            console.log(self.state.token)
        fetch(url,{
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      token : self.state.token
                   })
            })
            .then((response) => response.text())
            .then((responseText) => {
                // short circuit search
                // don't use results if search field is cleared
                if (this.state.isSearching)
                    this.props.setOptions(responseText, true);

                this.setState({isSearching: false});

                // needed if user stops typing while API results are still
                // being retrieved, so last text typed agrees with results
                if (this.state.isSearchBehind) {
                    this.setState({isSearchBehind: false});
                    this._search(this.state.searchText);
                }
            })
            .catch((error) => {
                this.props.setOptions('{}', false);
                this.setState({isSearching: false, isSearchBehind: false});
                this._search(this.state.searchText);
            })
        }.bind(self));
    }
});

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#CCCCCC',
        borderColor: '#6BCDFD',
        borderTopWidth: 2,
        flexDirection: 'row',
        height: 40,
    },
    searchContainer: {
        flex: 0.6,
    },
    searchIcon: {
        marginLeft: 6,
    },
    locationContainer: {
        flex: 0.4,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        height: 28,
        marginLeft: 4,
    },
    textInputContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        flexDirection: 'row',
        marginLeft: 8,
        marginRight: 8,
    },
});

module.exports = SurveySearchBar;
