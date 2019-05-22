const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {
    alignSelf: "stretch",
    // height: deviceHeight / 3.5,
    height: deviceHeight * 1/6,
    width: null,
    position: "relative",
    marginBottom: 10

  },
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  drawerHeader: {
    // height: 120,
    height: deviceHeight * 1/6,
    backgroundColor: '#02420b'
  },
  drawerImage: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
    top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
    width: 210,
    height: 75,
    resizeMode: "cover"
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    fontSize: 16,
    marginLeft: 20
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -3 : undefined
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#777777'

  },
  imageProfile: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
    // flexDirection: 'column',
    // justifyContent: 'center'
  },
  image: {
    height: 70,
    width: 70,
    borderRadius: 50,
    paddingLeft: 20,
    paddingRight: 20
  },
  displayName: {
    height: 60,
    width: 60,
    bottom: 8,
    borderWidth:1,
    borderColor:'grey',
    borderRadius:30,
    backgroundColor:'#A6D869',
    justifyContent: 'center',
    textAlign: 'center',
  },
  textProfile: {
    color: 'white',
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    color: 'white',

  },
};
