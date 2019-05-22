import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, FlatList, View } from "react-native";
import {
  Container,Header,Title,Content,Button, Textarea,
  Icon,Left,Right,Body,Text,ListItem,List, Separator
} from "native-base";
import { connect } from 'react-redux';
import Loader from '../nav/Loader';

import { sendMessage, messageSentRequestConfirm } from '../../actions/chat/actions';
import { sendRequestService, requestServiceDone } from '../../actions/requestService/actions';

const { width, height } = Dimensions.get("window");

const maxWord = 100;
const maxCharacter = maxWord * 10;

class SendRequestScreen extends Component {
  constructor() {
		super();
		this.state = {
      message: '',
      wordsRemain: maxWord,
      isChanged: false,
      providerName: ''
    }
  }

  componentDidMount() {
    const { providerId, name } = this.props.navigation.state.params;
    // const { user } = this.props;

    this.setState({providerName: name});
    console.log('SendRequestScreen-componentDidMount')
  }

  componentDidUpdate(prevProps) {
    console.log('SendRequestScreen-componentDidMount')
    const { error, sessionLogged, user, messageSentSuccess } = this.props;
    if (!prevProps.error && error) Alert.alert('Error', error);
    if (!sessionLogged) {
      this.props.navigation.navigate('signin');
    }
    if (messageSentSuccess) {
      this.props.messageSentRequestConfirm();
      this.setState({ message: null, isChanged: false, wordsRemain: maxWord });
      // Go back 
      Alert.alert(
        '',
        'Your request is sent to provider successfully.',
        [
          {text: 'OK', onPress: () => this.props.navigation.navigate('home')}
        ],
      );
    }
  }

  handleOnChangeText = (message) => {
    let wordsCount = message.split(" ").length;
    let wordsRemain = maxWord - wordsCount;
    if (wordsRemain >= 0) {
      this.setState({ message: message, isChanged: true, wordsRemain: wordsRemain });
    }
  }

  sendRequest = () => {
    const { providerId } = this.props.navigation.state.params;
    const { user } = this.props;
    const { message } = this.state;
    const messageRecord = {
      text: message,
      createdAt: new Date()
    }
    this.props.sendRequestService(messageRecord,providerId);
    this.props.sendMessage(messageRecord,providerId);    
  }

  render() {
    return (
      <Container style={styles.container}>
        <Loader loading={this.props.loading} />
        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('serviceProviderSearchScreen')} >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.state.providerName}</Title>
          </Body>
        </Header>

        <Content padder>
          <View>
            {/* <Separator bordered>
            <Text style={styles.headerText}>YOUR MESSAGE</Text>
            </Separator> */}
            <Textarea rowSpan={10} bordered placeholder="Your message" 
              value={this.state.message} 
              // editable={this.state.wordsRemain < 2 ? false : true}
              // defaultValue={this.state.message}
              onChangeText={(message) => this.handleOnChangeText(message)}
              maxLength= {maxCharacter}
            />

          </View>  
          <Text note>You have {this.state.wordsRemain} words remain.</Text>
          <Button disabled={!this.state.isChanged} block success 
                  style={{...styles.mb15,backgroundColor: this.state.isChanged ? '#507C08' : '#767a78'}} 
                  onPress={this.sendRequest} >
            <Text>Send Request</Text>
          </Button>          

        </Content>
      </Container>
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
  mb15: {
    marginBottom: 15,
    marginTop: 15,
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
});

const mapStateToProps = ({ sessionReducer: { sessionRestoring, sessionUser, sessionLogged }, 
                            settingsReducer: { serviceLocation, serviceArea, serviceProvide},
                            chatReducer: { loading , error, messageSentSuccess, messageLoadedSuccess }}) => ({
  sessionRestoring: sessionRestoring,
  user: sessionUser,
  sessionLogged: sessionLogged,

  loading: loading,
  error: error,

  serviceLocation: serviceLocation, 
  serviceArea: serviceArea, 
  serviceProvide: serviceProvide,
  messageSentSuccess: messageSentSuccess
});

const mapDispatchToProps = {

  sendMessage: sendMessage,
  messageSentRequestConfirm: messageSentRequestConfirm,
  sendRequestService: sendRequestService, 
  requestServiceDone: requestServiceDone
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendRequestScreen);

