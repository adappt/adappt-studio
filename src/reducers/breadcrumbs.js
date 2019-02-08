import * as types from '../constants/actionTypes';

export default function (state = {breadCrumsElementArray: [], mirrorContentData: []}, action) {
  switch (action.type) {
    case types.GENERATE_BREADCRUMB:
      var nid = action.nid;
      var nodeMap = action.nodeMap;
      var nidData = nodeMap.get(nid);
      var parent_nid = nidData.parent_nid;
      var parent_nid_array = [nid, parent_nid];
      do {
        var parent_data = nodeMap.get(parent_nid);
        if (parent_data !== undefined) {
          parent_nid = parent_data.parent_nid;
          if (nodeMap.get(parent_nid) !== undefined) {
            parent_nid_array.push(parent_nid);
          }
        } else {
          parent_nid = undefined;
        }
      } while (parent_nid !== undefined);
      breadCrumsElementArray = parent_nid_array.reverse();
      return {
        ...state,
        breadCrumsElementArray
      };
    case types.REMOVE_ELEMENT_FROM_BREADCRUMB:
      var breadCrumsElementArray = state.breadCrumsElementArray;
      var numberOfElementToRemove = action.numberOfElementToRemove;
      for (var i = 0; i < numberOfElementToRemove; i++) {
        breadCrumsElementArray.pop();
      }
      return {
        ...state,
        breadCrumsElementArray
      };
    case types.EMPTY_BREADCRUMB:
      breadCrumsElementArray = [];
      return {
        ...state,
        breadCrumsElementArray
      };
    case types.GENERATE_MIRROR_CONTENT_BREADCRUMB:
      var nodeMap = action.nodeMap;
      var original_content = action.original_content;
      var parent_nid_array = [];
      var originalData = nodeMap.get(original_content);
      if (originalData !== undefined) {
        var parent_nid = originalData.parent_nid;
        parent_nid_array = [original_content, parent_nid];
        do {
          var parent_data = nodeMap.get(parent_nid);
          if (parent_data !== undefined) {
            parent_nid = parent_data.parent_nid;
            if (nodeMap.get(parent_nid) !== undefined) {
              parent_nid_array.push(parent_nid);
            }
          } else {
            parent_nid = undefined;
          }
        } while (parent_nid !== undefined);
      }
      // generate the original nid array as well as the corresponding data set for it.
      breadCrumsElementArray = parent_nid_array.reverse();
      return {
        ...state,
        breadCrumsElementArray,
      };
    
    default:
      return state;
  }
}
