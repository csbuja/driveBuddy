'use strict';

var React = require('react-native');

var Overlay = require('react-native-overlay');
var SurveySearchBar = require('./SurveySearchBar');

var {
    Image,
    ListView,
    PropTypes,
    RecyclerViewBackedScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
} = React;

var SurveyListView = React.createClass({
    propTypes: {
        onPress: PropTypes.func.isRequired,
        showSearchResults: PropTypes.bool.isRequired,
    },

    componentWillUnmount: function() {
        this.setState({showOptions: false});
    },

    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return {
            dataSource: ds.cloneWithRows([]),
            options: [],
            showOptions: false,
            locationText: '',
            searchText: '',
        };
    },

    render: function() {
        return (
            <View>
                <SurveySearchBar
                    onLocationTextChange={this._onLocationTextChange}
                    onSearchTextChange={this._onSearchTextChange}
                    locationText={this.state.locationText}
                    searchText={this.state.searchText}
                />
                <Overlay isVisible={this.state.showOptions && this.props.showSearchResults}>
                    <View style={styles.overlay}>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow}
                            renderScrollComponent={
                                props => <RecyclerViewBackedScrollView {...props} />
                            }
                            renderSeparator={(secID, rowID, adjHighlighted) =>
                                <View key={rowID} style={styles.separator} />
                            }
                        />
                    </View>
                </Overlay>
            </View>
        );
    },

    _renderRow: function(info, sectionID, rowID, adjHighlighted) {
        return (
            <TouchableHighlight
                key={rowID}
                onPress={() => this.props.onPress(info)}>
                <View style={styles.row}>
                    <View style={styles.directionRow}>
                        <Image
                            style={styles.thumbnail}
                            source={{uri: info.image}}
                        />
                        <View style={styles.directionCol}>
                            <View style={styles.directionRow}>
                                <Text style={styles.title}>{info.name}</Text>
                                <Text>{info.rating + " Stars"}</Text>
                            </View>
                            <Text style={styles.address}>{info.address}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
    },

    _onLocationTextChange: function(text) {
        this.setState({locationText: text});
        this._search();
    },

    _onSearchTextChange: function(text) {
        this.setState({searchText: text});
        this._search();
    },

    _search: function() {
        var text = this.state.searchText;
        if (!text.length) {
            this._onCancelButtonPress();
            return;
        }

        // TODO (urlauba): change url, lat, and lon
        fetch('http://localhost:3000/api/search/42.27/-83.73/' + text + '/' + this.state.locationText)
            .then((response) => response.text())
            .then((responseText) => {
                var data = JSON.parse(responseText);
                var arr = Object.keys(data).map(function(k) { return data[k] });
                var showOptions = arr.length ? true : false;

                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    dataSource: ds.cloneWithRows(data),
                    showOptions: true,
                });
            })
            .catch((error) => {
                // TODO (urlauba): handle error state
                console.log('error')
            })
    },

    _onCancelButtonPress: function() {
        this.setState({
            options: [],
            showOptions: false,
        });
    },
});

var styles = StyleSheet.create({
    address: {
        width: 320,
    },
    directionCol: {
        flexDirection: 'column',
    },
    directionRow: {
        flexDirection: 'row',
    },
    overlay: {
        backgroundColor: '#333333',
        borderBottomWidth: 5,
        borderColor: '#3399ff',
        height: 150,
        marginTop: 203, // TODO (urlauba): make dynamic, measure in NativeMethodsMixin?
    },
    row: {
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    separator: {
        backgroundColor: '#3399ff',
        height: 1,
    },
    thumbnail: {
        height: 32,
        marginRight: 10,
        width: 32,
    },
    title: {
        fontWeight: 'bold',
        marginRight: 10,
    },
});

module.exports = SurveyListView;
