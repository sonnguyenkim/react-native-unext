import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions,View, Image } from "react-native"
import {
  Container,Header,Title,Content,Button,
  Icon,Left,Right,Body,Text,ListItem,List, Thumbnail, Badge
} from "native-base"
import { connect } from 'react-redux'
import moment from "moment"
import { StackActions, NavigationActions, NavigationEvents } from 'react-navigation'
// import {  } from 'react-native-firebase'

import { addFavouriteProvider, favouritesSuccess } from '../../actions/favourites/actions'
import { getAllReviews } from '../../actions/requestService/actions'
import { authSignOut } from '../../actions/auth/actions'

// import { logoutUser } from '../../actions/session/actions';
// import { getUserList } from '../../actions/service/actions';


import { getConversationList } from '../../actions/chat/actions';


import Loader from '../nav/Loader';

// import styles from "./stylesUserList";


const resetAction = StackActions.reset({
  index: 0,
  // actions: [NavigationActions.navigate({ routeName: 'DrawerNavigator' })],
  actions: [NavigationActions.navigate({ routeName: 'signin' })],
})

class MessageBoxScreen extends Component {
  constructor(props) {
    super(props);
    // this.ref = firebase.firestore().collection('conversations');
    // this.unsubscribe = null;
  }

  componentWillMount(){ 
    // this.props.favouritesSuccess()
    // this.props.getConversationList();
    // console.log('componentWillMount');
  }
  
  componentWillUnmount() {
    // console.log('componentWillUnmount');
    // this.unsubscribe();
  }

  componentDidMount() {
    const { sessionLogged } = this.props
    if (sessionLogged) {
      this.props.getConversationList();
      this.props.favouritesSuccess()  
    } else {
      this.props.navigation.navigate('signin')
    }
    
  }

  componentDidUpdate(prevProps) {
    const { error, sessionLogged, favouritesSuccess, favouritesError, favouritesAddedSuccess, conversationList } = this.props;
    console.log('MessageBoxScreen-componentDidMount-conversationList',conversationList);
    if (!prevProps.error && error) Alert.alert('Error', error);
    // if (!prevProps.favouritesError && favouritesError) Alert.alert('Error', favouritesError);
    if (!sessionLogged) {
      this.props.navigation.navigate('signin');
    }
    // if (favouritesAddedSuccess && sessionLogged) {
    //   // console.log(favouritesSuccess)
    //   this.props.favouritesSuccess()
    //   Alert.alert('','Provider is added to your favourite list.')
    // }
  }

  logout = () => {
    this.props.authSignOut()
    this.props.navigation.dispatch(resetAction)
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

  itemOnPress = (user) => {
    // console.log('MessageBoxScreen-itemOnPress-user', user)
    this.props.navigation.navigate('messaging',{user: user});
  }

  // showAllReviews = (userReviewed) => {
  //   const { user } = this.props;
  //   if (user.providerMode) { // Get Customer
  //     this.props.getAllReviews(userReviewed.uid, false)  // true: this is a provider, false: this is customer
  //     this.props.navigation.navigate('seeallreviews', {from: 'MSBOX', userReviewed: userReviewed, asProvider: false});
  //   } else { // Get Provider
  //     this.props.getAllReviews(userReviewed.uid, false)  // true: this is a provider, false: this is customer
  //     this.props.navigation.navigate('seeallreviews', {from: 'MSBOX', userReviewed: userReviewed, asProvider: true});
  //   }
  // }

  // addProviderToFavourite = (provider) => {
  //   // console.log('MSB-addProviderToFavourite', provider)
  //   this.props.addFavouriteProvider(provider.uid)
  //   // Alert.alert('',provider.name + ' is added to your favourite list.')
  // }

  // getConversationList_ = () => {
  //   console.log('NavigationEvents-onWillFocus')
  // }

  render() {
    return (
      <Container style={styles.container}>
        <NavigationEvents
          onWillFocus={() => {
            this.props.getConversationList();
          }}
        /> 
        <Loader loading={this.props.loading} />

        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.toggleDrawer()} >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>Messages Box</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.buttonSignOut()}>
            <Icon name="ios-log-out" />
            </Button>
          </Right>
        </Header>
        {this.props.sessionLogged
        ?
        <Content>
          <List>
            {this.props.conversationList ? 
              this.props.conversationList.map((user, index) => (
                <ListItem thumbnail style={{paddingTop: 10, borderWidth: 0}} key={user.senderId} onPress={() => {this.itemOnPress(user)}}>
                  <Left>
                    {user.avatar ? 
                      <Thumbnail source={{uri: user.avatar}}/>
                    :
                    <Button style={styles.displayName} onPress={() => {this.itemOnPress(user)}}>
                       <Text style={{color:'black', fontSize: 14}}>{user.displayName}</Text>
                    </Button>
                    }
                  </Left>
                  <Body>
                    <Text >{user.name}</Text>
                    {user.lastMessage.text 
                    ?
                    <View>
                      <Text numberOfLines={1} note>{user.lastMessage.text}</Text>
                      {/* <Text numberOfLines={1} note>{user.lastMessageTime}</Text> */}
                      {/* <Text numberOfLines={1} note>{moment.unix(user.lastMessage.createdAt._seconds).format('MMMM Do YYYY, hh:mm a')}</Text> */}
                      <Text numberOfLines={1} note>{moment.unix(user.lastMessage.createdAt._seconds).fromNow()}</Text>
                    </View>
                    : null
                    }
                  </Body>
                  <Right>
                    <View style={{flexDirection: 'column', borderWidth: 0}}>
                      {/* <Button
                        transparent
                        onPress={() => this.showAllReviews(user)} >
                        <Icon style={{ color: "green", fontSize: 30}} name="md-more" />
                      </Button> */}
                        
                      {
                        (user.unseenCount > 0) 
                        ? 
                        <Button transparent danger>
                          <Icon name="ios-notifications" />
                        </Button>
                        : null 
                      }
                    </View>
                  </Right>
                </ListItem>
              )) :
              null
            }
          </List>
        </Content>

        : null
        }

      </Container>
    );
  }
}

// (user.unseenCount > 0) 
// ? <Badge danger><Text>{user.unseenCount}</Text></Badge>
// : null 

{/* <Button transparent >
  <Icon style={{ color: "red", fontSize: 30}} name="ios-warning" />
</Button> */}
// (user.unseenCount > 0) ? <Badge danger><Text>{user.unseenCount}</Text></Badge>
// 

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF"
  },
  headerBackgroundColor: {
    backgroundColor: '#02420b'
  },
  mb10: {
    marginBottom: 10
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
});


const mapStateToProps = ({ sessionReducer: { sessionUser, sessionLogged }, 
                            chatReducer: { loading , error, conversationList },
                            authReducer: { authLogged },
                            favouritesReducer: { favouritesError, favouritesSuccess, favouritesAddedSuccess }
                          }) => ({
  user: sessionUser,
  sessionLogged: sessionLogged,
  authLogged: authLogged,

  conversationList: conversationList,
  loading: loading,
  error: error,

  favouritesError: favouritesError, 
  favouritesSuccess: favouritesSuccess,
  favouritesAddedSuccess: favouritesAddedSuccess
});

const mapDispatchToProps = {
  authSignOut: authSignOut,
  getConversationList: getConversationList,
  getAllReviews: getAllReviews,
  addFavouriteProvider: addFavouriteProvider,
  favouritesSuccess: favouritesSuccess
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageBoxScreen);

