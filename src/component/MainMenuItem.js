import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'; 
import { navigateHelper } from '../utils/navigateHelper';

class MenuListItem extends Component {
  constructor(props){
    super(props);
  }
  
  onLayoutCall=(activekey, data, onActive, index, activeKeyBreadcrumb)=>{
    this.refs.Marker.measure((x, y, width, height, pageX, pageY) => {
      activekey == data.nid || activeKeyBreadcrumb === data.nid ? onActive(index) : null
    })
  };
  
  render() {
    const { data, navigation, nodeMap, nodeUpdateInfoMap, activekey, activeKeyBreadcrumb, onActive, index } = this.props;
    return (
      <TouchableOpacity onPress={() => navigateHelper(data, navigation, nodeMap, nodeUpdateInfoMap, true, null)}>
        <View ref="Marker"
          onLayout={({ nativeEvent }) => this.onLayoutCall(activekey, data, onActive, index, activeKeyBreadcrumb)}
          style={{
            height: 45,
            backgroundColor: activekey == data.nid || activeKeyBreadcrumb === data.nid ? '#f9f9f9' : null,
            borderBottomColor: activekey == data.nid || activeKeyBreadcrumb === data.nid ? '#ed9100' : 'transparent',
            borderBottomWidth: 5, justifyContent: 'center'
          }}>
          <Text style={styles.title}>{data.title.toUpperCase()}</Text>
        </View>
      </TouchableOpacity>
    )
  };
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    paddingTop:4,
    paddingRight: 10,
    paddingLeft: 10,
    fontFamily: 'Nunito-SemiBold',
    color: '#333'
  }
});
export default MenuListItem;