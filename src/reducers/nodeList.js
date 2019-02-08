import * as types from '../constants/actionTypes';

export default function (state={ nodeMap: new Map(), nodeUpdateInfoMap: new Map(), nodeMapReady: false }, action) {
	switch (action.type) {
		case types.SET_NODE_DATA_MAP:
			return {
				...state,
				nodeMap: action.nodeMap,
				nodeMapReady: action.nodeMapReady,
			};
		case types.SET_NODE_UPDATE_INFO:
			return {
				...state,
				nodeUpdateInfoMap: action.nodeUpdateInfoMap
			};
		default:
			return state;
	}
}
