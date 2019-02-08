import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FeedbackMessage = ({ message, iconName = null, title = null }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <View style={styles.body}>
        <Icon size={50} style={{color:'#ddd'}} name={iconName}  />
        <Text style={styles.message}>{message}</Text>
      </View>  
    </View>     
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 15
  },
  body: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    borderRadius: 20,
    width: 40,
    height: 40
  },
  message: {
    color: '#666',
    fontSize: 22,
    marginTop:10,
    fontFamily: 'Nunito-SemiBold'
  },
  header: {
    flex: 0.1,
    marginTop: 20,
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 22,
    color: '#555555',
    textAlign: 'center',
    fontFamily: 'Nunito-Bold'
  }
});
export default FeedbackMessage;