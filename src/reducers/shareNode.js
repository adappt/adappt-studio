import * as types from '../constants/actionTypes';

export default function (state = {nodeID: null, language: null}, action) {
  switch (action.type) {
    case types.SET_SHARED_CONTENT_NODE:
      return {
        ...state,
        nodeID: action.nodeID,
        language: action.language,
      };
    default:
      return state;
  }
}
