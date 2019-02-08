import React, { PureComponent } from 'react';
import { Text, View, Dimensions, StyleSheet, Platform, Alert, Image, TouchableOpacity, Linking, AsyncStorage, ActivityIndicator, FlatList } from 'react-native';
import store from '../../redux/store'
import HTML from 'react-native-render-html';
import * as types from '../../constants/actionTypes';
import { connect } from 'react-redux';
import { RenderHtmlStyles } from './RenderHtmlStyles'
import ModalPopUp from './ModalPopUp'
import StoryTagsView from './StoryTagsView'
import { LANGUAGES } from '../../constants/serverAPIS';
import { navigateHelper } from '../../utils/navigateHelper';
import FlurryAnalytics from 'react-native-flurry-analytics';
var RNFS = require('react-native-fs');

const { width, height } = Dimensions.get('window');
const IMAGES_MAX_WIDTH = Dimensions.get('window').width - 150;
const CUSTOM_STYLES = {};

const mapStateToProps = state => {
  return {
    tags: state.tags.data,
    nodeUpdateInfoMap: state.nodeList.nodeUpdateInfoMap,
    languageCode: state.language.language_code
  }
};

class StoryViewBody extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      referenceId: '',
      sectionsData: {},
      loaderVisible: true,
      data: null,
      nid: null,
      willmount: false,
      bodyLength: ''
    };
  }

  componentWillMount = () => {
    const { bodylength } = this.props;
    this.setState({
      willmount: true,
      bodyLength: bodylength
    });

    setTimeout(() => this.setState({
      loaderVisible: false
    },()=> {
      this.props.showLoader(false);
    }), 300);
  };

  componentDidMount() {
    if(this.props.trackable){
      FlurryAnalytics.logEvent('Node Type: Content',{'Title' : this.props.data.title});
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const { bodylength } = nextProps;
    const { data } = this.props;
    this.setState({ bodyLength: bodylength });
    if (nextProps.data.nid !== data.nid) {
      this.setState({
        willmount: false,
        loaderVisible: true
      }, () => {
        this.props.showLoader(true)
      });
      setTimeout(() => this.setState({
        loaderVisible: false
      }, ()=> {
        this.props.showLoader(false);
      }), 300);
    }
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };

  nodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo) {
    if (updateInfo === undefined) {
      AsyncStorage.getItem(nid).then((localNodeData) => {
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
    var that = this;
    readNodeData.then((result) => {
      var parsedLocalNodeData = JSON.parse(result);
      that.nodeRedirect(parsedLocalNodeData);
    }).catch((error) => {
    });
  };
  
  nodeRedirect = (data) => {
    const { nav, nodeMap, nodeUpdateInfoMap } = this.props;
    if (data && data.translations) {
      let _itemsLang = data.translations.map((d) => { return d.lang; });
      let index = _itemsLang.indexOf(this.props.lanCode);
      if (index > -1) {
        // this.navigatepath(data.translations[index].nid);
        const nID = data.translations[index].nid;
        var nodeData = nodeMap.get(nID);
        navigateHelper(nodeData, nav, nodeMap, nodeUpdateInfoMap, false, null);
      } else {
        var nodeData = nodeMap.get(data.nid);
        navigateHelper(nodeData, nav, nodeMap, nodeUpdateInfoMap, false, null);
        // Redirect TO English Node
      }
    } else {
      var nodeData = nodeMap.get(data.nid);
      navigateHelper(nodeData, nav, nodeMap, nodeUpdateInfoMap, false, null);
      // Redirect TO English Node
    }
  };

  onLinkPress = (href) => {
    const { nodeMap, nodeUpdateInfoMap, languageCode } = this.props;
    const langIndex = LANGUAGES.findIndex(lang=> lang.code === languageCode); 
    if (href.indexOf("node/") > -1 && href.match(/\d+/g)) {
      var nodeLink = href.match(/\d+/g);
      var nid = nodeLink[0];
      var updateInfo = nodeUpdateInfoMap.get(nid);
      if (languageCode !== 'en') {
        this.nodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo);
      }
      store.dispatch({ type: types.SET_HEADER_TITLE, showLogo: true });
      if (languageCode === 'en') {
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

  render() {
    const { data, nav, searchText } = this.props;
    const CUSTOM_RENDERERS = {
      img: (htmlAttribs, children, convertedCSSStyles, passProps) => {
        var CurWidth, Curheight;
        if (htmlAttribs.hasOwnProperty('style') === false) {
          CurWidth = Dimensions.get('window').width - 50;
          Curheight = 200;
        } else {
          var res = htmlAttribs.style.split(";");
          var Imgwidth = res[0].match(/\d+/g).map(Number);
          var Imgheight = res[1].match(/\d+/g).map(Number);
          CurWidth = Dimensions.get('window').width - 50;
          Curheight = (Imgheight / Imgwidth) * CurWidth;
        }
        return (
          htmlAttribs.class === "resize" ?
            <Image
              source={{ uri: htmlAttribs.src }}
              style={{ width: convertedCSSStyles.width, height: convertedCSSStyles.height, marginLeft: Platform.OS === 'ios' ? (htmlAttribs.class === 'keyimg' ? -19 : 0) : (htmlAttribs.class === 'keyimg' ? 0 : 0) }} />
            :
            <TouchableOpacity key={passProps.nodeIndex}
              onPress={() => nav.navigate({ routeName: 'StoryViewImageZoom', params: { data: htmlAttribs.src }, key: passProps.key })}>
              {htmlAttribs.class === "resources" ?
                <Image source={{ uri: htmlAttribs.src }}
                  style={{
                    width: width > 700 ? 225 : CurWidth,
                    height: width > 700 ? 338 : Curheight,
                    marginRight: 20
                  }} />
                :
                <Image source={{ uri: htmlAttribs.src }}
                  style={{
                    width: CurWidth, height: Curheight, marginLeft: Platform.OS === 'ios' ? (htmlAttribs.class === 'keyimg' ? -19 : 0) :
                      (htmlAttribs.class === 'keyimg' ? 0 : 0)
                  }} />
              }
            </TouchableOpacity>
        )
      },
      ol:  (htmlAttribs, children, convertedCSSStyles, passProps = {}) => {
        const { rawChildren, nodeIndex, key, baseFontStyle, listsPrefixesRenderers } = passProps;
        const baseFontSize = baseFontStyle.fontSize || 14;
        children = children && children.map((child, index) => {
            const rawChild = rawChildren[index];
            let prefix = false;
            const rendererArgs = [
              htmlAttribs,
              children,
              convertedCSSStyles,
              {
                ...passProps,
                index
              }
            ];
            if (rawChild) {
              if (rawChild.parentTag === 'ul') {
                prefix = listsPrefixesRenderers && listsPrefixesRenderers.ul ? listsPrefixesRenderers.ul(...rendererArgs) : (
                  <View key={'ul-'+index} style={{
                    marginRight: 10,
                    width: baseFontSize / 2.8,
                    height: baseFontSize / 2.8,
                    marginTop: baseFontSize / 2,
                    borderRadius: baseFontSize / 2.8,
                    backgroundColor: 'black'
                  }} />
                );
              } else if (rawChild.parentTag === 'ol') {
                prefix = listsPrefixesRenderers && listsPrefixesRenderers.ol ? listsPrefixesRenderers.ol(...rendererArgs) : (
                  <Text key={'ol-'+index} style={{ marginRight: 5, fontSize: baseFontSize }}>{(rawChild.parent.attribs.start) ? parseInt(rawChild.parent.attribs.start) + index : index + 1 })</Text>
                );
              }
            }
            return (
                <View key={`list-${nodeIndex}-${index}-${key}`} style={{ flexDirection: 'row', marginBottom: 10 }}>
                    { prefix }
                    <View style={{ flex: 1 }}>{ child }</View>
                </View>
            );
        });
        // return children;
        return (
          <FlatList
          data={children}
          keyExtractor={(item, index) => index.toString()}
          removeClippedSubviews={true}
          renderItem={({item})=>item} 
          onEndReachedThreshold={0.8}
          maxToRenderPerBatch={120}
          initialNumToRender={60}
          updateCellsBatchingPeriod={0}
          />
        )
    }
    };
    const DEFAULT_PROPS = {
      htmlStyles: CUSTOM_STYLES,
      renderers: CUSTOM_RENDERERS,
      tagsStyles: RenderHtmlStyles.CUSTOM_TAGSSTYLE,
      imagesMaxWidth: IMAGES_MAX_WIDTH,
      classesStyles: RenderHtmlStyles.CUSTOM_CLASSES,
      onLinkPress: (evt, href) => this.onLinkPress(href),
    };
    const numberOfDigits = Math.floor(Math.log(data.body.length) / Math.LN10 + 1);
    var a = this.props.data.title.toUpperCase();
    var b = this.state.bodyLength == undefined ? a : this.state.bodyLength.toUpperCase();

    var htmlBody = data.body;
    if (searchText !== null && searchText !== undefined) {
      var _searchText = searchText;      
      var addBackslashWithSplChar = _searchText.replace(/([\[\]<>*()?])/g, "\\$1");
      var regex = new RegExp(addBackslashWithSplChar+"(?!([^<])*?>)(?!<script[^>]*?>)(?![^<]*?<\/script>|$)", 'gi');
      htmlBody = htmlBody.replace(regex, `<a style="color: #666; background-color: yellow">$&</a>`);
    }

    return (
      <View style={styles.container}>
        <ModalPopUp DEFAULT_PROPS={DEFAULT_PROPS} modalVisible={this.state.modalVisible} data={data} referenceId={this.state.referenceId} setModalVisible={(visible) => this.setModalVisible(visible)} />
        {
          (this.state.loaderVisible === false && a === b) ?
            <HTML
              {...DEFAULT_PROPS}
              imagesMaxWidth = {Dimensions.get('window').width - 200}
              textSelectable = {true}
              html = {htmlBody}
            /> :
            numberOfDigits >= 5 ? <ActivityIndicator size="small" color="#ed9100" style={styles.activityIndicator} /> : this.state.willmount ? <ActivityIndicator size="small" color="#ed9100" style={styles.activityIndicator} /> : null
        }
        {
          this.props.data.field_tagging && this.props.sectionTags && this.props.sectionsItem && this.state.loaderVisible === false && a === b ?
            <StoryTagsView SECTIONS_Tags={this.props.sectionTags} sectionsData={this.props.sectionsItem} nav={this.props.nav} nodeMap={this.props.nodeMap} nodeUpdateInfoMap={this.props.nodeUpdateInfoMap} languageCode={this.props.languageCode} />
            : null
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15
  },
  activityIndicator: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 90,
    height: 80
  }
});

export default connect(mapStateToProps)(StoryViewBody)