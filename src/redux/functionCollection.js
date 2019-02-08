import * as types from '../constants/actionTypes';
import { normalize, schema } from 'normalizr';
import { AsyncStorage, NetInfo, Platform } from "react-native";
import store from './store';
var RNFS = require('react-native-fs');

/**
 * creates the Swipe Array and dispatches the action SET_SWIPE_ARRAY.
 */
export async function createSwipeArray(nodeMap, firstElement)  {
    var dummyNid = firstElement.nid;
    var dummyData = nodeMap.get(dummyNid);
    do{
      var dummyPrev = dummyData.prev_nid;
      if(dummyPrev !== undefined){
        dummyData = nodeMap.get(dummyPrev);
      }
    }while(dummyPrev !== undefined);
    firstElement = dummyData;
    var swipeArrayNodes = [firstElement.nid];
    var nid = firstElement.nid;
    var nodeData = nodeMap.get(nid);
    var nextNid = nodeData.next_nid;
    do{
      var nodeData = nodeMap.get(nid);
      var nextNid = nodeData.next_nid;
      if(nextNid !== undefined && nextNid !== null && !swipeArrayNodes.includes(nextNid)){
        swipeArrayNodes.push(nextNid);
        nid = nextNid;
      }
    }while(nextNid !== undefined && nextNid !== null);
    store.dispatch({type: types.SET_SWIPE_ARRAY, swipeArrayNodes: swipeArrayNodes, swipeArrayReady: true});
}

/**
 * creates the Swipe Array with the Normalized data.
 */
export function getSwipeNormResponse(jsonNormalizedData) {
  var articlesEntityNormResponse = (jsonNormalizedData.articles.entities.data !== undefined) ? jsonNormalizedData.articles.entities.data : {};
  var contentmenulistEntityNormResponse = (jsonNormalizedData.contentmenulist.entities.data !== undefined) ? jsonNormalizedData.contentmenulist.entities.data : {};
  var mirrorcontentEntityNormResponse = (jsonNormalizedData.mirrorcontent.entities.data !== undefined) ? jsonNormalizedData.mirrorcontent.entities.data : {};
  var decisiontreeEntityNormResponse = (jsonNormalizedData.decisiontree.entities.data !== undefined) ? jsonNormalizedData.decisiontree.entities.data : {};
  var accordEntityNormResponse = (jsonNormalizedData.accord.entities.data !== undefined) ? jsonNormalizedData.accord.entities.data : {};
  var newsFeedEntityNormResponse = (jsonNormalizedData.newsFeed.entities.data !== undefined) ? jsonNormalizedData.newsFeed.entities.data : {};
  const swipeNormResponse  = Object.assign({}, articlesEntityNormResponse, contentmenulistEntityNormResponse, mirrorcontentEntityNormResponse, decisiontreeEntityNormResponse, accordEntityNormResponse, newsFeedEntityNormResponse);
  var swipeResultNodesArray = [];
  Object.keys(swipeNormResponse).forEach(function(c) {
    swipeResultNodesArray.push(swipeNormResponse[c]);
  });
  return swipeResultNodesArray;
}

/**
 * Combines different type of data into a single one.
 */
