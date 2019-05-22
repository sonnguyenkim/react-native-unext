import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
export default {
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
};
