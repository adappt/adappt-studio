import React, {Component} from 'react';
import {Text, View, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import { navigateHelper } from '../utils/navigateHelper';
const { width } = Dimensions.get('window');
import Entypo from 'react-native-vector-icons/Entypo'
const MenuListItem = ({data, navigation, nodeMap, lastItem, nodeUpdateInfoMap}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => {navigateHelper(data, navigation, nodeMap, nodeUpdateInfoMap, false, null)}}>
        <View style={styles.innerContainer}>
          <Entypo name="chevron-with-circle-right" color="#999" size={16}/>
          <Text style={styles.title}>{data.title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    width: width,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  },
  icon: {
    borderRadius: 20,
    width: 40,
    height: 40
  },
  title: {
    flex: 0.9,
    paddingLeft: 15,
    fontSize: 17,
    width: width - 40,
    fontFamily: 'Nunito-SemiBold',
    color: '#5a5959'
  }
});

export default MenuListItem;