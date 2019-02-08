/**
 * Favorite: Lists the items which are favorited by the user.
 */

import React, { PropTypes, Component } from 'react';
import { View, Text, StyleSheet, FlatList, AsyncStorage, Platform, ActivityIndicator, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import FavouriteItem from '../component/FavouriteItem';
import FeedbackMessage from '../component/FeedbackMessage';
var Dimensions = require('Dimensions');
var { width } = Dimensions.get('window');
import { Theme } from '../styles';

const mapStateToProps = state => {
  return {
    favourite: state.favourite.fav,
    nodeMap: state.nodeList.nodeMap,
    nodeUpdateInfoMap: state.nodeList.nodeUpdateInfoMap
  }
};

function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

function shallowCompare(instance, nextProps, nextState) {
  return !shallowEqual(instance.props, nextProps);
}

class Favorite extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View style={{flex:1, alignItems:'center', justifyContent:"center", paddingRight: 20}}>
          <Text
            style={{ justifyContent: 'center', color: Theme.color.darkgray, fontSize: 18, fontFamily: 'Nunito-Bold' }}
            numberOfLines={1}>{navigation.state.params.favorites}
          </Text>
        </View>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      favData: [],
      favArray: []
    };
  }

  componentWillMount() {
    Keyboard.dismiss();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((this.props.favourite !== nextProps.favourite)) {
      return true
    }
    return shallowCompare(this, nextProps, nextState);
  }
  render() {
    return (
      <View style={styles.container}>
        {this.props.favourite && this.props.favourite.length === 0 ?
          <FeedbackMessage message={this.props.navigation.state.params.noFavorite} iconName={'heart-o'} /> :
          (this.props.favourite && this.props.favourite.length === 0) ? <ActivityIndicator size="small" color="#ed9100" style={styles.activityIndicator} /> :
            <FlatList
              initialNumToRender={15}
              data={this.props.favourite}
              overScrollMode={'always'}
              renderItem={({ item }) => <FavouriteItem data={item} nav={this.props.navigation} nodeMap={this.props.nodeMap} nodeUpdateInfoMap={this.props.nodeUpdateInfoMap} />}
              keyExtractor={item => item.nid}
            />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  nofav: {
    marginTop: 10,
    color: '#888',
    fontSize: 22,
    textAlign: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    fontFamily: 'Nunito'
  },
  activityIndicator: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
    height: 80
  }
});

export default connect(mapStateToProps)(Favorite)