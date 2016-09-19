var React = require('react-native');

var {
    AsyncStorage,
    PropTypes,
} = React;

var SwiperContainerMixin = function(props) {
    return {
        propTypes: {
            currentPosition: PropTypes.shape({
                latitude: PropTypes.number,
                longitude: PropTypes.number,
            }).isRequired,
            lastPosition: PropTypes.shape({
                latitude: PropTypes.number,
                longitude: PropTypes.number,
            }).isRequired,
            navigator: PropTypes.object,
            onSetOptions: PropTypes.func,
            onSwipe: PropTypes.func,
            optionLatitude: PropTypes.number,
            optionLongitude: PropTypes.number,
            options: PropTypes.array.isRequired,
        },

        getInitialState: function() {
            return {
                loading: false,
                userID: '',
            };
        },

        componentWillReceiveProps: function(nextProps) {
            // option refresh set in componentWillMount but initially
            // currentPosition is null, this refreshes once when no longer null
            if (!this.props.currentPosition.latitude
                && !this.props.currentPosition.longitude
                && nextProps.currentPosition.latitude
                && nextProps.currentPosition.longitude
            ) {
                this._setOptions(nextProps.currentPosition, nextProps.lastPosition);
            }
        },

        componentWillMount: function() {
            this._getUserID();

            this._setOptions(
                this.props.currentPosition,
                this.props.lastPosition
            );

            this.setInterval(
                () => {
                    this._setOptions(
                        this.props.currentPosition,
                        this.props.lastPosition
                    );
                }, 5 * 60 * 1000 // 5 minutes
            );
        },

        _hasSetOptions: function() {
            this.setState({hasNewOptions: false});
        },

        _setOptions: function(currentPosition, lastPosition) {
            var current = JSON.stringify(currentPosition);
            var last = JSON.stringify(lastPosition);
            var config = require("../config");
            // TODO (urlauba): change url path
            var endpoint = (props.isFoodSwiper)
                ? 'http://' + config.hostname+ '/api/yelp/' + current + '/' + last + '/' + this.state.userID
                : 'http://' + config.hostname+ '/api/gas/' + current + '/' + last;

            this.props.onSetOptions([]);
            this.setState({loading: true, hasNewOptions: true});
            if (currentPosition.latitude && currentPosition.longitude) {
                fetch(endpoint).then((response) => response.text()
                ).then((responseText) => {
                    var data = JSON.parse(responseText);
                    var options = Object.keys(data).map(function(k) {
                        var item = data[k];
                        if (!props.isFoodSwiper) {
                            item.image = 'https://cdn3.iconfinder.com/data/icons/map/500/gasstation-512.png';
                        }
                        return item;
                    });
                    options.sort((a, b) => { return (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0); });
                    this.setState({loading: false});
                    this.props.onSetOptions(options);
                }).catch((error) => {
                    // TODO (urlauba): handle error state
                    this.setState({loading: false, hasNewOptions: false});
                });
            }
        },

        _getUserID: function() {
            AsyncStorage.getItem('userID').then(function(userID) {
                this.setState({userID: userID});
            }.bind(this)).catch(function(error) {
                console.log('error retrieving userID from disc' + error);
            });
        },
    };
};

module.exports = SwiperContainerMixin;
