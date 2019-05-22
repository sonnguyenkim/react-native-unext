import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, View, TouchableOpacity } from "react-native";
import {
  Container,Header,Title,Content,Button, Separator, Textarea, 
  Icon,Left,Right,Body,Text,ListItem,List, Item, Input, Thumbnail, Switch
} from "native-base";
import { connect } from 'react-redux';
import ImagePicker from "react-native-image-picker";
import { StackActions, NavigationActions } from 'react-navigation'

import Loader from '../nav/Loader';

import { sidebarRestore, sidebarDone } from '../../actions/sidebar/actions'
import { authSignOut, authUpdateProfile, authUpdateProfileDone } from '../../actions/auth/actions';
import { uploadAvatar, uploadAvatarDone } from '../../actions/upload/actions';

const options = {
  title: 'Select a picture'
}

const maxWord = 400;
const maxCharacter = maxWord * 10;

const resetAction = StackActions.reset({
  index: 0,
  // actions: [NavigationActions.navigate({ routeName: 'DrawerNavigator' })],
  actions: [NavigationActions.navigate({ routeName: 'signin' })],
})

class UserProfileScreen extends Component {
  constructor(props) {
		super(props);
		this.state = {
      isUploadAvatarDone: false,
      isAuthUpdateProfileDone: false,
      wordsRemain: maxWord,
      isChanged: false,
      isInfoChanged: false,
      isAvatarChanged: false,
      avatarSource: null,
      userInfo: {
        displayName:'',
        email:'',
        phoneNumber:'',
        firstName:'',
        middleName:'',
        lastName:'',
        photoURL:'',
        locationCityState:'',
        isServiceProvider: false,
        providerMode: false,
        serviceArea: [],
        serviceProvider:[]
      }
		}
  }
  logout = () => {
    this.props.authSignOut()
    this.props.navigation.dispatch(resetAction)
    // this.props.navigation.navigate('signin')
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
    )
  }

  selectPhoto = () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
      } else {
        const source = { uri: response.uri };
        this.setState({avatarSource: source, isChanged: true, isAvatarChanged: true})
      }
    });
  }

  isServiceProviderHandler = (value) => {
    if (value) {
      Alert.alert(
        'Notice',
        'You must be at least 18 years old to register as a provider',
        [
          {text: 'NO', onPress: () => {}, style: 'cancel'},
          {text: 'YES', onPress: () => this.setState({userInfo: {...this.state.userInfo, isServiceProvider: true, providerMode: true}, isChanged: true, isInfoChanged: true} )}
        ],
        { cancelable: false, onDismiss: () => {} }
      );
    }
    else {
      this.setState({userInfo: {...this.state.userInfo, isServiceProvider: false, providerMode: false}, isChanged: true, isInfoChanged: true} );
    }
  }

  uploadAvatarFirebase = () => {
    if (this.state.avatarSource) {
      const localFile = this.state.avatarSource.uri
      this.props.uploadAvatar(localFile);
    }
  }

  updateUserInfo = () => {
    const { firstName, middleName, lastName } = this.state.userInfo
    if (firstName && lastName) {
      if (this.state.isInfoChanged && this.state.isAvatarChanged) {
        if (this.state.avatarSource) {
          this.uploadAvatarFirebase()
        }
        this.props.authUpdateProfile(this.state.userInfo);
      } else if (this.state.isInfoChanged) {
        this.props.authUpdateProfile(this.state.userInfo);
      } else if (this.state.isAvatarChanged) {
        if (this.state.avatarSource) {
          this.uploadAvatarFirebase();
        }
      }
    } else {
      Alert.alert('Error', 'Please enter all required information !');
    }
  };
  
  onChangeTextAboutMe = (aboutMe) => {
    let wordsCount = aboutMe.split(" ").length;
    let wordsRemain = maxWord - wordsCount;
    // console.log('wordsCount', wordsCount);
    if (wordsRemain >= 0) {
      this.setState({ userInfo: {...this.state.userInfo, aboutMe}, wordsRemain: wordsRemain, isChanged: true, isInfoChanged: true })
    }
  }

  componentDidMount() {
    const {user} = this.props;
    this.setState({userInfo: user});
  };

  componentDidUpdate(prevProps) {
    const { sidebarError, uploaderror, uploadsuccess, authUpdateProfileSuccess } = this.props
    const { isAuthUpdateProfileDone, isUploadAvatarDone, isAvatarChanged, isInfoChanged } = this.state

    if (!prevProps.sidebarError && sidebarError) Alert.alert('Error', sidebarError);
    if (!prevProps.uploaderror && uploaderror) {
      Alert.alert(
        'Error',
        error,
        [
          {text: 'OK', onPress: () => {this.setState({ avatarSource: null })}}
        ],
        { cancelable: false, onDismiss: () => {} }
      );
    }
    if (this.state.isInfoChanged && this.state.isAvatarChanged) {
      if (uploadsuccess) {
        console.log('UserProfileScreen-uploadAvatarDone()')
        this.props.uploadAvatarDone();
        // this.setState({isUploadAvatarDone: true, avatarSource: null, isAvatarChanged: false});
        this.setState({isUploadAvatarDone: true, avatarSource: null});
      }
      if (authUpdateProfileSuccess) {
        console.log('UserProfileScreen-authUpdateProfileDone()')
        this.props.authUpdateProfileDone();
        // this.setState({ isAuthUpdateProfileDone: true, isChanged: false, isInfoChanged: false});
        this.setState({ isAuthUpdateProfileDone: true, isChanged: false});
      }
    } else if (this.state.isInfoChanged) {
      if (authUpdateProfileSuccess) {
        console.log('UserProfileScreen-authUpdateProfileDone() - ONLY')
        this.props.authUpdateProfileDone();
        // this.setState({isAuthUpdateProfileDone: true, isChanged: false, isInfoChanged: false});
        this.setState({isAuthUpdateProfileDone: true, isChanged: false});
      }
    } else if (this.state.isAvatarChanged) {
      if (uploadsuccess) {
        console.log('UserProfileScreen-uploadAvatarDone() - ONLY')
        this.props.uploadAvatarDone();
        // this.setState({isUploadAvatarDone: true, avatarSource: null, isChanged: false, isAvatarChanged: false});
        this.setState({isUploadAvatarDone: true, avatarSource: null, isChanged: false});
      }
    }

    if (isAvatarChanged && isInfoChanged) {
      if (isAuthUpdateProfileDone && isUploadAvatarDone) {
        console.log('UserProfileScreen-sidebarRestore()')
        this.setState({isUploadAvatarDone: false, isAuthUpdateProfileDone: false, isAvatarChanged: false, isInfoChanged: false})
        this.props.sidebarRestore()
      }
    } else if (isAvatarChanged) {
      if (isUploadAvatarDone) {
        console.log('UserProfileScreen-sidebarRestore()')
        this.setState({isUploadAvatarDone: false, isAuthUpdateProfileDone: false, isAvatarChanged: false, isInfoChanged: false})
        this.props.sidebarRestore()
      }
    } else if (isInfoChanged) {
      if (isAuthUpdateProfileDone) {
        console.log('UserProfileScreen-sidebarRestore()')
        this.setState({isUploadAvatarDone: false, isAuthUpdateProfileDone: false, isAvatarChanged: false, isInfoChanged: false})
        this.props.sidebarRestore()
      }
    }



  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Loader loading={this.props.loading || this.props.uploading} />
        <Container style={styles.container}>
          <Header style={styles.headerBackgroundColor}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.toggleDrawer()} >
                <Icon name="ios-menu" />
              </Button>
            </Left>
            <Body>
              <Title>User Profile</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => this.buttonSignOut()}>
              <Icon name="ios-log-out" />
              </Button>
            </Right>
          </Header>
          <ScrollView style={styles.scrollview} keyboardShouldPersistTaps='alway' keyboardDismissMode='on-drag'>
            <Content style={styles.formContainer}>
              <Item style={styles.item}>
                <Icon active name='mail' />
                <Input placeholder='Email' style={styles.inputemail} keyboardType='email-address'
                  value={this.props.user.email} editable={false}/>
              </Item>
              <Item style={styles.item}>
                <Input placeholder='First Name' style={styles.input} defaultValue={this.props.user.firstName}
                  onChangeText={(firstName) => this.setState({userInfo: {...this.state.userInfo, firstName}, isChanged: true, isInfoChanged: true})} />
              </Item>
              <Item style={styles.item}>
                <Input placeholder='Middle Name' style={styles.input} defaultValue={this.props.user.middleName}
                  onChangeText={(middleName) => this.setState({userInfo: {...this.state.userInfo, middleName}, isChanged: true, isInfoChanged: true})} />
              </Item>
              <Item style={styles.item}>
                <Input placeholder='Last Name' style={styles.input} defaultValue={this.props.user.lastName}
                  onChangeText={(lastName) => this.setState({userInfo: {...this.state.userInfo, lastName}, isChanged: true, isInfoChanged: true})} />
              </Item>
              
              <ListItem thumbnail style={styles.listitemavatar} >
                <Left>
                  { this.state.avatarSource 
                  ? <Thumbnail round source={this.state.avatarSource} />
                  : this.props.user.photoURL 
                    ? <Thumbnail round source={{ uri: this.props.user.photoURL }} />
                    : <Button style={styles.displayName} >
                      <Text style={{color:'black', fontSize: 18}}>{this.props.user.displayName}</Text>
                      </Button>
                  }
                </Left>
                
                <Body>
                  <Text style={styles.avataritem}>Your Avatar</Text>
                  {/* <Text note numberOfLines={1}>Your avatar</Text> */}
                </Body>
                <Right>
                  <Button transparent onPress={this.selectPhoto}>
                    <Text style={styles.signupLinkText}>Select Photo</Text>
                  </Button>
                </Right>
              </ListItem>

              <ListItem style={styles.listitem}>
                <Left>
                  <Text style={styles.listitem}>Service Provider?</Text>
                </Left>
                <Right>
                  <Switch style={styles.switch}
                    onValueChange={ (value) => {this.isServiceProviderHandler(value)}} 
                    value={ this.state.userInfo.isServiceProvider } 
                  /> 
                </Right>
              </ListItem>
              {this.state.userInfo.isServiceProvider 
              ?
              <View>
              <Text style={styles.listitem}>Your Services</Text>
              <Textarea rowSpan={6} bordered placeholder="About you and your services" 
                // value={this.state.aboutMe} 
                maxLength={maxCharacter}
                defaultValue={this.props.user.aboutMe}
                onChangeText={(aboutMe) => this.onChangeTextAboutMe(aboutMe)}
              />
              <Text note>You have {this.state.wordsRemain} words remain.</Text>
              </View>
              : null
              }

              <Button disabled={!this.state.isChanged} block 
                style={{marginTop: 20, backgroundColor: this.state.isChanged ? '#507C08' : '#767a78' }} 
                onPress={this.updateUserInfo}>
                <Text style={styles.buttonText}>Update</Text>
              </Button>

            </Content>
          </ScrollView>
        </Container>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  mainContainer: {
    flex: 1,
  },
  headerBackgroundColor: {
    backgroundColor: '#02420b'
  },
  formContainer: {
    paddingBottom: 30,
    paddingLeft : 10,
    paddingRight: 10,
  },
  input: {
    height: 45,
    fontSize: 20,
  },
  inputemail: {
    height: 45,
    fontSize: 20,
    color: '#757575'
  },
  item: {
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#456218",
  },
  listitemavatar: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  listitem :{
    paddingTop: 20,
    height: 45,
    fontSize: 20,
    color: "#22721d",
    // fontWeight: 'bold'
    borderBottomWidth: 0,
  },
  switch :{
    marginTop: 20,
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] 
  },
  avataritem: {
    paddingTop: 25,
    borderBottomWidth: 0,
  },
  forgotPasswordText: {
    paddingTop: 30,
  },
  buttonWrapper: {
    paddingTop: 30,
  },
  button: {
    backgroundColor: '#507C08',
  },
  buttonText: {
    fontSize: 20,
  },
  signupWrap: {
    paddingTop: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  accountText: {
    color: "#22721d",
    fontSize: 18,
  },
  signupLinkText: {
    color: "#22721d",
    marginLeft: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  displayName: {
    height: 60,
    width: 60,
    bottom: 8,
    borderWidth:1,
    borderColor:'grey',
    borderRadius:30,
    backgroundColor:'#A6D869',
    justifyContent: 'center',
    textAlign: 'center',
  },
})

const mapStateToProps = ({ sidebarReducer: { sidebarRestoring, sidebarUser, sidebarError, sidebarLogged }, 
                            uploadReducer: { uploading, uploaderror, uploadsuccess },
                            authReducer: { authUpdateProfileSuccess } }) => ({
  user: sidebarUser,
  sidebarRestoring: sidebarRestoring,
  sidebarError: sidebarError,
  sidebarLogged: sidebarLogged,

  authUpdateProfileSuccess: authUpdateProfileSuccess,

  uploading: uploading,
  uploaderror: uploaderror,
  uploadsuccess: uploadsuccess
});

const mapDispatchToProps = {
  sidebarRestore: sidebarRestore,
  sidebarDone: sidebarDone,

  authSignOut: authSignOut,
  authUpdateProfile: authUpdateProfile, 
  authUpdateProfileDone: authUpdateProfileDone,

  uploadAvatar: uploadAvatar,
  uploadAvatarDone: uploadAvatarDone,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfileScreen);


