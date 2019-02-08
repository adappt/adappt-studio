import * as types from '../constants/actionTypes';

export default function (state = {data: {}, imageLoaded: false}, action) {
  switch (action.type) {
    case types.SET_HOME_DATA:
      var data = action.data;
      return {
        ...state,
        data
      };
    case types.SET_HOME_IMAGE_LOADED:
      var imageLoaded = action.imageLoaded;
      return {
        ...state,
        imageLoaded
      };
    default:
      return state;
  }
}
