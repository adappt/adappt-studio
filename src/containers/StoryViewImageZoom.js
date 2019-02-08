/**
 * StoryViewImageZoom:  An Image component with pinch-to-zoom feature.
 */

import React, { Component } from 'react';
import { View } from 'react-native';
import PhotoView from 'react-native-photo-view';

class StoryViewImageZoom extends Component {
  render() {
    let imgData = this.props.navigation.state.params.data;
    return (
      <View style={{ backgroundColor: '#000', flex: 1, justifyContent: 'center' }}>
        <PhotoView source={{ uri: imgData }} minimumZoomScale={1} maximumZoomScale={4} style={{ flex: 1 }} />
      </View>
    )
  }
}

export default StoryViewImageZoom;