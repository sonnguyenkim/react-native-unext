import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, FlatList, View } from "react-native";
import {
  Container,Header,Title,Content,Button, Textarea,
  Icon,Left,Right,Body,Text,ListItem,List, Separator, CheckBox, Thumbnail
} from "native-base";
import { connect } from 'react-redux';
import Loader from '../nav/Loader';

import { loadServiceList } from '../../actions/services/actions';
import { updateServiceProvide, settingsDone } from '../../actions/settings/actions';

const { width, height } = Dimensions.get("window");

class ServiceProvideScreen extends Component {
  constructor(props) {
		super(props);
		this.state = {
      serviceProvide: [],
      serviceList: [],
      aboutMe: '',
      isChanged: false
    };
  }

  componentDidMount() {
    // console.log('componentDidMount');
    const { servicesList, user, authLogged } = this.props;
    console.log('componentDidMount-user',user)
    console.log('componentDidMount-authLogged',authLogged)
    console.log('componentDidMount-servicesList',servicesList)
    let serviceProvide = [];
    if (servicesList.length === 0) {
      console.log('Load Services');
      this.props.loadServiceList();
    } else {
      
      servicesList.forEach(function(service) {
        let isSelected = user.serviceProvide.indexOf(service.id);
        let item = {
          id: service.id,
          description: service.description,
          name: service.name,
          photo: service.photo,
          selected: isSelected >= 0 ? true : false           
        }
        serviceProvide.push(item);
      })
      this.setState({ serviceProvide: serviceProvide, serviceList: servicesList, aboutMe: user.aboutMe });
    }
  }

  componentDidUpdate(prevProps) {
    // const { logged, user, sessionerror, settingserror, loading, success } = this.props;
    const { sidebarLogged, servicesError, settingserror, settingssuccess } = this.props;
    if (!prevProps.servicesError && servicesError) Alert.alert('Error', servicesError);
    if (!prevProps.settingserror && settingserror) Alert.alert('Error', settingserror);
    if (!sidebarLogged) {
      this.props.navigation.navigate('signin');
    }
    if (settingssuccess) {
      this.props.settingsDone();
      this.setState({ isChanged: false });
    }

  }

  toggleSwitch = (index) => {
    let { serviceProvide } = this.state;
    serviceProvide[index].selected= !serviceProvide[index].selected;
    this.setState({ serviceProvide: serviceProvide, isChanged: true });
  }

  updateService = () => {
    const { serviceProvide, aboutMe } = this.state;
    let serviceList = [];
    serviceProvide.forEach(function(item) {
      if (item.selected) {
        serviceList.push(item.id);
      }
    })
    // console.log('serviceList',serviceList);
    this.props.updateServiceProvide(serviceList, aboutMe);
  }

  render() {
    return (
      <Container style={styles.container}>
        {/* <Loader loading={this.props.loading} /> */}
        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('settings')} >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Service Provided</Title>
          </Body>
        </Header>

        <Content padder>
          <Separator bordered>
            <Text style={styles.headerText}>Your Services</Text>
          </Separator>
          <Textarea rowSpan={6} bordered placeholder="About you & what you can do" 
            value={this.state.aboutMe} 
            onChangeText={(aboutMe) => this.setState({ aboutMe: aboutMe , isChanged: true })}
          />
          <View style={{paddingTop: 10}}>
            <Separator bordered>
              <Text style={styles.headerText}>SERVICES</Text>
            </Separator>
          
            <FlatList
              data={this.state.serviceProvide}
              extraData={this.state}
              keyExtractor={(item, index) => item.id} 
              renderItem={({item, index}) => 
                <ListItem thumbnail>
                  <Left>
                    <Thumbnail square source={{uri: item.photo}}/>
                  </Left>
                  <Body>
                    <Text>{item.name}</Text>
                    <Text note numberOfLines={1}>{item.description}</Text>
                  </Body>
                  <Right>
                    <CheckBox 
                      color='green'
                      checked={item.selected}
                      onPress={() => {this.toggleSwitch(index)}}
                    />  
                  </Right>
                </ListItem>
              }
            />
          </View>    
          <Button block success style={styles.mb15} onPress={this.updateService} disabled={!this.state.isChanged}>
            <Text>UPDATE</Text>
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

const mapStateToProps = ({  sidebarReducer: { sidebarUser, sidebarLogged }, 
                            servicesReducer: { servicesLoading, servicesError, servicesList },
                            settingsReducer: { settingsloading, settingserror, settingssuccess, serviceProvide }}) => ({
  user: sidebarUser,
  sidebarLogged: sidebarLogged,

  settingsloading: settingsloading,
  settingssuccess: settingssuccess,
  settingserror: settingserror,

  servicesError: servicesError,
  servicesList: servicesList,
  serviceProvide: serviceProvide
});


const mapDispatchToProps = {
  
  updateServiceProvide: updateServiceProvide, 
  settingsDone: settingsDone,
  loadServiceList: loadServiceList
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceProvideScreen);