export function getAllEntities (jsonNormalizedData) {
  var entityNormResponse = (jsonNormalizedData.articles.entities.data !== undefined) ? jsonNormalizedData.articles.entities.data : {};
  var articlesEntityNormResponse = (jsonNormalizedData.articles.entities.data !== undefined) ? jsonNormalizedData.articles.entities.data : {};
  var contentmenulistEntityNormResponse = (jsonNormalizedData.contentmenulist.entities.data !== undefined) ? jsonNormalizedData.contentmenulist.entities.data : {};
  var menuEntityNormResponse = (jsonNormalizedData.menu.entities.data !== undefined) ? jsonNormalizedData.menu.entities.data : {};
  var menulistEntityNormResponse = (jsonNormalizedData.menulist.entities.data !== undefined) ? jsonNormalizedData.menulist.entities.data : {};
  var menusquareslistEntityNormResponse = (jsonNormalizedData.menusquareslist.entities.data !== undefined) ? jsonNormalizedData.menusquareslist.entities.data : {};
  var mirrorcontentEntityNormResponse = (jsonNormalizedData.mirrorcontent.entities.data !== undefined) ? jsonNormalizedData.mirrorcontent.entities.data : {};
  var decisiontreeEntityNormResponse = (jsonNormalizedData.decisiontree.entities.data !== undefined) ? jsonNormalizedData.decisiontree.entities.data : {};
  var accordEntityNormResponse = (jsonNormalizedData.accord.entities.data !== undefined) ? jsonNormalizedData.accord.entities.data : {};
  var newsFeedEntityNormResponse = (jsonNormalizedData.newsFeed.entities.data !== undefined) ? jsonNormalizedData.newsFeed.entities.data : {};
  const allNormResponse = Object.assign({}, articlesEntityNormResponse, contentmenulistEntityNormResponse, menuEntityNormResponse, menulistEntityNormResponse, mirrorcontentEntityNormResponse, menusquareslistEntityNormResponse, decisiontreeEntityNormResponse, accordEntityNormResponse,newsFeedEntityNormResponse);
  return allNormResponse;
}

/**
 * Gets all the Results
 */
export function getAllResults (jsonNormalizedData)  {
  var articlesResultNodesArray  = (jsonNormalizedData.articles !== undefined) ? jsonNormalizedData.articles.result.data : [];
  var contentmenulistResultNodesArray  = (jsonNormalizedData.contentmenulist !== undefined) ? jsonNormalizedData.contentmenulist.result.data : [];
  var menuResultNodesArray  = (jsonNormalizedData.menu !== undefined) ? jsonNormalizedData.menu.result.data : [];
  var menulistResultNodesArray  = (jsonNormalizedData.menulist !== undefined) ? jsonNormalizedData.menulist.result.data : [];
  var menusquareslistResultNodesArray  = (jsonNormalizedData.menusquareslist !== undefined) ? jsonNormalizedData.menusquareslist.result.data : [];
  var mirrorcontentResultNodesArray  = (jsonNormalizedData.mirrorcontent !== undefined) ? jsonNormalizedData.mirrorcontent.result.data : [];
  var decisiontreeResultNodesArray  = (jsonNormalizedData.decisiontree !== undefined) ? jsonNormalizedData.decisiontree.result.data : [];
  var accordResultNodesArray  = (jsonNormalizedData.accord !== undefined) ? jsonNormalizedData.accord.result.data : [];
  var newsFeedResultNodesArray  = (jsonNormalizedData.newsFeed !== undefined) ? jsonNormalizedData.newsFeed.result.data : [];
  const allResultNodesArray = articlesResultNodesArray.concat(contentmenulistResultNodesArray, menuResultNodesArray, menulistResultNodesArray, mirrorcontentResultNodesArray, menusquareslistResultNodesArray, decisiontreeResultNodesArray, accordResultNodesArray, newsFeedResultNodesArray);
  return allResultNodesArray;
}

/**
 * Creates a Node map
 */
