import * as types from '../constants/actionTypes';
export default function (state = {swipeArrayNodes: [], swipeArrayReady: false}, action) {
  switch (action.type) {
    case types.SET_SWIPE_ARRAY:
      var swipeArrayNodes = action.swipeArrayNodes;
      var swipeArrayReady = action.swipeArrayReady;
      return {
        ...state,
        swipeArrayNodes,
        swipeArrayReady
      };
    case types.SET_SWIPE_ITEMS:
      var item1 = action.item1;
      var item2 = action.item2;
      var item3 = action.item3;
      var item4 = action.item4;
      var item5 = action.item5;
      return {
        ...state,
        item1,
        item2,
        item3,
        item4,
        item5
      };
    default:
      return state;
  }
}
