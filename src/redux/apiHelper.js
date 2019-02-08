import * as types from '../constants/actionTypes';
import { AsyncStorage, NetInfo, Platform } from "react-native";
import store from './store';
import { normalize, schema } from 'normalizr';
var RNFS = require('react-native-fs');
import { LANGUAGES } from '../constants/serverAPIS';
import { createSwipeArray, generateNormalizedData, storeNodeData, getAllEntities, getAllResults, getSwipeNormResponse, updateTag } from './functionCollection';
var DeviceInfo = require('react-native-device-info');

/**
 * Checks whether the language code is present in the jsonDataArray.
 */
export function checkLanguagePresent(jsonDataArray, language){
  var present = false;
  jsonDataArray.forEach(function(element) {
    if(element.code == language){
      present = true;
    }
  });
  return present;
}

/**
 * Checks the Version and dispatches the actions.
 */
export function checkVersion(next, languageCode){
  var checkingUpdate = '';
  var noUpdate = '';
  var fetchingUpdate = '';
  var updateSuccess = '';
  var serverIssue = '';
  var lowInternet = '';
  var noInternet = '';
  for (var i = 0; i < LANGUAGES.length; i++) {
    if (languageCode == LANGUAGES[i].code) {
      checkingUpdate = LANGUAGES[i].checkingUpdate;
      noUpdate = LANGUAGES[i].noUpdate;
      fetchingUpdate = LANGUAGES[i].fetchingUpdate;
      updateSuccess = LANGUAGES[i].updateSuccess;
      serverIssue = LANGUAGES[i].serverIssue;
      lowInternet = LANGUAGES[i].lowInternet;
      noInternet = LANGUAGES[i].noInternet;
    }
  }
  store.dispatch({type: types.SET_LANGUAGE, language_code: languageCode});
  NetInfo.isConnected.fetch().then(isConnected => {
    AsyncStorage.getItem('localversion').then((localversion) => {
      const currentversion = DeviceInfo.getVersion();
      if (localversion !== null) {
        if (localversion == currentversion) {
          AsyncStorage.getItem('localbuildnumber').then((localbuildnumber) => {
            const buildNumber = DeviceInfo.getBuildNumber();
            var parsedlocalbuildnumber = JSON.parse(localbuildnumber);
            if (localbuildnumber !== null) {
              if (parseFloat(parsedlocalbuildnumber) !== parseFloat(buildNumber)) {
                AsyncStorage.setItem('localbuildnumber', JSON.stringify(buildNumber));
              } else {
                _checkUpdateOperation(next, languageCode, noUpdate, fetchingUpdate, updateSuccess, serverIssue, lowInternet);
              }
            } else {
              AsyncStorage.setItem('localbuildnumber', JSON.stringify(buildNumber));
              _checkUpdateOperation(next, languageCode, noUpdate, fetchingUpdate, updateSuccess, serverIssue, lowInternet);
            }
          });
        } else {
          AsyncStorage.setItem('localversion', currentversion);
        }
      } else {
        AsyncStorage.setItem('localversion', currentversion);
        if (isConnected) {
          store.dispatch({ type: types.SET_SERVER_MESSAGE, showMessage: true, serverMessage: checkingUpdate, issue: false });
        } else {
          store.dispatch({ type: types.SET_SERVER_MESSAGE, showMessage: true, serverMessage: noInternet, issue: true });
          setTimeout(function () {
            store.dispatch({type: types.SET_SERVER_MESSAGE, showMessage: false, serverMessage: '', issue: false});
          }, 3000);
        }
        _checkUpdateOperation(next, languageCode, noUpdate, fetchingUpdate, updateSuccess, serverIssue, lowInternet);
      }
    })
  });
}

/**
 * Fetches the Latest Language information from the localstorage/local lanugage.json and dispatches the actions.
 */
export async function fetchLatestLanguage(appLanguage){
  if(appLanguage !== null){
    var finalLanguage = '';
    NetInfo.isConnected.fetch().then(isConnected => {
      AsyncStorage.getItem('languages').then((languages) => {
        if(languages !== null){
          var parsedlanguages = JSON.parse(languages);
          finalLanguage = checkLanguagePresent(parsedlanguages, appLanguage) ? appLanguage : 'en';
          store.dispatch({type: types.SET_LANGUAGE_LIST, languageList: parsedlanguages});
          if(isConnected){
            return _updateLanguageList(appLanguage);
          }
          return finalLanguage;
        }else{
          if(Platform.OS == 'ios'){
            RNFS.readFile(`${RNFS.MainBundlePath}/data/languages.json`, 'utf8')
            .then((result) => {
              var parsedlanguages = JSON.parse(result);
              finalLanguage = checkLanguagePresent(parsedlanguages, appLanguage) ? appLanguage : 'en';
              store.dispatch({type: types.SET_LANGUAGE_LIST, languageList: parsedlanguages});
              if(isConnected){
                return _updateLanguageList(appLanguage);
              }
              return finalLanguage;
            }).catch((error) => {
            });
          }else{
            RNFS.readFileAssets(`data/languages.json`, 'utf8')
            .then((result) => {
              var parsedlanguages = JSON.parse(result);
              finalLanguage = checkLanguagePresent(parsedlanguages, appLanguage) ? appLanguage : 'en';
              store.dispatch({type: types.SET_LANGUAGE_LIST, languageList: parsedlanguages});
              if(isConnected){
                return _updateLanguageList(appLanguage);
              }
              return finalLanguage;
            }).catch((error) => {
            });
          }
        }
      });
    });
  }
  return _updateLanguageList('en');
}