export function getNodeMap(jsonNormalizedData){
    var topMenu = (jsonNormalizedData.topMenu !== undefined) ? jsonNormalizedData.topMenu : {};
    var articles = (jsonNormalizedData.articles.entities.data !== undefined) ? jsonNormalizedData.articles.entities.data : {};
    var menu = (jsonNormalizedData.menu.entities.data !== undefined) ? jsonNormalizedData.menu.entities.data : {};
    var menulist = (jsonNormalizedData.menulist.entities.data !== undefined) ? jsonNormalizedData.menulist.entities.data : {};
    var menusquareslist = (jsonNormalizedData.menusquareslist.entities.data !== undefined) ? jsonNormalizedData.menusquareslist.entities.data : {};
    var contentmenulist = (jsonNormalizedData.contentmenulist.entities.data !== undefined) ? jsonNormalizedData.contentmenulist.entities.data : {};
    var mirrorcontent = (jsonNormalizedData.mirrorcontent.entities.data !== undefined) ? jsonNormalizedData.mirrorcontent.entities.data : {};
    var decisiontree = (jsonNormalizedData.decisiontree.entities.data !== undefined) ? jsonNormalizedData.decisiontree.entities.data : {};
    var accord = (jsonNormalizedData.accord.entities.data !== undefined) ? jsonNormalizedData.accord.entities.data : {};
    var newsFeed = (jsonNormalizedData.newsFeed.entities.data !== undefined) ? jsonNormalizedData.newsFeed.entities.data : {};
    var nodeMap = new Map();
    nodeMap.set(topMenu.nid, topMenu);
    Object.keys(articles).forEach(function(c) {
      nodeMap.set(c,articles[c]);
    });
      Object.keys(menu).forEach(function(c) {
      nodeMap.set(c,menu[c]);
    });
      Object.keys(menulist).forEach(function(c) {
      nodeMap.set(c,menulist[c]);
    });
      Object.keys(contentmenulist).forEach(function(c) {
      nodeMap.set(c,contentmenulist[c]);
    });
      Object.keys(mirrorcontent).forEach(function(c) {
      nodeMap.set(c,mirrorcontent[c]);
    });
      Object.keys(menusquareslist).forEach(function(c) {
      nodeMap.set(c,menusquareslist[c]);
    });
      Object.keys(decisiontree).forEach(function(c) {
      nodeMap.set(c,decisiontree[c]);
    });
    Object.keys(accord).forEach(function(c) {
      nodeMap.set(c,accord[c]);
    });
      Object.keys(newsFeed).forEach(function(c) {
      nodeMap.set(c,newsFeed[c]);
    });
    return nodeMap;
  }

/**
 * Dispatch the action to set the home screen data
 */  
export function findHomeScreenData(topMenuNid, topMenuRid) {
  AsyncStorage.getItem(topMenuNid).then((localTopMenuData) => {
    if (localTopMenuData !== null) {
      var localParsedTopMenuData = JSON.parse(localTopMenuData);
      if (topMenuRid !== localParsedTopMenuData.vid) {
        // check for updated homescreen.
        updateHomeData(topMenuNid, topMenuRid, localParsedTopMenuData);
      } else {
        // set the data to homescreen.
        store.dispatch({ type: types.SET_HOME_DATA, data: localParsedTopMenuData });
      }
    } else {
      if (Platform.OS == 'ios') {
        RNFS.readFile(`${RNFS.MainBundlePath}/data/nodes/node_${topMenuNid}.json`, 'utf8')
          .then((result) => {
            var parsedLocalData = JSON.parse(result);
            if (topMenuRid !== parsedLocalData.vid) {
              // check for updated homescreen.
              updateHomeData(topMenuNid, topMenuRid, parsedLocalData);
            } else {
              // set the data to homescreen.
              store.dispatch({ type: types.SET_HOME_DATA, data: parsedLocalData });
            }
          }).catch((error) => {
          });
      } else {
        RNFS.readFileAssets(`data/nodes/node_${topMenuNid}.json`, 'utf8')
          .then((result) => {
            var parsedLocalData = JSON.parse(result);
            if (topMenuRid !== parsedLocalData.vid) {
              // check for updated homescreen.
              updateHomeData(topMenuNid, topMenuRid, parsedLocalData);
            } else {
              // set the data to homescreen.
              store.dispatch({ type: types.SET_HOME_DATA, data: parsedLocalData });
            }
          }).catch((error) => {
          });
      }
    }
  }).catch((error) => {
  });
}

/**
 * Dispatches SET_HOME_DATA action
 */  
function updateHomeData(topMenuNid, topMenuRid, localParsedTopMenuData) {
  store.dispatch({ type: types.SET_HOME_DATA, data: localParsedTopMenuData });
}

/**
 * Generates Normalized Data
 */  
