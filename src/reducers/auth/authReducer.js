import * as types from '../../actions/auth/actionsTypes';

const initialState = {
  authLoading: false,
  authError: null,
  authUser: null,
  authLogged: false,

  authSignUpSuccess: false,
  authSignInSuccess: false,
  authSignOutSuccess: false,

  authSendPasswordReset: false,
  authUpdateProfileSuccess: false,

};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.AUTH_LOADING:
      return { ...state, authLoading: true, authError: null } 
    case types.AUTH_SUCCESS:
      return { ...state, authLoading: false, authError: null, authUpdateProfileSuccess: false, authSignInSuccess: false, authSignUpSuccess: false, authSignOutSuccess: false }
    case types.AUTH_ERROR:
      return { ...state, authLoading: false, authError: action.error, authSignInSuccess: false, authSignUpSuccess: false, authLogged: false }

    case types.AUTH_SIGNUP_SUCCESS:
      // return {...state, authLoading: false, authError: null, authSignUpSuccess: true, authUser: action.authUser, authLogged: true}
      console.log('AUTH_SIGNUP_SUCCESS')
      return {...state, authLoading: false, authError: null, authSignUpSuccess: true, authUser: null, authLogged: false}
    case types.AUTH_SIGNUP_DONE:
      return {...state, authLoading: false, authError: null, authSignUpSuccess: false}

    case types.AUTH_SIGNIN_SUCCESS:
      return {...state, authLoading: false, authError: null, authSignInSuccess: true, authUser: action.authUser, authLogged: true}
    case types.AUTH_SIGNIN_DONE:
      return {...state, authLoading: false, authError: null, authSignInSuccess: false}

    case types.AUTH_SIGNOUT_SUCCESS:
      return {...state, authLoading: false, authError: null, authSignOutSuccess: true, authLogged: false}
    case types.AUTH_SIGNOUT_DONE:
      return {...state, authLoading: false, authError: null, authSignOutSuccess: false, authLogged: false}
    
    case types.AUTH_PASSWORD_RESET_SUCCESS:
      return {...state, authLoading: false, authError: null, authSendPasswordReset: true}
    case types.AUTH_PASSWORD_RESET_DONE:
      return {...state, authLoading: false, authError: null, authSendPasswordReset: false}

    case types.AUTH_UPDATE_PROFILE_SUCCESS:
      return {...state, authLoading: false, authError: null, authUpdateProfileSuccess: true}
    case types.AUTH_UPDATE_PROFILE_DONE:
      return {...state, authLoading: false, authError: null, authUpdateProfileSuccess: false}

    default:
      return state;
  }
};

export default authReducer;
