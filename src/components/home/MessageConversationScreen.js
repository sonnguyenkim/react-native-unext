import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions,View, Image } from "react-native";
import {
  Container,Header,Title,Content,Button,
  Icon,Left,Right,Body,Text,ListItem,List, Thumbnail, Badge
} from "native-base";
import { NavigationEvents } from "react-navigation";
import { connect } from 'react-redux';

import { authSignOut } from '../../actions/auth/actions';
import { getConversationList } from '../../actions/chat/actions';

import Loader from '../nav/Loader';

import styles from "./stylesUserList";


class MessageConversationScreen extends Component {
  logout = () => {
    this.props.authSignOut();
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
  componentWillMount(){ 
    // false: meaning do not include current user
    // this.props.getConversationList();
  }

  componentDidMount() {
    // // false: meaning do not include current user
    this.props.getConversationList();
  }

  componentDidUpdate(prevProps) {
    const { error, logged, conversationList } = this.props;
    if (!prevProps.error && error) Alert.alert('Error', error);
    if (!logged) {
      this.props.navigation.navigate('signin');
    }
    if (conversationList) {
      // console.log('Test-DidMount-conversationList', conversationList);
    }
  }

  itemOnPress = (key) => {
    // Alert.alert('Meesage', key);
    this.props.navigation.navigate('messaging',{contactId: key});
  }

  render() {
    return (
      <Container style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            {/* console.log("will focus", payload); */}
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
        <Content>
          <List>
            {this.props.conversationList ? 
              this.props.conversationList.map((user, index) => (
                <ListItem thumbnail style={{paddingTop: 10}} key={user.senderId} onPress={() => {this.itemOnPress(user.senderId)}}>
                  <Left>
                    {user.avatar ? 
                      <Thumbnail source={{uri: user.avatar}}/>
                    :
                    <Button style={styles.displayName} onPress={() => {this.itemOnPress(user.senderId)}}>
                       <Text style={{color:'black', fontSize: 16}}>{user.displayName}</Text>
                    </Button>
                    }
                  </Left>
                  <Body>
                    <Text >{user.name}</Text>
                    <Text numberOfLines={1} note></Text>
                  </Body>
                  <Right>
                    {
                      (user.unseenCount > 0) ? <Badge danger><Text>{user.unseenCount}</Text></Badge>
                      : null
                    }
                    
                  </Right>
                </ListItem>
              )) :
              null
            }
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = ({ sessionReducer: { user, logged }, chatReducer: { loading , error, conversationList }}) => ({
  conversationList: conversationList,
  loading: loading,
  error: error,
  user: user,
  logged: logged
});

const mapDispatchToProps = {
  authSignOut: authSignOut,
  getConversationList: getConversationList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageConversationScreen);

