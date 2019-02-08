import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as types from '../../constants/actionTypes';

const HomeTagsItem = ({ tagsData, navigation }) => {
  return (
    <View style={styles.tagsContainer}>
      { tagsData.map((value, index) => {
        return (
          <TouchableOpacity key={index} activeOpacity={0.7}
            onPress={() => navigation.navigate({ routeName: 'Tag', params: { nids: value.nids, data: value }, key: 'hometag' })}>
            <View style={styles.textWrapper}>
              <Text style={styles.newsTags}>{value.name}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
};

const styles = StyleSheet.create({
  tagsContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  textWrapper: {
    backgroundColor: '#eee',
    borderRadius: 25,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 10,
    marginRight: 10
  },
  newsTags: {
    fontFamily: 'Nunito',
    color: '#333',
    fontSize: 15
  }
});
export default HomeTagsItem;