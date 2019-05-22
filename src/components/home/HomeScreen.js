import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, FlatList, View, AsyncStorage } from "react-native";
import {
  Container,Header,Title,Content,Button, Item, Input, 
  Icon,Left,Right,Body,Text,ListItem, Thumbnail, Separator
} from "native-base";
import { StackActions, NavigationActions } from 'react-navigation'
import { connect } from 'react-redux';
import Loader from '../nav/Loader';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { sessionRestore } from '../../actions/session/actions';
import { authSignIn, authSignInDone, authSignOut } from '../../actions/auth/actions';
import { loadServiceList, loadServiceProviderList, loadServiceDone, loadProvidersByLocationAndJobs } from '../../actions/services/actions';

import firebase from 'react-native-firebase';

const resetAction = StackActions.reset({
  index: 0,
  // actions: [NavigationActions.navigate({ routeName: 'DrawerNavigator' })],
  actions: [NavigationActions.navigate({ routeName: 'signin' })],
})

class HomeScreen extends Component {
  constructor() {
		super();
		this.state = {
      location: '',
      jobSearch: '',
      hasLocation: false
		};
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
    );
  }

  componentDidUpdate(prevProps) {
    
    const { location, hasLocation } = this.state;
    const { sessionUser, sessionLogged, servicesLoading, servicesError, servicesList, servicesProviderList, servicesLoadedDone, servicesProviderLoadedDone } = this.props;
    if (!prevProps.servicesError && servicesError) {
      Alert.alert('Error', servicesError);
    } else {
      // Load Provider List
      if (servicesLoadedDone) {
        this.props.loadServiceDone();
        if (servicesProviderList.length > 0) {
          this.props.navigation.navigate('serviceProviderSearchScreen');
        } else {
          Alert.alert('', 'No service provider found in ' + location)
        }
      }
    }
    if (sessionLogged) {
      // ===============================
      // Notifications - Adding FCM 
      // ===============================      
      // console.log('Home-checkPermission-createNotificationListeners')
      this.checkPermission();
      this.createNotificationListeners();
      // End FCM
      
      if (location.length > 0) {
        // console.log('Home-componentDidUpdate-location.length')
        this.locationRef.setAddressText(location)  
      } else {
        // console.log('HomeScreen-componentDidUpdate-user',sessionUser)
        if (!hasLocation) {
          this.setState({location: sessionUser.location, hasLocation: true})
        }
        // this.locationRef.setAddressText(sessionUser.location)
      }
    } else {
      this.locationRef.setAddressText(location)  
    }

  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async getToken() {
    const { sessionLogged } = this.props;
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (fcmToken) {
      if (sessionLogged) {
        const userID = firebase.auth().currentUser.uid;
        const firestore = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        // fcmToken is an array
        firestore.collection('users').doc(userID).update({
          "fcmToken" : firebase.firestore.FieldValue.arrayUnion(fcmToken)
        });  
      }
    }

    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
        // Update Firebase - Cloud Store
        const userID = firebase.auth().currentUser.uid;
        const firestore = firebase.firestore();
        const settings = { timestampsInSnapshots: true };
        firestore.settings(settings);
        firestore.collection('users').doc(userID).update({
          "fcmToken" : firebase.firestore.FieldValue.arrayUnion(fcmToken)
        });
      }
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('Permission rejected');
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      console.log(' notificationOpen-app is foreground', body)
      // this.showAlert(title + ' notificationListener', body);
      // this.props.navigation.navigate('message');
      // this.props.navigation.navigate('messaging',{contactId: key});
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      // this.props.navigation.navigate('message');
      const { title, body } = notificationOpen.notification;
      console.log(' notificationOpen-app is background', body)
      // this.showAlert(title + ' notificationOpenedListener-background', body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      // this.props.navigation.navigate('message');
      const { title, body } = notificationOpen.notification;
      console.log(' notificationOpen-app is closed', body)
      // this.showAlert(title + ' notificationOpen-app is closed', body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      // console.log(JSON.stringify(message));
    });
  }

  componentWillUnmount() {
    const { sessionLogged } = this.props;
    if (sessionLogged) {
      // console.log('HomeScreen-componentWillUnmount-notificationListener')
      this.notificationListener();
      this.notificationOpenedListener();  
    }
  }
  
  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

	componentDidMount() {
    const { sessionUser, sessionLogged, authUser } = this.props;
    // console.log('HomeScreen-componentDidMount-sessionUser',sessionUser)
    if (sessionLogged && sessionUser.location.legnth > 0) {
      this.setState({location: sessionUser.location, hasLocation: true});
      this.locationRef.setAddressText(sessionUser.location)
    }
    this.props.loadServiceList();
  }

  searchOnPress = () => {    
    const { location, jobSearch } = this.state;
    if (location && jobSearch.trim()) {
      this.props.loadProvidersByLocationAndJobs(location,jobSearch.trim())
    } else {
      Alert.alert('', 'Please select a place and a job to search for service providers, or select Service Categories.');
    }
  }

  serviceOnPress = (service) => {
    const { location } = this.state;
    if (location) {
      // console.log('HomeScreen-serviceOnPress-loadServiceProviderList()')
      this.props.loadServiceProviderList(location,service.id);
      this.setState({selectedService: service})
    } else {
      Alert.alert('','Please select a place to search for service providers.');
    }
  }
  
  selectLocation = (location) => {
    this.setState({location: location, hasLocation: true});
  }

  getCurrentLocationOnPress() {
    const { sessionUser } = this.props;
    if (sessionUser) {
      this.locationRef.setAddressText(sessionUser.location)
      this.setState({location: sessionUser.location, hasLocation: true});  
    } else {
      this.setState({location: '', hasLocation: false});
    }

  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
      <Container>
        <Loader loading={this.props.servicesLoading} />
        {this.props.sessionLogged
        ?
        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.toggleDrawer()} >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>uN&#603;xt Services</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.buttonSignOut()}>
            <Icon name="ios-log-out" />
            </Button>
          </Right>
        </Header>        
        :
				<Header style={styles.headerBackgroundColor}>
          <Body>
            <Title style={{textAlign: 'center'}}>uN&#603;xt Services</Title>
          </Body>
          <Right>
						<Button hasText transparent onPress={() => this.props.navigation.navigate('signin')}>
              <Text>Sign In</Text>
            </Button>
          </Right>
        </Header>
        }

        <Content padder>
        <View style={styles.searchBox}>
          <GooglePlacesAutocomplete
            ref={(instance) => {this.locationRef = instance}}
            placeholder="Service location (City)"
            placeholderTextColor='#444444'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
            listViewDisplayed="false" // true/false/undefined
            fetchDetails={true}
            renderDescription={row => row.description} // custom description render
            onPress={(data, details = null) => {
              {/* console.log('Data',data.description);
              console.log('Detail',details.formatted_address); */}
              this.selectLocation(data.description);
            }}
            getDefaultValue={() => {
              return this.state.location; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: 'AIzaSyCXL2VW0SwxxO71ui8H1a72mwKJKO2V89Q',
              language: 'en', // language of the results
              types: '(cities)', // default: 'geocode'
              components: 'country:us'
            }}
            styles={searchInpuStyle}
            //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            //currentLocationLabel="Current location"
            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              // rankby: 'distance',
              // types: 'food',
            }}
            filterReverseGeocodingByTypes={[
              'locality',
              'administrative_area_level_3',
            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            // predefinedPlaces={[homePlace, workPlace]}
            debounce={200}
          />
          <Button transparent onPress={() => this.getCurrentLocationOnPress()}>
            <Icon active name='ios-pin' style={{ color: '#507C08' }} />
          </Button>

        </View>
        
        <View style={{paddingTop: 10, paddingBottom: 10, marginBottom: 10}}>
          <Item style={{paddingTop: 10, marginBottom: 15}}>
            <Input placeholder='Search for a job' placeholderTextColor='#444444' style={{paddingLeft: 10, borderBottomWidth: 1, fontSize: 18}}
                    onChangeText={(jobSearch) => this.setState({jobSearch: jobSearch})} />
            <Button transparent onPress={() => this.searchOnPress()} >
              <Icon name='ios-search' style={{ color: "green"}} />
            </Button>
          </Item>
          <View style={{paddingTop: 10, paddingBottom: 10, alignItems: 'center'}}>
            <Text style={{fontSize: 30, fontWeight: 'bold', color: 'green'}}>OR</Text>
            <Text style={{}}>Select a Service Category</Text>

          </View>

          <Separator bordered>
            <Text style={styles.headerText}>SERVICE CATEGORIES</Text>
          </Separator>
          <ScrollView>
            <FlatList
              data={this.props.servicesList}
              scrollEnabled={false}
              keyExtractor={(item, index) => item.id} 
              renderItem={({item, index}) => 
                <ListItem thumbnail onPress={() => {this.serviceOnPress(item)}}>
                  <Left>
                    <Thumbnail square source={{uri: item.photo}}/>
                  </Left>
                  <Body>
                    <Text>{item.name}</Text>
                    <Text note numberOfLines={1}>{item.description}</Text>
                  </Body>
                  <Right>
                      
                  </Right>
                </ListItem>
              }
            />
            </ScrollView>
        </View>    

        </Content>

      </Container>
      </SafeAreaView>
    );
  }
}
const searchInpuStyle = {
  
  textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    color: '#444444',
    fontSize: 18,
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#444444',
    fontSize: 18,
    // borderWidth: 1,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingTop: 10, paddingBottom: 10, marginBottom: 10
  },
  predefinedPlacesDescription: {
    color: '#1faadb'
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  headerBackgroundColor: {
    backgroundColor: '#02420b',
  },
  mb10: {
    marginBottom: 10
  },
  contentContainer: {
    paddingVertical: 10
  },
  items: {
    flex: 1,
    // width: width - 20,
  },
  avatar: {
    width: 60,
    height: 60,

  },
  textItem: {
    paddingRight: 30,
    paddingLeft: 30,
    fontSize: 18,
    // fontWeight: 'bold'
  },
  displayName: {
    height: 55,
    width: 55,
    bottom: 8,
    borderWidth:1,
    borderColor:'#2E5103',
    borderRadius:30,
    backgroundColor:'#A6D869',
    justifyContent: 'center',
    textAlign: 'center'
  },
  headerText: {
    // height: 55,
    // paddingTop: 10,
    // paddingRight: 30,
    // paddingLeft: 30,
    fontSize: 16,
    // fontWeight: '400',
    color: '#043a00',
  },
  searchBox: {
    paddingTop: 10,
    flexDirection: "row",
  },
});

const mapStateToProps = ({  sessionReducer: { sessionUser, sessionLogged }, 
                            // authReducer: { authUser, authLogged },
                            sidebarReducer: { sidebarUser, sidebarLogged },
                            servicesReducer: { servicesLoading, servicesError, servicesLoadedDone, servicesProviderLoadedDone, servicesList, servicesProviderList } }) => ({

  sessionUser: sessionUser,
  sessionLogged: sessionLogged,

  sidebarUser: sidebarUser,
  sidebarLogged: sidebarLogged,
    
  servicesLoading: servicesLoading,
  servicesError: servicesError,
  servicesList: servicesList,
  servicesLoadedDone: servicesLoadedDone,
  servicesProviderLoadedDone: servicesProviderLoadedDone,
  servicesProviderList: servicesProviderList
});

const mapDispatchToProps = {
  sessionRestore: sessionRestore,
  authSignIn: authSignIn, 
  authSignInDone: authSignInDone, 
  authSignOut: authSignOut,

  loadServiceList: loadServiceList,
  loadServiceDone: loadServiceDone,
  loadServiceProviderList: loadServiceProviderList,
  loadProvidersByLocationAndJobs: loadProvidersByLocationAndJobs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);

