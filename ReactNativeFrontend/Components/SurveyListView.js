'use strict';

var React = require('react-native');

var {
    Image,
    ListView,
    PropTypes,
    RecyclerViewBackedScrollView,
    StyleSheet,
    Text,
    View,
} = React;

var SurveyListView = React.createClass({
    propTypes: {
        data: PropTypes.array.isRequired,
    },

    // may be a more efficient way
    componentWillReceiveProps: function(nextProps) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({dataSource: ds.cloneWithRows(nextProps.data)});
    },

    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return {
            dataSource: ds.cloneWithRows(this.props.data),
        };
    },

    render: function() {
        console.log(this.props.data)
        return (
            <View style={styles.list}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                />
            </View>
        );
    },

    _renderRow: function(info) {
        return (
            <View style={styles.row}>
                <View style={styles.directionRow}>
                    <Image
                        style={styles.thumbnail}
                        source={{uri: info.image_url}}
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
    list: {
        height: 200,
    },
    row: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 10,
        borderColor: '#333333',
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderTopWidth: 10,
        borderStyle: 'solid',
        padding: 10,
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
