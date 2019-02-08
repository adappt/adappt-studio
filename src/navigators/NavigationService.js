import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}
var beforeScreen = '';
function navigate(routeName, params, key) {
  _navigator.dispatch(
    NavigationActions.navigate({
      type: NavigationActions.NAVIGATE,
      routeName,
      params,
      key
    })
  );
}

function reset(routeName, params, key) {
  _navigator.dispatch(
    NavigationActions.reset({
      type: NavigationActions.RESET,
      routeName,
      index: 0,
      actions: [NavigationActions.navigate({ routeName: routeName, key: key, params, reload: false })]
    })
  );
}

export default {
  navigate,
  setTopLevelNavigator,
  reset
};
