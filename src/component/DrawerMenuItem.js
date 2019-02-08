import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Theme} from '../styles';
import { navigateHelper } from '../utils/navigateHelper'; 

const MenuListItem = ({data, navigation, nodeMap, nodeUpdateInfoMap}) => {
  return (
    <TouchableOpacity style={styles.row} onPress={() => navigateHelper(data, navigation, nodeMap, nodeUpdateInfoMap, false, null)}>
      <View style={styles.leftContainer}>
        {data.icon ?
          <Image source={{uri: data.icon}} style={styles.icon}/> :
          <SimpleLineIcons name="layers" size={18} color={Theme.color.darkgray}/>
        }
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.txtRight}>{data.title}</Text>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingLeft: 10,
    paddingRight: 15
  },
  leftContainer: {
    justifyContent: 'center',
    width: 30,
  },
  rightContainer: {
    paddingTop: 15,
    paddingBottom: 15,
  },
  txtRight: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#5a5959'
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#565656'
  }
});

export default MenuListItem;