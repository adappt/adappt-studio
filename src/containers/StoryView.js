/**
	* StoryView:  Displays the core content.
	* Contains breadcrumb at the top, Favourite and share buttons
*/

import React, { PureComponent } from "react";
import { View, Dimensions, StyleSheet, ScrollView, ActivityIndicator,	Text, TouchableOpacity,	Platform,	Share } from "react-native";
import store from '../redux/store';
import StoryViewBody from "../component/StoryView/StoryViewBody";
import FeedbackMessage from "../component/FeedbackMessage";
import DecisionTree from "./DecisionTree";
import News from "./News";
import Accordian from "../component/StoryView/Accordian";
import { AsyncStorage } from "react-native";
import { connect } from "react-redux";
import { STORE_URL } from "../constants/serverAPIS";
import Icon from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather"
import * as types from "../constants/actionTypes";
import FlurryAnalytics from "react-native-flurry-analytics";
import { navigateHelper, navigateReplaceWithAnimation } from "../utils/navigateHelper";
import { LANGUAGES } from "../constants/serverAPIS";
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {Theme} from '../styles';
import ExternalStyles from '../styles/Basic';
var S = require('string'); 
var RNFS = require("react-native-fs");
var { width } = Dimensions.get("window");
let _favItemData = [];

const mapStateToProps = state => {
	return {
		tags: state.tags.data,
		nodeUpdateInfoMap: state.nodeList.nodeUpdateInfoMap,
		languageCode: state.language.language_code
	};
};

class StoryView extends PureComponent {
	
