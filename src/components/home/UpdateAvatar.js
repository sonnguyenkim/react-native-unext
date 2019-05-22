import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, View, TouchableOpacity, Image } from "react-native";
import {
  Container,Header,Title,Content,Button,
  Icon,Left,Right,Body,Text,ListItem,List
} from "native-base";
import { connect } from 'react-redux';
import ImagePicker from "react-native-image-picker";

import Loader from '../nav/Loader';
import { logoutUser, restoreSession } from '../../actions/session/actions';
import styles from "./stylesAvatar";
import { uploadAvatar, uploadAvatarDone } from '../../actions/upload/actions'

const options = {
  title: 'Select a picture'
}

class UpdateAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null,
      avatarUrl: null
    }
  };

  componentDidUpdate(prevProps) {
    const { error, uploadsuccess } = this.props;
    // if (!prevProps.error && error) Alert.alert('Error', error);
    if (!prevProps.error && error) {
      Alert.alert(
        'Error',
        error,
        [
          {text: 'OK', onPress: () => {this.setState({ avatarSource: null, avatarUrl: null })}}
        ],
        { cancelable: false, onDismiss: () => {} }
      );
    }
    if (uploadsuccess) {
      this.props.restoreSession();
      this.props.uploadAvatarDone();
    }
  };

  logout = () => {
    this.props.logout();
  };

  buttonSignOut() {
    Alert.alert(
      'Do you want to sign out ?',
      '',
      [
        {text: 'NO', onPress: () => {}, style: 'cancel'},
        {text: 'YES', onPress: () => this.logout()}
      ],
      { cancelable: false, onDismiss: () => {} }
    );
  };

  handleSelect = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      // } else if (response.customButton) {
      //   console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log('source', source);
        this.setState({
          avatarSource: source,
          avatarUrl: null
        });
        console.log('this.state.avatarSource.uri', this.state.avatarSource.uri);
        // this.uploadImage(response.uri);
      }
    });
  };
  
  uploadAvatarFirebase = () => {
    if (this.state.avatarSource) {
      console.log('this.state.avatarSource.uri != null');
      const localFile = this.state.avatarSource.uri;
      this.props.uploadAvatar(localFile);
    }
  };


  render() {
    return (
      <Container style={styles.container}>
        <Content>
          <View style={styles.avatarcontainer}>
            <Loader loading={this.props.loading} />
            <Text style={styles.welcome}> Your Avatar </Text>
            <Image source={this.state.avatarSource} style={{width: 200, height: 200, margin:10}}></Image>
            <TouchableOpacity style={{backgroundColor: 'green', margin: 10, padding: 10}} onPress={this.handleSelect}>
              <Text style={{color:'white'}}> Select Image </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{backgroundColor: 'green', margin: 10, padding: 10}} onPress={this.uploadAvatarFirebase}>
              <Text style={{color:'white'}}> Upload Image </Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ sessionReducer: { user, logged }, uploadReducer: { uploading, uploaderror, uploadsuccess} }) => ({
  loading: uploading,
  user: user,
  error: uploaderror,
  logged: logged,
  uploadsuccess: uploadsuccess
});

const mapDispatchToProps = {
  logout: logoutUser,
  restoreSession: restoreSession,
  uploadAvatar: uploadAvatar,
  uploadAvatarDone: uploadAvatarDone
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateAvatar);

