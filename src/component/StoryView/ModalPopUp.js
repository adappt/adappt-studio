import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, Modal, TouchableHighlight } from 'react-native';
import HTML from 'react-native-render-html';
import Ionicon from 'react-native-vector-icons/Ionicons';
const { width } = Dimensions.get('window');

const ModalPopUp = ({ modalVisible, data, referenceId, setModalVisible, DEFAULT_PROPS }) => {
  const {container, childContainer, subChildContainer, modalViewStyle, modalCloseIconStyle} = styles
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={container}>
        <View style={childContainer}>
          <View style={subChildContainer}>
            <ScrollView>
              <View>
                {
                  data.nodeData != '' && !data.field_references ? null :
                    data.field_references.map((value, index) => {
                      if (value.field_id == referenceId) {
                        return <HTML
                          {...DEFAULT_PROPS}
                          html={value.field_reference_text}
                          key={index}
                          imagesMaxWidth={Dimensions.get('window').width - 200}
                        />
                      }
                    })
                }
              </View>
            </ScrollView>
          </View>
          <View style={modalViewStyle}>
            <TouchableHighlight
              underlayColor="transparent"
              activeOpacity={5}
              onPress={() => {setModalVisible(!modalVisible);}}>
              <View style={modalCloseIconStyle}>
                <Ionicon size={40} style={{ color: 'white', alignSelf: 'center', marginTop: -2 }} name="ios-close" />
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  )
};
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)',   
    justifyContent: 'center'
  },
  childContainer: {
    justifyContent: 'flex-end', 
    paddingBottom: 2
  },
  subChildContainer: {
    margin: 20, 
    backgroundColor: 'white', 
    borderRadius: 10, 
    paddingLeft: 20, 
    paddingRight: 20, 
    paddingBottom: 25, 
    paddingTop: 14, 
    width: width - 40, 
    maxHeight: 300
  },
  modalViewStyle: {
    alignSelf: 'center', 
    position: 'absolute' 
  },
  modalCloseIconStyle: {
    borderWidth: 5, 
    borderColor: 'white', 
    alignSelf: 'center', 
    height: 45,
    width: 45, 
    borderRadius: 30, 
    backgroundColor: '#215442'
  }
});
export default ModalPopUp