import React, { Component } from 'react'
import {Platform, StyleSheet, Text, View, ImageBackground, Image, Alert, TextInput, Dimensions, TouchableOpacity} from 'react-native';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import logo from '../../../assets/logo-green-leaves.png';
import bgImage from '../../../assets/929_1.0.jpg';
import { sessionRestore, sessionDone, sessionNeedToReload } from '../../actions/session/actions';
import { sidebarRestore, sidebarDone, sidebarNeedToReload} from '../../actions/sidebar/actions';

// if (Platform.OS === 'ios') {
// } else {  // Android
// }


class SplashScreen extends Component {
  componentDidMount() {
    setTimeout(() => {
      // console.log('SplashScreen-componentDidMount call : sidebarRestore & sessionNeedToReload')
      // this.props.sidebarRestore()
      this.props.sidebarNeedToReload()
      this.props.sessionNeedToReload()
    }, 1000);
  }
  componentDidUpdate(prevProps) {
    const { sessionLogged, sessionReload, sessionRestoring, sessionError, sidebarReload, sidebarLogged, sidebarRestoring, sidebarError } = this.props;
    // console.log('SplashScreen-componentDidUpdate: prevProps.sessionRestoring', prevProps.sessionRestoring)
    // console.log('SplashScreen-componentDidUpdate: sessionRestoring', sessionRestoring)
    // if (!prevProps.sessionError && sessionError) Alert.alert('Error', sessionError);
    // if (!prevProps.sidebarError && sidebarError) Alert.alert('Error', sidebarError);
    // if (!prevProps.sessionError && sessionError) Alert.alert('Error', 'Could not restore your loggin session.');
    if (!prevProps.sidebarError && sidebarError) Alert.alert('Error', 'Could not restore your loggin session.');
    if (sidebarReload) {
      console.log('SplashScreen-componentDidUpdate : sidebarReload')
      this.props.sidebarRestore()
    }
    if (prevProps.sidebarRestoring && !sidebarRestoring) {
      console.log('SplashScreen-componentDidUpdate : sidebarRestoring DONE')
      this.props.sidebarDone()
    }
    if (sessionReload) {
      console.log('SplashScreen-componentDidUpdate: sessionReload')
      this.props.sessionRestore()
    }      

    if (prevProps.sessionRestoring && !sessionRestoring) {
      console.log('SplashScreen-componentDidUpdate: sessionRestore DONE, Open HOME')
      this.props.sessionDone()
      this.props.navigation.navigate('home');
    }
    if (!sidebarLogged && !sessionLogged) {
      this.props.navigation.navigate('home')
    }
  }

  render() {  
    return (
      <ImageBackground source={bgImage} style={styles.backgroundContainer}> 
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo}/>
          <Text style={styles.logoText}>uN&#603;xt Services</Text>
          <Button block style={styles.buttonGo} onPress={() => this.props.navigation.navigate('home')}>
            <Text style={styles.buttonText}>GO</Text>
          </Button>
        </View>
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    width: null,
    height: null,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50
  },
  logo: {
    width: 120,
    height: 120
  },
  logoText: {
    color: 'white',
    fontSize: 35,
    fontWeight: '400',
    marginTop: 10,
    opacity: 1
  },
  buttonGo: {
    backgroundColor: '#1eac13',
    marginTop: 30,

  },
  buttonText: {
    color: 'white',
    fontSize: 24
  }
});

const mapStateToProps = ({ sessionReducer: { sessionReload, sessionRestoring, sessionError, sessionLogged },
                            sidebarReducer: { sidebarRestoring, sidebarError, sidebarLogged } }) => ({
  sessionRestoring: sessionRestoring,
  sessionError: sessionError,
  sessionReload: sessionReload,
  sessionLogged: sessionLogged,

  sidebarRestoring: sidebarRestoring,
  sidebarError: sidebarError,
  sidebarLogged: sidebarLogged
});

const mapDispatchToProps = {
  sessionRestore: sessionRestore,
  sessionDone: sessionDone,
  sessionNeedToReload: sessionNeedToReload,

  sidebarRestore: sidebarRestore, 
  sidebarDone: sidebarDone,
  sidebarNeedToReload: sidebarNeedToReload
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SplashScreen);
