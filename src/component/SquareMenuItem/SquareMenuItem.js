import React from 'react';
import { Text, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { navigateHelper } from '../../utils/navigateHelper';
const defaultIcon = require('./images/default-icon.png');
const { width } = Dimensions.get('window');

const SquareMenuItem = ({ data, navigation, nodeMap, text, style, nodeUpdateInfoMap }) => {
  return (
    <TouchableOpacity activeOpacity ={.9} onPress={() => { navigateHelper(data, navigation, nodeMap, nodeUpdateInfoMap, true, null) }} style={style}>
      {data.icon ? 
        <Image source={{ uri: data.icon }} style={[styles.icon,{tintColor:'#999'}]}/> :
        <Image source={defaultIcon} style={[styles.icon,,{tintColor:'#999'}]}/>
      }
      <Text style={styles.title} numberOfLines={2}>{text.toUpperCase()}</Text>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  title: {
    fontSize: 19,
    color: '#595959',
    paddingLeft:20,
    fontFamily: 'Nunito-Bold',
    width: width - 100
  },
  icon: {
    width: width * .09,
    height: width * .09
  },
  iconImg: {
    justifyContent: 'center'
  }
});

export default SquareMenuItem;
