import {combineReducers} from 'redux';
import version from './version';
import favourite from './favourite';
import data from './data';
import navReducer from './nav';
import serverMessage from './serverMessage';
import offlineMessage from './offlineMessage';
import nodeList from './nodeList';
import headerTitle from './headerTitle';
import netInfo from './netInfo';
import tags from './tags';
import search from './search';
import swipeArray from './swipeArray';
import breadcrumbs from './breadcrumbs';
import language from './language';
import drawer from './drawer';
import shareNode from './shareNode';
import homeScreen from './homeScreen';

const rootReducer = combineReducers({
  version,
  favourite,
  data,
  nav: navReducer,
  serverMessage,
  offlineMessage,
  nodeList,
  headerTitle,
  netInfo,
  tags,
  search,
  swipeArray,
  breadcrumbs,
  language,
  drawer,
  shareNode,
  homeScreen
});

export default rootReducer;
