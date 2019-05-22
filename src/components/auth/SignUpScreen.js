import React, { Component } from 'react';
import {StyleSheet, Dimensions, TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Container, Content, Header, Button, Text, Body, Form, Item as FormItem,
  Input, Label, Title, Item, Icon, CheckBox, ListItem, Switch, Left, Right
} from 'native-base';
import { connect } from 'react-redux';
import { authSignUp, authSignUpDone } from '../../actions/auth/actions'
import { settingLoadUserInfo, settingsDone } from '../../actions/settings/actions'
import { sessionRestore, sessionDone, sessionNeedToReload } from '../../actions/session/actions';
import Banner from './banner';
import Loader from '../nav/Loader';

const { width, height } = Dimensions.get("window");
class SignUpScreen extends Component {
  constructor() {
		super();
		this.state = {
			showPassword: false,
			email:'',
      password:'',
      firstName:'',
      middleName:'',
      lastName:'',
      isServiceProvider: false,
      validEmail: false
		}
  }
  componentDidUpdate(prevProps) {
    const { authError, authSignUpSuccess, sessionReload, sessionRestoring, settingssuccess } = this.props;
    if (!prevProps.authError && authError) {
      Alert.alert('Error', authError);
    }
    // if (authSignUpSuccess) {
    //   // this.props.settingLoadUserInfo()
    //   this.props.navigation.navigate('home');
    // } 

    if (authSignUpSuccess) {
      console.log('SignUp-componentDidUpdate-authSignUpSuccess')
      // this.props.settingLoadUserInfo()
      this.props.authSignUpDone()
      this.props.sessionNeedToReload()
      // this.props.navigation.navigate('signin');
    }
    // if (settingssuccess) {
    //   console.log('-settingssuccess-this.props.settingsDone()')
    //   this.props.settingsDone()
    //   // this.props.navigation.navigate('signin');
    // }
    if (sessionReload) {
      // Call session 
      console.log('SignIn-componentDidUpdate: sessionReload DONE, call sessionRestore')
      this.props.sessionRestore()
    }      
    if (prevProps.sessionRestoring && !sessionRestoring) {
      console.log('SignInScreen-componentDidUpdate: sessionRestore DONE, Open HOME')
      this.props.navigation.navigate('home');
    }

  }
  showPassword = () => {
		if (this.state.showPassword == true) {
			this.setState({ showPassword: false});
		} else {
			this.setState({ showPassword: true});
		}
  }   
  handleEmailChange = (email) => {
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validEmail } = this.state;
    this.setState({ email: email });
    if (!validEmail) {
      if (emailCheckRegex.test(email)) {
        this.setState({ validEmail: true });
      }
    } else if (!emailCheckRegex.test(email)) {
      this.setState({ validEmail: false });
    }
  }

	signInUser = () => {
    this.props.navigation.navigate('signin');
  }

  signUpUser = () => {
    const { email, password, firstName, middleName, lastName, isServiceProvider } = this.state;
    if (email && password && firstName && lastName) {
      let _firstName = firstName.trim();
      let _lastName = lastName.trim();
      let _middleName = middleName.trim();
      this.props.authSignUp(email, password, _firstName, _middleName, _lastName, isServiceProvider);
    } else {
      Alert.alert('Error', 'Please enter all required information !');
    }
  }

  isServiceProviderHandler = (value) => {
    if (value) {
      Alert.alert(
        'Notice',
        'You must be at least 18 years old to register as a provider',
        [
          {text: 'NO', onPress: () => {}, style: 'cancel'},
          {text: 'YES', onPress: () => this.setState({isServiceProvider: value})}
        ],
        { cancelable: false, onDismiss: () => {} }
      );
    }
    else {
      this.setState({isServiceProvider: value} );
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Loader loading={this.props.authLoading} />
        <Banner />
        <ScrollView style={styles.scrollview} keyboardShouldPersistTaps='alway' keyboardDismissMode='on-drag'> 
          <Container style={styles.mainContainer}>
            <Content style={styles.formContainer}>
              <Item style={styles.item}>
                <Input placeholder='First Name' style={styles.input} 
                  onChangeText={(firstName) => this.setState({firstName})} />
              </Item>
              <Item style={styles.item}>
                <Input placeholder='Middle Name' style={styles.input} 
                  onChangeText={(middleName) => this.setState({middleName})} />
              </Item>
              <Item style={styles.item}>
                <Input placeholder='Last Name' style={styles.input} 
                  onChangeText={(lastName) => this.setState({lastName})} />
              </Item>
              <Item style={styles.item}>
                <Icon active name='mail' />
                <Input placeholder='Email' style={styles.input} keyboardType='email-address'
                  onChangeText={(email) => this.handleEmailChange(email)} />
              </Item>
              <Item style={styles.item}>
                <Icon active name="lock" />
                <Input placeholder='Password (At least 6 charaters)' style={styles.input}  
                  secureTextEntry={!this.state.showPassword}
                  onChangeText={(password) => this.setState({password})} />
                <Icon active name={this.state.showPassword == false ? 'eye-off' : 'eye'} onPress={this.showPassword.bind(this)} />
              </Item>
              <ListItem style={styles.listitem}>
                <Left>
                <Text style={styles.listitem}>Service Provider?</Text>
                  </Left>
                {/* <Body>
                
                </Body> */}
                <Right>
                  <Switch style={styles.switch}
                    //onValueChange={ (value) => this.setState({ isServiceProvider: value })} 
                    onValueChange={ (value) => {this.isServiceProviderHandler(value)}} 
                    value={ this.state.isServiceProvider } 
                  /> 
                </Right>
              </ListItem>


              <View style={styles.buttonWrapper}>
                <Button disabled={!this.state.validEmail} block style={{ backgroundColor: this.state.validEmail ? '#507C08' : '#767a78' }} onPress={this.signUpUser}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </Button>
              </View>
              <View style={styles.signupWrap}>
                <Text style={styles.accountText}>Already have an account?</Text>
                <TouchableOpacity activeOpacity={.5} onPress={this.signInUser}>
                  <View>
                    <Text style={styles.signupLinkText}>Sign In</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Content>
          </Container>
        </ScrollView>  
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
  item: {
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#456218",
  },
  listitem :{
    paddingTop: 20,
    height: 45,
    fontSize: 20,
    color: "#22721d",
    borderBottomWidth: 0,
    // fontWeight: 'bold'
  },
  switch :{
    marginTop: 20,
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] 
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
    fontWeight: 'bold'
	},
});

const mapStateToProps = ({ sessionReducer: { sessionReload, sessionRestoring, sessionError, sessionLogged },
                          authReducer: { authLoading, authError, authSignUpSuccess },
                          settingsReducer: { settingssuccess } }) => ({

authLoading: authLoading,
authError: authError,
authSignUpSuccess: authSignUpSuccess,

settingssuccess: settingssuccess,

sessionReload: sessionReload,
sessionRestoring: sessionRestoring,
sessionError: sessionError,
sessionLogged: sessionLogged
});

const mapDispatchToProps = {
  authSignUp: authSignUp,
  authSignUpDone: authSignUpDone,

  settingLoadUserInfo: settingLoadUserInfo,
  settingsDone: settingsDone,

  sessionRestore: sessionRestore , 
  sessionDone: sessionDone, 
  sessionNeedToReload: sessionNeedToReload
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen)
