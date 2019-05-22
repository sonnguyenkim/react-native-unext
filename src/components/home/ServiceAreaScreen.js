import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, FlatList, View } from "react-native";
import {
  Container,Header,Title,Content,Button,
  Icon,Left,Right,Body,Text,ListItem,List, Separator
} from "native-base";
import { connect } from 'react-redux';
import { removeServiceArea, settingsDone } from '../../actions/settings/actions';

const { width, height } = Dimensions.get("window");

class ServiceAreaScreen extends Component {
  constructor(props) {
		super(props);
		this.state = {
      serviceArea: []
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    const { sessionLogged, sessionError, settingserror, settingssuccess } = this.props;
    if (!prevProps.sessionError && sessionError) Alert.alert('Error', sessionError);
    if (!prevProps.settingserror && settingserror) Alert.alert('Error', settingserror);
    if (!sessionLogged) {
      this.props.navigation.navigate('signin');
    }
    if (settingssuccess) {
      this.props.settingsDone();
    }
  }

  deleteCurrentLocation = (item) => {
    this.props.removeServiceArea(item);
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('settings')} >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Service Area</Title>
          </Body>
        </Header>

        <Content padder>
          <Button block success style={styles.mb15} onPress={() => {this.props.navigation.navigate('addCityState',{type:'SA'})}}>
            <Text>Select Area</Text>
          </Button>          

          {this.props.serviceArea.length > 0
          ?
            <View>
            <Separator bordered>
              <Text style={styles.headerText}>YOUR SERVICE AREA</Text>
            </Separator>
          
            <FlatList
                data={this.props.serviceArea}
                keyExtractor={item => item} 
                extraData={this.props}
                renderItem={({item}) => 
                  <ListItem icon >
                    <Left>
                    <Button style={{ backgroundColor: '#FD3C2D'}}  >
                      <Icon
                        onPress={() => {this.deleteCurrentLocation(item)}}
                        active
                        name='md-trash'
                        //style={{ color: "red", fontSize: 35, width: 45 }} ios-close-circle-outline
                      />
                      </Button>                    
                    </Left>
                    <Body>
                      <Text>{item}</Text>
                    </Body>
                  </ListItem>
                }
              />
            </View>  
          : null
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
});

const mapStateToProps = ({ sessionReducer: { sessionUser, sessionLogged, sessionError }, 
                settingsReducer: { settingsloading, settingserror, settingssuccess, serviceLocation, serviceArea, serviceProvide}}) => ({
  sessionUser: sessionUser,
  sessionLogged: sessionLogged,
  sessionError: sessionError,

  settingsloading: settingsloading,
  settingssuccess: settingssuccess,
  settingserror: settingserror,
  serviceLocation: serviceLocation, 
  serviceArea: serviceArea, 
  serviceProvide: serviceProvide
});


const mapDispatchToProps = {
  removeServiceArea: removeServiceArea, 
  settingsDone: settingsDone
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceAreaScreen);

