/**
 * News:  A Webview which displays the news webpage.
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, WebView } from 'react-native';
import { connect } from 'react-redux';
import FeedbackMessage from '../component/FeedbackMessage';
import { LANGUAGES } from '../constants/serverAPIS';

const mapStateToProps = state => {
  return {
    isConnected: state.netInfo.isConnected,
    languageCode: state.language.language_code
  }
};
class News extends Component {

  constructor(props) {
    super(props);
    this.state = {
      noInternet: "",
      errorMsg: "",
      showErrorMsg: false,
      reqFailureMsg: "",
      internetLost: ""
    }
    this.onErrorHandling = this.onErrorHandling.bind(this);
  }

  componentWillMount() {
    let languageCode = this.props.languageCode;
    let _lanCode = LANGUAGES && LANGUAGES.map((item) => { return item.code; });
    let _index = _lanCode.indexOf(languageCode);
    if (_index > -1) { this.setState({ noInternet: LANGUAGES[_index].noInternet }); }
  }

  onErrorHandling(event) {
    let languageCode = this.props.languageCode;
    let _lanCode = LANGUAGES && LANGUAGES.map((item) => { return item.code; });
    let _index = _lanCode.indexOf(languageCode);
    if (_index > -1) {
      this.setState({
        reqFailureMsg: LANGUAGES[_index].requestFailure,
        internetLost: LANGUAGES[_index].internetLost,
        showErrorMsg: true,
      });
    }
  }

  render() {
    const { showErrorMsg, reqFailureMsg, internetLost } = this.state;
    const { newsFeedData } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {(this.props.isConnected) ?
          <View style={{ flex: 1, }}>
            {!showErrorMsg ?
              <WebView
                source={{ uri: newsFeedData }}
                scalesPageToFit={true}
                startInLoadingState={true}
                onError={(event) => this.onErrorHandling(event)}
              /> : <View style={styles.errorContainer}>
                <Text style={styles.errorHandle}>{reqFailureMsg}</Text>
                <Text style={styles.tryAgainMsg}>{"(" + internetLost + ")"}</Text>
              </View>}
          </View> :
          <FeedbackMessage message={this.state.noInternet} />}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorHandle: {
    fontSize: 22,
    fontFamily: 'Nunito',
    textAlign: 'center',
    color: '#888'
  },
  tryAgainMsg: {
    fontSize: 20,
    fontFamily: 'Nunito-Italic',
    textAlign: 'center',
    color: '#888'
  }
})
export default connect(mapStateToProps)(News);