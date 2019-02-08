import * as types from '../constants/actionTypes';

export default function (state = {language_code: "en", showLanguageLoader: false, languageList: []}, action) {
  switch (action.type) {
    case types.SET_LANGUAGE:
      var new_language = action.language_code;
      return {
        ...state,
        language_code: new_language,
      };
    case types.SET_LOADER:
      var showLanguageLoader = action.showLanguageLoader;
      return {
        ...state,
        showLanguageLoader
      };
    case types.SET_LANGUAGE_LIST:
      var languageList = action.languageList;
      return {
        ...state,
        languageList,
      };
    default:
      return state;
  }
}
