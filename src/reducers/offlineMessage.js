import * as types from '../constants/actionTypes';

export default function (state = {showOffline: false, offlineMessage: ''}, action) {
  switch (action.type) {
    case types.SET_OFFLINE_MESSAGE:
      var showOffline = action.showOffline;
      var offlineMessage = action.offlineMessage;
      if (!showOffline) {
        offlineMessage = '';
      }
      return {
        ...state,
        showOffline,
        offlineMessage
      };
    default:
      return state;
  }
}
