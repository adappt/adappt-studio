import { Provider } from 'react-redux';
import React, { Component } from 'react';
import { Platform, View, Image, Dimensions, TouchableOpacity, Keyboard, StatusBar } from 'react-native';
import store from '../redux/store';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import DrawerMenu from '../containers/DrawerMenu';
import HomeScreen from '../containers/HomeScreen';
import Tags from '../containers/Tags'
import SquareMenu from '../containers/SquareMenu';
import MenuList from '../containers/MenuList';
import StoryView from '../containers/StoryView';
import Favourite from '../containers/Favourite';
import Search from '../containers/Search';
import MenuListWithContent from '../containers/MenuListWithContent';
import StoryViewImageZoom from '../containers/StoryViewImageZoom';
import News from '../containers/News';
import JumpToPage from '../containers/JumpToPage';
const { width, height } = Dimensions.get('window');

goBack = (navigation) => {
  if (navigation.state.routeName !== 'Favourite' && navigation.state.routeName != 'Home') {
    navigation.goBack();
    Keyboard.dismiss()
  }
  if (navigation.state.routeName === 'Favourite') {
    navigation.replace('Home')
    Keyboard.dismiss()
  }
};

const backButton = (navigation) =>
  <TouchableOpacity onPress={() => goBack(navigation)}
    style={{ paddingLeft: 18, paddingTop: Platform.OS == 'ios' ? 14 : 10, height: 54, width: 70, top: Platform.OS == 'ios' ? -3 : 0 }}>
    <SimpleLineIcons name='arrow-left' size={22} color="#565656" />
  </TouchableOpacity>

let fromLeft = (index, position) => {
  return {
    transform: [{
      translateX: position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [-width, 0, 0]
      })
    }]
  };
};

let fromRight = (index, position) => {
  return {
    transform: [{
      translateX: position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [width, 0, 0]
      })
    }]
  }
};

let _nav = '';
let TransitionConfiguration = () => {
  return {
    screenInterpolator: (sceneProps) => {
      const { position, scene } = sceneProps;
      _nav = sceneProps;
      const { index } = scene;
      if ((sceneProps.scene.route.routeName === 'StoryView' || sceneProps.scene.route.routeName === 'MenuListWithContent') && sceneProps.scene.route.params.isPrev) {
        return fromLeft(index, position);
      } else {
        return fromRight(index, position)
      }
    }
  }
};

export const funEvent = getNavigationEvent = () => {
  return _nav.scene.route.routeName;
}

const StackNav = StackNavigator({
  Home: { screen: HomeScreen },
  Tag: { screen: Tags },
  SquareMenu: { screen: SquareMenu },
  StoryView: { screen: StoryView },
  MenuList: { screen: MenuList },
  Favourite: { screen: Favourite },
  Search: { screen: Search },
  StoryViewImageZoom: { screen: StoryViewImageZoom },
  MenuListWithContent: { screen: MenuListWithContent },
  News: { screen: News },
  JumpToPage: { screen: JumpToPage }
},
  {
    transitionConfig: TransitionConfiguration,
    navigationOptions: ({ navigation, screenProps }) => ({
      headerStyle: {
        backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#ddd'
      },
      headerTitleStyle: {           
        flex:1,
        textAlign:'center',
        fontSize: 18,
        margin:0,
        marginHorizontal: 3 
      },
      headerTintColor: 'white',
      gesturesEnabled: false,
      drawerLockMode: 'locked-closed',
      headerMode: 'float',
      headerLeft: navigation.state.routeName === 'Home' ? null : backButton(navigation),
      headerTitle: (
        <View style={{ flex: 1}}>
          <Image
            resizeMode="cover"
            style={{
              width: 200,
              height: 27,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginRight: Platform.OS === 'android' && (navigation.state.routeName === 'SquareMenu' || navigation.state.routeName === 'StoryViewImageZoom') ? 50 : null
            }}
            source={require('./adappt-studio.png')}
          />
        </View>
      )
    })
  });

export const AppNavigator = DrawerNavigator({
  DrawerMenu: {
    screen: StackNav
  }
},
  {
    contentComponent: ({ navigation }) => (
      <DrawerMenu navigation={navigation} />
    ),
    drawerWidth: width - 50
  });

const defaultGetStateForAction = AppNavigator.router.getStateForAction;

AppNavigator.router.getStateForAction = (action, state) => {
  if (state && action.type === 'Navigation/NAVIGATE' && action.routeName === 'DrawerClose') {
    store.dispatch({ type: "RESET_TO_MAIN_DRAWER", mainDrawer: true });
  }
  return defaultGetStateForAction(action, state);
};