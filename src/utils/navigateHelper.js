import FlurryAnalytics from 'react-native-flurry-analytics';
import * as types from '../constants/actionTypes';
import store from '../redux/store';


export async function navigateHelper(data = '', navigation, nodeMap, nodeUpdateInfoMap, isFlurryAnalytic = false, searchText = null) {
    if (!data) {
        store.dispatch({ type: types.EMPTY_BREADCRUMB });
        navigation.navigate({ routeName: 'Home', params: { isParent: true }, key: 'Home' });
    }
    if (isFlurryAnalytic) FlurryAnalytics.logEvent('Inner Menu', { 'Name': data.title });
    var nextNid = (data && data.next_nid) ? data.next_nid : '';
    var prevNid = (data && data.prev_nid) ? data.prev_nid : '';
    var parentNid = (data && data.parent_nid) ? data.parent_nid : '';
    var nodeMapData = nodeMap.get(parentNid);
    var nodeId = (data && data.nid) ? data.nid : '';
    var deeperLink = (data && data.deeperlink) ? data.deeperlink : [];
    switch (data.menu_type) {
        case "mirror_content":
        case "content":
        case "decision_tree":
        case "news_feed":
        case "accord":
            if (data.menu_type == 'mirror_content') {
                var original_content = data.original_content;
                store.dispatch({ type: types.GENERATE_MIRROR_CONTENT_BREADCRUMB, nodeMap: nodeMap, original_content: original_content });
            } else {
                store.dispatch({ type: types.GENERATE_BREADCRUMB, nid: nodeId, nodeMap: nodeMap });
            }
            navigation.navigate({
                routeName: 'StoryView',
                params: {
                    nid: nodeId,
                    nodeMap: nodeMap,
                    title: (nodeMapData && nodeMapData.title) ? nodeMapData.title.toUpperCase() : '',
                    parentNid: parentNid,
                    nextNid: nextNid,
                    prevNid: prevNid,
                    nodeUpdateInfoMap: nodeUpdateInfoMap,
                    searchText: searchText
                },
                key: nodeId
            });
            break;
        case "menu_list":
            navigation.navigate({
                routeName: 'MenuList',
                params: {
                    data: deeperLink,
                    nodeMap: nodeMap,
                    title: (data && data.title) ? data.title.toUpperCase() : '',
                    parentNid: parentNid,
                    nodeUpdateInfoMap: nodeUpdateInfoMap
                },
                key: nodeId
            });
            break;
        case "content-menulist":
            store.dispatch({ type: types.GENERATE_BREADCRUMB, nid: nodeId, nodeMap: nodeMap });
            navigation.navigate({
                routeName: 'MenuListWithContent',
                params: {
                    data: deeperLink,
                    nid: nodeId,
                    nodeMap: nodeMap,
                    title: (nodeMapData && nodeMapData.title) ? nodeMapData.title.toUpperCase() : '',
                    parentNid: parentNid,
                    nextNid: nextNid,
                    prevNid: prevNid,
                    nodeUpdateInfoMap: nodeUpdateInfoMap,
                    searchText: searchText
                },
                key: nodeId
            });
            break;
        case "menu_squares":
            navigation.navigate({
                routeName: 'SquareMenu',
                params: {
                    data: deeperLink,
                    nodeMap: nodeMap,
                    title: (data && data.title) ? data.title.toUpperCase() : '',
                    parentNid: (data.parent_nid) ? data.parent_nid : '',
                    nodeUpdateInfoMap: nodeUpdateInfoMap
                },
                key: nodeId
            });
            break;     
        case "jump_page":
            navigation.navigate({
                routeName: 'JumpToPage',
                params: {
                    data: deeperLink,
                    nid: nodeId,
                    nodeMap: nodeMap,
                    title: (nodeMapData && nodeMapData.title) ? nodeMapData.title.toUpperCase() : '',
                    parentNid: parentNid,
                    nextNid: nextNid,
                    prevNid: prevNid,
                    nodeUpdateInfoMap: nodeUpdateInfoMap,
                    searchText: searchText
                },
                key: nodeId
            })
            break;
        default:
            store.dispatch({ type: types.EMPTY_BREADCRUMB });
            navigation.navigate({ routeName: 'Home', params: { isParent: true }, key: 'Home' });
            break;
    }
}

