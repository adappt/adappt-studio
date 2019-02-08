import * as types from '../constants/actionTypes';

export default function (state={}, action) {
	switch (action.type) {
		case types.FETCH_DATA:
			var data = action.data;
			return {
				...state,
				...data				
			};
		default:
			return state;
	}
}
