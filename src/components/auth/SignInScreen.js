import React, { Component } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View, Alert, SafeAreaView, ScrollView } from 'react-native';
import { Container, Content, Header, Button, Text, Body, Form, Item as FormItem,
  Input, Label, Title, Item, Icon, Right, Fab, Footer, FooterTab
} from 'native-base';
import { connect } from 'react-redux';
// import { loginUser } from '../../actions/session/actions';
import { authSignIn, authSignInDone } from '../../actions/auth/actions';
import { settingLoadUserInfo, settingsDone } from '../../actions/settings/actions'
import { sessionRestore, sessionDone, sessionNeedToReload } from '../../actions/session/actions';
import Banner from './banner';
import Loader from '../nav/Loader';

const { width, height } = Dimensions.get("window");
class SignInScreen extends Component {
  constructor() {
		super();
		this.state = {
      loading: false,
      showPassword: false,
      validEmail: false,
			email:'',
			password:''
		}
  }
  componentDidUpdate(prevProps) {
    console.log('signIn-componentDidUpdate')
    const { authError, authSignInSuccess, settingssuccess, sessionReload, sessionRestoring } = this.props;
    if (!prevProps.authError && authError) {
      Alert.alert(
        'Error',
        authError,
        [
          {text: 'OK', onPress: () => {}}
        ],
        { cancelable: false, onDismiss: () => {} }
      );
    }
    if (authSignInSuccess) {
      // console.log('this.props.settingLoadUserInfo()')
      this.props.settingLoadUserInfo()
      this.props.authSignInDone()
      this.props.sessionNeedToReload()
    }
    if (settingssuccess) {
      console.log('-settingssuccess-this.props.settingsDone()')
      this.props.settingsDone()
      // this.props.navigation.navigate('home');
    }
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
    const {email, password} = this.state;
    if (email && password) {
      console.log('this.props.login(email, password);')
      this.props.authSignIn(email, password);
    } else {
      Alert.alert('Error', 'Please enter email and password !');
    }
  }
  
  signUpUser = () => {
    this.props.navigation.navigate('signup');
  }
  forgotPassword = () => {
    this.props.navigation.navigate('forgotpassword');
  }  
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Loader loading={this.props.authLoading} />
        <Banner />  
        <ScrollView style={styles.scrollview} keyboardShouldPersistTaps='alway' keyboardDismissMode='on-drag'>  
        <Container style={styles.scrollview}>
          <Content style={styles.formContainer}>
            <Item style={styles.item}>
              <Icon active name='mail' />
              <Input placeholder='Email' style={styles.input} keyboardType='email-address'
                onChangeText={(email) => this.handleEmailChange(email)} />
            </Item>
            <Item style={styles.item}>
              <Icon active name="lock" />
              <Input placeholder='Password' style={styles.input} 
                secureTextEntry={!this.state.showPassword}
								onChangeText={(password) => this.setState({password})} />
              <Icon active name={this.state.showPassword == false ? 'eye-off' : 'eye'} onPress={this.showPassword.bind(this)} />
            </Item>
            <View style={styles.passwordWrap}>
              <Text style={styles.accountText}></Text>
              <TouchableOpacity activeOpacity={.5} onPress={this.forgotPassword}>
                <View>
                  <Text style={styles.signupLinkText}>Forgot Password?</Text>
                </View>
              </TouchableOpacity>
            </View>
            <Button disabled={!this.state.validEmail} block style={{ backgroundColor: this.state.validEmail ? '#507C08' : '#767a78' }} onPress={this.signInUser}><Text style={styles.buttonText}>Sign In</Text></Button>
            <View style={styles.signupWrap}>
              <Text style={styles.accountText}>Don't have an account?</Text>
              <TouchableOpacity activeOpacity={.5} onPress={this.signUpUser}>
                <View>
                  <Text style={styles.signupLinkText}>Sign Up</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Content>
            <Fab
              active={true}
              direction="up"
              containerStyle={{left: (width/2) - 25 , width: 50}}
              style={{ backgroundColor: '#698e55' }}
              position="bottomLeft"
              onPress={() => this.props.navigation.navigate('home')}>
              <Icon name="ios-home"/>
            </Fab>
        </Container>
        </ScrollView>  
      </SafeAreaView>  
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // justifyContent: 'center',
  },
  scrollview: {
    height: height - (width * 0.40) 
  },
  formContainer: {
    paddingTop: 30,
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
  forgotPasswordText: {
    color: "#2E430C",
    textAlign: "right",
    paddingTop: 30,
    paddingBottom: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#507C08',
  },
  buttonText: {
    fontSize: 20,
  },
  passwordWrap: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
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
                          authReducer: { authLoading, authError, authSignInSuccess },
                          settingsReducer: { settingssuccess } }) => ({
  authLoading: authLoading,
  authError: authError,
  authSignInSuccess: authSignInSuccess,
  settingssuccess: settingssuccess,

  sessionReload: sessionReload,
  sessionRestoring: sessionRestoring,
  sessionError: sessionError,
  sessionLogged: sessionLogged
});

const mapDispatchToProps = {
  authSignIn: authSignIn,
  authSignInDone: authSignInDone,
  settingLoadUserInfo: settingLoadUserInfo,
  settingsDone: settingsDone,
  sessionRestore: sessionRestore , 
  sessionDone: sessionDone, 
  sessionNeedToReload: sessionNeedToReload
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)
