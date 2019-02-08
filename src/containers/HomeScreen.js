/**
 * HomeScreen: Root of the App, consists Main Menu (at the top) and quick links / Tags (at the middle) which links to few Important contents
 * of the App.
 */

import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import store from '../redux/store';
import { connect } from 'react-redux';
import Modal from "react-native-modal";
import * as types from '../constants/actionTypes';
import HomeTagsItem from '../component/NewsItem/HomeTagsItem';
import MainMenu from '../containers/MainMenu';
import Theme from '../styles/Theme';
import { LANGUAGES } from '../constants/serverAPIS';
var S = require('string');

const mapStateToProps = state => {
  return {
    data: state.data.menu,
    nodeMap: state.nodeList.nodeMap,
    nodeMapReady: state.nodeList.nodeMapReady,
    nodeUpdateInfoMap: state.nodeList.nodeUpdateInfoMap,
    languageCode: state.language.language_code,
    languageList: state.language.languageList,
    isConnected: state.netInfo.isConnected,
    showOffline: state.offlineMessage.showOffline,
    showLanguageLoader: state.language.showLanguageLoader,
    shareNode: state.shareNode,
    swipeArrayReady: state.swipeArray.swipeArrayReady,
    topMenu: state.data.topMenu,
    topMenuData: state.homeScreen.data,
    tags: state.tags.data
  }
};

class HomeScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalText: '',
      showAlert: false,
      currentLang: '',
      changeLang: '',
      changeLanguageConfirmation1: '',
      changeLanguageConfirmation2: '',
      confirmation: '',
      ok: '',
      cancel: '',
      nodeID: null,
      topMenuNidData: {},
      showToast: false,
      toastMessage: '',
      showConfirm: false,
      tagsDone: false,
      tagsData: []
    }
    this.cancelAlert = this.cancelAlert.bind(this);
    this.submitAlert = this.submitAlert.bind(this);
    this.tagsCompleted = this.tagsCompleted.bind(this);
    this.homescreenTagsCompleted = this.homescreenTagsCompleted.bind(this);
  }

  tagsCompleted() {
    this.setState({
      tagsDone: true
    })
  }

  homescreenTagsCompleted() {
    setTimeout(() => this.tagsCompleted(), 3000);
  }

  parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      var key = decodeURIComponent(pair[0]);
      var value = decodeURIComponent(pair[1]);
      if (typeof query_string[key] === "undefined") {
        query_string[key] = decodeURIComponent(value);
      } else if (typeof query_string[key] === "string") {
        var arr = [query_string[key], decodeURIComponent(value)];
        query_string[key] = arr;
      } else {
        query_string[key].push(decodeURIComponent(value));
      }
    }
    return query_string;
  }

  componentWillMount() {
    var tagsData = [];
    store.dispatch({ type: types.SET_HOME_IMAGE_LOADED, imageLoaded: false })
    if (this.props.tags != undefined) {
      this.props.tags.result.data && Array.isArray(this.props.tags.result.data) && this.props.tags.result.data.map((element) => {
        if (this.props.tags.entities.data[element] && this.props.tags.entities.data[element].is_home == 1) {
          tagsData.push(this.props.tags.entities.data[element])
        }
      })
    }
    this.setState({
      tagsData
    })
  }

  componentWillReceiveProps(nextProps) {
    var showLanguageLoader = nextProps.showLanguageLoader;
    var modalVisible = this.state.modalVisible;
    var languageCode = nextProps.languageCode;
    var languageList = nextProps.languageList;
    var tagsData = [];
    if (nextProps.tags != undefined) {
      nextProps.tags.result.data && Array.isArray(nextProps.tags.result.data) && nextProps.tags.result.data.map((element) => {
        if (nextProps.tags.entities.data[element] && nextProps.tags.entities.data[element].is_home == 1) {
          tagsData.push(nextProps.tags.entities.data[element])
        }
      })
    }
    this.setState({
      tagsData
    })

    if (nextProps.shareNode.language) {
      let arr = languageList.filter(item => item.code !== nextProps.shareNode.language)
      if (arr.length > 0) {
        return
      }
    }
    if (modalVisible !== showLanguageLoader) {
      var modalText = '';
      for (var i = 0; i < LANGUAGES.length; i++) {
        if (languageCode == LANGUAGES[i].code) {
          modalText = LANGUAGES[i].switchLanguage;
        }
      }
      this.setState({
        modalVisible: showLanguageLoader,
        modalText
      })
    }
    var nodeMapReady = nextProps.nodeMapReady;
    var swipeArrayReady = nextProps.swipeArrayReady
    var { nodeID, language } = nextProps.shareNode;
    if (language !== null && language !== undefined && (language !== languageCode)) {
      if (!this.state.showAlert) {
        this.setState({
          showAlert: true
        })
      }
    }

    if (nodeID !== null && language !== null) {
      if (nextProps.languageCode == language) {
        if (nodeMapReady && swipeArrayReady) {
          this.setState({
            showAlert: false
          })
          var nodeMap = nextProps.nodeMap;
          var nodeUpdateInfoMap = nextProps.nodeUpdateInfoMap;
          var nodeData = nodeMap.get(nodeID);
          if (nodeData !== undefined && nodeData.menu_type !== "top_menu" ) {
            var parentNid = nodeData.parent_nid;
            var nextNid = nodeData.next_nid;
            var prevNid = nodeData.prev_nid;
            nextProps.navigation.navigate({
              routeName: 'StoryView',
              params: {
                nid: nodeID,
                nodeMap: nodeMap,
                title: nodeMap.get(parentNid).title.toUpperCase(),
                parentNid: parentNid,
                nextNid: nextNid,
                prevNid: prevNid,
                nodeUpdateInfoMap: nodeUpdateInfoMap
              },
              key: nodeID
            });
          }
        }
      }
    }

  }

  cancelAlert() {
    this.setState({
      showAlert: false
    })
    store.dispatch({ type: types.SET_SHARED_CONTENT_NODE, nodeID: null, language: null });
  }

  submitAlert(language, nodeID) {
    this.setState({
      showAlert: false
    });
    store.dispatch({ type: types.ON_CHANGE_LANGUAGE, selected_language: language });
    store.dispatch({ type: types.SET_SHARED_CONTENT_NODE, nodeID: nodeID, language });
  }

  render() {

    const { nodeID, language } = this.props.shareNode;
    var languageCode = this.props.languageCode;
    var confirmation = '';
    var changeLanguageConfirmation1 = '';
    var currentLang = '';
    var nextLang = '';
    var changeLanguageConfirmation2 = '';
    var ok = '';
    var cancel = '';
    if (language !== null && language !== undefined && (language !== languageCode)) {
      for (var i = 0; i < LANGUAGES.length; i++) {
        if (languageCode == LANGUAGES[i].code) {
          currentLang = LANGUAGES[i].name;
          confirmation = LANGUAGES[i].confirmation;
          changeLanguageConfirmation1 = LANGUAGES[i].changeLanguageConfirmation1;
          changeLanguageConfirmation2 = LANGUAGES[i].changeLanguageConfirmation2;
          ok = LANGUAGES[i].ok;
          cancel = LANGUAGES[i].cancel;
        } else if (language == LANGUAGES[i].code) {
          nextLang = LANGUAGES[i].name;
        }
      }
    }
    return (
      <View style={{ flex: 1 }}>
        {
          (this.props.data === undefined && this.props.topMenuData.body === undefined && this.props.tags === undefined) ?
            <ActivityIndicator
              animating={true}
              color='#4c4c4c'
              size="small"
              style={styles.activityIndicator} />
            :
            <View style={styles.container}>
              <MainMenu
                navigation={this.props.navigation}
                data={(this.props.data !== undefined) ? this.props.data.entities.data : []}
                nodeMap={this.props.nodeMap}
                nodeUpdateInfoMap={this.props.nodeUpdateInfoMap} />
              <View style={styles.container1}>
                {
                  this.props.topMenuData.home_view_image && this.props.topMenuData.home_view_image !== undefined ?
                    <Image source={{ uri: this.props.topMenuData.home_view_image, cache: 'only-if-cached' }} style={styles.imgStyle} onLoadEnd={store.dispatch({ type: types.SET_HOME_IMAGE_LOADED, imageLoaded: true })} />
                    :
                    <Image source={require('../component/NewsItem/images/adappt-studio.jpg')} style={styles.imgStyle} onLoadEnd={store.dispatch({ type: types.SET_HOME_IMAGE_LOADED, imageLoaded: true })} />

                }
                {/* <View style={styles.imgTransparentLayer} /> */}
                <View style={styles.newsBodyContainer}>
                  <View>
                    <Text style={styles.newsTitleStyle}>
                      {(this.props.topMenuData.home_view_content !== undefined) ? S(this.props.topMenuData.home_view_content).replace(/<\/[p^]+(>|$)/g, "\n\n").stripTags().decodeHTMLEntities().trim().s : ''}
                    </Text>
                  </View>
                  <HomeTagsItem
                    tagsData={this.state.tagsData}
                    navigation={this.props.navigation}
                    tags={this.props.tags}
                    tagsCompleted={this.tagsCompleted}
                    homescreenTagsCompleted={this.homescreenTagsCompleted}
                  />
                </View>
              </View>
              <Modal isVisible={this.state.showAlert}
                style={styles.languageSwitchModalViewStyle}>
                <View style={styles.alertContainer}>
                  <Text style={styles.languageSwitchPopupTitleStyle}>{confirmation}</Text>
                  <Text style={styles.languageSwitchPopupMessageStyle}>{changeLanguageConfirmation1 + ' ' + currentLang + '. ' + changeLanguageConfirmation2 + nextLang + ' ?'}</Text>
                  <View style={styles.languageSwitchPopupAnswerStyle}>
                    <TouchableOpacity style={styles.langSwitchCancelAlertStyle} onPress={() => this.submitAlert(language, nodeID)}>
                      <Text style={styles.langSwitchCancelTextStyle}>{ok}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.langSwitchCancelAlertStyle} onPress={() => this.cancelAlert()}>
                      <Text style={styles.langSwitchCancelTextStyle}>{cancel}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  newsBodyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'transparent',
    marginRight: 15,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  newsTitleStyle: {
    marginTop: 50,
    fontSize: 30,
    color: '#FFF',
    fontFamily: "Nunito-Bold"
  },
  container: {
    flex: 1,
    backgroundColor: Theme.color.white
  },
  container1: {
    flex: 1,
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  },
  title: {
    fontSize: 22,
    color: Theme.color.darkgreen,
    textAlign: 'center',
    paddingTop: 20
  },
  emptyText: {
    color: '#4a4a4a',
    fontSize: 18,
    padding: 5
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alertContainer: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "rgba(0, 0, 0, 0.1)",
    paddingTop: 10,
    paddingLeft: 12,
    paddingRight: 12,
    flex: 1,
    maxWidth: 350
  },
  modalText: {
    color: Theme.color.white,
    paddingTop: 15,
    fontSize: 18
  },
  languageSwitchModalViewStyle: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
  },
  languageSwitchPopupTitleStyle: {
    marginBottom: 10,
    fontFamily: 'Nunito-Bold',
    fontSize: 20,
  },
  languageSwitchPopupMessageStyle: {
    fontFamily: 'Nunito',
    fontSize: 18,
    color: '#595959',
    marginBottom: 10
  },
  languageSwitchPopupAnswerStyle: {
    width: 350,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: "space-around"
  },
  langSwitchCancelAlertStyle: {
    padding: 8,
    flex: 1,
    alignItems: "center"
  },
  langSwitchCancelTextStyle: {
    fontFamily: 'Nunito',
    fontSize: 18,
    color: '#2e91fc'
  },
  imgStyle: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  imgTransparentLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
});

export default connect(mapStateToProps)(HomeScreen)