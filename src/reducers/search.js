import * as types from '../constants/actionTypes';
var S = require('string');

export default function (state = {searchList: [], actualList: [], displayList: [], strPresent: true}, action) {
  switch (action.type) {
    case types.SET_ACTUAL_LIST_FOR_SEARCH:
      var actualList = action.actualList;
      return {
        ...state,
        actualList,
      };
    case types.SEARCH_NODE_LIST:
      var str = action.str;
      var nodeMap = action.nodeMap;
      var actualList = state.actualList && typeof state.actualList === "object" ? state.actualList : [];
      var searchList = [];
      var strPresent = false;
      if (str.trim() != '' && actualList && actualList !== undefined) {
        searchList = actualList.filter((data) => {
          var nodeData = nodeMap.get(data.nid);
          data.text_data = data.text_data.replace(/ {1,}/g, ' ');
          var title = '';
          
          if (nodeData !== undefined) {
            title = nodeData.title;
          }
          var titleLowerCase = title.toLowerCase();
          var strLowerCase = str.toLowerCase();
          var body = data.text_data;
          decodeArticle = S(body).stripTags().decodeHTMLEntities().trim().s;
          var lowerCaseTextData = decodeArticle.toLowerCase().trim();
          if ((lowerCaseTextData.indexOf(strLowerCase) > -1 || titleLowerCase.indexOf(strLowerCase) > -1) && nodeData !== undefined) {
            strPresent = true;
          }
          return ((lowerCaseTextData.indexOf(strLowerCase) > -1 || titleLowerCase.indexOf(strLowerCase) > -1) && nodeData !== undefined);
        });
      } else {
        strPresent = true;
      }
      var displayList = searchList ? searchList : [];
      return {
        ...state,
        searchList,
        displayList,
        strPresent
      };
    case types.CLEAR_SEARCH_LIST:
      var searchList = [];
      var displayList = [];
      return {
        ...state,
        searchList,
        displayList
      };
    default:
      return state;
  }
}