export function generateNormalizedData(data) {
  const myData = { data: data[0].deeperlink };
  const topMenu = { nid: data[0].nid, rid: data[0].rid, menu_type: data[0].menu_type, next_nid: data[0].next_nid, title: data[0].title, home_view_content: data[0].home_view_content, home_view_image: data[0].home_view_image };
  var topMenuNid = data[0].nid;
  var topMenuRid = data[0].rid;
  const menu = new schema.Entity('data', {}, { idAttribute: 'nid' });
  const mySchema = { data: [menu] }
  const normalizedData = normalize(myData, mySchema);
  var menuList = [];
  var menusquaresList = [];
  var mirrorContentList = [];
  var contentData = [];
  var contentMenuListData = [];
  var decisionTreeData = [];
  var accordData = [];
  var newsfeedData = [];
  function recursiveDeeperLink(items) {
    items.forEach(element => {
      if (element.deeperlink) {
        element['children'] = element.deeperlink.map((d) => { return d.nid; });
        switch (element.menu_type) {
          case 'menu_list':
            menuList.push(element);
            break;
          case 'content':
            contentData.push(element);
            break;
          case 'content-menulist':
            contentMenuListData.push(element);
            break;
          case 'mirror_content':
            mirrorContentList.push(element);
            break;
          case 'menu_squares':
            menusquaresList.push(element);
            break;
          case 'decision_tree':
            decisionTreeData.push(element);
            break;
          case 'accord':
            accordData.push(element);
            break;
          case 'news_feed':
            newsfeedData.push(element);
            break;
        }
        recursiveDeeperLink(element.deeperlink);
      } else {
        if (element.menu_type === "menu_list") {
          menuList.push(element);
        }
        else if (element.menu_type === "content-menulist") {
          contentMenuListData.push(element);
        }
        else if (element.menu_type === "mirror_content") {
          mirrorContentList.push(element);
        }
        else if (element.menu_type === "menu_squares") {
          menusquaresList.push(element);
        }
        else if (element.menu_type === "decision_tree") {
          decisionTreeData.push(element);
        }
        else if (element.menu_type === "accord") {
          accordData.push(element);
        }
        else if (element.menu_type === "news_feed") {
          newsfeedData.push(element);
        }
        contentData.push(element);
      }
    });
  }
  recursiveDeeperLink(data[0].deeperlink);
  const _menuList = { data: menuList };
  const _menuListdata = new schema.Entity('data', {}, { idAttribute: 'nid' });
  const menuListSchema = { data: [_menuListdata] }
  const normalizedMenuList = normalize(_menuList, menuListSchema);

  const _menusquaresList = { data: menusquaresList };
  const _menusquaresListdata = new schema.Entity('data', {}, { idAttribute: 'nid' });
  const menusquaresListSchema = { data: [_menusquaresListdata] }
  const normalizedMenuSquaresList = normalize(_menusquaresList, menusquaresListSchema);

  const _content = { data: contentData };
  const _contentdata = new schema.Entity('data', {}, { idAttribute: 'nid' });
  const contentSchema = { data: [_contentdata] }
  const normalizedContentData = normalize(_content, contentSchema);

  const _contentMenuList = { data: contentMenuListData };
  const _contentMenuListdata = new schema.Entity('data', {}, { idAttribute: 'nid' });
  const contentMenuListSchema = { data: [_contentMenuListdata] }
  const normalizedContentMenuListData = normalize(_contentMenuList, contentMenuListSchema);

  const _mirrorContentList = { data: mirrorContentList };
  const _mirrorContentListdata = new schema.Entity('data', {}, { idAttribute: 'nid' });
  const mirrorContentListSchema = { data: [_mirrorContentListdata] }
  const normalizedMirrorContentList = normalize(_mirrorContentList, mirrorContentListSchema);

  const _decisionTreeList = { data: decisionTreeData };
  const _decisionTreeListdata = new schema.Entity('data', {}, { idAttribute: 'nid' });
  const decisionTreeListSchema = { data: [_decisionTreeListdata] }
  const normalizedDecisionTree = normalize(_decisionTreeList, decisionTreeListSchema);

  const _accordList = { data: accordData };
  const _accordListdata = new schema.Entity('data', {}, { idAttribute: 'nid' });
  const accordListSchema = { data: [_accordListdata] }
  const normalizedAccord = normalize(_accordList, accordListSchema);

  const _newsfeedList = { data: newsfeedData };
  const _newsfeedListdata = new schema.Entity('data', {}, { idAttribute: 'nid' });
  const newsfeedListSchema = { data: [_newsfeedListdata] }
  const normalizedNewsfeed = normalize(_newsfeedList, newsfeedListSchema);

  var jsonData = {
    topMenu: topMenu,
    menu: normalizedData,
    menulist: normalizedMenuList,
    menusquareslist: normalizedMenuSquaresList,
    contentmenulist: normalizedContentMenuListData,
    articles: normalizedContentData,
    mirrorcontent: normalizedMirrorContentList,
    decisiontree: normalizedDecisionTree,
    accord: normalizedAccord,
    newsFeed: normalizedNewsfeed
  }
  return jsonData;
}

