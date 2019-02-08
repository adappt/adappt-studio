/**
 * DecisionTree: An Interactive tool.
*/

import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import FlurryAnalytics from 'react-native-flurry-analytics';
import StoryTagsView from '../component/StoryView/StoryTagsView'
class DecisionTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: [0],
      history: [],
      data: null,
    }
  }

  componentWillMount() {
    const field_decision_trees_json = this.props.field_decision_trees_json;
    const parsedData = JSON.parse(field_decision_trees_json);
    this.data = new Map(parsedData);
  }

  componentDidMount() {
    if (this.props.trackable) {
      FlurryAnalytics.logEvent('Node Type: Decision Tree', { 'Title': this.props.data.title });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      output: [0],
      history: [],
      data: null
    });
  }

  _onPress(nextStep, length, position, whichArray) {
    let newOutput = this.state.output;
    let newHistory = this.state.history;
    newHistory.splice(position, newHistory.length);
    newHistory[position] = whichArray;
    let _posIdx = newOutput.indexOf(position);
    let _nextIdx = newOutput.indexOf(nextStep);
    if (_nextIdx > -1 && _posIdx > -1) {
      newOutput.splice(_posIdx + 1, newOutput.length);
      newOutput.push(nextStep);
    } else if (_nextIdx > -1) {
      newOutput.splice(_nextIdx, newOutput.length);
    } else {
      if (length > 1 && (_posIdx > -1)) {
        newOutput.splice(_posIdx + 1, newOutput.length)
      }
      newOutput.push(nextStep);
    }
    this.setState({
      output: newOutput,
      history: newHistory
    });
  }

  renderItem(item, length, position, isLast, whichArray, shouldHighlight) {
    if (item.onClick) {
      return ({
        jsx: (<TouchableOpacity key={whichArray}
          style={[styles.itemClickable, (!isLast) ? styles.itemClickableBorder : null, (shouldHighlight) ? { backgroundColor: '#0f5745' } : null]}
          onPress={() => this._onPress(item.onClick, length, position, whichArray, shouldHighlight)}><Text
          style={[styles.itemClickableText, (shouldHighlight) ? { color: '#fff' } : null]}>{item.title}</Text></TouchableOpacity>),
        isLabel: false
      })
    }
    return ({
      jsx: (<View key={whichArray} style={styles.item}><Text style={styles.itemText}>{item.title}</Text></View>),
      isLabel: true
    })
  }

  renderRow() {
    let output = this.state.output.map((position, i) => {
      let label = this.data.get(position).map((item, i, arr) => {
        if (i === 0 && item.label !== "") {
          return (<View style={styles.label} key={i}><Text>{item.label}</Text></View>)
        } else {
          return null
        }
      });
      let innerOutput = this.data.get(position).map((item, i, arr) => {
        let shouldHighlight = i === this.state.history[position];
        let whichArray = i;
        const isLast = arr.length - 1 === i;
        if (i !== 0) {
          return (this.renderItem(item, arr.length, position, isLast, whichArray, shouldHighlight))
        }
        return <View />
      });
      let isLabel = false;
      let finalInnerOutput = innerOutput.map((item) => {
        isLabel = item.isLabel;
        return item.jsx
      });

      return (<View key={i}><View style={[styles.row, (isLabel) ? styles.reportRow : null]}>
        {label}
        <View style={[styles.options, (!isLabel) ? styles.optionsBorder : null]}>
          {finalInnerOutput}
        </View>
      </View>
        {(!isLabel) ?
          Platform.OS === 'android' ?
            <View style={styles.arrowContainer}>
              <Image
                source={require('./Logo/arrow2.png')}
                style={{ width: 40, height: 40 }}
              />
            </View> : <View style={styles.arrowContainer}>
              <View style={styles.triangle} />
              <View style={styles.square} />
            </View>
          :
          null
        }
      </View>)
    });
    return output
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderRow()}
        <StoryTagsView SECTIONS_Tags={this.props.sectionTags} sectionsData={this.props.sectionsItem} nav={this.props.nav} nodeMap={this.props.nodeMap} nodeUpdateInfoMap={this.props.nodeUpdateInfoMap} languageCode={this.props.languageCode} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 25,
  },
  row: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowOffset: { width: 0, height: 0, },
    shadowColor: '#717171',
    shadowOpacity: 0.5,
    borderRadius: 5,
    borderColor: Platform.OS === 'android' ? '#ccc' : '#eee',
    borderWidth: 1,
  },
  reportRow: {
    borderColor: '#0f5745',
    backgroundColor: '#d2e1c4',
    shadowOpacity: 0
  },
  label: {
    marginBottom: 10
  },
  options: {
    flexDirection: 'row',
  },
  optionsBorder: {
    borderColor: '#0f5745',
    borderWidth: 1,
    borderRadius: 5,
  },
  itemClickable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    backgroundColor: 'transparent',
  },
  itemClickableText: {
    fontFamily: 'Nunito',
    fontSize: 18
  },
  itemClickableBorder: {
    borderColor: '#0f5745',
    borderRightWidth: 1,
  },
  itemText: {
    textAlign: 'center'
  },
  active: {
    backgroundColor: '#0f5745',
  },
  activeText: {
    color: '#fff'
  },
  arrowContainer: {
    height: 30,
    flex: 1,
    alignItems: 'center',
    zIndex: 10,
    position: 'relative',
    top: -1
  },
  triangle: {
    borderTopWidth: 15,
    borderRightWidth: 30 / 2.0,
    borderBottomWidth: 0,
    borderLeftWidth: 30 / 2.0,
    borderTopColor: '#fff',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 2, },
    borderStyle: 'solid',
    shadowColor: '#818181',
    shadowOpacity: 0.5,
  },
  square: {
    width: 30,
    height: 5,
    position: 'absolute',
    top: -5,
    backgroundColor: '#fff'
  },
});

export default DecisionTree