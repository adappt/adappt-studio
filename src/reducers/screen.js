import * as types from '../constants/actionTypes';

export default function (state = {name: ''}, action) {
  switch (action.type) {
    case types.FETCH_SCREEN:
      var name = action.name;
      return {
        ...state,
        name
      };
    default:
      return state;
  }
}
