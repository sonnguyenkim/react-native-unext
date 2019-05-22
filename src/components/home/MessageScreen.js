import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions,View, Image } from "react-native";
import {
  Container, Header, Title, Content, Button,
  Left, Right, Body, Text, ListItem, List, Thumbnail
} from "native-base";
import { createBottomTabNavigator, createStackNavigator , createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux';
import { logoutUser } from '../../actions/session/actions';
import { getUserList } from '../../actions/service/actions';
import { getUserMessageList } from '../../actions/chat/actions';
import Loader from '../nav/Loader';


import MessageConversationScreen from "./MessageConversationScreen";
// import MessageUserListScreen from "./MessageUserListScreen";
import MessageContactListScreen from "./MessageContactListScreen";

import MessagingScreen from "./MessagingScreen";

const MessageScreenTab = createBottomTabNavigator({
  conversation: {
    screen: MessageConversationScreen,
    navigationOptions: {
      tabBarLabel: 'CONVERSATIONS',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-chatboxes" color={tintColor} size={24} />
      )
    }
  },
  contactlist: {
    screen: MessageContactListScreen,
    navigationOptions: {
      tabBarLabel: 'CONTACTS',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-people" color={tintColor} size={24} />
      )
    }
  }
}, {//router config
    initialRouteName: 'contactlist',
    order: ['conversation', 'contactlist'],
    //navigation for complete tab navigator
    navigationOptions: {
      tabBarVisible: true
    },
    tabBarOptions: {
      activeTintColor: 'darkgreen',
      inactiveTintColor: 'grey',
      // activeBackgroundColor: '#2EC4B6',
      // style: {
      //   backgroundColor: 'blue',
      // },
      style: {
        backgroundColor:'white',
        borderTopWidth:1,
        borderTopColor:'darkgreen',
        // fontSize: 14
      },
      // tabStyle: {
      //   backgroundColor:'gray',
      //   borderTopWidth:1,
      //   borderTopColor:'darkgreen',
      //   fontSize: 14
      // },
      // tabBarSelectedItemStyle: {
      //     borderBottomWidth: 2,
      //     borderBottomColor: 'red',
      // },
      
    }
  });



const MessageStack = createStackNavigator({
  messaging: {
    screen: MessagingScreen,
    navigationOptions: () => ({
        title: 'Message',
    }),
  },
  messageScreenTab: {
    screen: MessageScreenTab,
    navigationOptions: () => ({
      header: null,
    }),    
  }
},
{ initialRouteName: 'messageScreenTab' })

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

// {
//   navigationOptions: ({ navigation }) => ({
//     tabBarIcon: ({ focused, tintColor }) => {
//       const { routeName } = navigation.state;
//       return <Image style={{
//         width: 24,
//         height: 24,
//       }} source={IC_MASK}/>;
//     },
//   }),
//   tabBarLabel: {
//   },
//   tabBarOptions: {
//     activeTintColor: 'tomato',
//     inactiveTintColor: 'gray',
//     // showLabel: false,
//   },
// }

const MessageScreen = createAppContainer(MessageStack);

export default MessageScreen;

// https://medium.com/@dooboolab/types-of-navigation-in-react-navigation-v2-bce6d24d94ec
// https://reactnavigation.org/docs/en/material-bottom-tab-navigator.html