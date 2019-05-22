import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, View, TouchableOpacity } from "react-native";
import {
  Container,Header,Title,Content,Button, Separator, Textarea, 
  Icon,Left,Right,Body,Text,ListItem,List, Item, Input, Thumbnail, Switch, Toast
} from "native-base";
import { connect } from 'react-redux';
import { Rating, AirbnbRating } from 'react-native-ratings';
import ImagePicker from "react-native-image-picker";
import Loader from '../nav/Loader';
import { updateReviewAndRating, requestServiceDone } from '../../actions/requestService/actions';

// import styles from "./stylesHome";

const { width, height } = Dimensions.get("window");
const maxWord = 400;
const maxCharacter = maxWord * 10;

class UserRatingScreen extends Component {
  constructor() {
		super();
		this.state = {
      wordsRemain: maxWord,
      isCommentChanged: false,
      isRatingChanged: false,
      comment: '',
      rating: 0,
      ratingItem: {}
		}
  }

  componentWillMount() {
    const { ratingItem } = this.props.navigation.state.params;
    this.setState({ratingItem: ratingItem});
    // console.log('componentWillMount-ratingItem',ratingItem)
  };
    
  componentDidMount() {
    const { ratingItem } = this.props.navigation.state.params;
    this.setState({ratingItem: ratingItem});
    // console.log('componentDidMount-state',this.state)
    
  };

  componentDidUpdate(prevProps) {
    const { logged, error, requestServiceSuccess } = this.props;
    if (!prevProps.error && error) Alert.alert('Error', error);

    // console.log('componentDidMount-state',this.state)
    if (requestServiceSuccess) {
      Alert.alert('', 'Thank you for your review');

      this.setState({ wordsRemain: maxWord, comment: '', rating: 0, isCommentChanged: false, isRatingChanged: false, ratingItem: {}})
      this.props.requestServiceDone()
      this.props.navigation.navigate('home')
    }
  };

  _updateReviewAndRating = () => {
    const { isCommentChanged, isRatingChanged, comment, rating, ratingItem } = this.state;
    if (isCommentChanged && isRatingChanged) {
      // console.log('Changed-comment',comment)
      // console.log('Changed-rating',rating)
      // console.log('Changed-ratingItem',ratingItem)
      this.props.updateReviewAndRating(ratingItem.requestServiceId, ratingItem.jobIndex, ratingItem.userInfo.uid, comment, rating)

    } else {
      Alert.alert('Notice', 'Please enter all required information !');
    }
  };
  
  onChangeCommentText = (comment) => {
    let wordsCount = comment.split(" ").length;
    let wordsRemain = maxWord - wordsCount;
    if (wordsRemain >= 0) {
      this.setState({ wordsRemain: wordsRemain, comment: comment, isCommentChanged: true })
    }
  }

  onChangeRating = (rating) => {
    // console.log("Rating is: " + rating)
    this.setState({ rating: rating, isRatingChanged: true })
  }

  // ratingCompleted(rating) {
  //   console.log("Rating is: " + rating)
  // }
  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate('ratinglist')} >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{this.state.ratingItem.userInfo.name}</Title>
          </Body>
        </Header>

        <Content padder>
          <View style={styles.viewbody}>
          <Text style={styles.textItem}>Overall rating</Text>
          <Rating 
            style={{alignSelf:'flex-start'}}
            ratingCount={5}
            //reviews={["Terrible", "Bad", "OK", "Good", "Great"]}
            startingValue={0}
            imageSize={30}
            onFinishRating={this.onChangeRating}
            //showRating
          />
          </View>
          <View style={styles.viewbody}>
          <Text style={styles.textItem}>Write your review</Text>
          <Textarea rowSpan={10} bordered placeholder="What did you like or dislike service provider?" 
            // value={this.state.aboutMe} 
            maxLength={maxCharacter}
            //defaultValue={this.props.user.aboutMe}
            onChangeText={(comment) => this.onChangeCommentText(comment)}
          />
          <Text note>You have {this.state.wordsRemain} words remain.</Text>
          </View>
          <Button disabled={!this.state.isCommentChanged || !this.state.isRatingChanged} block 
            style={{marginTop: 20, backgroundColor: (this.state.isCommentChanged && this.state.isRatingChanged) ? '#507C08' : '#767a78' }} 
            onPress={this._updateReviewAndRating}>
            <Text style={styles.buttonText}>Update</Text>
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
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 18,
    // fontWeight: 'bold',
    // color: '#043a00'
  },
  rating: {
    paddingBottom: 10,
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
    fontSize: 16,
    color: '#043a00',
  },
  buttonText: {
    fontSize: 20,
  },
  viewbody: {
    paddingTop: 10,
    paddingBottom: 10,
  }
});

const mapStateToProps = ({ 
  sessionReducer: { restoring, loading, user, error, logged }, 
  requestServiceReducer: { requestServiceLoading, requestServiceError, requestServiceSuccess }}) => ({

    restoring: restoring,
    loading: loading,
    user: user,
    error: error,
    logged: logged,
  
    requestServiceLoading: requestServiceLoading,
    requestServiceError: requestServiceError,
    requestServiceSuccess: requestServiceSuccess,
    
});

const mapDispatchToProps = {
  updateReviewAndRating: updateReviewAndRating, 
  requestServiceDone: requestServiceDone
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserRatingScreen);


