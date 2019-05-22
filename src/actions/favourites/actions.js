
import firebase from 'react-native-firebase';
import * as types from './actionsTypes';

export const addFavouriteProvider = (providerId) => dispatch => {
  dispatch(favouritesLoadingType());
  const userId = firebase.auth().currentUser.uid; 
  const httpsCallable = firebase.functions().httpsCallable('addFavouriteProvider')
  console.log('addFavouriteProvider', providerId)
  httpsCallable({userId: userId, providerId: providerId})
    .then(function(respData) {
      // console.log('respData return', respData)
      console.log('data respData.data', respData.data)
      let resp = respData.data
      if (resp) {
        // console.log('actions-loadServiceProviderList-servicesProviderList > 0', servicesProviderList);
        dispatch(favouritesAddedSuccessType());
      } else {
        dispatch(favouritesErrorType('This contact is not a provider.'));
      }
    })
    .catch(function(error) {
      dispatch(favouritesErrorType(error.message));
    });

}

export const removeFavouriteProvider = (providerId) => dispatch => {
  dispatch(favouritesLoadingType());
  const userId = firebase.auth().currentUser.uid; 
  const httpsCallable = firebase.functions().httpsCallable('removeFavouriteProvider')
  // console.log('data return', servicesProviderList)
  httpsCallable({userId: userId, providerId: providerId})
    .then(function(respData) {
      // console.log('respData return', respData)
      // console.log('data respData.data', respData.data)
      let resp = respData.data
      if (resp) {
        // console.log('actions-loadServiceProviderList-servicesProviderList > 0', servicesProviderList);
        dispatch(favouritesRemovedSuccessType());
      } else {
        dispatch(favouritesErrorType('Cannot delete Provider to Favourite List'));
      }
    })
    .catch(function(error) {
      dispatch(favouritesErrorType(error.message));
    });

}

export const loadFavouriteProvider = () => dispatch => {
  dispatch(favouritesLoadingType());
  const httpsCallable = firebase.functions().httpsCallable('loadFavouriteProvider')
  const userId = firebase.auth().currentUser.uid; 

  httpsCallable({userId: userId})
    .then(function(resp) {
      // console.log('resp return', resp)
      // console.log('data respData.data', resp.data)
      let favouritesProviderList = resp.data
      if (favouritesProviderList) {
        // console.log('actions-loadFavouriteProvider-favouritesProviderList', favouritesProviderList);
        dispatch(favouritesLoadedSuccessType(favouritesProviderList));
      } else {
        dispatch(favouritesLoadedSuccessType([]));
        // dispatch(favouritesErrorType('Favourite List is empty'));
      }
    })
    .catch(function(error) {
      dispatch(favouritesErrorType(error.message));
    });

}

export const _loadFavouriteProvider = (userId) => dispatch => {
  dispatch(favouritesLoadingType());
  const httpsCallable = firebase.functions().httpsCallable('loadFavouriteProvider')
  httpsCallable({userId: userId})
    .then(function(resp) {
      // console.log('--resp return', resp)
      // console.log('--data respData.data', resp.data)
      let respData = resp.data
      if (respData) {
        // console.log('actions-loadServiceProviderList-servicesProviderList > 0', servicesProviderList);
        dispatch(favouritesLoadedSuccessType(respData));
      } else {
        dispatch(favouritesErrorType('Favourite List is empty'));
      }
    })
    .catch(function(error) {
      dispatch(favouritesErrorType(error.message));
    });

}

export const favouritesSuccess = () => dispatch => {
  dispatch(favouritesSuccessType());
}

// ===============================================

const favouritesLoadingType = () => ({
  type: types.FAVOURITES_LOADING
});

const favouritesSuccessType = () => ({
  type: types.FAVOURITES_SUCCESS
});

const favouritesErrorType = error => ({
  type: types.FAVOURITES_ERROR,
  error
});

const favouritesAddedSuccessType = () => ({
  type: types.FAVOURITES_ADDED_SUCCESS
});

const favouritesRemovedSuccessType = () => ({
  type: types.FAVOURITES_REMOVED_SUCCESS
});

const favouritesLoadedSuccessType = (favouritesProviderList) => ({
  type: types.FAVOURITES_LOADED_SUCCESS,
  favouritesProviderList
});




