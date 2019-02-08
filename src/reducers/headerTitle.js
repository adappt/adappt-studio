import * as types from '../constants/actionTypes';

export default function (state = {showLogo: true, title: '', data: {}}, action) {
  switch (action.type) {
    case types.SET_HEADER_TITLE:
      var showLogo = action.showLogo;
      var title = action.title;
      var data = action.data;
      if (showLogo) {
        title = '';
        data = {};
      }
      return {
        ...state,
        showLogo,
        title,
        data
      };
    default:
      return state;
  }
}
