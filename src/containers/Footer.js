/**
 * Footer: sticky Footer provides quick access to Main  menu, Home screen, Favourites and Search.
 */

import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Keyboard } from 'react-native';
import NavigationService from '../navigators/NavigationService';
import { connect } from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { LANGUAGES } from '../constants/serverAPIS';
import { Theme } from '../styles';

const mapStateToProps = state => {
  return {
    screenName: state.screen,
    languageCode: state.language.language_code,
    serverMessage: state.serverMessage,
  }
};

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      searchHere: "",
      noContent: "",
      favorites: "",
      noFavorite: "",
      noResultSearch: ""
    }
  }

  componentWillMount() {
    let languageCode = this.props.languageCode;
    for (let i = 0; i < LANGUAGES.length; i++) {
      if (languageCode === LANGUAGES[i].code) {
        this.setState({
          search: LANGUAGES[i].search,
          searchHere: LANGUAGES[i].searchHere,
          noContent: LANGUAGES[i].noContent,
          favorites: LANGUAGES[i].favorites,
          noFavorite: LANGUAGES[i].noFavorite,
          noResultSearch: LANGUAGES[i].noResultSearch,
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let languageCode = nextProps.languageCode;
    for (let i = 0; i < LANGUAGES.length; i++) {
      if (languageCode === LANGUAGES[i].code) {
        this.setState({
          search: LANGUAGES[i].search,
          searchHere: LANGUAGES[i].searchHere,
          noContent: LANGUAGES[i].noContent,
          favorites: LANGUAGES[i].favorites,
          noFavorite: LANGUAGES[i].noFavorite,
          noResultSearch: LANGUAGES[i].noResultSearch,
        })
      }
    }
  }

  render() {
    const { showMessage, serverMessage, issue } = this.props.serverMessage;
    return (
      <View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => {
            NavigationService.navigate('DrawerToggle');
            Keyboard.dismiss();
          }}>
            <SimpleLineIcons name="menu" size={24} style={styles.iconImg} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => NavigationService.reset('Home', '', 'home')}>
            <SimpleLineIcons name="home" size={24} style={styles.iconImg} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              NavigationService.navigate('Search', {
                search: this.state.search,
                searchHere: this.state.searchHere,
                noContent: this.state.noContent,
                noResultSearch: this.state.noResultSearch
              }, 'search')
            }}>
            <SimpleLineIcons name="magnifier" size={24} style={styles.iconImg} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              NavigationService.reset('Favourite', {
                noFavorite: this.state.noFavorite,
                favorites: this.state.favorites
              }, 'favourite')
            }}>
            <SimpleLineIcons name="heart" size={24} style={styles.iconImg} />
          </TouchableOpacity>

        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  iconImg: {
    color: Theme.color.white,
    paddingHorizontal: 30,
    paddingVertical: 7
  },
  iconContainer: {
    backgroundColor: Theme.color.darkgray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    borderTopWidth: 1,
    borderTopColor: Theme.color.darkgray
  }
});

export default connect(mapStateToProps)(Footer)