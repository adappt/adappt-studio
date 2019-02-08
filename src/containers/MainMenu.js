/**
 * MainMenu: Horizontal Menu which list all the Menu Items. (which lives at the top of the HomeScreen)
 */

import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import MainMenuItem from '../component/MainMenuItem';

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItems: [],
    }
    this.renderItem = this.renderItem.bind(this);
    this.onActive = this.onActive.bind(this);
  }

  componentWillMount() {
    var that = this;
    var menuItems = [];
    var _sort = Object.keys(this.props.data).map(function (a, b) {
      return that.props.data[a];
    }).sort((a, b) => {
      return a.weight - b.weight;
    });

    for (var item in _sort) {
      if (_sort.hasOwnProperty(item)) {
        var i = Object.keys(_sort).indexOf(item);
        var menuItemData = this.props.data[_sort[item].nid];
        menuItems.push(menuItemData)
      }
    }
    this.setState({
      menuItems
    })
  }

  componentWillReceiveProps(nextProps) {
    var that = this;
    var menuItems = [];
    var _sort = Object.keys(nextProps.data).map(function (a, b) {
      return nextProps.data[a];
    }).sort((a, b) => {
      return a.weight - b.weight;
    });

    for (var item in _sort) {
      if (_sort.hasOwnProperty(item)) {
        var i = Object.keys(_sort).indexOf(item);
        var menuItemData = nextProps.data[_sort[item].nid];
        menuItems.push(menuItemData)
      }
    }
    this.setState({
      menuItems
    })
  }

  onActive = (index, lastindex) => {
    if (this._flatList) {
      if (index == lastindex) {
        this._flatList.scrollToIndex({ animated: true, index: index, viewPosition: 1 });
      } else {
        this._flatList.scrollToIndex({ animated: true, index: index, viewPosition: 0.5 });
      }
    }
  };

  renderItem = (item, index, lastindex) => {
    return (
      <MainMenuItem
        index={index}
        onActive={(index) => this.onActive(index, lastindex)}
        activekey={this.props.activekey}
        activeKeyBreadcrumb={this.props.activeKeyBreadcrumb}
        data={item} navigation={this.props.navigation}
        nodeMap={this.props.nodeMap}
        nodeUpdateInfoMap={this.props.nodeUpdateInfoMap}
      />
    )
  }

  render() {
    var output = this.state.menuItems.filter((item, index, arr) => {
      if (!item.hide_menu || (item.hide_menu != null && item.hide_menu != 1)) {
        return item;
      }
    });
    var lastindex = output.length - 1
    return (
      <View style={[this.props.navigation.state.routeName === "Home" ? styles.homescreenMenu : styles.menusquareMenu]}>
        <FlatList
          contentContainerStyle={{ alignItems: 'center' }}
          showsHorizontalScrollIndicator={false}
          ref={(ref) => this._flatList = ref}
          horizontal={true}
          data={output}
          renderItem={({ item, index }) => this.renderItem(item, index, lastindex)}
          keyExtractor={item => item.title}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  homescreenMenu: {
    backgroundColor: 'rgba(255, 255, 255,.8)',
    position: 'absolute',
    height: 45,
    zIndex: 5
  },
  menusquareMenu: {
    backgroundColor: 'rgb(210, 210, 210)',
    height: 45
  }
});

export default MainMenu