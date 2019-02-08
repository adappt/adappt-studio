import * as types from '../constants/actionTypes';
import { VERSION_URL, NODE_URL_PREFIX, NODE_URL_SUFFIX } from '../constants/serverAPIS';
import { normalize, schema } from 'normalizr';
import { AsyncStorage, NetInfo, Platform } from "react-native";
var { fetchAndStoreVersion, clearLocalStoreData, _checkUpdateOperation, compareLocalToServerMenu, fetchLatestLanguage, checkVersion, checkLanguagePresent, _updateLanguageList } = require('./apiHelper');
var RNFS = require('react-native-fs');
import { createSwipeArray, getNodeMap, generateNormalizedData, getSwipeNormResponse, updateTag, updateSearch, resetdata } from './functionCollection';
var DeviceInfo = require('react-native-device-info');
import { LANGUAGES } from '../constants/serverAPIS';
var S = require('string'); 

const apiMiddleware = store => next => action => {
  next(action);
  switch (action.type) {
    case types.FETCH_VERSION:
      fetch(VERSION_URL, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
        .then(response => response.json())
        .then(data => {
          next({
            type: types.FETCH_VERSION,
            version: data.version
          });
        });
      break;

    case types.FETCH_FAVOURITE:
      AsyncStorage.getItem('appLanguage').then((appLanguage) => { 
        var languageCode = appLanguage;
        if (languageCode === null) { 
          languageCode = 'en';
        }
        AsyncStorage.getItem('favItems_' + languageCode).then((value) => {
          let _parseItem = value !== null ? JSON.parse(value) : [];
                if (_parseItem.length && !_parseItem[0].hasOwnProperty("nid")) {
                  _parseItem.map((nid, i) => {
                    var _platform = Platform.OS === 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/nodes/node_${nid}.json`, 'utf8') : RNFS.readFileAssets(`data/nodes/node_${nid}.json`, 'utf8');
                    _platform
                      .then((resultnid) => {
                        var parsedLocalNodeData = JSON.parse(resultnid);
                        var decodeArticle = S(parsedLocalNodeData.body).stripTags().decodeHTMLEntities().trim().s;
                        decodeArticle = decodeArticle.replace(/\+/g, ' ');
                        let decodeArticleRemoveSpace = decodeArticle.replace(/\s+/g, ' ');
                        var _item = { nid: parsedLocalNodeData.nid, title: parsedLocalNodeData.title, body: decodeArticleRemoveSpace && decodeArticleRemoveSpace.substring(0, 250) };
                        _parseItem[i] = _item;
                        AsyncStorage.setItem("favItems_" + languageCode, JSON.stringify(_parseItem));
                      }).catch((error) => {
                      });
                  });
                } 
          next({
            type: types.FETCH_FAVOURITE,
            fav: _parseItem
          });
        });
      });
      break;

    case types.CHECK_UPDATE:
      AsyncStorage.getItem('appLanguage').then((appLanguage) => { 
        var languageCode = '';
        NetInfo.isConnected.fetch().then(isConnected => {
          if (appLanguage !== null) {            
            var finalLanguage = '';
            AsyncStorage.getItem('languages').then((languages) => {
              if (languages !== null) {
                var parsedlanguages = JSON.parse(languages);
                finalLanguage = checkLanguagePresent(parsedlanguages, appLanguage) ? appLanguage : 'en';
                store.dispatch({ type: types.SET_LANGUAGE_LIST, languageList: parsedlanguages });
                checkVersion(next, finalLanguage);
                languageCode = finalLanguage;
              } else {
                // pass to appLanguage 
                let findPlatForm = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/languages.json`, 'utf8') : RNFS.readFileAssets(`data/languages.json`, 'utf8');
                findPlatForm.then((result) => {
                  var parsedlanguages = JSON.parse(result);
                  finalLanguage = checkLanguagePresent(parsedlanguages, appLanguage) ? appLanguage : 'en';
                  store.dispatch({ type: types.SET_LANGUAGE_LIST, languageList: parsedlanguages });
                    checkVersion(next, finalLanguage);
                }).catch((error) => {
                });
              }
            });
          } else {
            let findPlatForm = Platform.OS == 'ios' ?  RNFS.readFile(`${RNFS.MainBundlePath}/data/languages.json`, 'utf8') : RNFS.readFileAssets(`data/languages.json`, 'utf8');
            findPlatForm.then((result) => {
              var parsedlanguages = JSON.parse(result);
              finalLanguage = checkLanguagePresent(parsedlanguages, appLanguage) ? appLanguage : 'en';
              store.dispatch({ type: types.SET_LANGUAGE_LIST, languageList: parsedlanguages });
              checkVersion(next, 'en');
            }).catch((error) => {
            });
          }
        });
      });
      break;

    case types.RETRY_AGAIN:
      NetInfo.isConnected.fetch().then(isConnected => {
        if (isConnected) {
        } else {
          store.dispatch({ type: types.SET_OFFLINE_MESSAGE, showOffline: true });
        }
      });
      break;

    case types.ON_CHANGE_LANGUAGE:
      var selected_language = action.selected_language;
      AsyncStorage.setItem('appLanguage', selected_language);
      resetdata();  
      store.dispatch({ type: types.FETCH_FAVOURITE });  
      store.dispatch({ type: types.CLEAR_SEARCH_LIST }); 
      var checkingUpdate = '';
      var noUpdate = '';
      var fetchingUpdate = '';
      var updateSuccess = '';
      var serverIssue = '';
      var lowInternet = '';
      var noInternet = '';
      for (var i = 0; i < LANGUAGES.length; i++) {
        if (selected_language == LANGUAGES[i].code) {
          checkingUpdate = LANGUAGES[i].checkingUpdate;
          noUpdate = LANGUAGES[i].noUpdate;
          fetchingUpdate = LANGUAGES[i].fetchingUpdate;
          updateSuccess = LANGUAGES[i].updateSuccess;
          serverIssue = LANGUAGES[i].serverIssue;
          lowInternet = LANGUAGES[i].lowInternet;
          noInternet = LANGUAGES[i].noInternet;
        }
      }
      NetInfo.isConnected.fetch().then(isConnected => {
        store.dispatch({ type: types.SET_LOADER, showLanguageLoader: true });
        store.dispatch({ type: types.SET_HOME_IMAGE_LOADED, imageLoaded: false });
        _tags();
        _localData(isConnected).then(() => { });
        _search_content();
      });
      _tags = async () => {
        try {
          const _tags_content = await AsyncStorage.getItem('tags_content_' + selected_language);
          if (_tags_content !== null) {
            var parsedTags_content = JSON.parse(_tags_content);
            const _tagList = { data: parsedTags_content };
            const _tagListdata = new schema.Entity('data', {}, { idAttribute: 'tid' });
            const tagListSchema = { data: [_tagListdata] }
            const normalizedTagList = normalize(_tagList, tagListSchema);
          } else {
            let _platform = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/tags-${selected_language}.json`, 'utf8') : RNFS.readFileAssets(`data/tags-${selected_language}.json`, 'utf8');
            _platform.then((tagsresult) => {
              var parsedTags_content = JSON.parse(tagsresult);
              const _tagList = { data: parsedTags_content };
              const _tagListdata = new schema.Entity('data', {}, { idAttribute: 'tid' });
              const tagListSchema = { data: [_tagListdata] }
              const normalizedTagList = normalize(_tagList, tagListSchema);
              updateTag(selected_language, normalizedTagList);
            }).catch((error) => {
            });
          }
        } catch (error) {
        }
      }

      _localData = async (isConnected) => {
        try {
          const _localMenuData = await AsyncStorage.getItem('localData_' + selected_language);
          if (_localMenuData !== null) {
            var parsedlocalData = JSON.parse(_localMenuData);
            var homeData = { home_view_content: parsedlocalData.topMenu.home_view_content, home_view_image: parsedlocalData.topMenu.home_view_image };
            store.dispatch({ type: types.SET_HOME_DATA, data: homeData });
            var localMenuNodeData = getNodeMap(parsedlocalData);
            var swipeResultNodesArray = getSwipeNormResponse(parsedlocalData);
            createSwipeArray(localMenuNodeData, swipeResultNodesArray[0]);
            store.dispatch({ type: types.FETCH_DATA, data: parsedlocalData });
            store.dispatch({ type: types.SET_NODE_DATA_MAP, nodeMap: localMenuNodeData, nodeMapReady: true });
            store.dispatch({ type: types.SET_LANGUAGE, language_code: selected_language });
            store.dispatch({ type: types.SET_LOADER, showLanguageLoader: false });
            if (isConnected) {
              store.dispatch({ type: types.SET_SERVER_MESSAGE, showMessage: true, serverMessage: checkingUpdate, issue: false });
            }
          } else {
            let _platform = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/menu-${selected_language}.json`, 'utf8') : RNFS.readFileAssets(`data/menu-${selected_language}.json`, 'utf8');
            _platform.then((result) => {
              var parsedLocalData = JSON.parse(result);
              var jsonNormalizedData = generateNormalizedData(parsedLocalData);
              var homeData = { home_view_content: jsonNormalizedData.topMenu.home_view_content, home_view_image: jsonNormalizedData.topMenu.home_view_image };
              store.dispatch({ type: types.SET_HOME_DATA, data: homeData });
              var localMenuNodeData = getNodeMap(jsonNormalizedData);
              var swipeResultNodesArray = getSwipeNormResponse(jsonNormalizedData);
              createSwipeArray(localMenuNodeData, swipeResultNodesArray[0]);
              store.dispatch({ type: types.FETCH_DATA, data: jsonNormalizedData });
              store.dispatch({ type: types.SET_NODE_DATA_MAP, nodeMap: localMenuNodeData, nodeMapReady: true });
              store.dispatch({ type: types.SET_LANGUAGE, language_code: selected_language });
              store.dispatch({ type: types.SET_LOADER, showLanguageLoader: false });
              if (isConnected) {
                store.dispatch({ type: types.SET_SERVER_MESSAGE, showMessage: true, serverMessage: checkingUpdate, issue: false });
              }
            }).catch((error) => {
            });
          }
        } catch (error) {
        }
      }
      _search_content = async () => {
        try {
          const _search_content = await AsyncStorage.getItem('search_content_' + selected_language);
          if (_search_content !== null) {
            var parsedSearch_content = JSON.parse(_search_content);
            store.dispatch({ type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: parsedSearch_content });
            updateSearch(selected_language, parsedSearch_content);
          } else {
            let _platform = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/search-${selected_language}.json`, 'utf8') : RNFS.readFileAssets(`data/search-${selected_language}.json`, 'utf8');
            _platform.then((searchresult) => {
              var parsedSearch_content = JSON.parse(searchresult);
              store.dispatch({ type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: parsedSearch_content });
              updateSearch(selected_language, parsedSearch_content);
            }).catch((error) => {
              store.dispatch({ type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: [] });
            });
          }
        }
        catch (error) {
        }
      }
      break;
    default:
      break;
  }
};
export default apiMiddleware