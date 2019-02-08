import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Highlighter from 'react-native-highlight-words';
import { navigateHelper } from '../utils/navigateHelper';
const S = require('string');

const SearchItem = ({data, nav, nodeMap, searchText, nodeUpdateInfoMap}) => {
  const nodeData = nodeMap.get(data.nid);
  let decodeArticle = '';
  if (nodeData !== undefined) {
    var title = nodeData.title;
    const body = data.text_data;
    decodeArticle = S(body).stripTags().decodeHTMLEntities().trim().s;
    const _text = searchText.toLowerCase();
    const _case = decodeArticle.toLowerCase();
    const _pos = _case.indexOf(_text);
    decodeArticle = decodeArticle.substring(_pos);
    if (_pos > searchText.length) {
      decodeArticle = '...' + decodeArticle;
    }
  }
  return (
    <TouchableOpacity onPress={() =>  navigateHelper(nodeData, nav, nodeMap, nodeUpdateInfoMap, false, searchText)}>
      <View style={styles.container}>
        <Highlighter
          highlightStyle={{backgroundColor: 'yellow'}}
          searchWords={[searchText]}
          style={styles.favTitle}
          textToHighlight={title}
          autoEscape={true}
        />
        <Highlighter
          highlightStyle={{backgroundColor: 'yellow'}}
          searchWords={[searchText]}
          style={styles.favContent}
          autoEscape={true}
          textToHighlight={decodeArticle.length > 250 ? decodeArticle.substring(0, 250) + '...' : decodeArticle }
        />
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  favTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#005744',
    fontFamily: 'Nunito-Bold'
  },
  favContent: {
    fontSize: 16,
    fontFamily: 'Nunito',
    lineHeight: 20,
    color: '#5a5959',
    flexWrap: 'nowrap'
  }
});
export default SearchItem;