import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions,View, Image } from "react-native";
import {
  Container,Header,Title,Content,Button,
  Icon,Left,Right,Body,Text,ListItem,List, Thumbnail
} from "native-base";
import { NavigationEvents } from "react-navigation";
import { connect } from 'react-redux';
import { authSignOut } from '../../actions/auth/actions';
import { loadUserList } from '../../actions/service/actions';
import Loader from '../nav/Loader';

import styles from "./stylesUserList";


class UserListScreen extends Component {
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
    this.props.loadUserList(true);
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    const { error, logged, userList} = this.props;
    if (!prevProps.error && error) Alert.alert('Error', error);
    if (!logged) {
      this.props.navigation.navigate('signin');
    }
    if (userList) {
      
    }
  }

  render() {
    return (
      <Container style={styles.container}>
      <NavigationEvents
          onWillFocus={payload => {
            this.props.loadUserList(true);
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
            <Title>Contact List</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.buttonSignOut()}>
            <Icon name="ios-log-out" />
            </Button>
          </Right>
        </Header>

        <Content>
          <List>
            {this.props.userList ? 
              this.props.userList.map((user, index) => (
                <ListItem thumbnail style={{paddingTop: 10}} key={user.senderId}>
                  <Left>
                    {user.avatar ? 
                      <Thumbnail source={{uri: user.avatar}}/>
                    :
                    <Button style={styles.displayName}>
                       <Text style={{color:'black', fontSize: 16}}>{user.displayName}</Text>
                    </Button>
                    }
                  </Left>
                  <Body>
                    <Text >{user.name}</Text>
                    <Text numberOfLines={1} note></Text>
                  </Body>
                  <Right>
                    {/* <Badge warning><Text>0</Text></Badge> */}
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

const mapStateToProps = ({ sessionReducer: { user, logged }, serviceReducer: { loading , error, userList }}) => ({
  userList: userList,
  loading: loading,
  error: error,
  user: user,
  logged: logged
});

const mapDispatchToProps = {
  authSignOut: authSignOut,
  loadUserList: loadUserList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserListScreen);

