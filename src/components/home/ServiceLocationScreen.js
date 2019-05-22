import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, FlatList, View } from "react-native";
import {
  Container,Header,Title,Content,Button,
  Icon,Left,Right,Body,Text,ListItem,List, Separator
} from "native-base";
import { connect } from 'react-redux';

const { width, height } = Dimensions.get("window");

class ServiceLocationScreen extends Component {
  constructor() {
		super();
		this.state = {
      location: ''
    }
  }

  componentWillReceiveProps() {
    // console.log('ServiceLocationScreen-componentWillReceiveProps')

  }

  componentWillMount() {
    // console.log('ServiceLocationScreen-componentWillMount')
  }

  componentWillUpdate() {
    // console.log('ServiceLocationScreen-componentWillUpdate')
  }

  componentWillUnmount() {
    // console.log('ServiceLocationScreen-componentWillUnmount')

  }

  componentDidMount() {
    // console.log('ServiceLocationScreen-componentDidMount')
    const { serviceLocation, serviceArea, serviceProvide } = this.props;
    this.setState({location: serviceLocation});
  }

  componentDidUpdate(prevProps) {
    console.log('ServiceLocationScreen-componentDidUpdate')
    const { sessionError, sessionLogged, serviceLocation, serviceArea, serviceProvide } = this.props;
    console.log('ServiceLocationScreen-componentDidUpdate-serviceLocation',serviceLocation)
    console.log('ServiceLocationScreen-componentDidUpdate-serviceArea',serviceArea)
    console.log('ServiceLocationScreen-componentDidUpdate-serviceProvide',serviceProvide)
    if (!prevProps.sessionError && sessionError) Alert.alert('Error', sessionError);
    if (!sessionLogged) {
      this.props.navigation.navigate('signin');
    }
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
            <Title>Current Location</Title>
          </Body>
        </Header>

        <Content padder>
          <Button block success style={styles.mb15} onPress={() => {this.props.navigation.navigate('addCityState',{type:'LO'})}}>
            <Text>Select Location</Text>
          </Button>          
          <View>
            <Separator bordered>
            <Text style={styles.headerText}>CURRENT SELECTED LOCATION</Text>
            </Separator>
            {this.props.serviceLocation 
            ?
            <ListItem icon>
              <Left>
                <Icon
                  active
                  name='ios-pin'
                  style={{ color: "green", fontSize: 35, width: 45 }} 
                />                    
              </Left>
              <Body>
                <Text>{this.props.serviceLocation}</Text>
              </Body>
            </ListItem>
            : null
            }
          </View>  
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

const mapStateToProps = ({ sessionReducer: { sessionRestoring, sessionLoading, sessionUser, sessionError, sessionLogged }, 
                            settingsReducer: { serviceLocation, serviceArea, serviceProvide }}) => ({
  sessionRestoring: sessionRestoring,
  sessionLoading: sessionLoading,
  sessionUser: sessionUser,
  sessionError: sessionError,
  sessionLogged: sessionLogged,

  serviceLocation: serviceLocation, 
  serviceArea: serviceArea, 
  serviceProvide: serviceProvide
})

// const mapDispatchToProps = {

// };

export default connect(
  mapStateToProps
)(ServiceLocationScreen);

