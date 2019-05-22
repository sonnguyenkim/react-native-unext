import React, { Component } from "react";
import { Image, FlatList } from "react-native";
import { connect } from 'react-redux';
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge, 
  View, 
  Button
} from "native-base";

import { getConversationList } from '../../actions/chat/actions';
import { getUserListToBeRated } from '../../actions/requestService/actions';
import { loadFavouriteProvider } from '../../actions/favourites/actions';

import { sessionRestore } from '../../actions/session/actions'
import { sidebarRestore, sidebarDone } from '../../actions/sidebar/actions'
import { authSignOut } from '../../actions/auth/actions';
import { settingLoadUserInfo } from '../../actions/settings/actions';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from "./styleSideBar";


const datas = [
  {
    name: "Home",
    route: "home",
    icon: "ios-home",
    bg: "#C5F442"
  },
  {
    name: "Message Box",
    route: "message",
    icon: "ios-text",
    bg: "#DA4437"
  },
  {
    name: "Favourites",
    route: "favourites",
    icon: "ios-heart-half",
    bg: "#DA4437"
  },
  {
    name: "Review & Rating",
    route: "ratinglist",
    icon: "ios-star-half",
    bg: "#DA4437"
  },
  {
    name: "User Profile",
    route: "userprofile",
    icon: "ios-paper",
    bg: "#DA4437"
  },
  {
    name: "Settings",
    route: "settings",
    icon: "ios-settings",
    bg: "#477EEA"
  },
  {
    name: "Change Passcode",
    route: "changepassword",
    icon: "ios-information-circle",
    bg: "#477EEA"
  }
  
];

class SideBar extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     user: null
  //   };
  // }

  componentWillMount() {
    this.props.sidebarRestore()
  }

  componentDidMount() {
    // const { sidebarLogged } = this.props;
    // console.log('Sidebar-componentDidMount-sidebarLogged', sidebarLogged)
    // if (sidebarLogged) {
    //   console.log('Sidebar-componentDidMount-sidebarLogged-settingLoadUserInfo()', sidebarLogged)
    //   this.props.settingLoadUserInfo()
    // }
  }

  componentWillUnmount() {

  }

  onPressRoute = (route) => {
    const { authLogged } = this.props
    if (route == 'message') {
      console.log('Sidebar-message-getConversationList()')
      this.props.getConversationList()
    }
    if (route == 'ratinglist') {
      console.log('Sidebar-ratinglist-getUserListToBeRated()',this.props.user)

      this.props.getUserListToBeRated(this.props.user)
    }
    if (route == 'favourites') {
      console.log('Sidebar-favourites-loadFavouriteProvider()')
      this.props.loadFavouriteProvider()
    }
    if (route == 'home') {
      console.log('Sidebar-home-sessionRestore()')
      this.props.sessionRestore()
    }
    if (route == 'settings') {
      console.log('Sidebar-settings-settingLoadUserInfo()')
      this.props.settingLoadUserInfo();
    }
    this.props.navigation.navigate(route);
  }

  _renderItem = (item) => {
    if (item.route === 'favourites') {
      if (!this.props.user.providerMode) {  // Show Favourite if user is not in ProviderMode
        return(
          <ListItem
            button
            noBorder
            onPress={() => this.onPressRoute(item.route)}
          >
            <Left>
              <Icon
                active
                name={item.icon}
                style={{ color: "#376b30", fontSize: 26, width: 30 }}
              />
              <Text style={styles.text}>
                {item.name}
              </Text>
            </Left>
          </ListItem>
        );  
      }

    } else {
      return(
        <ListItem
          button
          noBorder
          onPress={() => this.onPressRoute(item.route)}
        >
          <Left>
            <Icon
              active
              name={item.icon}
              style={{ color: "#376b30", fontSize: 26, width: 30 }}
            />
            <Text style={styles.text}>
              {item.name}
            </Text>
          </Left>
        </ListItem>
      );
    }

  }

  render() {
    return (
      <Container>
        {this.props.user
        ?
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }} >
          <View style={styles.drawerHeader}>
            <View style={styles.profile}>
              <View style={styles.imageProfile}>
                { this.props.user.photoURL ? 
                  <Image style={styles.image} source={{uri: this.props.user.photoURL}} />
                  :
                  <Button style={styles.displayName} >
                    <Text style={{color:'black', fontSize: 18}}>{this.props.user.displayName}</Text>
                  </Button>
                }
              </View>
              <View style={styles.textProfile}>
                <Text style={styles.name}>{this.props.user.firstName + ' ' + this.props.user.lastName}</Text>
                <Text note numberOfLines={1}>{this.props.user.email}</Text>
                {this.props.user.providerMode
                ? <Text note numberOfLines={1}>Provider Mode is On</Text>
                : null
                }
              </View>
            </View>
          </View>
          <FlatList
            data={datas}
            extraData={this.props}
            scrollEnabled={false}
            keyExtractor={(item, index) => item.name} 
            renderItem={({item, index}) => this._renderItem(item)} 
          />
        </Content>
        : null
        }
      </Container>
    );    
  }
}

const mapStateToProps = ({ sidebarReducer: { sidebarUser, sidebarError, sidebarLogged },
                            authReducer: {authLogged} }) => ({
  user: sidebarUser,
  sidebarLogged: sidebarLogged,
  sidebarError: sidebarError,
  authLogged: authLogged
});

const mapDispatchToProps = {
  sessionRestore: sessionRestore,

  sidebarRestore: sidebarRestore,
  sidebarDone: sidebarDone,

  authSignOut: authSignOut,
  
  getConversationList: getConversationList,
  getUserListToBeRated: getUserListToBeRated,
  loadFavouriteProvider: loadFavouriteProvider,
  
  settingLoadUserInfo: settingLoadUserInfo,
  
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);