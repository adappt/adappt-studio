import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { navigateHelper } from '../utils/navigateHelper';

const FavouriteItem = ({data, nav, nodeMap, nodeUpdateInfoMap}) => {
  var nodeData = nodeMap.get(data.nid);
  return (
    <TouchableOpacity onPress={() =>  navigateHelper(nodeData, nav, nodeMap, nodeUpdateInfoMap, false, null)}>
      <View style={styles.container}>
        <Text style={styles.favTitle}>{data.title}</Text>
        <Text style={styles.favContent}>{data.body ? data.body  + '...': ''}</Text>
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

export default FavouriteItem;