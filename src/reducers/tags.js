import * as types from '../constants/actionTypes';

export default function (state = {}, action) {
  switch (action.type) {
    case types.FETCH_TAG_DATAS:
      var data = action.data;
      return {
        ...state,
        data
      };
    default:
      return state;
  }
}
