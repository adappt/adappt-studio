import React, { Component } from 'react';
import { Text, View, StyleSheet, Linking, AsyncStorage, Platform, Alert } from 'react-native';
import store from '../../redux/store'
import Accordion from 'react-native-collapsible/Accordion';
import HTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as types from '../../constants/actionTypes';
import { LANGUAGES } from '../../constants/serverAPIS';
import { navigateHelper } from '../../utils/navigateHelper';
var RNFS = require('react-native-fs');
import FlurryAnalytics from 'react-native-flurry-analytics';

const CUSTOM_STYLES = {};
let chapters = [];
let contents = [];
const CUSTOM_CLASSES = {
  'approach': {
    backgroundColor: '#e8e8e8',
    padding: 10
  }
};
const CUSTOM_TAGSSTYLE = {
  h4: {
    margin: 4
  },
  p: {
    fontFamily: 'Nunito',
    fontSize: 17,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 10,
    padding: 0,
  },
  span: {
    fontFamily: 'Nunito',
    fontSize: 17,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 10,
    padding: 0
  },
  a: {
    color: '#03adea',
    textDecorationLine: 'none',
    padding: 0,
    fontFamily: 'Nunito',
    fontSize: 17
  },
  strong: {
    fontFamily: 'Nunito-Bold',
    fontSize: 17,
    flexDirection: 'row'
  },
  em: {
    fontFamily: 'Nunito-Italic',
    fontSize: 16,
  }
};

class Accordian extends Component {
  constructor() {
    super();
    chapters = [];
    contents = []
  }

  componentWillMount = () => {
    this.props.data.field_accordian_header.map((item, index) => {
      item.field_accordian.map((items, index) => {
        contents.push(items);
        chapters.push(item.field_header)
      })
    })
  };

  componentDidMount() {
    if(this.props.trackable){
      FlurryAnalytics.logEvent('Node Type: Accordian',{'Title' : this.props.data.title});
    }
  }

  _renderHeader = (section, index, isActive) => {
    const { sectionHeadView, HeaderTextView, HeaderIconView, HeaderIcon, HeaderText } = styles;
    return (
      <View key={index} style={{ marginBottom: isActive ? 0 : 5 }}>
        {
          section &&
          <View style={[{ backgroundColor: isActive ? '#024E3D' : '#F2F2F2' }, sectionHeadView]}>
            <View style={HeaderTextView}>
              <Text style={[{ color: isActive ? 'white' : '#5a5959' }, HeaderText]}>{section && section.field_title}</Text>
            </View>
            <View style={HeaderIconView}>
              {isActive && <Icon style={HeaderIcon} color='white' size={18} name='angle-up' />}
              {!isActive && <Icon style={HeaderIcon} color='#5a5959' size={18} name='angle-down' />}
            </View>
          </View>
        }
      </View>
    );
  };

  nodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo) {
    if (updateInfo === undefined) {
      AsyncStorage.getItem('' + nid).then((localNodeData) => {
        if (localNodeData !== null) {
          var parsedLocalNodeData = JSON.parse(localNodeData);
          this.nodeRedirect(parsedLocalNodeData);
        } else {
          this.readNodeData(nid);
        }
      }).catch((error) => {
      });
    } else if (updateInfo === false) {
    } else {
      AsyncStorage.getItem('' + nid).then((localNodeData) => {
        if (localNodeData !== null) {
          var parsedLocalNodeData = JSON.parse(localNodeData);
          this.nodeRedirect(parsedLocalNodeData);
        }
      }).catch(() => { });
    }
  }

  readNodeData = (nid) => {
    let readNodeData = (Platform.OS === 'ios') ?
      RNFS.readFile(`${RNFS.MainBundlePath}/data/nodes/node_${nid}.json`, 'utf8') :
      RNFS.readFileAssets(`data/nodes/node_${nid}.json`, 'utf8');

    readNodeData.then((result) => {
      var parsedLocalNodeData = JSON.parse(result);
      this.nodeRedirect(parsedLocalNodeData);
    }).catch((error) => {
    });
  };

  nodeRedirect = (data) => {
    const { nav, nodeMap, nodeUpdateInfoMap } = this.props;
    if (data && data.translations) {
      let _itemsLang = data.translations.map((d) => { return d.lang; });
      let index = _itemsLang.indexOf(this.props.lanCode);
      if (index > -1) {
        const nID = data.translations[index].nid;
        var nodeData = nodeMap.get(nID);
        navigateHelper(nodeData, nav, nodeMap, nodeUpdateInfoMap, false, null);
      } else {
        var nodeData = nodeMap.get(data.nid);
        navigateHelper(nodeData, nav, nodeMap, nodeUpdateInfoMap, false, null);
      }
    } else {
      var nodeData = nodeMap.get(data.nid);
      navigateHelper(nodeData, nav, nodeMap, nodeUpdateInfoMap, false, null);

    }
  };
  _renderContent = (section, index) => {
    const { ContentView } = styles;
    const DEFAULT_PROPS = {
       htmlStyles: CUSTOM_STYLES,
      tagsStyles: CUSTOM_TAGSSTYLE,
      classesStyles: CUSTOM_CLASSES,
      onLinkPress: (evt, href) => onLinkPress(href)
    };
    onLinkPress = (href) => {
      const { data, nav, nodeMap, nodeUpdateInfoMap, lanCode } = this.props;
      const langIndex = LANGUAGES.findIndex(lang => lang.code === lanCode); 

      if (href.indexOf("node/") > -1 && href.match(/\d+/g)) {
        var nodeLink = href.match(/\d+/g);
        store.dispatch({ type: types.SET_HEADER_TITLE, showLogo: true });
        var nid = nodeLink[0];
        var updateInfo = nodeUpdateInfoMap.get(nid);
        var nodeData = this.props.nodeMap.get(nid);
        if (this.props.lanCode !== 'en' ) {
          this.nodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo);
        }

        if (this.props.lanCode === 'en') {
          var nodeData = this.props.nodeMap.get(nid);
          const { nav, nodeMap, nodeUpdateInfoMap } = this.props;
          navigateHelper(nodeData, nav, nodeMap, nodeUpdateInfoMap);
        }

      } else if (href.search(/#\d|#foot.*/) > -1) {
        this.setState({ referenceId: href });
        this.setModalVisible(true);
      } else {
        Alert.alert(
          LANGUAGES[langIndex].notificationTitle,
          LANGUAGES[langIndex].externalNotificationMsg,
          [
            {text: LANGUAGES[langIndex].cancel, onPress: () => {}, style: 'cancel'},
            {text: LANGUAGES[langIndex].ok, onPress: () => Linking.openURL(href).catch((err) => console.log(`Error Occured: ${err.message}`))}, 
          ],
          { cancelable: false }
        ) 
      }
    };
    return (
      <View key={index} style={ContentView}>
        {section && <HTML {...DEFAULT_PROPS} baseFontStyle={{ color: '#5a5959' }} html={section.field_content} />}
      </View>
    );
  };

  renderSectionTitle = (content, index, isActive) => {
    return (
      <View>
        {chapters[index - 1] !== chapters[index] ? <Text style={styles.chapterHeader}>{chapters[index]}</Text> : null}
      </View>
    )
  };

  render() { 
    return (
      <View style={{ margin: 13 }}>
        <Accordion
          sections={contents}
          renderSectionTitle={this.renderSectionTitle}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          underlayColor='transparent'
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  chapterHeader: {
    fontSize: 20,
    color: '#005744',
    fontFamily: 'Nunito-Bold',
    margin: 8,
    marginLeft: 0
  },
  sectionHeadView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  HeaderTextView: {
    flex: 0.9
  },
  HeaderText: {
    fontSize: 16,
    padding: 10,
    fontFamily: 'Nunito-Bold',
  },
  HeaderIconView: {
    flex: 0.1
  },
  HeaderIcon: {
    paddingLeft: 10
  },
  ContentView: {
    padding: 13,
    marginBottom: 5,
    paddingTop: 0,
    backgroundColor: '#F2F2F2'
  }
});
export default Accordian;