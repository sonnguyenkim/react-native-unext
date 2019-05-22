import React, { Component } from "react"
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, FlatList, View } from "react-native"
import {
  Container,Header,Title,Content,Button,Subtitle,
  Icon,Left,Right,Body,Text,ListItem,List, Switch
} from "native-base"
import { connect } from 'react-redux'
import { StackActions, NavigationActions } from 'react-navigation'

import { updateProviderMode, settingsDone } from '../../actions/settings/actions'
import { sidebarRestore } from '../../actions/sidebar/actions'
import { authSignOut } from '../../actions/auth/actions';

const { width, height } = Dimensions.get("window");

const itemsGeneral = [
  {
    id: '1',
    name: "Locations",
    route: "serviceLocation",
    icon: "ios-arrow-forward",
    deactive: false
  },
];

const itemsProvider = [
  {
    id: '1',
    name: "Locations",
    route: "serviceLocation",
    icon: "ios-arrow-forward",
    deactive: false
  },
  {
    id: '2',
    name: "Service Area",
    route: "serviceArea",
    icon: "ios-arrow-forward",
    deactive: true
  },
  {
    id: '3',
    name: "Service Provide",
    route: "serviceProvide",
    icon: "ios-arrow-forward",
    deactive: true
  },

];

const resetAction = StackActions.reset({
  index: 0,
  // actions: [NavigationActions.navigate({ routeName: 'DrawerNavigator' })],
  actions: [NavigationActions.navigate({ routeName: 'signin' })],
})

class SettingsScreen extends Component {
  constructor() {
    super();
		this.state = {
      providerMode: false,
		}
  }

  componentDidMount() {
    const { user, providerMode } = this.props;
    this.setState({ providerMode: providerMode, user: user});
  };

  // componentWillReceiveProps() {
  // }

  // componentWillUnmount() {
  //   console.log('SettingsScreen-componentWillUnmount : call sidebarRestore');
  //   this.props.sidebarRestore()
  // }

  componentDidUpdate(prevProps) {
    // console.log('componentDidUpdate');

    const { sidebarError, sidebarLogged, settingssuccess, providerMode } = this.props;
    if (!prevProps.sidebarError && sidebarError) Alert.alert('Error', sidebarError);
    if (!sidebarLogged) {
      this.props.navigation.navigate('signin')
    } else {
      if (settingssuccess) {
        this.props.settingsDone()
        this.setState({providerMode: providerMode})
      } else {
        if (prevProps.providerMode != providerMode) {
          this.setState({providerMode: providerMode})
        }
      }
    }

  }

  logout = () => {
    this.props.authSignOut()
    this.props.navigation.dispatch(resetAction)
    // this.props.navigation.navigate('signin')
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

  updateProviderMode = (value) => {
    this.setState({providerMode: value})
    this.props.updateProviderMode(value)
    this.props.sidebarRestore()
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.toggleDrawer()} >
              <Icon name="ios-menu" />
            </Button>
          </Left>
          <Body>
            <Title>Settings</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.buttonSignOut()}>
            <Icon name="ios-log-out" />
            </Button>
          </Right>
        </Header>

        <Content>
          {this.props.user.isServiceProvider && this.state.providerMode
          ? 
          <View>
            <FlatList
              data={itemsProvider}
              keyExtractor={item => item.id} 
              renderItem={({item}) => 

                <ListItem key={item.id} onPress={() => {this.props.navigation.navigate(item.route)}}>
                  <Left>
                    <Text>
                      {item.name}
                    </Text>
                  </Left>
                  <Right>
                    <Icon
                      active
                      name={item.icon}
                      style={{ color: "#02420b", fontSize: 26, width: 30 }}
                    />
                  </Right>
                </ListItem>
              }
            />
            <ListItem key={'4'}>
              <Left>
                <Text>
                  Switch to Provider Mode
                </Text>
              </Left>
              <Right>
                <Switch style={styles.switch}
                    onValueChange={ (value) => {this.updateProviderMode(value)}} 
                    value={ this.state.providerMode } 
                  /> 
              </Right>
            </ListItem>
          </View>
          :
          <View>
          <FlatList
						data={itemsGeneral}
						keyExtractor={item => item.id} 
						renderItem={({item}) => 
              <ListItem key={item.id} onPress={() => {this.props.navigation.navigate(item.route)}}>
                <Left>
                  <Text>
                    {item.name}
                  </Text>
                </Left>
                <Right>
                  <Icon
                    active
                    name={item.icon}
                    style={{ color: "#02420b", fontSize: 26, width: 30 }}
                  />
                </Right>
              </ListItem>
						}
					/>
          {this.props.user.isServiceProvider
          ?
          <ListItem key={'4'}>
              <Left>
                <Text>
                  Switch to Provider Mode
                </Text>
              </Left>
              <Right>
                <Switch style={styles.switch}
                    onValueChange={ (value) => {this.updateProviderMode(value)}} 
                    value={ this.state.providerMode } 
                  /> 
              </Right>
            </ListItem>

          : null
          }
          </View>
          }
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
  mb10: {
    marginBottom: 10
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
    fontSize: 20,
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
  switch :{
    // marginTop: 20,
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] 
  },
});

const mapStateToProps = ({ sidebarReducer: { sidebarRestoring, sidebarUser, sidebarError, sidebarLogged },
                            settingsReducer: { settingsloading, settingserror, settingssuccess, 
                              isServiceProvider, providerMode, serviceLocation, serviceArea, serviceProvide } }) => ({
  user: sidebarUser,
  sidebarLogged: sidebarLogged,
  sidebarError: sidebarError,

  settingsloading: settingsloading,
  settingserror: settingserror,
  settingssuccess: settingssuccess,

  isServiceProvider: isServiceProvider,
  providerMode: providerMode,


  // serviceLocation: serviceLocation, 
  // serviceArea: serviceArea, 
  // serviceProvide: serviceProvide, 
  
});

const mapDispatchToProps = {
  authSignOut: authSignOut,
  updateProviderMode: updateProviderMode,
  settingsDone: settingsDone,
  sidebarRestore: sidebarRestore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);

