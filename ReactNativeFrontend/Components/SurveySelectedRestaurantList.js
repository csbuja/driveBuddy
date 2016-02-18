'use strict';

var React = require('react-native');
var SurveyRestaurantCard = require('./SurveyRestaurantCard');

var {
    PropTypes,
    ListView,
    RecyclerViewBackedScrollView,
    StyleSheet,
    Text,
    View,
} = React;

var SurveySelectedRestaurantList = React.createClass({
    propTypes: {
        onRestaurantRemove: PropTypes.func.isRequired,
        restaurantInfo: PropTypes.array.isRequired,
    },

    // may be a more efficient way
    componentWillReceiveProps: function(nextProps) {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState({dataSource: ds.cloneWithRows(nextProps.restaurantInfo)});
    },

    getInitialState: function() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        return {
            dataSource: ds.cloneWithRows(this.props.restaurantInfo),
        };
    },

    render: function() {
        return (
            <View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderScrollComponent={
                        props => <RecyclerViewBackedScrollView {...props} />
                    }
                    contentContainerStyle={styles.list}
                />
            </View>
        );
    },

    _renderRow: function(info) {
        return (
            <View style={styles.listItem}>
                <SurveyRestaurantCard
                    onRestaurantRemove={this.props.onRestaurantRemove}
                    info={info}
                />
            </View>
        )
    },
});

var styles = StyleSheet.create({
    list: {
        alignItems: 'center',
    },
    listItem: {
        margin: 10,
    },
})

module.exports = SurveySelectedRestaurantList;
