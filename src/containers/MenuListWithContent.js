/**
 * MenuListWithContent: A tertiary level Menu which lists the menu items along with the content.
 */

import React, { Component, PureComponent } from 'react';
import { View, Dimensions, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity, AsyncStorage, Platform, Share, ScrollView } from 'react-native';
import store from '../redux/store';
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from "react-native-vector-icons/Feather"
import StoryViewBody from '../component/StoryView/StoryViewBody';
import { STORE_URL } from '../constants/serverAPIS';
import { connect } from 'react-redux';
import MenuListItemWithContent from '../component/MenuListItemWithContent';
import FeedbackMessage from '../component/FeedbackMessage';
const { width } = Dimensions.get('window');
import * as types from '../constants/actionTypes';
var RNFS = require('react-native-fs');
import FlurryAnalytics from 'react-native-flurry-analytics';
import { LANGUAGES } from '../constants/serverAPIS';
import { navigateHelper, navigateReplaceWithAnimation } from "../utils/navigateHelper";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Theme } from '../styles';
import ExternalStyles from '../styles/Basic';

import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

var S = require('string');


var S = require('string');
let breadTitle;
let _favItemData = [];


const mapStateToProps = state => {
  return {
    favourite: state.favourite.fav,
    tags: state.tags.data,
    nodeUpdateInfoMap: state.nodeList.nodeUpdateInfoMap,
    breadCrumsElementArray: state.breadcrumbs.breadCrumsElementArray,
    languageCode: state.language.language_code,
  }
};

class MenuListWithContent extends Component {

  static navigationOptions = ({ navigation }) => {
    navigate1 = (data, navigation, nodeMap) => {
      if (data !== undefined) {
        var nextNid = data.next_nid;
        var prevNid = data.prev_nid;
        var parentNid = data.parent_nid;
        var nodeUpdateInfoMap = navigation.state.params.nodeUpdateInfoMap;
        switch (data.menu_type) {
          case "mirror_content":
          case "content":
            navigation.navigate('StoryView', { nodeUpdateInfoMap: nodeUpdateInfoMap, nid: data.nid, nodeMap: nodeMap, title: nodeMap.get(data.parent_nid).title.toUpperCase(), parentNid: parentNid, nextNid: nextNid, prevNid: prevNid, isParent: true });
            break;
          case "menu_list":
            navigation.navigate('MenuList', { nodeUpdateInfoMap: nodeUpdateInfoMap, data: data.deeperlink, nodeMap: nodeMap, title: data.title.toUpperCase(), parentNid: data.parent_nid, isParent: true });
            break;
          case "content-menulist":
            navigation.navigate('MenuListWithContent', {
              data: data.deeperlink,
              nid: data.nid,
              nodeMap: nodeMap,
              title: nodeMap.get(parentNid).title.toUpperCase(),
              parentNid: parentNid,
              nextNid: nextNid,
              prevNid: prevNid,
              isParent: true,
              nodeUpdateInfoMap: nodeUpdateInfoMap
            });
            break;
          case "menu_squares":
            navigation.navigate('SquareMenu', { nodeUpdateInfoMap: nodeUpdateInfoMap, data: data.deeperlink, nodeMap: nodeMap, title: data.title.toUpperCase(), parentNid: data.parent_nid, isParent: true });
            break;
          default:
            break;
        }
      } else {
        navigation.navigate('Home', { isParent: true });
      }
    };
    return {
      headerTitle: (
        <TouchableOpacity onPress={() => this.navigate1(navigation.state.params.nodeMap.get(navigation.state.params.parentNid), navigation, navigation.state.params.nodeMap)}
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={ExternalStyles.textStyle} numberOfLines={1}>{navigation.state.params.title}</Text>
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => this.navigate1(navigation.state.params.nodeMap.get(navigation.state.params.parentNid), navigation, navigation.state.params.nodeMap)}
          style={{ paddingLeft: 25, paddingTop: 14, width: 70}}>
        </TouchableOpacity>
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      nid: this.props.navigation.state.params.nid,
      data: null,
      isfav: false,
      prevMenuType: '',
      nextMenuType: '',
      prevData: null,
      nextData: null,
      normalizedData: null,
      breadCrumsElementArray: [],
      shareText1: '',
      shareText2: '',
      tagsField: [],
      noContent: '',
      showLoader: true,
      showBreadCrumb: true

    };
    this.renderHeader = this.renderHeader.bind(this);
    this.navigateFromBreadCrumb = this.navigateFromBreadCrumb.bind(this);
    this.showLoader = this.showLoader.bind(this);
    this.scroll = null;
    this.SECTIONS_Tags = [];
    this.SECTIONS = {};
  }

