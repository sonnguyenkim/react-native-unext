import * as types from '../../actions/session/actionsTypes';

const initialState = {
  sessionReload: false,
  sessionRestoring: false,
  sessionUser: null,
  sessionError: null,
  sessionLogged: null,
  sessionSuccess: false,
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SESSION_NEED_TO_RELOAD:
      return { ...state, sessionReload: true, sessionRestoring: false, sessionError: null };
    case types.SESSION_RESTORING:
      return { ...state, sessionReload: false, sessionRestoring: true, sessionError: null };
    case types.SESSION_SUCCESS:
      return {
        sessionReload: false, 
        sessionRestoring: false,
        sessionUser: action.userInfo,
        sessionError: null,
        sessionLogged: true,
        sessionSuccess: true
      };
    case types.SESSION_ERROR:
      return {
        sessionReload: false, 
        sessionRestoring: false,
        sessionUser: null,
        sessionError: action.error,
        sessionLogged: false,
        sessionSuccess: false
      }
    case types.SESSION_SIGNOUT:
      return {
        sessionReload: false, 
        sessionRestoring: false,
        sessionUser: null,
        sessionError: null,
        sessionLogged: false,
        sessionSuccess: false
      }
    case types.SESSION_DONE:
      return {
        ...state,
        sessionRestoring: false,
        sessionSuccess: false
      };
    default:
      return state;
  }
};

export default sessionReducer;
