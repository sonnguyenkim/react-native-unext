import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, FlatList, Dimensions, View, TouchableOpacity } from "react-native";
import {
  Container,Header,Title,Content,Button, Separator, Textarea, 
  Icon,Left,Right,Body,Text,ListItem,List, Item, Input, Thumbnail, Switch
} from "native-base";
import { withNavigation, StackActions, NavigationActions  } from 'react-navigation';

import { Rating } from 'react-native-ratings';
import { connect } from 'react-redux';

import Loader from '../nav/Loader';
import { authSignOut } from '../../actions/auth/actions'
import { getUserListToBeRated, updateReviewAndRating, requestServiceDone } from '../../actions/requestService/actions';

const resetAction = StackActions.reset({
  index: 0,
  // actions: [NavigationActions.navigate({ routeName: 'DrawerNavigator' })],
  actions: [NavigationActions.navigate({ routeName: 'signin' })],
})

class UserRatingListScreen extends Component {

  logout = () => {
    // console.log('UserList-signOut')
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
    );
  };
  
  onPressUserRating = (item) => {
    this.props.navigation.navigate('userrating', {ratingItem: item})
  }

  componentDidMount() {
    const {sessionUser} = this.props;
    // this.setState({userInfo: user});
    console.log('componentDidMount-user',sessionUser)
    // if (user)
    this.props.getUserListToBeRated(sessionUser)
  };

  componentDidUpdate(prevProps) {
    const { sessionError, sessionLogged, requestServiceError, requestServiceLoading, requestServiceSuccess, userRatingList } = this.props;
    console.log('UserRatingListScreen-getUserListToBeRated',userRatingList)
   
    if (!prevProps.sessionError && sessionError) Alert.alert('Error', sessionError);
    if (!prevProps.requestServiceError && requestServiceError) {
      // console.log('componentDidUpdate-requestServiceError',requestServiceError)
      Alert.alert('Error', requestServiceError);
    }
    if (!sessionLogged) {
      this.props.navigation.navigate('signin');
    }

    // if (requestServiceSuccess) {
    //   console.log('getUserListToBeRated',userRatingList)
    // }
    console.log('UserRatingListScreen-getUserListToBeRated',userRatingList)

  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Loader loading={this.props.requestServiceLoading} />

        {/* {this.props.sessionUser
        ?
        : null
        } */}
        <Container style={styles.container}>
          <Header style={styles.headerBackgroundColor}>
            <Left>
              <Button
                transparent
                onPress={() => this.props.navigation.toggleDrawer()}
                 >
                <Icon name="ios-menu" />
              </Button>
            </Left>
            <Body>
              {this.props.sessionUser && this.props.sessionUser.providerMode
              ? <Title>Your Customers</Title>
              : <Title>Your Providers</Title>
              }
              <Text note numberOfLines={1}>waiting for your review</Text>
            </Body>
            <Right>
              <Button transparent onPress={() => this.buttonSignOut()}>
              <Icon name="ios-log-out" />
              </Button>
            </Right>
          </Header>
          <ScrollView style={styles.scrollview} keyboardShouldPersistTaps='alway' keyboardDismissMode='on-drag'>
            <Content padder style={styles.formContainer}>

            <FlatList
              data={this.props.userRatingList}
              keyExtractor={(item, index) => item.id} 
              renderItem={({item, index}) => 
                <ListItem thumbnail key={item.id} onPress={() => {this.onPressUserRating(item)}}>
                  <Left>
                  {item.userInfo.photoURL ? 
                    <Thumbnail source={{uri: item.userInfo.photoURL}}/>
                    :
                    <Button style={styles.displayName}>
                       <Text style={{color:'black', fontSize: 16}}>{item.userInfo.displayName}</Text>
                    </Button>
                    }                    
                  </Left>
                  <Body>
                    <Text>{item.userInfo.name}</Text>
                    <Text note numberOfLines={1}>{item.userInfo.email}</Text>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Rating 
                      style={{alignSelf:'flex-start'}}
                      readonly
                      ratingCount={5}
                      reviews={["Terrible", "Bad", "OK", "Good", "Great"]}
                      startingValue={item.userInfo.rating}
                      imageSize={20}
                    />
                    {item.userInfo.ratingCount > 0 
                    ? <Text>  ( {item.userInfo.ratingCount} reviews)</Text>
                    : null
                    }
                    </View>
                  </Body>
                  <Right>
                      
                  </Right>
                </ListItem>
              }
            />
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
});


const mapStateToProps = ({ 
  sessionReducer: { sessionRestoring, sessionLoading, sessionUser, sessionError, sessionLogged }, 
  requestServiceReducer: { requestServiceLoading, requestServiceError, requestServiceSuccess, userRatingList }}) => ({

    sessionRestoring: sessionRestoring,
    sessionLoading: sessionLoading,
    sessionUser: sessionUser,
    sessionError: sessionError,
    sessionLogged: sessionLogged,
  
    requestServiceLoading: requestServiceLoading,
    requestServiceError: requestServiceError,
    requestServiceSuccess: requestServiceSuccess,
    userRatingList: userRatingList,
});

const mapDispatchToProps = {
  authSignOut: authSignOut,
  
  getUserListToBeRated: getUserListToBeRated, 
  updateReviewAndRating: updateReviewAndRating, 
  requestServiceDone: requestServiceDone
};

export default withNavigation(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRatingListScreen));


