import React, { Component } from "react";
import { Platform, StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, View, FlatList, TouchableOpacity  } from "react-native";
import {
  Container,Header,Title,Content,Button, List, ListItem, Separator, 
  Icon,Left,Right,Body,Text, Thumbnail
} from "native-base";
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Rating } from 'react-native-ratings';
import { getAllReviews } from '../../actions/requestService/actions';
import Loader from '../nav/Loader';
import { loadServiceList, loadServiceProviderList, loadServiceDone } from '../../actions/services/actions';

// import styles from "./stylesHome";

const { width, height } = Dimensions.get("window");

class ServiceProviderSearchScreen extends Component {
	constructor() {
		super();
		this.state = {
      showProvider: null,
      servicesProviderList: []
		};
  }

	componentDidMount() {
    const { user, logged, servicesProviderList } = this.props;
		// console.log('ServiceProviderSearchScreen-componentDidMount - servicesProviderList',servicesProviderList);
		// this.props.loadServiceList();
    // const { error, servicesProviderList } = this.props;
    
		// console.log('ServiceProviderSearchScreen-componentDidMount-user',user);
		// this.setState({ servicesProviderList: servicesProviderList});
	}

  // servicesLoading: servicesLoading,
  // servicesError: servicesError,
  componentDidUpdate(prevProps) {
    const { servicesError, servicesProviderList } = this.props;
    if (!prevProps.servicesError && servicesError) {
      Alert.alert('Error', servicesError);
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
		// console.log('providerOnPress',providerId);
  }

	sendRequestToProvider = (provider) => {
    const { user, logged } = this.props;
    // console.log('sendRequestToProvider')
    const name = provider.firstName + ' ' + provider.lastName;
    if (!logged) {
      Alert.alert('', 'Please Sign In to send request.');
    } else {
      if (user.uid != provider.uid) {
        this.props.navigation.navigate('sendRequestScreen', {providerId: provider.uid, name: name});
      }
    }
  }
  
  showAllReviews = (provider) => {
    // console.log('ServiceProviderSearchScreen-showAllReviews')
    const { user } = this.props;
    this.props.getAllReviews(provider.uid, true)  // true: this is a provider, false: this is customer
    this.props.navigation.navigate('seeallreviews', {userReviewed: provider, asProvider: true});
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
      <Container>
      	{/* <Loader loading={this.props.servicesLoading} /> */}
        <Header style={styles.headerBackgroundColor}>
          <Left>
						<Button
              transparent
              onPress={() => this.props.navigation.navigate('home')} >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Service Providers</Title>
          </Body>
          <Right>
          </Right>
        </Header>
				<Content padder >
          <View style={{}}>
            {/* <Separator bordered>
              <Text style={styles.headerText}>SERVICE PROVIDERS</Text>
            </Separator> */}
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
                      startingValue={item.ratingAsProvider}
                      imageSize={20}
                    />
                    {item.ratingCountAsProvider > 0 
                    ? <Text>  ( {item.ratingCountAsProvider} reviews)</Text>
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
                    <Button transparent style={{}} 
											onPress={() => {this.showAllReviews(item)}} >
											<Text style={styles.headerText}>See All Reviews</Text>
										</Button>
										{item.aboutMe 
										?
										<View>
                      <Separator bordered>
                        <Text style={styles.headerText}>Services</Text>
                      </Separator>
											{/* <Text style={styles.contentHeader}>Biography</Text> */}
											<Text style={styles.contentDetail}>{item.aboutMe}</Text>
										</View>
										: null
										}
                    <View style={{borderBottomWidth: 1}}>
										<Button success block style={{marginTop: 15, marginBottom: 15,
                        backgroundColor: (this.props.user && (this.state.showProvider === this.props.user.uid)) ? '#767a78' : '#507C08'}} 
											onPress={() => {this.sendRequestToProvider(item)}} >
											<Text>Send Request</Text>
										</Button>

										{/* <TouchableOpacity activeOpacity={.5} onPress={() => {this.showReview(item)}}>
											<View>
												<Text>See All Review</Text>
											</View>
										</TouchableOpacity> */}
                    </View>

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

const mapStateToProps = ({  servicesReducer: { servicesLoading, servicesError, servicesLoadedDone, servicesProviderList },
                            sessionReducer: { sessionUser, sessionLogged } }) => ({
  user: sessionUser,
  logged: sessionLogged,              

  servicesLoading: servicesLoading,
  servicesError: servicesError,
  servicesLoadedDone: servicesLoadedDone,
  servicesProviderList: servicesProviderList
});

const mapDispatchToProps = {
  loadServiceDone: loadServiceDone,
  loadServiceList: loadServiceList,
  loadServiceProviderList: loadServiceProviderList,
  getAllReviews: getAllReviews
};

export default withNavigation(connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceProviderSearchScreen));
