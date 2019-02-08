/**
 * MenuList: A tertiary level Menu which lists the menu items .
 */

import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import MenuListItem from '../component/MenuListItem';
import FeedbackMessage from '../component/FeedbackMessage';
import ExternalStyles from '../styles/Basic';
import { navigateHelper } from '../utils/navigateHelper';

class MenuList extends Component {
  static navigationOptions = ({ navigation }) => {
    let nodeData = navigation.state.params.nodeMap.get(navigation.state.params.parentNid);
    return {
      headerTitle: (
        <TouchableOpacity onPress={() => navigateHelper(nodeData, navigation, navigation.state.params.nodeMap, navigation.state.params.nodeUpdateInfoMap, false, null)}
          style={ExternalStyles.headerTitleStyle}>
          <Text style={ExternalStyles.textStyle} numberOfLines={1}>{navigation.state.params.title}</Text>
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => navigateHelper(nodeData, navigation, navigation.state.params.nodeMap, navigation.state.params.nodeUpdateInfoMap, false, null)}
          style={ExternalStyles.headerRight}>
        </TouchableOpacity>
      )
    };
  };

  render() {
    if (this.props.navigation.state.params.data) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.props.navigation.state.params.data}
            renderItem={({ item }) => {
              return <MenuListItem data={item} navigation={this.props.navigation} nodeMap={this.props.navigation.state.params.nodeMap} nodeUpdateInfoMap={this.props.navigation.state.params.nodeUpdateInfoMap} />
            }}
            keyExtractor={item => item.title}
          />
        </View>
      )
    } else {
      return <FeedbackMessage message={'No children available'} />
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  }
});

export default MenuList;