import { AppNavigator } from '../navigators/Navigator'

export default function navReducer(state, action) {
  if (action.type.startsWith('Navigation/')) {
    const { type, routeName } = action;
    const lastRoute = state.routes[state.routes.length - 1];
    if (type == lastRoute.type && routeName == lastRoute.routeName) {
      return state;
    }
  }
  const newState = AppNavigator.router.getStateForAction(action, state);
  return newState || state
}
