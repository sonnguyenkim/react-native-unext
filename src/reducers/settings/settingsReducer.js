import * as types from '../../actions/settings/actionsTypes';

const initialState = {
  settingsloading: false,
  settingserror: null,
  settingssuccess: false,

  serviceLocation: null,
  isServiceProvider: false,
  providerMode: false,
  serviceArea: [],
  serviceProvide: [],

};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SETTINGS_LOADING:
      return { ...state, settingsloading: true, settingserror: null };
    case types.SETTINGS_SUCCESS:
      return { ...state, settingsloading: false, settingserror: null , settingssuccess: true };
    case types.SETTINGS_DONE:
      return { ...state, settingsloading: false, settingserror: null , settingssuccess: false };
    case types.SESSION_ERROR:
      return { ...state, settingsloading: false, settingserror: action.error, settingssuccess: false };
    case types.SETTINGS_UPDATE_LOCATION_SUCCESS:
      return { ...state, settingsloading: false, settingserror: null , 
                settingssuccess: true, serviceLocation: action.serviceLocation };
    case types.SETTINGS_UPDATE_SERVICE_AREA_SUCCESS:
      return { ...state, settingsloading: false, settingserror: null , 
                settingssuccess: true, serviceArea: action.serviceArea };
    case types.SETTINGS_UPDATE_SERVICE_PROVIDE_SUCCESS:
      return { ...state, settingsloading: false, settingserror: null , 
                settingssuccess: true, serviceProvide: action.serviceProvide };
    case types.SETTINGS_UPDATE_PROVIDER_MODE_SUCCESS:
      return { ...state, settingsloading: false, settingserror: null , 
                settingssuccess: true, providerMode: action.providerMode };
    case types.SETTINGS_LOAD_USER_INFO:
        console.log('SETTINGS_LOAD_USER_INFO-action.settingsInfo',action.settingsInfo)
      return { ...state, settingsloading: false, settingserror: null , settingssuccess: true, 
                serviceLocation: action.settingsInfo.serviceLocation, 
                serviceArea: action.settingsInfo.serviceArea, 
                serviceProvide: action.settingsInfo.serviceProvide,
                providerMode: action.settingsInfo.providerMode,
                isServiceProvider: action.settingsInfo.isServiceProvider
              };
    default:
      return state;
  }
};

export default settingsReducer;
