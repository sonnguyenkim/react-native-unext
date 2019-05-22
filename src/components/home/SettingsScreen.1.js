import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, FlatList, View } from "react-native";
import {
  Container,Header,Title,Content,Button,Subtitle,
  Icon,Left,Right,Body,Text,ListItem,List, Switch
} from "native-base";
import { connect } from 'react-redux';
import { logoutUser, restoreSession, updateProfileDone } from '../../actions/session/actions';
import { updateProviderMode, settingsDone } from '../../actions/settings/actions';

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

class SettingsScreen extends Component {
  constructor() {
    super();
		this.state = {
      isChanged: false,  
      userInfo: null,
      location: '', 
      serviceArea: [], 
      serviceProvide: [], 
      providerMode: false,
		}
  }

  componentDidMount() {
    const { user, location, serviceArea, serviceProvide, providerMode } = this.props;
    this.setState({location: location, serviceArea: serviceArea, serviceProvide: serviceProvide, providerMode: providerMode, userInfo: user});
  };

  // componentWillReceiveProps() {
  // }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate');
    
    const { error, logged , updateprofilesuccess} = this.props;
    if (!prevProps.error && error) Alert.alert('Error', error);
    if (!logged) {
      this.props.navigation.navigate('signin');
    }
    if (updateprofilesuccess) {
      console.log('componentDidUpdate-updateprofilesuccess');
      // this.props.restoreSession();
      this.props.updateProfileDone();
    }
  }

  logout = () => {
    this.props.logout();
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
    console.log('Switch', value);
    // let { userInfo } = this.state;
    // userInfo.providerMode = value;
    // this.setState({providerMode: value, userInfo: userInfo, isChanged: true});
    this.setState({providerMode: value});
    this.props.updateProviderMode(value);
  }

// style={styles.textItem}
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
          {this.props.user.isServiceProvider && this.props.user.providerMode
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


{/* <ListItem key={item.id} onPress={() => {this.props.navigation.navigate(item.route)}}>
  <Text style={styles.textItem}>{item.name}</Text>
</ListItem> */}


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

const mapStateToProps = ({ sessionReducer: { restoring, loading, user, error, logged, updateprofilesuccess },
                            settingsReducer: { settingsloading, settingserror, settingssuccess, 
                              serviceLocation, serviceArea, serviceProvide, providerMode } }) => ({
  restoring: restoring,
  loading: loading,
  user: user,
  error: error,
  logged: logged,
  updateprofilesuccess: updateprofilesuccess,
  location: serviceLocation, 
  serviceArea: serviceArea, 
  serviceProvide: serviceProvide, 
  providerMode: providerMode
});

const mapDispatchToProps = {
  logout: logoutUser,
  restoreSession: restoreSession,
  updateProviderMode: updateProviderMode,
  updateProfileDone: updateProfileDone
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsScreen);

