import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions,View, Image } from "react-native";
import {
  Container,Header,Title,Content,Button,
  Icon,Left,Right,Body,Text,ListItem,List, Thumbnail
} from "native-base";
import { NavigationEvents } from "react-navigation";
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/session/actions';
import { loadUserList } from '../../actions/service/actions';
import Loader from '../nav/Loader';

import styles from "./stylesUserList";


class MessageUserListScreen extends Component {

  componentWillMount(){ 
  
  }

  componentDidMount() {
    // false: meaning do not include current user
    this.props.loadUserList(false);
  }

  componentDidUpdate(prevProps) {
    const { error, logged, userList} = this.props;
    if (!prevProps.error && error) Alert.alert('Error', error);
    if (!logged) {
      this.props.navigation.navigate('signin');
    }
    if (userList) {
      // console.log('Test-DidMount-userList', userList);
    }
  }

  itemOnPress = (key) => {
    // Alert.alert('Meesage', key);
    this.props.navigation.navigate('messaging',{id: key});
  }

  render() {
    return (
      <Container style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => {
            {/* console.log("will focus", payload); */}
            this.props.loadUserList(false);
          }}
        />
        <Loader loading={this.props.loading} />
        <Content>
          <List>
            {this.props.userList ? 
              this.props.userList.map((user, index) => (
                <ListItem key={user.senderId} onPress={() => {this.itemOnPress(user.senderId)}}>
                  <Thumbnail style={styles.avatar} source={{uri: user.avatar}}/>
                  <Text style={styles.textItem}>{user.name}</Text>
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
  logout: logoutUser,
  loadUserList: loadUserList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageUserListScreen);

