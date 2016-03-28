'use strict';

var React = require('react-native');
var Icon = require('react-native-vector-icons/FontAwesome');

var {
    PropTypes,
    StyleSheet,
    TextInput,
    View,
} = React;

var SurveySearchBar = React.createClass({
    propTypes: {
        onLocationTextChange: PropTypes.func.isRequired,
        onSearchTextChange: PropTypes.func.isRequired,
        locationText: PropTypes.string.isRequired,
        searchText: PropTypes.string.isRequired,
    },

    componentDidMount: function() {
        //this.refs.searchBar.focus();
    },

    render: function() {
        return (
            <View style={styles.container}>
                <View
                    style={[styles.textInputContainer, styles.searchContainer]}>
                    <Icon
                        style={styles.searchIcon}
                        name="search"
                        size={15}
                        color={'#B3B3B3'}
                    />
                    <TextInput
                        clearButtonMode={'always'}
                        onChangeText={this.props.onSearchTextChange}
                        placeholder='Search Restaurants Near'
                        ref="searchBar"
                        selectionColor={'#3399FF'}
                        style={styles.textInput}
                        value={this.props.searchText}
                    />
                </View>
                <View
                    style={[styles.textInputContainer, styles.locationContainer]}>
                    <TextInput
                        clearButtonMode={'always'}
                        onChangeText={this.props.onLocationTextChange}
                        placeholder='Current Location'
                        selectionColor={'#3399FF'}
                        style={styles.textInput}
                        value={this.props.locationText}
                    />
                </View>
            </View>
        );
    },
});

var styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#CCCCCC',
        borderColor: '#3399FF',
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
