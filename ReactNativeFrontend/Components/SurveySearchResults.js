'use strict';

var Overlay = require('react-native-overlay');
var React = require('react-native');
var SurveySearchBar = require('./SurveySearchBar');

var {
    Image,
    ListView,
    PropTypes,
    RecyclerViewBackedScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
} = React;

var SurveyRestaurantResults = React.createClass({
    propTypes: {
        data: PropTypes.any.isRequired,
        enableResults: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired,
    },

    render: function() {
        var listHeight = 54 * Math.min(Object.keys(this.props.data).length, 3);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.props.data);

        return (
            <Overlay
                isVisible={this.props.enableResults}>
                <View style={{
                    backgroundColor: '#333333',
                    borderBottomWidth: 5,
                    borderColor: '#6BCDFD',
                    height: listHeight,
                    marginTop: 176,
                }}>
                    <ListView
                        dataSource={dataSource}
                        keyboardShouldPersistTaps={true}
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
                            </View>
                            <Text style={styles.address}>{info.address}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        );
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
        backgroundColor: '#6BCDFD',
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

module.exports = SurveyRestaurantResults;
