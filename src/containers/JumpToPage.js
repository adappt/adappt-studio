/**
 * JumpToPage: Displays the list of countries. On click of each countries shows the statistics about that country in an external browser.
 */

import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, AsyncStorage, ActivityIndicator, FlatList, Image, TouchableOpacity, Linking, TextInput, Platform } from 'react-native';
import Flag from 'react-native-flags';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { LANGUAGES } from '../constants/serverAPIS';
import { connect } from 'react-redux';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Theme } from '../styles';
import { navigateHelper } from "../utils/navigateHelper";

var RNFS = require('react-native-fs');
var { width, height } = Dimensions.get('window');

const mapStateToProps = state => {
  return {
    languageCode: state.language.language_code
  }
};


class JumpToPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      searchTerm: '',
      noCountry: '',
      trackable: false,
      shareText1: "",
      shareText2: "",
      noContent: "",
      showLoader: true,
      showBreadCrumb: true,
      breadCrumsElementArray: []
    }
    this.navigateFromBreadCrumb = this.navigateFromBreadCrumb.bind(this);
  }

  componentWillMount() {
    const { nid, nodeMap, nodeUpdateInfoMap } = this.props.navigation.state.params;
    var updateInfo = nodeUpdateInfoMap.get(nid + '');
    this.nodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo)
    let languageCode = this.props.languageCode;

    for (let i = 0; i < LANGUAGES.length; i++) {
      if (languageCode === LANGUAGES[i].code) {
        this.setState({
          noCountry: LANGUAGES[i].noCountry,
        })
      }
    }
    var trackable = nodeMap.get(nid).trackable;

    var updateInfo = nodeUpdateInfoMap.get(nid + '');
    var nidNodeData = nodeMap.get(nid);
    var nodeMap1 = nodeMap;
    var itemData = nodeMap1.get(nid);
    var menu_type = itemData.menu_type;

    var parent_nid = itemData.parent_nid;

    if (menu_type !== 'news_feed') {
      var bred = [];
      var parent_nid_array = [nid, parent_nid];
      do {
        var parent_data = nodeMap1.get(parent_nid);
        if (parent_data !== undefined) {
          parent_nid = parent_data.parent_nid;
          if (nodeMap1.get(parent_nid) !== undefined) {
            parent_nid_array.push(parent_nid);
          }
        } else {
          parent_nid = undefined;
        }
      } while (parent_nid !== undefined);
      bred = parent_nid_array;
      this.setState({ showBreadCrumb: true, breadCrumsElementArray: bred.reverse() });
    } else {
      this.setState({ showBreadCrumb: false });
    }


    this.setState({
      trackable: trackable !== undefined ? true : false,
      willmount: true,
    });
  }

  onSwipeLeft(gestureState) {
    if (this.state.data !== null) {
      const { nid, nodeMap, nodeUpdateInfoMap } = this.props.navigation.state.params;
      let _data = nodeMap.get(nid);
      var nextNid = _data.next_nid;
      var prevNid = _data.prev_nid;
      var nextMenuData = nodeMap.get(nextNid);
      var parentNid = nextMenuData.parent_nid;
      var parentMenuData = nodeMap.get(parentNid);
      var nextMenuType = nextMenuData.menu_type;
      var title = parentMenuData.title.toUpperCase();
      if (nextMenuType == "content" || nextMenuType == "mirror_content" || nextMenuType == "jump_page" || nextMenuType == "news_feed" || nextMenuType == "decision_tree" || nextMenuType == "accord") {
        this.props.navigation.replaceWithAnimation('StoryView', { nid: nextNid, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      } else if (nextMenuType == "menu_list") {
        this.props.navigation.navigate('MenuList', { data: nextMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      }
      else if (nextMenuType == "content-menulist") {
        this.props.navigation.replaceWithAnimation('MenuListWithContent', { data: nextMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nid: nextNid, nodeMap: nodeMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      } else if (nextMenuType == "menu_squares") {
        this.props.navigation.navigate('SquareMenu', { data: nextMenuData.deeperlink, nodeMap: nodeMap, title: title, nodeUpdateInfoMap: nodeUpdateInfoMap, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      }
    }
  }

  onSwipeRight(gestureState) {
    if (this.state.data !== null) {
      const { nid, nodeMap, nodeUpdateInfoMap } = this.props.navigation.state.params;
      let _data = nodeMap.get(nid);
      var nextNid = _data.next_nid;
      var prevNid = _data.prev_nid;
      var prevtMenuData = nodeMap.get(prevNid);
      var parentNid = prevtMenuData.parent_nid;
      var parentMenuData = nodeMap.get(parentNid);
      var prevMenuType = prevtMenuData.menu_type;
      var title = parentMenuData.title.toUpperCase();
      if (prevMenuType == "content" || prevMenuType == "mirror_content" || prevMenuType == "jump_page" || prevMenuType == "news_feed" || prevMenuType == "decision_tree" || prevMenuType == "accord") {
        this.props.navigation.replaceWithAnimation('StoryView', { nid: prevNid, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      } else if (prevMenuType == "menu_list") {
        this.props.navigation.navigate('MenuList', { data: prevtMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      }
      else if (prevMenuType == "content-menulist") {
        this.props.navigation.replaceWithAnimation('MenuListWithContent', { data: prevtMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nid: prevNid, nodeMap: nodeMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      }
      else if (prevMenuType == "menu_squares") {
        this.props.navigation.navigate('SquareMenu', { data: prevtMenuData.deeperlink, nodeMap: nodeMap, title: title, nodeUpdateInfoMap: nodeUpdateInfoMap, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      }
    }
  }

  nodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo) {
    if (updateInfo === undefined) {
      AsyncStorage.getItem('' + nid).then((localNodeData) => {
        if (localNodeData !== null) {
          var parsedLocalNodeData = JSON.parse(localNodeData);
          this.setState({
            data: parsedLocalNodeData
          });
        } else {
          this.readNodeData(nid, nodeUpdateInfoMap, nodeMap);
        }
      }).catch((error) => {
      });
    } else if (updateInfo === false) {
    } else {
      AsyncStorage.getItem('' + nid).then((localNodeData) => {
        if (localNodeData !== null) {
          var parsedLocalNodeData = JSON.parse(localNodeData);
          this.setState({
            data: parsedLocalNodeData
          });
        } else {
          this.readNodeData(nid, nodeUpdateInfoMap, nodeMap);
        }
      }).catch(() => {
      });
    }
  }

  readNodeData = (nid, nodeUpdateInfoMap, nodeMap) => {
    var that = this;
    let readNodeData = (Platform.OS === 'ios') ?
      RNFS.readFile(`${RNFS.MainBundlePath}/data/nodes/node_${nid}.json`, 'utf8') :
      RNFS.readFileAssets(`data/nodes/node_${nid}.json`, 'utf8');
    readNodeData.then((result) => {
      var parsedLocalNodeData = JSON.parse(result);
      that.setState({
        data: parsedLocalNodeData
      });
    }).catch((error) => {
    });
  };

  renderItem(item, index) {
    return (
      <TouchableOpacity key={index} onPress={() => Linking.openURL(item.field_jump_link)}>
        <View style={styles.itemContainer}>
          <View style={styles.itemView}>
            <View style={{ flex: 2 }}>
              <Flag
                code={item.field_iso}
                size={32}
              />
            </View>
            <View style={{ flex: 12 }}>
              <Text style={styles.countryText}>{item.field_jump_text}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  getFilteredResults() {
    return this.state.data.field_jump_list && this.state.data.field_jump_list.filter(
      item => {
        return new RegExp(`\\b${this.state.searchTerm}`, "gi").test(item.field_jump_text)
      }
    );
  }

  renderBreadCrumb = ({ item, index }) => {
    var nodeMap = this.props.navigation.state.params.nodeMap;
    var nodeUpdateInfoMap = this.props.navigation.state.params.nodeUpdateInfoMap;
    var breadCrumsElementArray = this.state.breadCrumsElementArray;

    return <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => {
      this.navigateFromBreadCrumb(index, this.props.navigation, nodeMap, nodeUpdateInfoMap, breadCrumsElementArray)
    }}>
      <View style={{
        flex: 1,
        flexDirection: 'row',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
        paddingRight: 5
      }}>
        <Text numberOfLines={1}
          style={[styles.breadCrumbTags, { maxWidth: width / 1.8, fontFamily: (index === 0) ? 'Nunito-Bold' : 'Nunito' }]}>{nodeMap.get(item).title}</Text>
        {index !== breadCrumsElementArray.length - 1 ?
          <SimpleLineIcons name="arrow-right" size={33} color={Theme.color.white} /> : null}
      </View>
    </TouchableOpacity>
  }

  navigateFromBreadCrumb(index, nav, nodeMap, nodeUpdateInfoMap, breadCrumsElementArray) {
    var selectedNid = breadCrumsElementArray[index];
    var selectedNidData = nodeMap.get(selectedNid);
    navigateHelper(selectedNidData, nav, nodeMap, nodeUpdateInfoMap, false, null);
  }

  render() {
    const { nid, nodeMap } = this.props.navigation.state.params;
    var showBreadCrumb = this.state.showBreadCrumb;
    var breadCrumsElementArray = this.state.breadCrumsElementArray;
    let _data = nodeMap.get(nid);
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    return (
      <GestureRecognizer
        onSwipeLeft={(state) => (_data.next_nid != undefined) ? this.onSwipeLeft(state) : null}
        onSwipeRight={(state) => (_data.prev_nid != undefined) ? this.onSwipeRight(state) : null}
        config={config}
        style={{ flex: 1 }}
      >
        {(showBreadCrumb) ?
          <View style={{ height: 35, paddingLeft: 5, paddingRight: 5, backgroundColor: '#e5e5e5' }}>
            <FlatList
              data={breadCrumsElementArray}
              renderItem={this.renderBreadCrumb}
              style={{ flex: 1 }}
              horizontal={true}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
            />
          </View> : null}
        <View style={{ flex: 1 }}>
          {
            this.state.data === null ?
              <ActivityIndicator size="small" color="#ed9100" style={styles.activityIndicator} /> :
              <View style={{ flex: 1 }}>

                <View style={{ flex: 1, zIndex: 1 }}>
                  <View style={styles.searchContainer}>
                    <View style={styles.iconView}>
                      <Icon size={20} style={styles.flagIcon} name="magnifier" />
                    </View>
                    <View style={{ flex: 9 }}>
                      <TextInput
                        placeholder={"Search..."}
                        style={styles.searchInput}
                        underlineColorAndroid="transparent"
                        onChangeText={searchTerm => this.setState({ searchTerm })}
                        placeholderTextColor="#fff"
                      />
                    </View>
                  </View>
                  {
                    this.getFilteredResults() && this.getFilteredResults().length > 0 ?
                      <FlatList
                        initialNumToRender={25}
                        data={this.getFilteredResults()}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                      /> :
                      <View style={{ alignSelf: 'center', padding: 20 }}>
                        <Text style={styles.noCountries}>{this.state.noCountry}</Text>
                      </View>
                  }
                </View>
                {
                  this.state.data.field_background_image && this.state.data.field_background_image !== undefined ?
                    <Image
                      style={{ width: width, height: height, position: 'absolute' }}
                      source={{ uri: this.state.data.field_background_image }}
                    /> :
                    <Image
                      source={require('../component/NewsItem/images/adappt-studio.jpg')}
                      style={{ width: width, height: height, position: 'absolute' }}
                    />
                }
                <View style={styles.imageBackgroundOverlay} />
              </View>
          }
        </View>
      </GestureRecognizer>
    )
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  },
  imageBackgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  flagIcon: {
    color: '#bbbbbb',
    alignSelf: 'center'
  },
  searchInput: {
    color: '#fff',
    fontSize: 17,
    backgroundColor: "transparent",
    fontFamily: 'Nunito',
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'rgba(255,255,255,0.3)',
    borderBottomWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  iconView: {
    flex: 1,
    padding: 5,
    paddingLeft: 6
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.5)'
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15,
  },
  countryText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Nunito'
  },
  noCountries: {
    color: '#fff',
    fontFamily: 'Nunito',
    fontSize: 18
  }
});
export default connect(mapStateToProps)(JumpToPage);