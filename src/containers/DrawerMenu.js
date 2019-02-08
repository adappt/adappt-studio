/**
 * DrawerMenu: Sidebar which opens up when the user clicks on the hamburger menu.
 * It lists the menu items along with icons.
*/

import React, { Component } from 'react';
import { Platform, StyleSheet, Image, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import store from '../redux/store';
import { LANGUAGES } from '../constants/serverAPIS';
import * as types from '../constants/actionTypes';
import NavigationService from '../navigators/NavigationService';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ifIphoneX} from 'react-native-iphone-x-helper';
var Dimensions = require('Dimensions');
var { width } = Dimensions.get('window');
import { Theme } from '../styles';
import { connect } from 'react-redux';
import DrawerMenuItem from '../component/DrawerMenuItem';
var DeviceInfo = require('react-native-device-info');

const mapStateToProps = state => {
  return {
    data: state.data.menu,
    nodeMap: state.nodeList.nodeMap,
    nodeUpdateInfoMap: state.nodeList.nodeUpdateInfoMap,
    serverMessage: state.serverMessage,
    languageCode: state.language.language_code,
    languageList: state.language.languageList,
    mainDrawer: state.drawer.mainDrawer,
    showLanguageLoader: state.language.showLanguageLoader,
    nodeID: state.shareNode.nodeID,
    tags: state.tags.data,
    topMenuData: state.homeScreen.data,
    imageLoaded: state.homeScreen.imageLoaded
  }
};

class MainMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      primaryLabel: '',
      secondaryLabel: '',
      quickMenu: '',
      modalVisible: false,
      navigateHome: false,
    }
    this.flag = true
  }

  createLanguageMenuItems() {
    return this.props.languageList.map((item, i) => {
      return (
        <TouchableOpacity key={i} onPress={() => {
          this.setState({
            navigateHome: true
          })
          var currentLang = this.props.languageCode;
          if (currentLang !== item.code) {
            store.dispatch({ type: types.ON_CHANGE_LANGUAGE, selected_language: item.code });
          }
        }}>
          <View style={styles.row}>
            <View style={styles.rightContainer}>
              <Text style={styles.txtRight}>{item.name}</Text>
              {(this.props.languageCode == item.code) ?
                <MaterialIcons name='check' size={22} style={{ color: Theme.color.darkgray }} />
                :
                null
              }
            </View>
          </View>
        </TouchableOpacity>
      )
    })
  }

  languageDispatch = () => {
    store.dispatch({ type: types.RESET_TO_MAIN_DRAWER, mainDrawer: false });
  }

  createMenuItems() {
    if (this.props.data !== undefined) {
      var menuItems = [];
      var that = this;
      var _sort = Object.keys(this.props.data.entities.data).map(function (a, b) {
        return that.props.data.entities.data[a];
      }).sort((a, b) => {
        return a.weight - b.weight;
      });
      for (var item in _sort) {
        if (_sort.hasOwnProperty(item)) {
          var i = Object.keys(_sort).indexOf(item);
          var menuItemData = this.props.data.entities.data[_sort[item].nid];
          menuItems.push(<DrawerMenuItem hasChildren={false} data={menuItemData} navigation={this.props.navigation} key={i} nodeMap={this.props.nodeMap} nodeUpdateInfoMap={this.props.nodeUpdateInfoMap} />)
        }
      }
      
      var languageMenuItem = (
        this.props.languageList.length > 1 ?  
        <TouchableOpacity style={styles.row} key="language" onPress={() => this.languageDispatch()} >
          <View style={styles.leftContainer}>
            <SimpleLineIcons name="globe" size={18} color={Theme.color.darkgray} />
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.txtRight} >{this.state.primaryLabel}</Text>
            <MaterialIcons name='keyboard-arrow-right' size={22} style={{ color: Theme.color.darkgray }} />
          </View>
        </TouchableOpacity> : null
      )

      var versionItem = (<View style={styles.row} key="version">
        <View style={styles.leftContainer}>
          <SimpleLineIcons name="info" size={18} color={Theme.color.darkgray} />
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.txtRight}>Version: {DeviceInfo.getVersion()}({DeviceInfo.getBuildNumber()})</Text>
        </View>
      </View>)

      menuItems.push(languageMenuItem)
      menuItems.push(versionItem)
      return menuItems
    }
    return null;
  }

  toggleMainDrawer() {
    store.dispatch({ type: types.RESET_TO_MAIN_DRAWER, mainDrawer: !this.props.mainDrawer });
  }

  componentWillReceiveProps(nextProps) {
    var showLanguageLoader = nextProps.showLanguageLoader;
    var modalVisible = this.state.modalVisible;
    var languageCode = nextProps.languageCode;
    var tags = nextProps.tags;
    var topMenuData = nextProps.topMenuData;
    var imageLoaded = nextProps.imageLoaded;
    if (modalVisible !== showLanguageLoader) {
      var languageCode = nextProps.languageCode;
      var modalText = '';
      for (var i = 0; i < LANGUAGES.length; i++) {
        if (languageCode == LANGUAGES[i].code) {
          modalText = LANGUAGES[i].switchLanguage;
        }
      }
      var displayModal = showLanguageLoader || (tags === undefined) || (topMenuData.home_view_image === undefined) || !imageLoaded;
      if (displayModal !== this.state.modalVisible) {
        this.setState({
          modalVisible: displayModal,
          modalText
        })
      }
    }

    for (var i = 0; i < LANGUAGES.length; i++) {
      if (languageCode == LANGUAGES[i].code) {
        this.setState({
          primaryLabel: LANGUAGES[i].primaryLabel,
          secondaryLabel: LANGUAGES[i].secondaryLabel,
          quickMenu: LANGUAGES[i].quickMenu
        })
      }
    }

    var self = this;
    setTimeout(function () {
      if (nextProps.showLanguageLoader == false) {
        self.flag = true
      }
      if (nextProps.showLanguageLoader == true && self.state.navigateHome) {
        if (self.flag) {
          self.setState({
            navigateHome: false
          })
          store.dispatch({ type: types.RESET_TO_MAIN_DRAWER, mainDrawer: true });
          NavigationService.reset('Home', 'home');
          self.flag = false
        }
      }
    }, 1000);
  }

  render() {
    const { mainDrawer } = this.props;

    if (mainDrawer) {
      return (
        <View style={{ backgroundColor: Theme.color.white, flex: 1 }}>
          <View style={styles.toolBarContainer}>
            <View style={styles.navLeft}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerClose')}>
                <SimpleLineIcons name='arrow-left' size={22}
                  style={styles.leftArrowIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.navCenter}>
              <Text style={styles.quickMenuTitle}>{this.state.quickMenu}</Text>
            </View>
            <View style={styles.navRight} />
          </View>
          <ScrollView>
            {this.createMenuItems()}
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={{ backgroundColor: Theme.color.white, flex: 1 }}>
        <Modal
          visible={this.state.modalVisible}
          style={styles.modalContainer}
          animationType="none"
          transparent={true}
          onRequestClose={() => {
          }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <ActivityIndicator
              color='#FFF'
              size="large"
            />
            <Text style={styles.modalText}>{this.state.modalText}</Text>
          </View>
        </Modal>
        <View style={styles.toolBarContainer}>
          <View style={styles.navLeft}>
            <TouchableOpacity onPress={() => this.toggleMainDrawer()}>
              <SimpleLineIcons name='arrow-left' size={22}
                style={styles.leftArrowIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.navCenter}>
            <Text style={styles.quickMenuTitle}>{this.state.secondaryLabel}</Text>
          </View>
          <View style={styles.navRight} />
        </View>
        <ScrollView>
          {this.createLanguageMenuItems()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toolBarContainer: {
    ...ifIphoneX({height:88}, {height: 64}),
    ...ifIphoneX({paddingTop: 38}, (Platform.OS === 'android') ? null : {paddingTop: 13}),
    top: 0,
    width: width - 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row'
  },
  navLeft: {
    height: 40,
    width: 60,
    paddingTop: (Platform.OS === 'android') ? 10 : 6
  },
  navCenter: {
    flex: 1,
    paddingTop: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navRight: {
    width: width * .15,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
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
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  txtRight: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#5a5959'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    color: Theme.color.white,
    paddingTop: 15,
    fontSize: 18
  },
  leftArrowIcon: {
    paddingLeft: 18,
    paddingTop: 6,
    height: 40,
    width: 60,
    justifyContent: 'center',
    color: '#595959'
  },
  quickMenuTitle: {
    color: Theme.color.darkgray,
    fontSize: 20,
    fontFamily: 'Nunito-Bold'
  }
});

export default connect(mapStateToProps)(MainMenu)