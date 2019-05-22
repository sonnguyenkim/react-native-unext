import { combineReducers } from 'redux';


import sessionReducer from '../reducers/session/sessionReducer'
import sidebarReducer from '../reducers/sidebar/sidebarReducer'
import authReducer from '../reducers/auth/authReducer'
import uploadReducer from '../reducers/upload/uploadReducer'
import chatReducer from '../reducers/chat/chatReducer'
import servicesReducer from '../reducers/services/servicesReducer'
import settingsReducer from '../reducers/settings/settingsReducer'
import requestServiceReducer from '../reducers/requestService/requestServiceReducer'
import favouritesReducer from '../reducers/favourites/favouritesReducer'

export default combineReducers({
  sessionReducer,
  sidebarReducer,
  authReducer,
  uploadReducer,
  chatReducer,
  servicesReducer,
  settingsReducer,
  requestServiceReducer,
  favouritesReducer
});
