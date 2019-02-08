import * as types from '../constants/actionTypes';

export default function (state = {isConnected: true}, action) {
  switch (action.type) {
    case types.SET_CONNECTION_STATUS:
      var isConnected = action.isConnected;
      return {
        ...state,
        isConnected,
      };
    default:
      return state;
  }
}
