import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, Alert } from 'react-native'
import firebase from 'react-native-firebase';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import {
  Container,Header,Title,Content,Button, Toast,
  Icon,Left,Right,Body,Text,ListItem,List, Separator, Footer, FooterTab
} from "native-base";

import { connect } from 'react-redux';
import { sendMessage, loadConversationForContactId, loadConversationForContactIdAffirmation } from '../../actions/chat/actions';
import { addFavouriteProvider, favouritesSuccess } from '../../actions/favourites/actions'
import { getAllReviews } from '../../actions/requestService/actions'
const { width, height } = Dimensions.get("window");

class MessagingScreen extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('conversations');
    this.unsubscribe = null;
    this.state = {
      messages: [],
      receiver: null,
      contactId: '',
      // isProvider: false
    };
  }

  componentWillMount() {
    // console.log('MessagingScreen-componentWillMount');
    const { navigation } = this.props;
    const receiver = navigation.getParam('user', 'NO-ID');
    this.setState({ receiver: receiver, contactId: receiver.senderId });
    console.log('MessagingScreen-componentWillMount-receiver', receiver);
    // Load Conversation between 2 users
    this.props.loadConversationForContactId(receiver.senderId);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  componentDidMount() {
    
    const { navigation } = this.props;
    const receiver = navigation.getParam('user', 'NO-ID');
    // console.log('receiver', receiver);
    let currentId = firebase.auth().currentUser.uid;
    let conversationId = '';
    if (currentId < receiver.senderId) {
      conversationId = currentId + '_' + receiver.senderId;
    } else {
      conversationId = receiver.senderId + '_' + currentId;
    }
    console.log('MessagingScreen-componentDidMount-conversationId',conversationId);
    this.unsubscribe = this.ref.doc(conversationId).onSnapshot(this.onConversationUpdate);
  }

  onConversationUpdate = (querySnapshot) => { 
    const data = querySnapshot.data();
    // console.log('onConversationUpdate-contactId',this.state);
    const { navigation } = this.props;
    const receiver = navigation.getParam('user', 'NO-ID');
    this.props.loadConversationForContactId(receiver.senderId);
  }

  componentDidUpdate(prevProps) {
    console.log('MessagingScreen-componentDidUpdate');
    const { navigation, error, sessionLogged, messages, messageSentSuccess, messageLoadedSuccess, favouritesError,  favouritesAddedSuccess } = this.props;
    const receiver = navigation.getParam('user', 'NO-ID');
    // console.log('componentDidUpdate-messages',messages);
    if (!prevProps.error && error) {
      Alert.alert('Error', error);
    } 
    if (!prevProps.favouritesError && favouritesError) {
      Toast.show({
        text: favouritesError,
        duration: 3000,
        buttonText: 'Close',
        // type: 'warning',
        position: 'top'
      })
      // Alert.alert('Error', favouritesError);
    } 

    if (!sessionLogged) {
      this.props.navigation.navigate('signin');
    }
    if (messageSentSuccess) {
      // this.props.loadConversationForContactId(contactId);
    }
    if (messageLoadedSuccess) {
      this.setState({receiver: receiver ,contactId: receiver.senderId, messages: messages});
      // console.log('componentDidUpdate-messageLoadedSuccess-messages', messages);
      // Reset messageLoadedSuccess = false after setState(), so it will do this again. And also reset unseenCount 
      this.props.loadConversationForContactIdAffirmation(receiver.senderId);
    } else {
      // console.log('componentDidUpdate-messageLoadedSuccess(FALSE)-messages', this.state.messages);
    }
    if (favouritesAddedSuccess && sessionLogged) {
      // console.log(favouritesSuccess)
      this.props.favouritesSuccess()
      Toast.show({
        text: 'Provider is added to your favourite list.',
        duration: 3000,
        buttonText: 'Close',
        // type: 'warning',
        position: 'top'
      })
    }
  }

  renderCustomView = (props) => {
    if (props.currentMessage.location) {
      return (
        <View style={props.containerStyle}>
          <MapView
              provider={PROVIDER_GOOGLE}
              style={[styles.mapView]}
              region={{
                latitude: props.currentMessage.location.latitude,
                longitude: props.currentMessage.location.longitude,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <MapView.Marker
                coordinate={{
                latitude: props.currentMessage.location.latitude,
                longitude: props.currentMessage.location.longitude
                }}
              />
            </MapView>
        </View>
      );
    }
    return null
  }

  addProviderToFavourite = () => {
    const { navigation } = this.props;
    const receiver = navigation.getParam('user', 'NO-ID');
    // console.log('MSB-addProviderToFavourite', receiver)
    this.props.addFavouriteProvider(receiver.senderId)
  }

  showAllReviews = () => {
    const { user } = this.props;
    const { navigation } = this.props;
    const userReviewed = navigation.getParam('user', 'NO-ID');
    if (user.providerMode) { // Get Customer
      this.props.getAllReviews(userReviewed.uid, false)  // true: this is a provider, false: this is customer
      this.props.navigation.navigate('seeallreviews', {from: 'MSBOX', userReviewed: userReviewed, asProvider: false});
    } else { // Get Provider
      this.props.getAllReviews(userReviewed.uid, false)  // true: this is a provider, false: this is customer
      this.props.navigation.navigate('seeallreviews', {from: 'MSBOX', userReviewed: userReviewed, asProvider: true});
    }
  }

  onSend(messages = []) {
    const { navigation } = this.props;
    const receiver = navigation.getParam('user', 'NO-ID');
    
    this.setState((previousState, prosp) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.props.sendMessage(messages[0],receiver.senderId);
  }

  renderBubble(props) { 
    return ( 
    <Bubble {...props} 
      wrapperStyle={{
        right: {
          backgroundColor: '#5bbf9a'
        }
      }} />
    )
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}
              >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.state.receiver.name}</Title>
          </Body>
        </Header>

        <View style={styles.container}>
          <GiftedChat
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            renderCustomView={this.renderCustomView} 
            renderBubble={this.renderBubble}
            user={{
              _id: this.props.user.uid,
              name: this.props.user.displayName
            }}
            parsePatterns={linkStyle => [
            {
                pattern: /#(\w+)/,
                style: { ...linkStyle, color: 'lightgreen' },
                onPress: props => alert(`press on ${props}`),
              },
            ]}
          />
        </View>
        <Footer>
          <FooterTab style={{backgroundColor: '#ebffe5'}}>
            <Button vertical onPress={() => this.addProviderToFavourite()}>
              <Icon style={{ color: "green", fontSize: 25}} name="ios-heart-half" />
              <Text style={{ color: "green"}}>Add to Favourites</Text>
            </Button>
            <Button vertical onPress={() => this.showAllReviews()}>
              <Icon style={{ color: "green", fontSize: 25}} name="ios-star-half" />
              <Text style={{ color: "green"}}>See all review</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
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
  mb15: {
    marginBottom: 15
  },
  contentContainer: {
    paddingVertical: 10
  },
  items: {
		flex: 1,
		width: width - 20,
  },
  avatar: {
    width: 60,
    height: 60,
  },
  textItem: {
    paddingRight: 30,
    paddingLeft: 30,
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#043a00'
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
  itemHeader: {
    backgroundColor:'#757575',
  },
  headerText: {
    // height: 55,
    // paddingTop: 10,
    // paddingRight: 30,
    // paddingLeft: 30,
    fontSize: 16,
    // fontWeight: '400',
    color: '#043a00',
    // borderColor: '#043a00',
    // borderBottomWidth: 1
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF"
//   },
//   mapView: {
//     width: 150,
//     height: 100,
//     borderRadius: 13,
//     margin: 3,
//   },
// });


const mapStateToProps = ({ sessionReducer: { sessionUser, sessionLogged }, 
                          chatReducer: { loading , error, messages, messageSentSuccess, messageLoadedSuccess },
                          favouritesReducer: { favouritesError, favouritesSuccess, favouritesAddedSuccess }}) => ({
  messages: messages,
  loading: loading,
  error: error,
  messageLoadedSuccess: messageLoadedSuccess,
  messageSentSuccess: messageSentSuccess,
  user: sessionUser,
  sessionLogged: sessionLogged,

  favouritesError: favouritesError, 
  favouritesSuccess: favouritesSuccess, 
  favouritesAddedSuccess: favouritesAddedSuccess

});

const mapDispatchToProps = {
  sendMessage: sendMessage,
  loadConversationForContactId: loadConversationForContactId,
  loadConversationForContactIdAffirmation: loadConversationForContactIdAffirmation,
  addFavouriteProvider: addFavouriteProvider,
  favouritesSuccess: favouritesSuccess,
  getAllReviews: getAllReviews
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessagingScreen);