  navigateFromBreadCrumb(
    index,
    nav,
    nodeMap,
    nodeUpdateInfoMap,
    breadCrumsElementArray
  ) {
    var selectedNid = breadCrumsElementArray[index];
    var selectedNidData = nodeMap.get(selectedNid);
    navigateHelper(
      selectedNidData,
      nav,
      nodeMap,
      nodeUpdateInfoMap,
      false,
      null
    );
  }

  getFavItems = () => {
    const { languageCode } = this.props;
    AsyncStorage.getItem("favItems_" + languageCode).then(value => {
      if (value !== null) {
        let _parseItem = JSON.parse(value);
        _favItemData = _parseItem;
        this.setState({ isfav: _parseItem.findIndex(x => x.nid == this.state.nid) > -1 ? true : false });
      }
    });
  };

  componentDidMount() {
    const { nid, nodeMap, nodeUpdateInfoMap } = this.props.navigation.state.params;
    var updateInfo = nodeUpdateInfoMap.get(nid + "");
    this.nodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo);
    this.getFavItems();
    var languageCode = this.props.languageCode;
    var shareText1 = "";
    var shareText2 = "";
    var noContent = "";
    for (var i = 0; i < LANGUAGES.length; i++) {
      if (languageCode == LANGUAGES[i].code) {
        shareText1 = LANGUAGES[i].shareText1;
        shareText2 = LANGUAGES[i].shareText2;
        noContent = LANGUAGES[i].noContent;
      }
    }

