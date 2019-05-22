import React, { Component } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View, Alert } from 'react-native';
import { Container, Content, Header, Button, Text, Body, Form, Item as FormItem, 
  Input, Label, Title, Item, Icon, Fab, Left, Right
} from 'native-base';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';

import { authSignOut, authSignOutDone, authSendPasswordResetEmail, authPasswordResetDone } from '../../actions/auth/actions'
import { sessionRestore, sessionDone, sessionNeedToReload } from '../../actions/session/actions';
import { sidebarRestore, sidebarDone, sidebarNeedToReload} from '../../actions/sidebar/actions';

import Loader from '../nav/Loader';

const { width, height } = Dimensions.get("window")

const resetAction = StackActions.reset({
  index: 0,
  // actions: [NavigationActions.navigate({ routeName: 'DrawerNavigator' })],
  actions: [NavigationActions.navigate({ routeName: 'signin' })],
})

class ChangePasswordScreen extends Component {
  constructor(props) {
		super(props);
		this.state = {
      loading: false,
      emailAddress:'',
      validEmail: false
		}
  }

  componentDidUpdate(prevProps) {
    const { authError, authSendPasswordReset, authSignOutSuccess } = this.props;
    if (!prevProps.authError && authError) Alert.alert('Error', authError);
    console.log('ChangePasswordScreen-componentDidUpdate-sendpasswordreset',authSendPasswordReset)
    if (authSendPasswordReset) {
      Alert.alert('Message', 'An email is sent to you successfully. Please read your email for instructions.');
      this.props.authPasswordResetDone()
      this.props.authSignOut()
      // this.props.navigation.navigate('signin')
    }
    if (authSignOutSuccess) {
      this.props.authSignOutDone()
      this.props.sidebarNeedToReload()
      this.props.sessionNeedToReload()
      this.props.navigation.dispatch(resetAction)
      // this.props.navigation.navigate('signin')
    }
  }

  logout = () => {
    this.props.authSignOut()
    // this.props.navigation.dispatch(resetAction)
    // this.props.navigation.navigate('signin')
  }

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

  handleEmailChange = (email) => {
    const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validEmail } = this.state;
    this.setState({ emailAddress: email });
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

  handleResetPassword = () => {
    const { emailAddress, validEmail } = this.state;
    if (validEmail) {
      this.props.authSendPasswordResetEmail(emailAddress)
    }
  }  

  render() {
    return (
        <Container>
          <Loader loading={this.props.authLoading} />
          <Header style={styles.headerBackgroundColor}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.toggleDrawer()} >
                <Icon name="ios-menu" />
              </Button>
            </Left>
            <Body>
              <Title>Change Passcode</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => this.buttonSignOut()}>
              <Icon name="ios-log-out" />
              </Button>
            </Right>
          </Header>
          <Content style={styles.formContainer}>
            <View>
							<Text style={styles.text}>We'll send you an email with instructions on how to reset your password.</Text>
              {/* <Text style={styles.text}>on how to reset your password.</Text> */}
            </View>
            <Item style={styles.item}>
              <Icon active name='mail' />
              <Input placeholder='Your email address' style={styles.input} 
                onChangeText={(email) => this.handleEmailChange(email)} />
            </Item>
            <View style={styles.buttonWrapper}>
              <Button disabled={!this.state.validEmail} block style={{ backgroundColor: this.state.validEmail ? '#507C08' : '#767a78' }} onPress={this.handleResetPassword}>
                <Text style={styles.buttonText}>Reset Password</Text>
              </Button>
            </View>

          </Content>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft : 10,
    paddingRight: 10,
  },
  headerBackgroundColor: {
    backgroundColor: '#02420b'
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
  buttonWrapper: {
    paddingTop: 30,
  },
  button: {
    backgroundColor: '#507C08',
    //#767a78
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
  text: {
    color: "#2E430C",
    fontSize: 20,
  },
  accountText: {
    color: "#2E430C",
    fontSize: 18,
  },
  signupLinkText: {
    color: "#22721d",
    marginLeft: 5,
    fontSize: 18,
    fontWeight: 'bold'
	},
});


const mapStateToProps = ({ authReducer: { authLoading, authUser, authError, authSendPasswordReset, authSignOutSuccess } }) => ({
  authLoading: authLoading,
  user: authUser,
  authError: authError,
  authSendPasswordReset: authSendPasswordReset,
  authSignOutSuccess: authSignOutSuccess
});

const mapDispatchToProps = {
  authSignOut: authSignOut, 
  authSignOutDone: authSignOutDone,
  authSendPasswordResetEmail: authSendPasswordResetEmail, 
  authPasswordResetDone: authPasswordResetDone,

  sessionNeedToReload: sessionNeedToReload,
  sidebarNeedToReload: sidebarNeedToReload

};

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen))
