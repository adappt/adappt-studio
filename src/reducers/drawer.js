import * as types from '../constants/actionTypes';

export default function (state = {mainDrawer: true}, action) {
  switch (action.type) {
    case types.RESET_TO_MAIN_DRAWER:
      var mainDrawer = action.mainDrawer;
      return {
        ...state,
        mainDrawer,
      };
    default:
      return state;
  }
}
