import * as types from '../../actions/services/actionsTypes';

const initialState = {
  servicesLoading: false,
  servicesError: null,
  servicesLoadedDone: false,
  // servicesProviderLoadedDone: false,
  servicesList: null,
  servicesProviderList: null
};

const servicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SERVICES_LOADING:
      return { ...state, servicesLoading: true, servicesError: null, servicesLoadedDone: false };
    case types.SERVICES_SUCCESS:
      return { ...state, servicesLoading: false, servicesError: null, servicesLoadedDone: false };
    case types.SERVICES_ERROR:
      return { ...state, servicesLoading: false, servicesError: action.error, servicesLoadedDone: false, 
                        servicesList: null, servicesProviderList: null };
    case types.SERVICES_LOADED_SUCCESS:
      return { ...state, servicesLoading: false, servicesError: null, servicesLoadedDone: false, servicesList: action.servicesList };
    case types.SERVICES_PROVIDER_LOADED_SUCCESS:
      return { ...state, servicesLoading: false, servicesError: null, servicesLoadedDone: true, servicesProviderList: action.servicesProviderList };
    default:
      return state;
  }
};

export default servicesReducer;