/**
 * Checks the Update Operation and calls the fetchAndStoreVersion function
 */
export function _checkUpdateOperation(next, languageCode, noUpdate, fetchingUpdate, updateSuccess, serverIssue, lowInternet) {
  AsyncStorage.getItem('version').then((version) => {
    if(version !== null){
      var parsedVersion = JSON.parse(version);
      fetchAndStoreVersion('localstore', null, next, languageCode, updateSuccess, serverIssue);
    }else{
      fetchAndStoreVersion('offline', null, next, languageCode, updateSuccess, serverIssue);
    }
  })
}

/**
 * Dispatches the action with the search data from the local search.json / from the local storage
 */
export function localSearchData(languageCode) {
  AsyncStorage.getItem('search_content_' + languageCode).then((search_content) => {
    if (search_content !== null) {
      var parsedSearch_content = JSON.parse(search_content);
      store.dispatch({ type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: parsedSearch_content });
    } else {
      let findPlatform = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/search-${languageCode}.json`, 'utf8') : RNFS.readFileAssets(`data/search-${languageCode}.json`, 'utf8');
      findPlatform.then((result) => {
        var parsedSearch_content = JSON.parse(result);
        store.dispatch({ type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: parsedSearch_content });
      }).catch((error) => {
        store.dispatch({ type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: [] });
      });
    }
  }).catch((error) => {
  });
}

/**
 * Dispatches many key actions based on cases like local json, platform etc
 */
export function fetchAndStoreVersion(type='notFirstTime', version=null, next, languageCode, updateSuccess, serverIssue) {
  if(type == 'localstore'){
    AsyncStorage.getItem('localData_'+languageCode).then((localData) => {
      if(localData !== null){
        var parsedLocalData = JSON.parse(localData);
        var homeData = {home_view_content: parsedLocalData.topMenu.home_view_content, home_view_image: parsedLocalData.topMenu.home_view_image};
        store.dispatch({type: types.SET_HOME_DATA, data: homeData});
        store.dispatch({type: types.SET_OFFLINE_MESSAGE, showOffline: false});
        store.dispatch({type: types.FETCH_DATA, data: parsedLocalData});
        insertContentForAllNodes(parsedLocalData, version, type, languageCode, updateSuccess, serverIssue);
      }else{
        let menuDataPlatform = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/menu-${languageCode}.json`, 'utf8') : RNFS.readFileAssets(`data/menu-${languageCode}.json`, 'utf8');
        menuDataPlatform.then((result) => {
          var parsedLocalData = JSON.parse(result);
          var jsonNormalizedData = generateNormalizedData(parsedLocalData);
          var homeData = {home_view_content: jsonNormalizedData.topMenu.home_view_content, home_view_image: jsonNormalizedData.topMenu.home_view_image};
          store.dispatch({type: types.SET_HOME_DATA, data: homeData});
          store.dispatch({type: types.FETCH_DATA, data: jsonNormalizedData});
          store.dispatch({type: types.SET_OFFLINE_MESSAGE, showOffline: false});
          insertContentForAllNodes(jsonNormalizedData, version, type, languageCode, updateSuccess, serverIssue);
        }).catch((error) => {
          store.dispatch({type: types.SET_OFFLINE_MESSAGE, showOffline: true, offlineMessage: 'Unable to load data. Make sure if internet is proper.'});
        });
      }
    }).catch((error) => {
    });

    AsyncStorage.getItem('tags_content_'+languageCode).then((tags_content) => {
      if(tags_content !== null){
        var parsedTags_content = JSON.parse(tags_content);
        const _tagList = { data: parsedTags_content };
        const _tagListdata = new schema.Entity('data', {}, { idAttribute: 'tid' });
        const tagListSchema = { data: [_tagListdata] };
        const normalizedTagList = normalize(_tagList, tagListSchema);
        updateTag(languageCode, normalizedTagList);
      }else{
        let tagDataPlatform = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/tags-${languageCode}.json`, 'utf8') : RNFS.readFileAssets(`data/tags-${languageCode}.json`, 'utf8');
        tagDataPlatform.then((result) => {
          var parsedTags_content = JSON.parse(result);
          const _tagList = { data: parsedTags_content };
          const _tagListdata = new schema.Entity('data', {}, { idAttribute: 'tid' });
          const tagListSchema = { data: [_tagListdata] };
          const normalizedTagList = normalize(_tagList, tagListSchema);
          updateTag(languageCode, normalizedTagList);
        }).catch((error) => {
        });
      }
    }).catch((error) => {
    });

   AsyncStorage.getItem('search_content_'+languageCode).then((search_content) => {
    if(search_content !== null){
      var parsedSearch_content = JSON.parse(search_content);
      store.dispatch({type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: parsedSearch_content});
    }else{
      let searchDataPlatform = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/search-${languageCode}.json`, 'utf8') : RNFS.readFileAssets(`data/search-${languageCode}.json`, 'utf8');
      searchDataPlatform.then((result) => {
        var parsedSearch_content = JSON.parse(result);
        store.dispatch({type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: parsedSearch_content});
      }).catch((error) => {
        store.dispatch({type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: []});
      });
    }
    }).catch((error) => {
    });
  }
  else if(type == 'offline'){
    let menuDataPlatform = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/menu-${languageCode}.json`, 'utf8') : RNFS.readFileAssets(`data/menu-${languageCode}.json`, 'utf8');
    menuDataPlatform.then((result) => {
      var parsedLocalData = JSON.parse(result);
      var jsonNormalizedData = generateNormalizedData(parsedLocalData);
      var homeData = {home_view_content: jsonNormalizedData.topMenu.home_view_content, home_view_image: jsonNormalizedData.topMenu.home_view_image};
      store.dispatch({type: types.SET_HOME_DATA, data: homeData});
      store.dispatch({type: types.FETCH_DATA, data: jsonNormalizedData});
      store.dispatch({type: types.SET_OFFLINE_MESSAGE, showOffline: false});
      insertContentForAllNodes(jsonNormalizedData, version, type, languageCode, updateSuccess, serverIssue);
    }).catch((error) => {
      store.dispatch({type: types.SET_OFFLINE_MESSAGE, showOffline: true, offlineMessage: 'Unable to load data. Make sure if internet is proper.'});
    });
  
    let tagDataPlatform = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/tags-${languageCode}.json`, 'utf8') : RNFS.readFileAssets(`data/tags-${languageCode}.json`, 'utf8');
    tagDataPlatform.then((result) => {
      var parsedTags_content = JSON.parse(result);
      const _tagList = { data: parsedTags_content };
      const _tagListdata = new schema.Entity('data', {}, { idAttribute: 'tid' });
      const tagListSchema = { data: [_tagListdata] };
      const normalizedTagList = normalize(_tagList, tagListSchema);
      updateTag(languageCode, normalizedTagList);
    }).catch((error) => {
    });
    
    let searchDataPlatform = Platform.OS == 'ios' ? RNFS.readFile(`${RNFS.MainBundlePath}/data/search-${languageCode}.json`, 'utf8') : RNFS.readFileAssets(`data/search-${languageCode}.json`, 'utf8');
    searchDataPlatform.then((result) => {
      var parsedSearch_content = JSON.parse(result);
      store.dispatch({type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: parsedSearch_content});
    }).catch((error) => {
      store.dispatch({type: types.SET_ACTUAL_LIST_FOR_SEARCH, actualList: []});
    });
  }
}

/**
 * Dispatches the action that sets main data for all the components
 */
function insertContentForAllNodes(jsonNormalizedData, version, type, languageCode, updateSuccess, serverIssue){
  const allNormResponse = getAllEntities(jsonNormalizedData);
  const allResultNodesArray = getAllResults(jsonNormalizedData);
  var swipeResultNodesArray = getSwipeNormResponse(jsonNormalizedData);
  var totalNodesArrayLength  = allResultNodesArray.length;
  var asyncNodeCount = 0;
  var nodeUpdateInfoMap = new Map();
  var nodeMap = storeNodeData(jsonNormalizedData);
  createSwipeArray(nodeMap, swipeResultNodesArray[0]);
  allResultNodesArray.map((nid) => {
    var nodeData = allNormResponse[nid];
    var actualRid = nodeData.rid;
  if(type == 'offline' || type == 'localstore'){
      AsyncStorage.setItem(nid+'_rid', JSON.stringify(actualRid));
    }
  });
  AsyncStorage.setItem('localData_'+languageCode, JSON.stringify(jsonNormalizedData));
  store.dispatch({type: types.SET_NODE_UPDATE_INFO, nodeUpdateInfoMap: nodeUpdateInfoMap});
}