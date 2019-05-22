
import firebase from 'react-native-firebase';
import * as types from './actionsTypes';

export const loadServiceList = () => dispatch => {
  dispatch(servicesLoading());
  // console.log('actions-serviceList-START');
  var servicesList = [];
  const firestore = firebase.firestore();
  firestore.collection('services').get()
  .then(snapshot => {
    snapshot
    .docs.forEach(doc => {
      // console.log('actions-serviceList-doc', doc);
      // console.log('actions-serviceList-doc ID', doc.id);
      const serviceInfo = {
        id: doc.id, 
        name: doc._data.name, 
        description: doc._data.description, 
        photo: doc._data.photo 
      };
      servicesList.push(serviceInfo);
    });
    // console.log('actions-serviceList-result', servicesList);
    dispatch(servicesLoadedSuccess(servicesList));
  })
  .catch(error => {
    dispatch(servicesError(error.message));
  });
}

export const loadServiceProviderList = (location, service) => dispatch => {
  dispatch(servicesLoading());
  var servicesProviderList = [];
  const firestore = firebase.firestore();

  const userRef = firestore.collection('users');
  userRef.where('isServiceProvider','==',true).where('serviceArea','array-contains',location).get()
    .then(docs => {
      docs.forEach(doc => {
        const serviceList = doc.data().serviceProvide
        // console.log('actions-loadServiceProviderList-DOC', serviceList);
        if (serviceList.indexOf(service) >= 0) {
          servicesProviderList.push(doc.data());
        }
      });
      if (servicesProviderList.length > 0) {
        // console.log('actions-loadServiceProviderList-servicesProviderList', servicesProviderList);
        dispatch(servicesProviderLoadedSuccess(servicesProviderList));
      } else {
        dispatch(servicesProviderLoadedSuccess([]));
      }
    })
    .catch(error => {
      dispatch(servicesError(error.message));
    })
}

export const loadProvidersByLocationAndJobs = (location, jobs) => dispatch => {
  dispatch(servicesLoading())
  const httpsCallable = firebase.functions().httpsCallable('loadProvidersByLocationAndJobs')
  // console.log('data return', servicesProviderList)
  httpsCallable({location: location, jobs: jobs})
    .then(function(respData) {
      // console.log('respData return', respData)
      // console.log('data respData.data', respData.data)
      let servicesProviderList = respData.data
      if (servicesProviderList.length > 0) {
        // console.log('actions-loadServiceProviderList-servicesProviderList > 0', servicesProviderList);
        dispatch(servicesProviderLoadedSuccess(servicesProviderList));
      } else {
        dispatch(servicesProviderLoadedSuccess([]));
      }
    })
    .catch(function(error) {
      dispatch(sessionError(error.message));
    });
};

export const loadServiceDone = () => dispatch => {
  dispatch(servicesSuccess());
}

const servicesLoading = () => ({
  type: types.SERVICES_LOADING
});

const servicesSuccess = () => ({
  type: types.SERVICES_SUCCESS
});

const servicesError = error => ({
  type: types.SERVICES_ERROR,
  error
});

const servicesLoadedSuccess = (servicesList) => ({
  type: types.SERVICES_LOADED_SUCCESS,
  servicesList
});

const servicesProviderLoadedSuccess = (servicesProviderList) => ({
  type: types.SERVICES_PROVIDER_LOADED_SUCCESS,
  servicesProviderList
});