/**
 * Dispatches the action that sets the nodemap
 */ 
export function storeNodeData(jsonNormalizedData) {
  var topMenu = (jsonNormalizedData.topMenu !== undefined) ? jsonNormalizedData.topMenu : {};
  var articles = (jsonNormalizedData.articles.entities.data !== undefined) ? jsonNormalizedData.articles.entities.data : {};
  var menu = (jsonNormalizedData.menu.entities.data !== undefined) ? jsonNormalizedData.menu.entities.data : {};
  var menulist = (jsonNormalizedData.menulist.entities.data !== undefined) ? jsonNormalizedData.menulist.entities.data : {};
  var menusquareslist = (jsonNormalizedData.menusquareslist.entities.data !== undefined) ? jsonNormalizedData.menusquareslist.entities.data : {};
  var contentmenulist = (jsonNormalizedData.contentmenulist.entities.data !== undefined) ? jsonNormalizedData.contentmenulist.entities.data : {};
  var mirrorcontent = (jsonNormalizedData.mirrorcontent.entities.data !== undefined) ? jsonNormalizedData.mirrorcontent.entities.data : {};
  var decisiontree = (jsonNormalizedData.decisiontree.entities.data !== undefined) ? jsonNormalizedData.decisiontree.entities.data : {};
  var accord = (jsonNormalizedData.accord.entities.data !== undefined) ? jsonNormalizedData.accord.entities.data : {};
  var newsFeed = (jsonNormalizedData.newsFeed.entities.data !== undefined) ? jsonNormalizedData.newsFeed.entities.data : {};
  var nodeMap = new Map();
  nodeMap.set(topMenu.nid, topMenu);
  Object.keys(articles).forEach(function (c) {
    nodeMap.set(c, articles[c]);
  });
  Object.keys(menu).forEach(function (c) {
    nodeMap.set(c, menu[c]);
  });
  Object.keys(menulist).forEach(function (c) {
    nodeMap.set(c, menulist[c]);
  });
  Object.keys(contentmenulist).forEach(function (c) {
    nodeMap.set(c, contentmenulist[c]);
  });
  Object.keys(mirrorcontent).forEach(function (c) {
    nodeMap.set(c, mirrorcontent[c]);
  });
  Object.keys(menusquareslist).forEach(function (c) {
    nodeMap.set(c, menusquareslist[c]);
  });
  Object.keys(decisiontree).forEach(function (c) {
    nodeMap.set(c, decisiontree[c]);
  });
  Object.keys(accord).forEach(function (c) {
    nodeMap.set(c, accord[c]);
  });
  Object.keys(newsFeed).forEach(function (c) {
    nodeMap.set(c, newsFeed[c]);
  });
  store.dispatch({ type: types.SET_NODE_DATA_MAP, nodeMap: nodeMap, nodeMapReady: true });
  return nodeMap;
}

/**
 * Dispatches the action to sets the Tag data
 */ 
export async function updateTag(selected_language, normalizedTagList) {
  store.dispatch({ type: types.FETCH_TAG_DATAS, data: normalizedTagList });
}

/**
 * Dispatches the action to sets the search data
 */ 
export async function updateSearch(selected_language, parsedSearch_content) {
  store.dispatch({ type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: parsedSearch_content });
}

/**
 * Dispatches the actions to reset everything
 */ 
export async function resetdata() {
  store.dispatch({ type: types.SET_NODE_DATA_MAP, nodeMap: new Map(), nodeMapReady: false });
  store.dispatch({ type: types.SET_SWIPE_ARRAY, swipeArrayNodes: [], swipeArrayReady: false });
  store.dispatch({ type: types.SET_HOME_IMAGE_LOADED, imageLoaded: false });
  store.dispatch({ type: types.FETCH_TAG_DATAS, data: undefined });
  store.dispatch({ type: types.SET_HOME_DATA, data: {} });  // clearing home data.
}