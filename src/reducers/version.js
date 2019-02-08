import * as types from '../constants/actionTypes';

export default function (state = {version: ''}, action) {
  switch (action.type) {
    case types.FETCH_VERSION:
      return {
        ...state,
        version: action.version
      };
    default:
      return state;
  }
}