export async function navigateReplaceWithAnimation(data = '', navigation, nodeMap, nodeUpdateInfoMap, isFlurryAnalytic = false, searchText = null) {
    if (!data) {
        store.dispatch({ type: types.EMPTY_BREADCRUMB });
        navigation.navigate({ routeName: 'Home', params: { isParent: true }, key: 'Home' });
    }
    if (isFlurryAnalytic) FlurryAnalytics.logEvent('Inner Menu', { 'Name': data.title });
    var nextNid = (data && data.next_nid) ? data.next_nid : '';
    var prevNid = (data && data.prev_nid) ? data.prev_nid : '';
    var parentNid = (data && data.parent_nid) ? data.parent_nid : '';
    var nodeMapData = nodeMap.get(parentNid);
    var nodeId = (data && data.nid) ? data.nid : '';
    var deeperLink = (data && data.deeperlink) ? data.deeperlink : [];
    var activeKey = data.nid
    switch (data.menu_type) {
        case "mirror_content":
        case "content":
        case "decision_tree":
        case "news_feed":
        case "accord":
            if (data.menu_type == 'mirror_content') {
                var original_content = data.original_content;
                store.dispatch({ type: types.GENERATE_MIRROR_CONTENT_BREADCRUMB, nodeMap: nodeMap, original_content: original_content });
            } else {
                store.dispatch({ type: types.GENERATE_BREADCRUMB, nid: nodeId, nodeMap: nodeMap });
            }
            navigation.replaceWithAnimation( 'StoryView',
                {
                    nid: nodeId,
                    nodeMap: nodeMap,
                    title: (nodeMapData && nodeMapData.title) ? nodeMapData.title.toUpperCase() : '',
                    parentNid: parentNid,
                    nextNid: nextNid,
                    prevNid: prevNid,
                    nodeUpdateInfoMap: nodeUpdateInfoMap,
                    searchText: searchText
                }
            );
            break;
        case "menu_list":
            navigation.replaceWithAnimation( 'MenuList',
                {
                    data: deeperLink,
                    nodeMap: nodeMap,
                    title: (data && data.title) ? data.title.toUpperCase() : '',
                    parentNid: parentNid,
                    nodeUpdateInfoMap: nodeUpdateInfoMap
                });
            break;
        case "content-menulist":
            store.dispatch({ type: types.GENERATE_BREADCRUMB, nid: nodeId, nodeMap: nodeMap });
            navigation.replaceWithAnimation( 'MenuListWithContent',
                {
                    data: deeperLink,
                    nid: nodeId,
                    nodeMap: nodeMap,
                    title: (nodeMapData && nodeMapData.title) ? nodeMapData.title.toUpperCase() : '',
                    parentNid: parentNid,
                    nextNid: nextNid,
                    prevNid: prevNid,
                    nodeUpdateInfoMap: nodeUpdateInfoMap,
                    searchText: searchText
                });
            break;

        case "menu_squares":
            navigation.replaceWithAnimation( 'SquareMenu',
                {
                    data: deeperLink,
                    nodeMap: nodeMap,
                    title: (data && data.title) ? data.title.toUpperCase() : '',
                    parentNid: (data.parent_nid) ? data.parent_nid : '',
                    nodeUpdateInfoMap: nodeUpdateInfoMap,
                    activeKey: activeKey
                });
            break;          
        default:
            store.dispatch({ type: types.EMPTY_BREADCRUMB });
            navigation.navigate({ routeName: 'Home', params: { isParent: true }, key: 'Home' });
            break;
    }
}