    var updateInfo = nodeUpdateInfoMap.get(nid + '');
    var nidNodeData = nodeMap.get(nid);
    var trackable = nodeMap.get(nid).trackable;

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
      this.timeoutHandle = setTimeout(() => {
        this.flatList.scrollToEnd();
      }, 0);
    } else {
      this.setState({ showBreadCrumb: false });
    }


    this.setState({
      trackable: trackable !== undefined ? true : false,
      willmount: true,
      shareText1,
      shareText2,
      noContent
    });
  }

  componentWillUnmount = () => {
		if(this.timeoutHandle){
			clearTimeout(this.timeoutHandle);
		}
	}


  tagsData(itemData, nodeMap) {
    var that = this;
    this.SECTIONS_Tags = [];
    this.SECTIONS = {};
    if (itemData && nodeMap && itemData.field_tagging && this.props.tags) {
      this.setState({ tagsField: itemData.field_tagging });
      itemData.field_tagging.forEach(item => {
        if (that.props.tags !== undefined && that.props.tags.entities.data[item.tid] !== undefined && that.props.tags.entities.data[item.tid].nids && that.props.tags.entities.data[item.tid].nids.length > 1) {
          this.SECTIONS_Tags.push({
            name: that.props.tags.entities.data[item.tid] ? that.props.tags.entities.data[item.tid].name : item.name,
            tid: item.tid,
            content: []
          });
        }
      });

      itemData.field_tagging.forEach(element => {
        if (that.props.tags.entities.data[element.tid] !== undefined) {
          var _d = that.props.tags.entities.data[element.tid].nids.map(d => {
            if (itemData.nid !== d) return nodeMap.get(d);
          });
          that.SECTIONS[element.tid] = {
            name: element.name,
            tid: element.tid,
            content: _d
          };
        }
      });

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
          this.tagsData(parsedLocalNodeData, nodeMap);
        } else {
          this.renderNodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo)
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
          this.tagsData(parsedLocalNodeData, nodeMap);
        } else {
          this.renderNodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo)
        }
      }).catch(() => { });
    }
  }


  togglefav = async (selectedData) => {
    this.setState({ isfav: !this.state.isfav });
    try {
      if (this.state.isfav) {
        var index = _favItemData.findIndex(x => x.nid == selectedData.nid);
        if (index > -1) {
          _favItemData.splice(index, 1);
        }
      } else {
        var decodeArticle = S(selectedData.body).stripTags().decodeHTMLEntities().trim().s;
        decodeArticle = decodeArticle.replace(/\+/g, ' ');
        let decodeArticleRemoveSpace = decodeArticle.replace(/\s+/g, ' ');
        _favItemData.unshift({ nid: selectedData.nid, title: selectedData.title, body: decodeArticleRemoveSpace && decodeArticleRemoveSpace.substring(0, 120) });
      }
      await AsyncStorage.setItem("favItems_" + this.props.languageCode, JSON.stringify(_favItemData));
      store.dispatch({ type: types.FETCH_FAVOURITE });
    } catch (error) {
    }
  };

  renderNodeData = (nid, nodeMap, nodeUpdateInfoMap, updateInfo) => {
    let renderNodeLink = (Platform.OS == 'ios') ?
      RNFS.readFile(`${RNFS.MainBundlePath}/data/nodes/node_${nid}.json`, 'utf8') :
      RNFS.readFileAssets(`data/nodes/node_${nid}.json`, 'utf8');

    var that = this;

    renderNodeLink.then((result) => {
      var parsedLocalNodeData = JSON.parse(result);
      this.setState({
        data: parsedLocalNodeData
      });
      this.tagsData(parsedLocalNodeData, nodeMap);
    }).catch((error) => {
    });
  }

  removeFavItems = (id) => {
    AsyncStorage.getItem('favItems_' + this.props.languageCode).then((value) => {
      if (value !== null) {
        let _parseItem = JSON.parse(value);
        let _index = _parseItem.indexOf(id);
        if (_index > -1) {
          _parseItem.splice(_index, 1);
        }
        AsyncStorage.setItem('favItems_' + this.props.languageCode, JSON.stringify(_parseItem));
      }
      store.dispatch({ type: types.FETCH_FAVOURITE })
    });
  };


  shareOptions(breadCrumsElementArray) {
    FlurryAnalytics.logEvent('Shared Content', { 'Name': this.state.data.title });
    let { languageCode } = this.props;
    let { shareText1, shareText2 } = this.state;
    const { nid, nodeMap, nodeUpdateInfoMap } = this.props.navigation.state.params;

    const platform = (Platform.OS === 'android') ? 'android' : 'ios'
    const { appStoreURL, playStoreURL, deepLinkURL, emailSubject } = STORE_URL;
    let deepLinkURLWithParams = `${deepLinkURL}?node=${nid}&language=${languageCode}&platform=${platform}`

    var breadCrumbPath = [];
    breadCrumsElementArray.map((ele) => {
      breadCrumbPath.push(nodeMap.get(ele).title);
    });   
    let url = `${shareText1}\n\n` + `${deepLinkURLWithParams}\n\n` + `${shareText2}\n\n` + `iOS: ${appStoreURL},\n\n` + `Android: ${playStoreURL}`;

    Share.share({
      title: this.state.data.title,
      message: url,
      subject: emailSubject
    });
  }

  renderHeader(breadCrumsElementArray) {
    const { tags, navigation } = this.props;
    const { nodeMap, nodeUpdateInfoMap, searchText } = navigation.state.params;
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {
          this.state.data == null ?
            <ActivityIndicator
              animating={true}
              color='#4c4c4c'
              size="small"
              style={styles.activityIndicator} />
            :
            (this.state.data.body == null || this.state.data.body == "") ?
              <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                <FeedbackMessage message={this.state.noContent} iconName={'file'} />
              </View>
              :
              <View style={styles.container}>
                <View style={{ backgroundColor: '#FFF' }}>
                  <View style={styles.viewContainer}>
                    <Text style={styles.title}> {this.state.data.title} </Text>
                  </View>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15 }}>
                    {this.state.isfav ?
                      <Icon size={25}
                        onPress={() => {
                          this.togglefav(this.state.data)
                          FlurryAnalytics.logEvent('Favourites', { 'Name': this.state.data.title });
                        }} style={{ color: '#595959' }}
                        name="heart" /> :
                      <Icon size={25}
                        onPress={() => { this.togglefav(this.state.data) }} style={{ color: '#bbbbbb' }}
                        name="heart-o" />
                    }
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { this.shareOptions(breadCrumsElementArray) }} style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 15, paddingRight: 15 }}>
                    <Feather name="share" size={24}
                      style={{ color: '#bbbbbb' }} />
                  </TouchableOpacity>
                </View>

                {
                  this.state.tagsField ? <StoryViewBody showLoader={this.showLoader} sectionsItem={this.SECTIONS} sectionTags={this.SECTIONS_Tags} data={this.state.data} tags={tags} nav={navigation} nodeMap={nodeMap} nodeUpdateInfoMap={nodeUpdateInfoMap} breadCrumsElementArray={this.props.breadCrumsElementArray} searchText={searchText} /> :

                    <StoryViewBody showLoader={this.showLoader} sectionsItem={this.SECTIONS} sectionTags={this.SECTIONS_Tags} data={this.state.data} tags={tags} nav={navigation} nodeMap={nodeMap} nodeUpdateInfoMap={nodeUpdateInfoMap} breadCrumsElementArray={this.props.breadCrumsElementArray} searchText={searchText} />
                }

              </View>
        }
      </View>
    )
  }

  showLoader = (val) => {
    this.setState({
      showLoader: val
    })
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

      if (nextMenuType == "content" || nextMenuType == "mirror_content") {
        this.props.navigation.replaceWithAnimation('StoryView', { nid: nextNid, nodeMap: nodeMap, nodeUpdateInfoMap: nodeUpdateInfoMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      } else if (nextMenuType == "menu_list") {
        this.props.navigation.navigate('MenuList', { data: nextMenuData.deeperlink, nodeMap: nodeMap, nodeUpdateInfoMap: nodeUpdateInfoMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      }
      else if (nextMenuType == "content-menulist") {
        this.props.navigation.replaceWithAnimation('MenuListWithContent', { data: nextMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nid: nextNid, nodeMap: nodeMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      } else if (nextMenuType == "menu_squares") {
        this.props.navigation.navigate('SquareMenu', { data: nextMenuData.deeperlink, nodeMap: nodeMap, nodeUpdateInfoMap: nodeUpdateInfoMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
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
      if (prevMenuType == "content" || prevMenuType == "mirror_content") {
        this.props.navigation.replaceWithAnimation('StoryView', { nid: prevNid, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      } else if (prevMenuType == "menu_list") {
        this.props.navigation.navigate('MenuList', { data: prevtMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      }
      else if (prevMenuType == "content-menulist") {
        this.props.navigation.replaceWithAnimation('MenuListWithContent', { data: prevtMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nid: prevNid, nodeMap: nodeMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      }
      else if (prevMenuType == "menu_squares") {
        this.props.navigation.navigate('SquareMenu', { data: prevtMenuData.deeperlink, nodeMap: nodeMap, nodeUpdateInfoMap: nodeUpdateInfoMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      }
    }
  }

  navigateFromBreadCrumb(index, nav, nodeMap, nodeUpdateInfoMap, breadCrumsElementArray) {
    var selectedNid = breadCrumsElementArray[index];
    var selectedNidData = nodeMap.get(selectedNid);
    navigateReplaceWithAnimation(selectedNidData, nav, nodeMap, nodeUpdateInfoMap, false, null);
  }

	renderBreadCrumb = (item, index) => { 
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
			  style={[styles.breadCrumbTags, {maxWidth: width /1.8, fontFamily: (index === breadCrumsElementArray.length-1) ? 'Nunito-Bold' : 'Nunito'}]}>{nodeMap.get(item).title}</Text>
			{index !== breadCrumsElementArray.length - 1 ?
			  <SimpleLineIcons name="arrow-right" size={33} color={Theme.color.white}/> : null}
		  </View>
		</TouchableOpacity>
	  }

  render() {
    const { nodeMap, nodeUpdateInfoMap, nid, data } = this.props.navigation.state.params;
    let _data = nodeMap.get(nid);

    var menuListWithContentLength = (data) ? data.length - 1 : 0;
    var getLastItem = (data && menuListWithContentLength) ? data[menuListWithContentLength] : {};
    var showBreadCrumb = this.state.showBreadCrumb;
    var breadCrumsElementArray = this.state.breadCrumsElementArray.reverse();

    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    if (data) {
      return (
        <GestureRecognizer
          onSwipeLeft={(state) => (_data.next_nid != undefined) ? this.onSwipeLeft(state) : null}
          onSwipeRight={(state) => (_data.prev_nid != undefined) ? this.onSwipeRight(state) : null}
          config={config}
          style={{ flex: 1 }}
        >
          <View style={styles.container}>

          {(showBreadCrumb) ?
          <View style={{ height: 35, paddingLeft: 5, paddingRight: 5, backgroundColor: '#e5e5e5' }}>
		  <ScrollView ref={(scroll) => { this.flatList = scroll; }} style={{ flex: 1 }} horizontal={true} contentContainerStyle={{ alignItems: 'center' }} showsHorizontalScrollIndicator={false}>
			{
			breadCrumsElementArray.map((item, index) => this.renderBreadCrumb(item, index) )
			}
		  </ScrollView>
		  </View> : null}

            <FlatList
              ref={ref => this.scrollView = ref}
              ListHeaderComponent={this.renderHeader(breadCrumsElementArray)}
              data={data}
              renderItem={({ item }) => {
                return <MenuListItemWithContent data={item} navigation={this.props.navigation} nodeMap={nodeMap} lastItem={getLastItem} nodeUpdateInfoMap={nodeUpdateInfoMap} />
              }}
              keyExtractor={item => item.title}
            />

          </View>
        </GestureRecognizer>
      )
    } else {
      return <FeedbackMessage message={'No children available'} />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center'
  },
  viewContainer: {
    alignItems: 'center'
  },
  title: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 19,
    color: '#b4ca6b',
    textAlign: 'center',
    paddingTop: 15,
    fontFamily: 'Nunito-Bold'
  },
  breadCrumbTags: {
    color: '#595959',
    fontSize: 16
  }
});

export default connect(mapStateToProps)(MenuListWithContent)