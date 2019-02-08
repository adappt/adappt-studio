import React, {Component} from 'react'
import {Provider} from 'react-redux';
import {NetInfo, Linking, Platform, BackHandler, AppState} from 'react-native';
import store from './src/redux/store';
import {SafeAreaView} from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import {AppNavigator, funEvent} from './src/navigators/Navigator';
import NavigationService from './src/navigators/NavigationService';
import * as types from './src/constants/actionTypes';
import Footer from './src/containers/Footer';
import FlurryAnalytics from 'react-native-flurry-analytics';

// Flurry Keys
const flurryApiKey = {
  ios: 'XXXXXXXXXXXXXXXX',
  android: 'XXXXXXXXXXXXXXXX',
};

type
Props = {};
export default class App extends Component<Props> {
  
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    }
  }
  
  componentWillMount() {
    FlurryAnalytics.startSession(flurryApiKey[Platform.OS]);
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }
  
  componentDidMount() {
    SplashScreen.hide();
    store.dispatch({type: types.CHECK_UPDATE});
    store.dispatch({type: types.FETCH_FAVOURITE});
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        if (url)
          this._handleOpenURLFurther(url);
      });
    } else {
      Linking.addEventListener('url', this._handleOpenURL.bind(this));
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    AppState.addEventListener('change', this._handleAppStateChange);
  }
  
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange);
    Linking.removeEventListener('url', this._handleOpenURL);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }
  
  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      store.dispatch({type: types.SET_SERVER_MESSAGE, showMessage: false, serverMessage: '', issue: false});
    }
    this.setState({appState: nextAppState});
  };
  
  handleBackPress = () => {
    let _returnVal = funEvent();
    if (_returnVal === 'Favourite') {
      NavigationService.navigate('Home');
      return true;
    }
    if (_returnVal === 'Home') {
      BackHandler.exitApp();
    }
    return false;
  };
  
  _handleOpenURL(event) {
    this._handleOpenURLFurther(event.url);
  }
  
  _handleOpenURLFurther(url) {
    const route = url.replace(/.*?:\/\//g, '');
    const params = route.split("/");
    const nodeID = params[0];
    const languageCode = params[1];
    const numberOnlyRegex = new RegExp(/^\d{0,6}$/);
    const languageCodeRegex = new RegExp(/^[a-z]{0,3}(-[a-z]{0,5})?$/);
    if (params.length === 2 && numberOnlyRegex.test(nodeID) && languageCodeRegex.test(languageCode)) {
      store.dispatch({type: types.SET_SHARED_CONTENT_NODE, nodeID: nodeID, language: languageCode});
    }
  }
  
  _handleConnectionChange = (isConnected) => {
    store.dispatch({type: types.SET_CONNECTION_STATUS, isConnected});
  };
  
  render() {
    return (
      <Provider store={store}>
        <SafeAreaView style={{flex: 1, backgroundColor:'#565656'}} forceInset={{'top': 'never'}}>
          <AppNavigator ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}/>
          <Footer/>
        </SafeAreaView>
      </Provider>
    );
  }
}