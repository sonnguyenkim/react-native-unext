import React, { Component } from "react";
import { Platform, StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, View, FlatList  } from "react-native";
import {
  Container,Header,Title,Content,Button, List, ListItem, Separator, 
  Icon,Left,Right,Body,Text, Thumbnail
} from "native-base";
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Rating, AirbnbRating } from 'react-native-ratings';

import Loader from '../nav/Loader';
import { loadServiceList, loadServiceProviderList, loadServiceDone } from '../../actions/services/actions';

// import styles from "./stylesHome";

const { width, height } = Dimensions.get("window");

class ServiceProviderSearchNotLoggedScreen extends Component {
	constructor() {
		super();
		this.state = {
      showProvider: null,
      servicesProviderList: []
		};
  }

	componentDidMount() {
		// this.props.loadServiceList();
		const { error, servicesProviderList } = this.props;
		// console.log('servicesProviderList-----',servicesProviderList);
		// this.setState({ servicesProviderList: servicesProviderList});
	}

  componentDidUpdate(prevProps) {
    const { error, servicesProviderList } = this.props;
    if (!prevProps.error && error) {
      Alert.alert('Error', error);
    } else {
      
    }
  }
 
  providerOnPress = (providerId) => {
		const {showProvider} = this.state;
		if (showProvider === providerId) {
			this.setState({showProvider: null});
		} else {
			this.setState({showProvider: providerId});
		}
		console.log('providerOnPress',providerId);
  }

	sendRequestToProvider = () => {
		// console.log('sendRequestToProvider');
		Alert.alert('Message', 'Please Sign In to send request.');
	}

  render() {
    return (
      <SafeAreaView style={styles.container}>
      <Container>
				<Loader loading={this.props.loading} />
				<Header style={styles.headerBackgroundColor}>
          <Left>
						<Button
              transparent
              onPress={() => this.props.navigation.navigate('homenotlogged')} >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>uNext Services</Title>
          </Body>
          <Right>
						<Button hasText transparent onPress={() => this.props.navigation.navigate('signin')}>
              <Text>Sign In</Text>
            </Button>
          </Right>
        </Header>
        {/* style={styles.items} onPress={() => {this.itemOnPress(user.uid)}} 
				 style={{paddingTop: 10, borderTopWidth: 1}}
				 style={{alignSelf: 'center', margin: 15}} 
				*/}
				<Content padder >
          <View style={{paddingTop: 10}}>
            <Separator bordered>
              <Text style={styles.headerText}>SERVICE PROVIDERS</Text>
            </Separator>
						{this.props.servicesProviderList.length > 0 
						?
						<FlatList
                data={this.props.servicesProviderList}
                scrollEnabled={false}
                keyExtractor={(item, index) => item.uid} 
								extraData={this.state}
                renderItem={({item, index}) => 
								<View>
                <ListItem thumbnail onPress={() => {this.providerOnPress(item.uid)}} >
                  <Left>
                    {item.photoURL ? 
                      <Thumbnail source={{uri: item.photoURL}}/>
                    :
                    <Button style={styles.displayName}>
                       <Text style={{color:'black', fontSize: 16}}>{item.displayName}</Text>
                    </Button>
                    }
                  </Left>
                  <Body>
                    <Text >{item.firstName + ' ' + item.lastName}</Text>
                    <Text numberOfLines={2} note>{item.aboutMe}</Text>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Rating 
                      style={{alignSelf:'flex-start'}}
                      readonly
                      ratingCount={5}
                      reviews={["Terrible", "Bad", "OK", "Good", "Great"]}
                      startingValue={item.rating}
                      imageSize={20}
                    />
                    {item.ratingCount > 0 
                    ? <Text>  ( {item.ratingCount} reviews)</Text>
                    : null
                    }
                    </View>
										<View>	
										{this.state.showProvider === item.uid
										? <Text style={{alignSelf:'flex-start'}}>Show less ...</Text>
										: <Text style={{alignSelf:'flex-start'}}>Show more ...</Text>
										}
										</View>
                  </Body>
                  <Right>
                    
                  </Right>
									
                </ListItem>
								{this.state.showProvider === item.uid
									? 
									<View>
										{item.aboutMe 
										?
										<View>
											<Text style={styles.contentHeader}>Biography</Text>
											<Text style={styles.contentDetail}>{item.aboutMe}</Text>
										</View>
										: null
										}
										<Button success block style={{margin: 15}} 
											onPress={this.sendRequestToProvider} >
											<Text> Send Request</Text>
										</Button>
										{/* <TouchableOpacity activeOpacity={.5} onPress={this.sendRequestToProvider}>
											<View>
												<Text>Send Request</Text>
											</View>
										</TouchableOpacity> */}
									</View>
									: null
									} 
									
								</View>
								}
              />
						: null
						}
          </View>    
				</Content>
      </Container>
      </SafeAreaView>
    );
  }
}

const searchInputStyle={
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF"
      // backgroundColor: '#fff',
      // // width: width ,
      // paddingLeft: 10,
      // paddingRight: 10,
      // // marginLeft: 10,
      // // marginRight: 10,
      // marginTop: 20,
      // marginBottom: 0,
      // opacity: 0.9,
      // borderRadius: 8
  },
  description: {
      fontWeight: 'bold',
      color: "#007",
      borderTopWidth: 0,
      borderBottomWidth: 0,
      opacity: 0.9,
  },
  predefinedPlacesDescription: {
      color: '#355',
  },
  textInputContainer: {
    borderTopColor: 'white',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    height: 50,
  },
  textInput: {
    height: 33,
    fontSize: 20,
    borderRadius: 0,
    borderTopWidth: 0,
    // borderBottomWidth: 1,
    // clearButtonMode: 'always'
  },
  listView: {
    //backgroundColor: '#4286f4',
    fontSize: 20
  },
  seperator: {
    borderBottomWidth: 1,
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
		// width: width - 20,
  },
  avatar: {
    width: 60,
    height: 60,

  },
  textItem: {
    paddingRight: 30,
    paddingLeft: 30,
    fontSize: 18,
    // fontWeight: 'bold'
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
  headerText: {
    // height: 55,
    // paddingTop: 10,
    // paddingRight: 30,
    // paddingLeft: 30,
    fontSize: 16,
    // fontWeight: '400',
    color: '#043a00',
	},
	contentHeader: {
    paddingTop: 10,
    paddingLeft: 10,
    fontSize: 16,
    color: "#22721d",
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#EDEDED'
  },
  contentDetail: {
    paddingTop: 10,
    paddingLeft: 10,
    // fontSize: 16,
    // color: "#22721d",
    // fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: '#EDEDED'
  },

});

const mapStateToProps = ({  servicesReducer: { loading, error, servicesLoadedDone, servicesProviderList },
                            sessionReducer: { user, logged } }) => ({
  user: user,
  logged: logged,               
  loading: loading,
  error: error,
  servicesLoadedDone: servicesLoadedDone,
  servicesProviderList: servicesProviderList
});

const mapDispatchToProps = {
  loadServiceDone: loadServiceDone,
  loadServiceList: loadServiceList,
  loadServiceProviderList: loadServiceProviderList
};

export default withNavigation(connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceProviderSearchNotLoggedScreen));
