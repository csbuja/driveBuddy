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
    watchID: (null: ?number),

    propTypes: {
        onPress: PropTypes.func.isRequired,
        showSearchResults: PropTypes.bool.isRequired,
    },

    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return {
            dataSource: ds.cloneWithRows([]),
            numberOptions: 0,
            latitude: 0,
            longitude: 0,
            locationText: '',
            options: [],
            searchText: '',
            showOptions: false,
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
        this.setState({showOptions: false});
        navigator.geolocation.clearWatch(this.watchID);
    },

    render: function() {
        var rowHeight = 54;
        var rowsToShow = Math.min(this.state.numberOptions,3);
        var listHeight = rowHeight * rowsToShow;
        return (
            <View>
                <SurveySearchBar
                    onLocationTextChange={this._onLocationTextChange}
                    onSearchTextChange={this._onSearchTextChange}
                    locationText={this.state.locationText}
                    searchText={this.state.searchText}
                />
                <Overlay isVisible={this.state.showOptions && this.props.showSearchResults}>
                    <View style={{
                        backgroundColor: '#333333',
                        borderBottomWidth: 5,
                        borderColor: '#3399ff',
                        height: listHeight,
                        marginTop: 193,
                    }}>
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
        var rating = info.rating
            ? <Text>{info.rating + " Stars"}</Text>
            : null;

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
                                {rating}
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

        // TODO (urlauba): change url
        fetch('http://localhost:3000/api/search/'
            + this.state.latitude + '/' + this.state.longitude + '/'
            + text + '/' + this.state.locationText)
            .then((response) => response.text())
            .then((responseText) => {
                var data = JSON.parse(responseText);
                var arr = Object.keys(data).map(function(k) { return data[k] });
                var showOptions = arr.length ? true : false;

                var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                this.setState({
                    dataSource: ds.cloneWithRows(data),
                    numberOptions: arr.length,
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
