import React, { Component } from "react";
import { Platform, StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, View, FlatList, TouchableOpacity  } from "react-native";
import {
  Container,Header,Title,Content,Button, List, ListItem, Separator, 
  Icon,Left,Right,Body,Text, Thumbnail, SwipeRow
} from "native-base";
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Rating } from 'react-native-ratings';
import { StackActions, NavigationActions } from 'react-navigation'

import Loader from '../nav/Loader';

import { authSignOut } from '../../actions/auth/actions';
import { favouritesSuccess, addFavouriteProvider, removeFavouriteProvider, loadFavouriteProvider } from '../../actions/favourites/actions';

// import styles from "./stylesHome";

const { width, height } = Dimensions.get("window");

const resetAction = StackActions.reset({
  index: 0,
  // actions: [NavigationActions.navigate({ routeName: 'DrawerNavigator' })],
  actions: [NavigationActions.navigate({ routeName: 'signin' })],
})

class FavouriteProviderScreen extends Component {

	componentDidMount() {
    const { sessionLogged } = this.props
    if (sessionLogged) {
      this.props.loadFavouriteProvider()
    } else {
      this.props.navigation.navigate('signin')
    }
    
	}

  componentDidUpdate(prevProps) {
    const { user, logged, favouritesLoading, favouritesLoadedSuccess, favouritesError, favouritesRemovedSuccess, favouritesSuccess, favouritesProviderList } = this.props;
    if (!prevProps.favouritesError && favouritesError) {
      Alert.alert('Error', favouritesError);
    } else {
      // console.log('favouritesProviderList',favouritesProviderList)
      // console.log('user',user)
      if (favouritesRemovedSuccess) {
        // console.log('favouritesRemovedSuccess',favouritesRemovedSuccess)
        this.props.loadFavouriteProvider()
      } else {
        if (favouritesLoadedSuccess) {
          // console.log('favouritesLoadedSuccess',favouritesLoadedSuccess)
          this.props.favouritesSuccess()
        }
      }

    }
  }

  
  logout = () => {
    this.props.authSignOut()
    this.props.navigation.dispatch(resetAction)
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

  providerOnPress = (item) => {
    // console.log('item',item)
    let user = {...item, senderId: item.uid, name: item.firstName + ' ' + item.lastName}
    this.props.navigation.navigate('messaging',{user: user});
  }

  removeFavouriteProvider = (item) => {
    // console.log('item',item)
    Alert.alert(
      '',
      'Do you want to remove ' + item.firstName + ' ' + item.lastName + ' from favourite list ?',
      [
        {text: 'NO', onPress: () => {}, style: 'cancel'},
        {text: 'YES', onPress: () => this.props.removeFavouriteProvider(item.uid)}
      ],
      { cancelable: false, onDismiss: () => {} }
    );

  }

  _renderItem = (item) => {
    return (
      <View>
      <ListItem thumbnail onPress={() => {this.providerOnPress(item)}}>
        <Left>
          {item.photoURL ? 
            <Thumbnail source={{uri: item.photoURL}}/>
          :
          <Button style={styles.displayName} onPress={() => {this.providerOnPress(item)}}>
              <Text style={{color:'black', fontSize: 16}}>{item.displayName}</Text>
          </Button>
          }
                  
        </Left>
        <Body>
          <Text >{item.firstName + ' ' + item.lastName}</Text>
          <Text numberOfLines={2} note>{item.aboutMe}</Text>
          <View style={{flexDirection: 'row', marginTop: 5}}>
          <Rating 
            style={{alignSelf:'flex-start'}}
            readonly
            ratingCount={5}
            reviews={["Terrible", "Bad", "OK", "Good", "Great"]}
            startingValue={item.ratingAsProvider}
            imageSize={20}
          />
          {item.ratingCountAsProvider > 0 
          ? <Text>  ( {item.ratingCountAsProvider} reviews)</Text>
          : null
          }
          </View>

        </Body>
        <Right>
          <Button style={styles.buttonRemove} onPress={() => this.removeFavouriteProvider(item)} >
            <Icon active type='FontAwesome' name='trash' />
            {/* <Icon active type='FontAwesome' name='trash' color='#d33f13' fontSize='30'/> */}
          </Button>
        </Right>
      </ListItem>

        
      </View>
    )
    
  }
//
  render() {
    return (
      <SafeAreaView style={styles.container}>
      <Container>
      	<Loader loading={this.props.favouritesLoading} />
        {/* <Header style={styles.headerBackgroundColor}>
          <Left>
						<Button
              transparent
              onPress={() => this.props.navigation.navigate('home')} >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Favourite Providers</Title>
          </Body>
          <Right>
          </Right>
        </Header> */}
        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.toggleDrawer()} >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>Favourite Providers</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.buttonSignOut()}>
            <Icon name="ios-log-out" />
            </Button>
          </Right>
        </Header>        
        {this.props.sessionLogged
        ?
				<Content padder >
          <View style={{}}>
						{this.props.favouritesProviderList 
						?
						<FlatList
                data={this.props.favouritesProviderList}
                scrollEnabled={false}
                keyExtractor={(item, index) => item.uid} 
								extraData={this.props}
                renderItem={({item, index}) => this._renderItem(item)}
              />
						: null
						}
          </View>    
				</Content>

        : null
        }
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
  headerBackgroundColor: {
    backgroundColor: '#02420b'
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
  buttonRemove: {
    height: 50,
    width: 50,
    bottom: 8,
    // borderWidth:1,
    // borderColor:'#2E5103',
    borderRadius: 5,
    backgroundColor:'#f43d00',
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
	contentHeader: {
    paddingTop: 10,
    paddingLeft: 10,
    fontSize: 16,
    color: "#22721d",
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#EDEDED'
  },
  contentDetail: {
    paddingTop: 10,
    paddingLeft: 10,
    // fontSize: 16,
    // color: "#22721d",
    // fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#EDEDED'
  },

});

const mapStateToProps = ({  favouritesReducer: { favouritesLoading, favouritesError, favouritesSuccess, 
                                                  favouritesRemovedSuccess, favouritesProviderList, favouritesLoadedSuccess },
                            sessionReducer: { sessionUser, sessionLogged } }) => ({
  user: sessionUser,
  sessionLogged: sessionLogged,              

  favouritesLoading: favouritesLoading, 
  favouritesError: favouritesError, 
  favouritesSuccess: favouritesSuccess, 
  favouritesRemovedSuccess: favouritesRemovedSuccess,
  favouritesProviderList: favouritesProviderList,
  favouritesLoadedSuccess: favouritesLoadedSuccess
  
});

const mapDispatchToProps = {
  authSignOut: authSignOut,
  favouritesSuccess: favouritesSuccess,
  addFavouriteProvider: addFavouriteProvider,
  removeFavouriteProvider: removeFavouriteProvider,
  loadFavouriteProvider: loadFavouriteProvider
};

export default withNavigation(connect(
  mapStateToProps,
  mapDispatchToProps
)(FavouriteProviderScreen));
