'use strict';

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
        height: PropTypes.number.isRequired,
        onLayout: PropTypes.func,
        onPress: PropTypes.func.isRequired,
        selected: PropTypes.object.isRequired,
    },

    render: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.props.data);

        return (
            <ListView
                dataSource={dataSource}
                keyboardShouldPersistTaps={true}
                onLayout={this.props.onLayout}
                renderRow={this._renderRow}
                renderScrollComponent={
                    props => <RecyclerViewBackedScrollView {...props} />
                }
                renderSeparator={(secID, rowID, adjHighlighted) =>
                    <View key={rowID} style={styles.separator} />
                }
                style={[styles.list, { height: this.props.height }]}
            />
        );
    },

    _renderRow: function(info, sectionID, rowID, adjHighlighted) {
        var highlight = (info.id in this.props.selected)
            ? styles.highlight
            : {};

        return (
            <TouchableHighlight
                key={rowID}
                onPress={() => this.props.onPress(info)}>
                <View style={[styles.row, highlight]}>
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
    highlight: {
        backgroundColor: '#6BCDFD',
    },
    list: {
        backgroundColor: '#333333',
        borderColor: '#6BCDFD',
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
