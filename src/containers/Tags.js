/**
 * Tags:  Lists the items based on selected tags from the Homescreen Tags.
 */

import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, ActivityIndicator, Platform } from 'react-native';
import { connect } from 'react-redux';
import TagItem from '../component/TagItem'
import { Theme } from '../styles';
import ExternalStyles from '../styles/Basic';


var RNFS = require('react-native-fs');

const mapStateToProps = state => {
  return {
    tags: state.tags.data,
    nodeMap: state.nodeList.nodeMap,
    nodeUpdateInfoMap: state.nodeList.nodeUpdateInfoMap
  }
};

class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagData: [],
      tagDatabundle: []
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <View
          style={ExternalStyles.headerTitleStyle}>
          <Text style={ExternalStyles.textStyle}
            numberOfLines={1}>{navigation.state.params.data.name.toUpperCase()}</Text>
        </View>
      ),
      headerRight: (
        <View style={ExternalStyles.headerRight} />
      )
    };
  };

  componentWillMount = () => {
    this.fetchData(this.props.navigation.state.params.nids, this.props.nodeUpdateInfoMap);
  };

  fetchData = (arrayOfnids, nodeUpdateInfoMap) => {
    this.setState({ tagDatabundle: arrayOfnids });
    if (arrayOfnids && arrayOfnids.length) {
      let _items = [], that = this;
      arrayOfnids.map((nid, i) => {
        AsyncStorage.getItem(nid)
          .then((value) => {
            if (value !== null) {
              var parsedLocalNodeData = JSON.parse(value);
              _items.push(parsedLocalNodeData);
              this.setState({
                tagData: _items
              })
            } else {
              let readFileNode = (Platform.OS === 'ios') ?
                RNFS.readFile(`${RNFS.MainBundlePath}/data/nodes/node_${nid}.json`, 'utf8') :
                RNFS.readFileAssets(`data/nodes/node_${nid}.json`, 'utf8');

              readFileNode.then((result) => {
                var parsedLocalNodeData = JSON.parse(result);
                _items.push(parsedLocalNodeData);
                this.setState({
                  tagData: _items
                })
              }).catch((error) => {
              })
            }
          })
          .catch(() => {
          })
      })

    }
  }



  componentWillReceiveProps = (nextProps) => {
    this.fetchData(nextProps.navigation.state.params.nids);
  }

  render() {
    const { navigation, nodeMap, nodeUpdateInfoMap } = this.props;
    const { tagData } = this.state;
    return (
      <View style={styles.container}>
        {
          this.state.tagData && this.state.tagDatabundle && this.state.tagData.length == this.state.tagDatabundle.length ?
            <TagItem navigation={this.props.navigation}
              tagData={this.state.tagData}
              nodeMap={this.props.nodeMap}
              nodeUpdateInfoMap={this.props.nodeUpdateInfoMap} /> :
            <ActivityIndicator
              animating={true}
              color='#4c4c4c'
              size="small"
              style={styles.activityIndicator} />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  }
});

export default connect(mapStateToProps)(Tags)