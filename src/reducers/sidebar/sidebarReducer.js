import * as types from '../../actions/sidebar/actionsTypes';

const initialState = {
  sidebarReload: false,
  sidebarRestoring: false,
  sidebarUser: null,
  sidebarError: null,
  sidebarLogged: false,
  sidebarSuccess: false,
};

const sidebarReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SIDEBAR_NEED_TO_RELOAD:
      return { ...state, sidebarReload: true, sidebarRestoring: false, sidebarError: null }
    case types.SIDEBAR_RESTORING:
      return { ...state, sidebarReload: false, sidebarRestoring: true, sidebarError: null }
    case types.SIDEBAR_SUCCESS:
      return {
        sidebarReload: false,
        sidebarRestoring: false,
        sidebarUser: action.userInfo,
        sidebarError: null,
        sidebarLogged: true,
        sidebarSuccess: true
      }

    // case types.SIDEBAR_LOADING:
    //   return {
    //     ...state,
    //     sidebarRestoring: true
    //   };
    case types.SIDEBAR_ERROR:
      return {
        sidebarRestoring: false,
        sidebarUser: null,
        sidebarError: action.error,
        sidebarLogged: false,
        sidebarSuccess: false
      };
    case types.SIDEBAR_DONE:
      return {
        ...state,
        sidebarRestoring: false,
        sidebarSuccess: false
      };
    default:
      return state;
  }
};

export default sidebarReducer;
