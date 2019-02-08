import React, {Component} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {navigateHelper} from '../utils/navigateHelper';
var S = require('string');

class TagItem extends Component {
  renderTag = (data) => {
    const { navigation, nodeMap, nodeUpdateInfoMap} = this.props;
    var decodeArticle = S(data.body).stripTags().decodeHTMLEntities().trim().s;
    var nodeData = nodeMap.get(data.nid);
    decodeArticle = decodeArticle.replace(/\+/g, ' ');
    let decodeArticleRemoveSpace = decodeArticle.replace(/\s+/g, ' ');
    return (
      <TouchableOpacity onPress={() => navigateHelper(nodeData, navigation, nodeMap, nodeUpdateInfoMap, false, null)}>
        <View style={styles.container}>
          <Text style={styles.favTitle}>{data.title}</Text>
          {decodeArticleRemoveSpace !== '' ?
            <Text style={styles.favContent}>
              {decodeArticleRemoveSpace.length > 250 ? decodeArticleRemoveSpace.substring(0, 250) + '...' : decodeArticleRemoveSpace}
            </Text> : null
          }
        </View>
      </TouchableOpacity>
    )
  };

  render() {
    const { tagData } = this.props;
    return (
      <FlatList
        initialNumToRender={12}
        data={tagData}
        extraData={this.props}
        renderItem={({item}) => this.renderTag(item)}
        keyExtractor={item => item.nid}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  favTitle: {
    fontSize: 16,
    color: '#005744',
    fontFamily: 'Nunito-Bold'
  },
  favContent: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'Nunito',
    lineHeight: 20,
    color: '#5a5959',
    flexWrap: 'nowrap'
  }
});
export default TagItem