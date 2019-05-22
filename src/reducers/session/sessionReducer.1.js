import * as types from '../../actions/session/actionsTypes';

const initialState = {
  restoring: false,
  loading: false,
  user: {},
  error: null,
  logged: null,
  registered: null,
  sendpasswordreset: false,
  updateprofilesuccess: false,
  providerList: [],
  signInSuccess: false
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SESSION_SIGNIN_ERROR:
      return { ...state, restoring: false, loading: false, error: null }; 
    case types.SESSION_RESTORING:
      return { ...state, restoring: true };
    case types.SESSION_LOADING:
      return { ...state, restoring: false, loading: true, error: null };
    case types.SESSION_SUCCESS:
      //AsyncStorage.setItem('userId', action.user.userId);
      return {
        ...state,
        restoring: false,
        loading: false,
        user: action.user,
        error: null,
        logged: true,
        registered: null,
        sendpasswordreset: false,
        signInSuccess: false
        // providerMode: action.user.providerMode
      };
    case types.SIGNUP_SUCCESS:
      return {
        ...state,
        restoring: false,
        loading: false,
        user: action.user,
        error: null,
        logged: true,
        registered: true,
        sendpasswordreset: false,
        signInSuccess: false
        // providerMode: action.user.providerMode
      };
    case types.SESSION_ERROR:
      return {
        ...state,
        restoring: false,
        loading: false,
        user: null,
        error: action.error,
        logged: null,
        registered: null,
        sendpasswordreset: false
      };
    case types.SESSION_LOGOUT:
      return initialState;
    case types.SESSION_PASSWORD_RESET:
      // console.log('types.SESSION_PASSWORD_RESET')
      return {
        ...state,
        restoring: false,
        loading: false,
        error: null,
        logged: null,
        user: null,
        registered: null,
        sendpasswordreset: true   
      }
    case types.SESSION_PASSWORD_RESET_DONE:
      return {
        ...state,
        sendpasswordreset: false   
      }
    case types.SESSION_UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        updateprofilesuccess: true
      };
    case types.SESSION_UPDATE_PROFILE_DONE:
      return {
        ...state,
        loading: false,
        error: null,
        updateprofilesuccess: false
      };  
    case types.SESSION_LOADED_PROVIDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        providerList: action.providerList
      }; 
    case types.SESSION_UPDATE_PROVIDER_MODE:
      return {
        ...state,
        // user: user,
        loading: false,
        error: null,
        updateprofilesuccess: true
      };
    case types.SESSION_SIGNIN_SUCCESS:
      console.log('types.SESSION_SIGNIN_SUCCESS')
      return {
        ...state,
        signInSuccess: true
      };  
      
      
    default:
      return state;
  }
};

export default sessionReducer;