	static navigationOptions = ({ navigation }) => {
		navigate1=(data, navigation, nodeMap) => {
		  if(data !== undefined){
			var nodeUpdateInfoMap = navigation.state.params.nodeUpdateInfoMap;
			var nextNid = data.next_nid;
			var prevNid = data.prev_nid;
			var parentNid = data.parent_nid;
			switch (data.menu_type) {
			  case "mirror_content":
			  case "content":
				navigation.navigate('StoryView', {nid: data.nid, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: nodeMap.get(data.parent_nid).title.toUpperCase(), parentNid: parentNid, nextNid: nextNid, prevNid: prevNid, isParent: true});
				break;
			  case "menu_list":
				navigation.navigate('MenuList', { nodeUpdateInfoMap: nodeUpdateInfoMap, data: data.deeperlink, nodeMap: nodeMap, title: data.title.toUpperCase(), parentNid: data.parent_nid, isParent: true});
				break;
			  case "content-menulist":
				navigation.navigate('MenuListWithContent', {
				  data: data.deeperlink,
				  nid: data.nid,
				  nodeMap: nodeMap,
				  title: nodeMap.get(parentNid).title.toUpperCase(),
				  parentNid: parentNid,
					nextNid: nextNid,
					nodeUpdateInfoMap: nodeUpdateInfoMap,
				  prevNid: prevNid,
				  isParent: true
				});
				break;
			  case "menu_squares":
				navigation.navigate('SquareMenu', { nodeUpdateInfoMap: nodeUpdateInfoMap, data: data.deeperlink, nodeMap: nodeMap, title: data.title.toUpperCase(), parentNid: data.parent_nid, isParent: true});
				break;
			  default:
				break;
			}
		  }else{
			navigation.navigate('Home',{isParent: true});
		  }
		};
		return {
			headerTitle: (
			  <TouchableOpacity onPress={() => this.navigate1(navigation.state.params.nodeMap.get(navigation.state.params.parentNid),navigation, navigation.state.params.nodeMap)}
			  style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				  <Text style={ExternalStyles.textStyle} numberOfLines={1}>{navigation.state.params.title}</Text>
			  </TouchableOpacity>
			),
			headerRight: (
			  <TouchableOpacity onPress={() => this.navigate1(navigation.state.params.nodeMap.get(navigation.state.params.parentNid),navigation, navigation.state.params.nodeMap)}
			   style={{paddingLeft: 25, paddingTop: 14, width: 70, height: 52}}>
			  </TouchableOpacity>
			)
		  };
		};


	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			isfav: false,
			prevMenuType: "",
			nextMenuType: "",
			prevData: null,
			nextData: null,
			normalizedData: null,
			willmount: false,
			breadCrumsElementArray: [],
			trackable: false,
			shareText1: "",
			shareText2: "",
			noContent: "",
			showLoader: true,
			isLoading: true,
			nid: this.props.navigation.state.params.nid,
			data: null,
			showBreadCrumb:true,
			breadCrumsElementArray: []
		};
		this.scroll = null;
		this.someRef = {};
		this.SECTIONS_Tags = [];
		this.SECTIONS = {};
		this.navigateFromBreadCrumb = this.navigateFromBreadCrumb.bind(this);
		this.showLoader = this.showLoader.bind(this);
	}

	getFavItems = () => {
		const { languageCode } = this.props;
		AsyncStorage.getItem("favItems_" + languageCode).then(value => {
			if (value !== null) {
				let _parseItem = JSON.parse(value); 
				_favItemData = _parseItem;
				this.setState({ isfav: _parseItem.findIndex(x => x.nid == this.state.nid) > -1 ? true : false });
			}
		});
	};

	componentWillMount() {
		store.dispatch({type: types.SET_SHARED_CONTENT_NODE, nodeID: null});
	}

	componentDidMount() {
		const { nid, nodeMap, nodeUpdateInfoMap } = this.props.navigation.state.params;
		var updateInfo = nodeUpdateInfoMap.get(nid + "");
		this.nodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo);
		this.getFavItems();
		var languageCode = this.props.languageCode;
		var shareText1 = "";
		var shareText2 = "";
		var noContent = "";
		for (var i = 0; i < LANGUAGES.length; i++) {
			if (languageCode == LANGUAGES[i].code) {
				shareText1 = LANGUAGES[i].shareText1;
				shareText2 = LANGUAGES[i].shareText2;
				noContent = LANGUAGES[i].noContent;
			}
		}
		var trackable = nodeMap.get(nid).trackable;

		var updateInfo = nodeUpdateInfoMap.get(nid + '');
		var nidNodeData = nodeMap.get(nid);
		var nodeMap1 = nodeMap;
		var itemData = nodeMap1.get(nid);
		var menu_type = itemData.menu_type;
	
		var parent_nid = itemData.parent_nid;
	
		if(menu_type !== 'news_feed'){
		  var bred = [];
		var parent_nid_array = [nid, parent_nid];
		do {
		  var parent_data = nodeMap1.get(parent_nid);
		  if (parent_data !== undefined) {
			parent_nid = parent_data.parent_nid;
			if (nodeMap1.get(parent_nid) !== undefined) {
			  parent_nid_array.push(parent_nid);
			}
		  } else {
			parent_nid = undefined;
		  }
		} while (parent_nid !== undefined);
		bred = parent_nid_array;
    this.setState({showBreadCrumb:true, breadCrumsElementArray: bred.reverse()});
    this.setState({
			trackable: trackable !== undefined ? true : false,
			willmount: true,
			shareText1,
			shareText2,
			noContent
		});
		this.timeoutHandle = setTimeout(() => {
			this.flatList.scrollToEnd();
		}, 0);
		} else{
		  this.setState({showBreadCrumb:false});
		}		
	}

	componentWillUnmount = () => {
		if(this.timeoutHandle){
			clearTimeout(this.timeoutHandle);
		}
	}

  onSwipeLeft(gestureState) {
    if (this.state.data !== null) {
      const { nid, nodeMap, nodeUpdateInfoMap } = this.props.navigation.state.params;
      let _data = nodeMap.get(nid);
      var nextNid = _data.next_nid;
      var prevNid = _data.prev_nid;
      var nextMenuData = nodeMap.get(nextNid);
      var parentNid = nextMenuData.parent_nid;
      var parentMenuData = nodeMap.get(parentNid);
      var nextMenuType = nextMenuData.menu_type;
	  var title = parentMenuData.title.toUpperCase();
      if (nextMenuType == "content" || nextMenuType == "mirror_content" || nextMenuType == "news_feed" || nextMenuType == "decision_tree" || nextMenuType == "accord") {
        this.props.navigation.replaceWithAnimation('StoryView', { nid: nextNid, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      } else if (nextMenuType == "menu_list") {
        this.props.navigation.navigate('MenuList', { data: nextMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      }
      else if (nextMenuType == "content-menulist") {
        this.props.navigation.replaceWithAnimation('MenuListWithContent', { data: nextMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nid: nextNid, nodeMap: nodeMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      } else if (nextMenuType == "menu_squares") {
        this.props.navigation.navigate('SquareMenu', { data: nextMenuData.deeperlink, nodeMap: nodeMap, title: title, nodeUpdateInfoMap: nodeUpdateInfoMap, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      } else if (nextMenuType == "jump_page") {
        this.props.navigation.replaceWithAnimation('JumpToPage', { nid: nextNid, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: nextMenuData.parent_nid, nextNid: nextMenuData.next_nid, prevNid: nextMenuData.prev_nid, isPrev: false });
      }
    }
  }
	
  onSwipeRight(gestureState) {
    if (this.state.data !== null) {
      const { nid, nodeMap, nodeUpdateInfoMap } = this.props.navigation.state.params;
      let _data = nodeMap.get(nid);
      var nextNid = _data.next_nid;
      var prevNid = _data.prev_nid;
      var prevtMenuData = nodeMap.get(prevNid);
      var parentNid = prevtMenuData.parent_nid;
      var parentMenuData = nodeMap.get(parentNid);
      var prevMenuType = prevtMenuData.menu_type;
      var title = parentMenuData.title.toUpperCase();
      if (prevMenuType == "content" || prevMenuType == "mirror_content" || prevMenuType == "news_feed" || prevMenuType == "decision_tree" || prevMenuType == "accord") {
        this.props.navigation.replaceWithAnimation('StoryView', { nid: prevNid, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      } else if (prevMenuType == "menu_list") {
        this.props.navigation.navigate('MenuList', { data: prevtMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      }
      else if (prevMenuType == "content-menulist") {
        this.props.navigation.replaceWithAnimation('MenuListWithContent', { data: prevtMenuData.deeperlink, nodeUpdateInfoMap: nodeUpdateInfoMap, nid: prevNid, nodeMap: nodeMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      }
      else if (prevMenuType == "menu_squares") {
        this.props.navigation.navigate('SquareMenu', { data: prevtMenuData.deeperlink, nodeMap: nodeMap, title: title, nodeUpdateInfoMap: nodeUpdateInfoMap, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      } else if (prevMenuType == "jump_page") {
        this.props.navigation.replaceWithAnimation('JumpToPage', { nid: prevNid, nodeUpdateInfoMap: nodeUpdateInfoMap, nodeMap: nodeMap, title: title, parentNid: prevtMenuData.parent_nid, nextNid: prevtMenuData.next_nid, prevNid: prevtMenuData.prev_nid, isPrev: true });
      }
    }
  }

	  

	togglefav = async (selectedData) => {
		this.setState({ isfav: !this.state.isfav });
		try {
			if (this.state.isfav) {
				var index = _favItemData.findIndex(x => x.nid==selectedData.nid);
				if (index > -1) {
					_favItemData.splice(index, 1);
				}
			} else {
				var decodeArticle = S(selectedData.body).stripTags().decodeHTMLEntities().trim().s;
				decodeArticle = decodeArticle.replace(/\+/g, ' ');
				let decodeArticleRemoveSpace = decodeArticle.replace(/\s+/g, ' ');
				_favItemData.unshift({ nid: selectedData.nid, title: selectedData.title, body: decodeArticleRemoveSpace && decodeArticleRemoveSpace.substring(0, 250) });
			}
			await AsyncStorage.setItem("favItems_" + this.props.languageCode, JSON.stringify(_favItemData));
			store.dispatch({ type: types.FETCH_FAVOURITE });
		} catch (error) {
		}
	};

	shareOptions(breadCrumsElementArray) {
		FlurryAnalytics.logEvent("Shared Content", { Name: this.state.data.title });
		let { languageCode } = this.props;
		const { nid, nodeMap, nodeUpdateInfoMap } = this.props.navigation.state.params;

		let { shareText1, shareText2 } = this.state;
		const platform = Platform.OS === "android" ? "android" : "ios";
		const { appStoreURL, playStoreURL, deepLinkURL, emailSubject } = STORE_URL;
		let deepLinkURLWithParams = `${deepLinkURL}?node=${nid}&language=${languageCode}&platform=${platform}`;

		var breadCrumbPath = [];
		breadCrumsElementArray.map(ele => {
			breadCrumbPath.push(nodeMap.get(ele).title);
		});
		var str = breadCrumbPath.toString();
		var breadCrumbPathString = str.replace(new RegExp(",", "g"), " > ");
		var strippedBody = S(this.state.data.body)
			.replace(/<\/[p^]+(>|$)/g, "\n\n")
			.stripTags()
			.decodeHTMLEntities()
			.trim().s;
			let url = `${shareText1}\n\n`+`${deepLinkURLWithParams}\n\n`+`${shareText2}\n\n`+`iOS: ${appStoreURL},\n\n`+`Android: ${playStoreURL}`;
		Share.share({
			title: this.state.data.title,
			message: url,
			subject: emailSubject
		});
	}


	tagsData(itemData, nodeMap) {
		var that = this;
		this.SECTIONS_Tags = [];
		this.SECTIONS = {};
		if (itemData && nodeMap && itemData.field_tagging && this.props.tags) {
			itemData.field_tagging.forEach(item => {
				if (
					that.props.tags !== undefined &&
					that.props.tags.entities.data[item.tid] !== undefined &&
					that.props.tags.entities.data[item.tid].nids &&
					that.props.tags.entities.data[item.tid].nids.length > 1
				) {
					this.SECTIONS_Tags.push({
						name: that.props.tags.entities.data[item.tid]
							? that.props.tags.entities.data[item.tid].name
							: item.name,
						tid: item.tid,
						content: []
					});
				}
			});

			itemData.field_tagging.forEach(element => {
				if (that.props.tags.entities.data[element.tid] !== undefined) {
					var _d = that.props.tags.entities.data[element.tid].nids.map(d => {
						if (itemData.nid !== d) return nodeMap.get(d);
					});
					that.SECTIONS[element.tid] = {
						name: element.name,
						tid: element.tid,
						content: _d
					};
				}
			});
		}
	}

	nodeData(nid, nodeMap, nodeUpdateInfoMap, updateInfo) {
		if (updateInfo === undefined) {
			AsyncStorage.getItem("" + nid)
				.then(localNodeData => {
					if (localNodeData !== null) {
						var parsedLocalNodeData = JSON.parse(localNodeData);

						this.setState({
							data: parsedLocalNodeData
						});
						this.tagsData(parsedLocalNodeData, nodeMap);
					} else {
						this.readNodeData(nid, nodeUpdateInfoMap, nodeMap);
					}
				})
				.catch(error => {
				});
		} else if (updateInfo === false) {
		} else {
			AsyncStorage.getItem("" + nid)
				.then(localNodeData => {
					if (localNodeData !== null) {
						var parsedLocalNodeData = JSON.parse(localNodeData);
						this.setState({
							data: parsedLocalNodeData
						});
						this.tagsData(parsedLocalNodeData, nodeMap);
					} else {
						this.readNodeData(nid, nodeUpdateInfoMap, nodeMap);
					}
				})
				.catch(() => { });
		}
	}

	navigateFromBreadCrumb(
		index,
		nav,
		nodeMap,
		nodeUpdateInfoMap,
		breadCrumsElementArray
	) {
		var selectedNid = breadCrumsElementArray[index];
		var selectedNidData = nodeMap.get(selectedNid);
		navigateHelper(
			selectedNidData,
			nav,
			nodeMap,
			nodeUpdateInfoMap,
			false,
			null
		);
	}

	showLoader = (val) => {
		this.setState({ showLoader: val });
	}
	renderView = () => {
		const { paramNid, titlenode, tags, languageCode } = this.props.navigation.state.params;
		const { nodeMap, nodeUpdateInfoMap, searchText } =this.props.navigation.state.params;

		switch (this.state.data.field_content_type.class) {
			case "decision_tree":
				return (
					<DecisionTree
						sectionsItem={this.SECTIONS}
						sectionTags={this.SECTIONS_Tags}
						tags={tags}
						nav={this.props.navigation}
						nodeMap={nodeMap}
						nodeUpdateInfoMap={nodeUpdateInfoMap}
						languageCode={this.props.languageCode}
						contentHeight={this.state.contentHeight}
						field_decision_trees_json={
							this.state.data.field_decision_trees_json
						}
					/>
				);
				break;
			case "content":
			
			case "content-menulist":
				return (
					<StoryViewBody
						showLoader={this.showLoader}
						sectionsItem={this.SECTIONS}
						sectionTags={this.SECTIONS_Tags}
						paramNid={paramNid}
						bodylength={titlenode}
						data={this.state.data}
						tags={tags}
						nav={this.props.navigation}
						nodeMap={nodeMap}
						nodeUpdateInfoMap={nodeUpdateInfoMap}
						searchText={searchText}
					/>
				);
				break;
			case "accord":
				return (
					<Accordian
						lanCode={languageCode}
						data={this.state.data}
						nav={this.props.navigation}
						nodeMap={nodeMap}
						nodeUpdateInfoMap={nodeUpdateInfoMap}
					/>
				);
				break;
			case "news_feed":
				return <News newsFeedData={this.state.data.field_news_feeds} />;
				break;
				
			default:
				break;
		}
	};

	debounce(callback, wait, context = this) {
		let timeout = null;
		let callbackArgs = null;
		const later = () => callback.apply(context, callbackArgs);
		return function () {
			callbackArgs = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	readNodeData(nid, nodeUpdateInfoMap, nodeMap) {
		var that = this;
		let readNodeData =
			Platform.OS === "ios"
				? RNFS.readFile(
					`${RNFS.MainBundlePath}/data/nodes/node_${nid}.json`,
					"utf8"
				)
				: RNFS.readFileAssets(`data/nodes/node_${nid}.json`, "utf8");

		readNodeData
			.then(result => {
				var parsedLocalNodeData = JSON.parse(result);
				that.setState({
					data: parsedLocalNodeData
				});
				this.tagsData(parsedLocalNodeData, nodeMap);
			})
			.catch(error => {
			});
	}


	navigateFromBreadCrumb(index, nav, nodeMap, nodeUpdateInfoMap, breadCrumsElementArray) {
		var selectedNid = breadCrumsElementArray[index];
		var selectedNidData = nodeMap.get(selectedNid); 
		navigateReplaceWithAnimation(selectedNidData, nav, nodeMap, nodeUpdateInfoMap, false, null);
	}

	renderBreadCrumb = (item, index) => { 
		var nodeMap = this.props.navigation.state.params.nodeMap;
		var nodeUpdateInfoMap = this.props.navigation.state.params.nodeUpdateInfoMap;
		var breadCrumsElementArray = this.state.breadCrumsElementArray;
	
		return <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => {
		  this.navigateFromBreadCrumb(index, this.props.navigation, nodeMap, nodeUpdateInfoMap, breadCrumsElementArray)
		}}>
		  <View style={{
			flex: 1,
			flexDirection: 'row',
			height: 35,
			justifyContent: 'center',
			alignItems: 'center',
			paddingLeft: 5,
			paddingRight: 5
		  }}>
			<Text numberOfLines={1}
			  style={[styles.breadCrumbTags, {maxWidth: width /1.8, fontFamily: (index === breadCrumsElementArray.length-1) ? 'Nunito-Bold' : 'Nunito'}]}>{nodeMap.get(item).title}</Text>
			{index !== breadCrumsElementArray.length - 1 ?
			  <SimpleLineIcons name="arrow-right" size={33} color={Theme.color.white}/> : null}
		  </View>
		</TouchableOpacity>
	  }

	render() {
		const {  menu_type, titlenode, nid, nodeMap} = this.props.navigation.state.params;
		var showBreadCrumb = this.state.showBreadCrumb;
		var breadCrumsElementArray = this.state.breadCrumsElementArray;
		let _data =  nodeMap.get(nid);
		const config = {
		  velocityThreshold: 0.3,
		  directionalOffsetThreshold: 80
		};
		return (
			<GestureRecognizer
			onSwipeLeft={(state) => (_data.next_nid != undefined) ? this.onSwipeLeft(state) : null}
			onSwipeRight={(state) => (_data.prev_nid != undefined) ? this.onSwipeRight(state) : null}
            config={config}
            style={{flex: 1}} 
		  >
		  <View style={{flex: 1, backgroundColor: '#fff'}}>
		  {(showBreadCrumb) ?
          <View style={{ height: 35, paddingLeft: 5, paddingRight: 5, backgroundColor: '#e5e5e5' }}>
		  <ScrollView ref={(scroll) => { this.flatList = scroll; }} style={{ flex: 1 }} horizontal={true} contentContainerStyle={{ alignItems: 'center' }} showsHorizontalScrollIndicator={false}>
			{
			breadCrumsElementArray.map((item, index) => this.renderBreadCrumb(item, index) )
			}
		  </ScrollView>
		  </View> : null}
		  
		  {
		     this.state.data === null ? (
				<ActivityIndicator size="small" color="#ed9100" style={styles.activityIndicator} />
				) : (this.state.data.body == null || this.state.data.body === "") && (_data.menu_type === "content" || _data.menu_type === "mirror_content" || _data.menu_type === "content-menulist") ? (
						<View style={{flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
							<FeedbackMessage 	message={this.state.noContent} iconName={"file"} title={this.state.data.title}/>
						</View>
					) :

			  this.state.data.body != null ? (
				<View style={{ flex: 1 }}>
												<ScrollView
									style={styles.container}
									ref={ref => (this.scrollView = ref)}
									contentContainerStyle={{ flexGrow: 1 }}
									onContentSizeChange={(contentWidth, contentHeight) => {
										if (_data.menu_type == "decision_tree") {
											this.scrollView.scrollToEnd({ animated: true });
										}
									}}
								>
									<View style={{ backgroundColor: "#FFF" }}>
										{_data.menu_type !== "news_feed" ? (
											<View style={styles.viewContainer}>
												<Text style={styles.title}> {this.state.data.title} </Text>
											</View>
										) : null}
										
										{this.state.data.field_hide_share &&
											this.state.data.field_hide_share == 1 ? null :
											(breadCrumsElementArray.indexOf(nid) > -1 ?
												<View style={styles.iconContainer}>
													{this.state.isfav ? (
														<TouchableOpacity
															onPress={() => {
																this.togglefav(this.state.data);
																FlurryAnalytics.logEvent("Favourites", {
																	Name: this.state.data.title
																  });
															}}
														>
															<Icon
																size={25}
																name="heart"
																style={{
																	paddingTop: 8,
																	paddingRight: 15,
																	paddingLeft: 15,
																	paddingBottom: 8,
																	color: "#565656"
																}}
															/>
														</TouchableOpacity>
													) : (
															<TouchableOpacity
																onPress={() => { this.togglefav(this.state.data) }}
															>
																<Icon
																	size={25}
																	style={{
																		paddingTop: 8,
																		paddingRight: 15,
																		paddingLeft: 15,
																		paddingBottom: 8,
																		color: "#bbbbbb"
																	}}
																	name="heart-o"
																/>
															</TouchableOpacity>
														)}



													<TouchableOpacity
														onPress={this.debounce(() => {
															this.shareOptions(breadCrumsElementArray);
														}, 200)}
													>
														<Feather
															name="share"
															size={24}
															style={{
																paddingTop: 8,
																paddingBottom: 8,
																paddingLeft: 15,
																paddingRight: 15,
																color: "#bbbbbb"
															}}
														/>
													</TouchableOpacity>
												</View>
												:
												<View style={{ height: 50 }} />
											)

										}


									</View>
									{this.renderView()}
								</ScrollView>
							</View>
				) : ( <ActivityIndicator size="small" color="#ed9100" style={styles.activityIndicator}/> )	
		  }
		 
		  </View>
		</GestureRecognizer>

			
			
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF"
	},
	activityIndicator: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		height: 80
	},
	iconContainer: {
		flex: 1,
		flexDirection: "row",
		marginTop: 10,
		justifyContent: "center"
	},
	viewContainer: {
		paddingLeft: 15,
		paddingRight: 15
	},
	title: {
		fontSize: 19,
		color: "#ed9100",
		textAlign: "center",
		paddingTop: 15,
		fontFamily: "Nunito-Bold"
	},
	titleNoContent: {
		fontSize: 19,
		color: "#b4ca6b",
		textAlign: "auto",
		paddingTop: 15,
		paddingLeft: 10,
		paddingRight: 10,
		fontFamily: "Nunito"
	},
	nocontent: {
		marginTop: 10,
		color: "#888",
		fontSize: 22,
		textAlign: "center",
		alignSelf: "center",
		justifyContent: "center",
		flexDirection: "row",
		fontFamily: "Nunito"
	},
	breadCrumbTags: {
    color: '#595959',
    fontSize: 16
  }
});

export default connect(mapStateToProps)(StoryView);