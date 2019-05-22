import React, { Component } from "react";
import { StatusBar, Alert, StyleSheet, SafeAreaView, ScrollView, Dimensions, View } from "react-native";
import {
  Container,Header,Title,Content,Button,
  Icon,Left,Right,Body,Text,ListItem,List
} from "native-base";
import { connect } from 'react-redux';
import { updateLocation, settingsDone, addServiceArea } from '../../actions/settings/actions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { sessionRestore } from '../../actions/session/actions';

const { width, height } = Dimensions.get("window");

class AddCityStateScreen extends Component {
  constructor() {
		super();
		this.state = {
      city: '',
      isChanged: false
		}
  }

  componentWillUpdate() {
    console.log('AddCityStateScreen-componentWillUpdate')
  }

  componentWillUnmount() {
    console.log('AddCityStateScreen-componentWillUnmount')

  }

  componentDidMount() {
    console.log('AddCityStateScreen-componentDidMount')
    if (!this.props.navigation.state.params) {
      this.props.navigation.navigate('settings');
    }
    const { type } = this.props.navigation.state.params;
  }

  componentDidUpdate(prevProps) {
    console.log('AddCityStateScreen-componentDidUpdate')
    const { type } = this.props.navigation.state.params;
    const { settingsloading, settingserror, settingssuccess, sessionLogged } = this.props;
    if (!prevProps.settingserror && settingserror) Alert.alert('Error', settingserror);
    if (!sessionLogged) {
      this.props.navigation.navigate('signin');
    }
    if (!prevProps.settingssuccess && settingssuccess) {
      console.log('(!prevProps.success && success)',(!prevProps.settingssuccess && settingssuccess))
      this.props.settingsDone();
      
      console.log('AddCityStateScreen-componentDidUpdate')
    }
    if (prevProps.settingssuccess && !settingssuccess) {
      console.log('(prevProps.success && !success)',(prevProps.success && !success))
      if (type === 'LO') {
        console.log('AddCityStateScreen-componentDidUpdate-this.props.navigation.navigate(serviceLocation)')
        // 
        this.props.navigation.navigate('serviceLocation');
      }
      if (type === 'SA') {
        console.log('AddCityStateScreen-componentDidUpdate-this.props.navigation.navigate(serviceArea)')
        this.props.navigation.navigate('serviceArea');
      }
    }
  }

  selectCity = (city) => {
    this.setState({city: city, isChanged: true});
  }

  updateCity = () => {
    const { type } = this.props.navigation.state.params;
    if (type === 'LO') {
      console.log('AddCityStateScreen-updateCity',this.state.city)
      this.props.updateLocation(this.state.city);
    }
    if (type === 'SA') {
      this.props.addServiceArea(this.state.city);
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={styles.headerBackgroundColor}>
          <Left>
            <Button
              transparent
              // onPress={() => this.props.navigation.navigate('settings')}
              onPress={() => this.props.navigation.goBack()}
              >
              <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Add City, State</Title>
          </Body>
          <Right>
          </Right>
        </Header>

        <Content>
        <View style={styles.searchBox}>
        <GooglePlacesAutocomplete
          placeholder="Search City"
          minLength={2} // minimum length of text to search
          autoFocus={false}
          returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
          listViewDisplayed="false" // true/false/undefined
          fetchDetails={true}
          renderDescription={row => row.description} // custom description render
          onPress={(data, details = null) => {
            {/* console.log('Data',data.description);
            console.log('Detail',details.formatted_address); */}
            this.selectCity(data.description);
          }}
          getDefaultValue={() => {
            return ''; // text input default value
          }}
          query={{
            // available options: https://developers.google.com/places/web-service/autocomplete
            key: 'AIzaSyCXL2VW0SwxxO71ui8H1a72mwKJKO2V89Q',
            language: 'en', // language of the results
            types: '(cities)', // default: 'geocode'
            components: 'country:us'
          }}
          styles={searchInpuStyle_1}
          //currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
          //currentLocationLabel="Current location"
          nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}
          GooglePlacesSearchQuery={{
            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
            // rankby: 'distance',
            // types: 'food',
          }}
          filterReverseGeocodingByTypes={[
            'locality',
            'administrative_area_level_3',
          ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          // predefinedPlaces={[homePlace, workPlace]}
          debounce={200}
        />
        </View>
        <View style={{paddingLeft: 10, paddingRight: 10, paddingTop: 20}}>
        <Button disabled={!this.state.isChanged} block style={{ backgroundColor: this.state.isChanged ? '#507C08' : '#767a78'}} onPress={this.updateCity}>
          <Text style={styles.buttonText}>Add City</Text>
        </Button>
        </View>
        </Content>
      </Container>
    );
  }
}

const searchInpuStyle_1 = {
  
  textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    color: '#444444',
    fontSize: 18,
    paddingLeft: 10, paddingRight: 10,
  },
  textInput: {
    marginLeft: 0,
    marginRight: 0,
    height: 38,
    color: '#444444',
    fontSize: 18,
    // borderWidth: 1,
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingTop: 10, paddingBottom: 10, marginBottom: 10
  },
  predefinedPlacesDescription: {
    color: '#1faadb'
  },

}
const searchInputStyle={
  container: {
      backgroundColor: '#fff',
      // width: width ,
      paddingLeft: 10,
      paddingRight: 10,
      // marginLeft: 10,
      // marginRight: 10,
      marginTop: 20,
      marginBottom: 0,
      opacity: 0.9,
      borderRadius: 8
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
    backgroundColor: "#FFF",
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
  searchBox: {
    // top: 0,
    // position: "absolute",
    flex: 1,
    justifyContent: 'center',
  },
});

const mapStateToProps = ({ sessionReducer: { sessionUser, sessionLogged }, 
            settingsReducer: { settingsloading, settingserror, settingssuccess, serviceLocation, serviceArea, serviceProvide}}) => ({
  sessionUser: sessionUser,
  sessionLogged: sessionLogged,

  settingsloading: settingsloading,
  settingssuccess: settingssuccess,
  settingserror: settingserror,
  serviceLocation: serviceLocation, 
  serviceArea: serviceArea, 
  serviceProvide: serviceProvide
});

const mapDispatchToProps = {
  updateLocation: updateLocation,
  settingsDone: settingsDone,
  addServiceArea: addServiceArea,
  sessionRestore: sessionRestore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCityStateScreen);


// styles={{
//   description: {
//     fontWeight: 'bold',
//   },
//   predefinedPlacesDescription: {
//     color: '#1faadb',
//   },
//   listView: {
//     //backgroundColor: '#4286f4',
//     width: width - 20
//   },
//   textInputContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 20,
//     backgroundColor: 'rgba(0,0,0,0)',
//     borderTopWidth: 2,
//     borderBottomWidth: 2,
//     borderColor: 'black',
//     width: width - 20
//   },
//   textInput: {
//     marginLeft: 0,
//     marginRight: 0,
//     height: 38,
//     color: 'black', 
//     fontSize: 20,
//   },

// }}
