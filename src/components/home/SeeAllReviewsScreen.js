import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, FlatList, View } from "react-native";
import {
  Container,Header,Title,Content,Button, Textarea,
  Icon,Left,Right,Body,Text,ListItem,List, Separator, CheckBox, Thumbnail
} from "native-base";
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Rating } from 'react-native-ratings';
import moment from "moment";
import Loader from '../nav/Loader';
import { sessionRestore } from '../../actions/session/actions';
import { loadServiceList } from '../../actions/services/actions';
import { updateServiceProvide, settingsDone } from '../../actions/settings/actions';
import { getAllReviews } from '../../actions/requestService/actions';

const { width, height } = Dimensions.get("window");

class SeeAllReviewsScreen extends Component {
  constructor(props) {
		super(props);
		this.state = {
      reviewsList: [],
      userReviewed: {}
    };
  }

  componentWillMount() {
    if (!this.props.navigation.state.params) {
      this.props.navigation.navigate('settings');
    }
    const { userReviewed, asProvider } = this.props.navigation.state.params;
    this.props.getAllReviews(userReviewed.uid, asProvider)
  }

  componentDidMount() {
    // console.log('componentDidMount');
    const { userReviewed, asProvider } = this.props.navigation.state.params;
    this.setState({userReviewed: userReviewed})
    this.props.getAllReviews(userReviewed.uid, asProvider)
  }

  componentDidUpdate(prevProps) {
    const { requestServiceError, requestServiceSuccess, reviewsList } = this.props;
    const { userReviewed, asProvider } = this.props.navigation.state.params;

    if (!prevProps.requestServiceError && requestServiceError) Alert.alert('Error', requestServiceError);
    // if (!logged) {
    //   this.props.navigation.navigate('signin');
    // }
    // if (requestServiceSuccess) {
    //   this.setState({reviewsList: reviewsList})
    //   if (reviewsList.length === 0) {
    //     console.log('reviewsList is null')
    //     Alert.alert('Error', 'Have no review yet.');
    //   }
      
    // }

    // console.log('reviewsList',reviewsList)
  }

  onHandleGoBack() {
    const { from, userId, asProvider } = this.props.navigation.state.params;
    if (from === 'MSBOX') {
      this.props.navigation.navigate('message')
    } else {
      this.props.navigation.navigate('serviceProviderSearchScreen')
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        {/* <Loader loading={this.props.loading} /> */}
        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              onPress={() => this.onHandleGoBack()} >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.state.userReviewed.firstName} {this.state.userReviewed.lastName}</Title>
          </Body>
        </Header>

        <Content padder>
          <View style={{paddingTop: 10}}>
            {this.props.reviewsList[0]
            ? 
            <FlatList
              data={this.props.reviewsList}
              scrollEnabled={false}
              keyExtractor={(item, index) => item.reviewerInfo.uid} 
              extraData={this.state}
              renderItem={({item, index}) => 
              <View style={{borderBottomWidth: 1, paddingBottom: 10}}>
              <ListItem thumbnail >
                <Left>
                  {item.reviewerInfo.photoURL ? 
                    <Thumbnail source={{uri: item.reviewerInfo.photoURL}}/>
                  :
                  <Button style={styles.displayName}>
                      <Text style={{color:'black', fontSize: 16}}>{item.reviewerInfo.displayName}</Text>
                  </Button>
                  }
                </Left>
                <Body>
                  <Text>{item.reviewerInfo.name}</Text>
                  <Text>{moment(item.date).format('MMMM Do YYYY')}</Text>
                </Body>
                <Right>
                </Right>
              </ListItem>
                
              <Separator bordered>
                <Text style={styles.headerText}>REVIEWS</Text>
              </Separator>
              <View style={{flexDirection: 'row', marginTop: 5, marginBottom: 5, paddingLeft: 10}}>
                
                <Rating 
                    style={{alignSelf:'flex-start'}}
                    readonly
                    ratingCount={5}
                    reviews={["Terrible", "Bad", "OK", "Good", "Great"]}
                    startingValue={item.rating}
                    imageSize={20}
                  />
                  
                  </View>
                  {item.review
                  ?
                  <View style={{paddingLeft: 10}}>
                    <Text>{item.review}</Text>
                  </View>
                  : null
                  }
              </View>
              }
            />
            : <Text></Text>
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

const mapStateToProps = ({ requestServiceReducer: { requestServiceLoading, reviewsList, requestServiceError, requestServiceSuccess }}) => ({
  requestServiceLoading: requestServiceLoading,
  requestServiceError: requestServiceError,
  requestServiceSuccess: requestServiceSuccess,
  reviewsList: reviewsList
});

const mapDispatchToProps = {
  // sessionRestore: sessionRestore,
  getAllReviews: getAllReviews
};

export default withNavigation(connect(
  mapStateToProps,
  mapDispatchToProps
)(SeeAllReviewsScreen));

