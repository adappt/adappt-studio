import { StyleSheet, Dimensions, Platform } from 'react-native';
import Theme from './Theme';
let winSize = Dimensions.get('window');

const Basic = StyleSheet.create({
  text: {
    fontSize: 32/winSize.scale
  },
  headerTitleStyle:{
    flex:1,
    margin:0,
    marginHorizontal: 3,
    alignItems:'center',
    justifyContent:"center"
  },
  headerRight:{
    paddingLeft: 18, 
    paddingTop: 14, 
    height: 54, 
    width: 70, 
    top: Platform.OS == 'ios' ? -5 : 3
  },
  textStyle:{
    color: '#555555', 
    fontSize: 20, 
    fontFamily: 'Nunito-Bold',
  }
});
export default Basic;

