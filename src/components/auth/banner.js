
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ImageBackground, Image, TextInput, Dimensions, TouchableOpacity} from 'react-native';

import bannerImage from '../../../assets/green_tree_2.1.jpg';

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

// style={styles.bgImage}  resizeMode="contain"
class Banner extends Component {
  render() {
    return (
      <Image source={bannerImage} style={styles.bannerImage} />
    );
  }
}
const styles = StyleSheet.create({
  bannerImage: {
    // top: 0,
    // left: 0,
    width: WIDTH, 
    height: WIDTH * 0.35,
    borderWidth: 1,
    borderColor: '#456218',
  },
});

export default Banner