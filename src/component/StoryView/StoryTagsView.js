import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { navigateReplaceWithAnimation } from '../../utils/navigateHelper';
import * as types from '../../constants/actionTypes';
import { LANGUAGES } from '../../constants/serverAPIS'

const StoryTagsView = ({ SECTIONS_Tags, sectionsData, nav, nodeMap, nodeUpdateInfoMap, languageCode }) => {
  const { TagHeadView, TagHeadTextView, TagHeadText, TagHeadIconView, IconTagHeader, TagContentView, ContentRowView, TagContentIcon, ContentText } = styles;
  _renderTagHeader = (section, index, isActive, sections) => {
    return (
      <View key={index}>
        {section &&
          <View style={{ marginBottom: isActive ? 0 : 5 }}>
            <View style={[{ backgroundColor: isActive ? '#444' : '#F2F2F2' }, TagHeadView]}>
              <View style={TagHeadTextView}>
                <Text style={[{ color: isActive ? 'white' : '#5a5959' }, TagHeadText]}>{section.name}</Text>
              </View>
              <View style={TagHeadIconView}>
                {isActive && <Icon style={IconTagHeader} color="white" size={18} name="angle-up" />}
                {!isActive && <Icon style={IconTagHeader} color="#5a5959" size={18} name="angle-down" />}
              </View>
            </View>
          </View>
        }
      </View>
    );
  };

  _renderTagContent = (contentData, index, isActive, section) => {
    if (isActive && contentData && contentData.tid) {
      return (
        <View key={index} style={TagContentView}>
          {sectionsData && sectionsData[contentData.tid] && sectionsData[contentData.tid].content && sectionsData[contentData.tid].content.map((data, i) => {
            return (
              <View key={i}>
                {
                  data &&
                  <TouchableOpacity onPress={() => navigateReplaceWithAnimation(data, nav, nodeMap, nodeUpdateInfoMap, false, null)}>
                    <View style={ContentRowView}>
                      <Ionicons style={TagContentIcon} color="#333" size={18} name="ios-arrow-dropright" />
                      <Text style={ContentText}>
                        {data.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                }
              </View>
            )
          })}
        </View>
      )
    }
  };

  return (
    <View>
      {
        SECTIONS_Tags && SECTIONS_Tags.length !== 0 && LANGUAGES.map((language, index) => {
          if (languageCode == language.code) {
            return <Text key={index} style={styles.TagHeader}>{language.related}</Text>
          }
        })
      }
      <Accordion
        sections={SECTIONS_Tags && SECTIONS_Tags}
        renderHeader={this._renderTagHeader}
        renderContent={this._renderTagContent}
        underlayColor="transparent"
      />
    </View>
  )
};
const styles = StyleSheet.create({
  TagHeader: {
    fontSize: 17,
    padding: 10,
    fontFamily: 'Nunito-Bold',
    color: '#ed9100',
    paddingLeft: 0
  },
  TagHeadView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  TagHeadTextView: {
    flex: 0.9
  },
  TagHeadText: {
    fontSize: 16,
    padding: 10,
    fontFamily: 'Nunito-SemiBold',
    fontWeight: 'bold'
  },
  TagHeadIconView: {
    flex: 0.1
  },
  IconTagHeader: {
    paddingLeft: 10
  },
  TagContentView: {
    paddingLeft: 5,
    paddingBottom: 5,
    paddingRight: 30,
    marginBottom: 5,
    paddingTop: 8,
    backgroundColor: '#F6F6F6'
  },
  ContentRowView: {
    margin: 5,
    flexDirection: 'row'
  },
  TagContentIcon: {
    padding: 5,
    paddingRight: 10,
    paddingTop: 0
  },
  ContentText: {
    color: '#595959',
    fontSize: 16,
    fontFamily: 'Nunito'
  }
})
export default StoryTagsView