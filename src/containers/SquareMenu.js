/**
 * SquareMenu: A secondary level Menu which lists the menu items along with Icons .
 */

import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, StatusBar, Platform } from 'react-native';
import SquareMenuItem from '../component/SquareMenuItem/SquareMenuItem';
import FeedbackMessage from '../component/FeedbackMessage';
import { connect } from 'react-redux';
import MainMenu from '../containers/MainMenu';
const { width, height } = Dimensions.get('window');

const mapStateToProps = state => {
  return {
    menudata: state.data.menu,
    nodeMap: state.nodeList.nodeMap,
    nodeUpdateInfoMap: state.nodeList.nodeUpdateInfoMap,
    data: state.data.menulist.entities.data
  }
};

class SquareMenu extends Component {

  renderMenuItems(navigationData) {
    let style = {};
    let menuType = styles.subContainer;
    const { navigation } = this.props;
    const { data, nodeMap, nodeUpdateInfoMap } = navigation.state.params;
    if (navigationData.length <= 4) {
      style = {
        flex: navigationData.length == 1 ? 1 : 1 / 2,
      }
      menuType = styles.squareMenuItem;
    }

    var output = navigationData.map((item, index, arr) => {
      let bgColor = index % 2 === 0 ?  '#fff' : '#f1f1f1' ;
      return (<SquareMenuItem
        style={[menuType, style, { backgroundColor: bgColor }]}
        text={item.title} data={item} index={index} key={index} navigation={navigation}
        menuSquareLength={data.length}
        nodeMap={nodeMap} nodeUpdateInfoMap={nodeUpdateInfoMap} />)
    });

    if (navigationData.length <= 4)
      return output;

    var finalOutput = (
      <ScrollView>
        <View style={styles.scrollViewContainer}>
          {output}
        </View>
      </ScrollView>
    );
    return finalOutput
  }
  render() {
    const { navigation, nodeMap, nodeUpdateInfoMap, menudata } = this.props;
    const { data } = this.props.navigation.state.params;
    var nonHiddenMenus = data.filter((item, index, arr) => {
      if (!item.hide_menu || (item.hide_menu != null && item.hide_menu != 1)) {
        return item;
      }
    });
    if (data) {
      let children = this.renderMenuItems(nonHiddenMenus);
      return (
        <View style={styles.container}>
          <MainMenu activekey={navigation.state.key} activeKeyBreadcrumb={navigation.state.params.activeKey} navigation={navigation} data={menudata.entities.data} nodeMap={nodeMap} nodeUpdateInfoMap={nodeUpdateInfoMap} />
          {children}
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
    backgroundColor: '#ddd'
  },
  scrollViewContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  subContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    flexDirection: 'row',
    paddingLeft: 25,
    width: width,
    height: Platform.OS === 'ios' ? (height - 160) / 4 : (height - 155 - StatusBar.currentHeight) / 4
  },
  squareMenuItem: {
    flex: 1 / 2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 25,
    flexWrap: 'wrap',
  }
});

export default connect(mapStateToProps)(SquareMenu);