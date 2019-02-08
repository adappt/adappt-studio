/**
 * Search:  Displays the Search Result from the App based on User's input.
 */

import React, { PropTypes, Component } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import store from '../redux/store';
import { connect } from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SearchItem from '../component/SearchItem';
import FeedbackMessage from '../component/FeedbackMessage';
import * as types from '../constants/actionTypes';
import ExternalStyles from '../styles/Basic';

const mapStateToProps = state => {
  return {
    displayList: state.search.displayList,
    strPresent: state.search.strPresent,
    nodeMap: state.nodeList.nodeMap,
    nodeUpdateInfoMap: state.nodeList.nodeUpdateInfoMap
  }
};

class Search extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View
          style={ExternalStyles.headerTitleStyle}>
          <Text style={ExternalStyles.textStyle}
            numberOfLines={1}>{navigation.state.params.search}</Text>
        </View>
      ),
      headerRight: (
        <View style={ExternalStyles.headerRight} />
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = { searchText: '', searchPattern: null };
    this.onChangeText = this.onChangeText.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentWillMount() {
    store.dispatch({ type: types.CLEAR_SEARCH_LIST })
  }

  componentWillReceiveProps() {
    this.textInput.clear()
  }

  onChangeText(text) {
    this.setState({
      searchText: text
    });

    if (text && text.length >= 3 && this.props.nodeMap) {
      store.dispatch({ type: types.SEARCH_NODE_LIST, str: text, nodeMap: this.props.nodeMap })
    } else {
      store.dispatch({ type: types.CLEAR_SEARCH_LIST })
    }
  }

  onCancel() {
    this.setState({
      searchText: ''
    });
    store.dispatch({ type: types.CLEAR_SEARCH_LIST })
  }

  render() {
    const { searchText } = this.state;
    const { navigation, nodeMap, nodeUpdateInfoMap, displayList, strPresent } = this.props;
    const { searchHere, noContent, noResultSearch } = navigation.state.params;

    return (
      <View style={styles.container}>
        <View style={{ backgroundColor: '#868686' }}>
          <SimpleLineIcons name="magnifier" color="#aaa" size={18} style={styles.searchIcon} />
          {searchText.length > 0 ?
            <TouchableOpacity onPress={() => this.onCancel()} style={styles.inputClose}>
              <SimpleLineIcons name="close" color="#aaa" size={20} />
            </TouchableOpacity> : null
          }
          <TextInput
            style={styles.inputText}
            onChangeText={(text) => this.onChangeText(text)}
            placeholder={searchHere}
            underlineColorAndroid='transparent'
            maxLength={24}
            autoCorrect={false}
            autoFocus={true}
            ref={input => {
              this.textInput = input
            }}
            value={searchText}
          />
        </View>
        {displayList && displayList.length === 0 ?
          (strPresent) || searchText.length === 0 ?
            <FeedbackMessage message={noContent} iconName={'search'} /> :
            <FeedbackMessage message={noResultSearch + ' "' + searchText + '"'} iconName={'search'} /> :
          <FlatList
            data={displayList}
            keyExtractor={item => item.nid}
            renderItem={({ item }) => <SearchItem data={item} nav={navigation} nodeMap={nodeMap}
              searchText={searchText} nodeUpdateInfoMap={nodeUpdateInfoMap} />}
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
  searchIcon: {
    position: 'absolute',
    zIndex: 1,
    left: 14,
    top: 14
  },
  inputText: {
    height: 35,
    padding: 8,
    borderWidth: 1,
    borderColor: '#fff',
    margin: 5,
    borderRadius: 50,
    backgroundColor: '#fff',
    paddingLeft: 35,
    paddingRight: 25,
    lineHeight: 18
  },
  inputClose: {
    position: 'absolute',
    zIndex: 1,
    right: 5,
    top: 5,
    padding: 8
  }
});

export default connect(mapStateToProps)(Search)