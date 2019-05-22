
import React, { Component } from 'react';
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, View, Image, Text, TouchableOpacity } from "react-native";
import { createStackNavigator, createSwitchNavigator, createDrawerNavigator, createAppContainer, DrawerItems, DrawerActions } from 'react-navigation'
import { Root } from 'native-base';

import SplashScreen from './SplashScreen';
import SideBar from './SideBar';
import SignInScreen from '../auth/SignInScreen';
import SignUpScreen from '../auth/SignUpScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
import ChangePasswordScreen from '../auth/ChangePasswordScreen';
import HomeScreen from '../home/HomeScreen';
import SettingsScreen from '../home/SettingsScreen';
// import ImagePickerScreen from '../home/ImagePickerScreen';
import UserProfileScreen from '../home/UserProfileScreen';
// import UpdateAvatar from '../home/UpdateAvatar';
// import UserListScreen from '../home/UserListScreen';
// import MapTrackingScreen from '../home/MapTrackingScreen';

// import MapScreen from '../home/MapScreen';

// import MessageScreen from '../home/MessageScreen';
import MessageBoxScreen from '../home/MessageBoxScreen';
import MessagingScreen from '../home/MessagingScreen';

// import TestScreen from '../test/TestScreen';
// import HomeScreenNotLogged from '../home/HomeScreenNotLogged';
// import HomeScreenLogged from '../home/HomeScreenLogged';
import ServiceLocationScreen from '../home/ServiceLocationScreen';
import ServiceAreaScreen from '../home/ServiceAreaScreen';
import ServiceProvideScreen from '../home/ServiceProvideScreen';
import AddCityStateScreen from '../home/AddCityStateScreen';
import ServiceProviderSearchScreen from '../home/ServiceProviderSearchScreen';
// import ServiceProviderSearchNotLoggedScreen from '../home/ServiceProviderSearchNotLoggedScreen';
import SendRequestScreen from '../home/SendRequestScreen';
import UserRatingListScreen from '../home/UserRatingListScreen';
import UserRatingScreen from '../home/UserRatingScreen';
import SeeAllReviewsScreen from '../home/SeeAllReviewsScreen';
import FavouriteProviderScreen from '../home/FavouriteProviderScreen'

// import AccordionCustomHeaderContent from '../test/accordion-custom-header-content';
// import testAccordion from '../test/testAccordion';
// import testExpandListItem from '../test/testExpandListItem';

const { width } = Dimensions.get('window');

const DrawerConfig = {
  initialRouteName: 'splash',
  drawerWidth: width*.83,
  contentComponent: ({ navigation }) => {
    return(<SideBar navigation={navigation} />)
  }
}

const DrawerNavigator = createDrawerNavigator(
  {
    home: {
      screen: HomeScreen
    },
    message: {
      screen: MessageBoxScreen
    },
    favourites: {
      screen: FavouriteProviderScreen,
    },
    ratinglist: {
      screen: UserRatingListScreen,
    },
    userprofile: {
      screen: UserProfileScreen
    },
    settings: {
      screen: SettingsScreen
    },
    changepassword: {
      screen: ChangePasswordScreen
    },
    splash: {
      screen: SplashScreen,
    },
  
  },
  DrawerConfig
)


const AppNavigator = createStackNavigator ({

  DrawerNavigator: DrawerNavigator,

  signin: {
    screen: SignInScreen,
  },
  signup: {
      screen: SignUpScreen,
  },
  forgotpassword: {
    screen: ForgotPasswordScreen,
  },
  serviceLocation: {
    screen: ServiceLocationScreen,   
  },
  serviceArea: {
    screen: ServiceAreaScreen,   
  },
  serviceProvide: {
    screen: ServiceProvideScreen,   
  },
  addCityState: {
    screen: AddCityStateScreen,   
  },
  serviceProviderSearchScreen: {
    screen: ServiceProviderSearchScreen,   
  },
  // serviceProviderSearchNotLoggedScreen: {
  //   screen: ServiceProviderSearchNotLoggedScreen,   
  // },
  sendRequestScreen: {
    screen: SendRequestScreen,   
  },
  messaging: {
    screen: MessagingScreen,
  },
  userrating: {
    screen: UserRatingScreen,
  },
  seeallreviews: {
    screen: SeeAllReviewsScreen,
  },
  },{
  initialRouteName: 'DrawerNavigator',
  headerMode: 'none'
})


// const AppStackNavigator = createStackNavigator({


// })

// const AppNavigator = createSwitchNavigator({
//   AuthNavigator: AuthSwitchNavigator,
//   DrawerNavigator: DrawerNavigator
// },{
//     initialRouteName: 'AuthNavigator'
// })

const AppContainer = createAppContainer(AppNavigator);

// const mapStateToProps = ({ sessionReducer: { user } }) => ({
//   user: user
// });

export default () =>
<Root>
  <AppContainer />
</Root>
// export default AppContainer