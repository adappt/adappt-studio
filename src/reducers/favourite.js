import * as types from '../constants/actionTypes';

export default function (state = {fav: []}, action) {
  switch (action.type) {
    case types.FETCH_FAVOURITE:
      return {
        ...state,
        fav: action.fav
      };
    default:
      return state;
  }
}
