import * as types from '../constants/actionTypes';

export default function (state = {showMessage: false, serverMessage: '', issue: false}, action) {
  switch (action.type) {
    case types.SET_SERVER_MESSAGE:
      var showMessage = action.showMessage;
      var serverMessage = action.serverMessage;
      var issue = action.issue;
      if (!showMessage) {
        serverMessage = '';
      }
      return {
        ...state,
        showMessage,
        serverMessage,
        issue
      };
    default:
      return state;
  }
}
