import { Dimensions } from 'react-native';
const { width, height} = Dimensions.get('window');

const CUSTOM_CLASSES = {
  'vimeoIframe': {
    left: 0, 
    width: width-30,
    height:  width > 500 ? 450 : 280
  },
  'table': {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  'table-row': {
    flex: 1,
    flexDirection: 'row'
  },
  'table-header': {
    fontWeight: 'bold',
    width: '30%',
    marginRight: 15
  },
  'table-body': {
    width: '67%'
  },
  'grayshade-title': {
    backgroundColor: '#01614c',
    position: 'absolute',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    right: 25,
    top: -3,
    height: 25
  },
  'grayshad-sub': {
    fontSize: 12,
    top: -8,
    height: 20
  },
  'grayshade': {
    backgroundColor: '#d2d1d1',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginTop: 15,
    marginBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 25
  },
  'blueshade': {
    backgroundColor: '#edf6fc',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginTop: 15,
    marginBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 25
  },
  'greenshade': {
    backgroundColor: '#ebf1e5',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginTop: 15,
    marginBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 25
  },
  'lightgray': {
    backgroundColor: '#f2f3f8',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginTop: 15,
    marginBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 25
  },
  'violetshade': {
    backgroundColor: '#e9e0f4',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginTop: 15,
    marginBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 25
  },
  'purpleshade': {
    backgroundColor: '#e9e0f4',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginTop: 15,
    marginBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 25
  },
  'abbreviations': {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flex: 1,
    flexDirection: 'row'
  },
  'shorttxt': {
    width: 70,
  },
  'abbrtext': {
    width: width - 98
  },
  'box': {
    borderWidth: 1,
    borderTopWidth: 3,
    borderColor: '#b9b9b9',
    borderTopColor: '#a9a9a9',
    padding: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf:'flex-start',
    color: '#595959',
    backgroundColor:'#fbfbfb'
  },
  'footer': {
    fontSize: 11,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 6,
    lineHeight: 16,
    color: '#595959',
  },
  'resource-block': {
    flex: 1,
    flexDirection: width > 700 ? 'row' : 'column'
  },
  'resource-text': {
    flex: 1,
    flexDirection: 'column'
  }
};
const CUSTOM_TAGSSTYLE = {
  p: {
    fontFamily: 'Nunito',
    fontSize: 17,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 10,
    padding: 0,
    color: '#595959'
  },
  span: {
    fontFamily: 'Nunito',
    fontSize: 17,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 10,
    padding: 0,
    color: '#595959'
  },
  div: {
    fontFamily: 'Nunito',
    fontSize: 17,
    lineHeight: 22,
    padding: 0,
  },
  li: {
    fontFamily: 'Nunito',
    fontSize: 17,
    lineHeight: 22,
    marginTop: 0,
    color: '#595959',
    marginBottom: 0,
    paddingBottom: 0
  },
  ul: {
    left: -10,
    marginBottom: 0,
    marginTop: 10
  },
  strong: {
    fontFamily: 'Nunito-Bold',
    fontSize: 17,
    flexDirection: 'row',
  },
  em: {
    fontFamily: 'Nunito-Italic',
    fontSize: 16,
  },
  a: {
    color: '#03adea',
    textDecorationLine: 'none',
    marginTop: 10,
    marginBottom: 10,
    padding: 0,
    fontFamily: 'Nunito',
    fontSize: 17
  },
  u: {
    fontFamily: 'Nunito',
    fontSize: 17,
    textDecorationLine: 'underline'
  }
};

export const RenderHtmlStyles = {
  CUSTOM_CLASSES,
  CUSTOM_TAGSSTYLE
};