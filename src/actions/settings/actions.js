import firebase from 'react-native-firebase';
import * as types from './actionsTypes';


export const settingsDone = () => dispatch => {
  dispatch(settingsDoneType());
}

export const settingLoadUserInfo = () => dispatch => {
  dispatch(settingsLoadingType());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  console.log('settingLoadUserInfo-user',user);
  firestore.collection('users').doc(user.uid).get()
  .then((doc) => {
    console.log('settingLoadUserInfo-doc',doc.data());

    const settingsInfo = {
      serviceLocation: doc.data().location,
      serviceArea: doc.data().serviceArea,
      serviceProvide: doc.data().serviceProvide,
      providerMode: doc.data().providerMode,
      isServiceProvider: doc.data().isServiceProvider
    }
    dispatch(settingsLoadUserInfoType(settingsInfo))
  })
  .catch((error) => {
    console.log('settingLoadUserInfo Error', error);
    dispatch(settingsErrorType(error.message));
  })
}

export const updateLocation = (serviceLocation) => dispatch => {
  dispatch(settingsLoadingType());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  // console.log('updateLocation-location',location);
  firestore.collection('users').doc(user.uid).update({
    location: serviceLocation
  })
  .then(() => {
    // console.log('Update serviceLocation field Success');
    dispatch(settingsUpdateLocationType(serviceLocation))
  })
  .catch((error) => {
    // console.log('Update serviceLocation field Error', error);
    dispatch(settingsErrorType(error.message));
  })
};

export const addServiceArea = (city) => dispatch => {
  // console.log('addServiceArea-city', city);
  dispatch(settingsLoadingType());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  firestore.collection('users').doc(user.uid).get()
  .then(userDoc => {
    const userCollection = userDoc.data();
    let userServiceArea = userCollection.serviceArea;
    // console.log('addServiceArea-userServiceArea-BEFORE',userServiceArea);
    if (userServiceArea.indexOf(city) < 0) {
      userServiceArea.push(city);
    }
    // console.log('addServiceArea-userServiceArea-AFTER',userServiceArea);
    firestore.collection('users').doc(user.uid).update({
      serviceArea: userServiceArea
    })
    .then(() => {
      // console.log('Update userServiceArea field Success');
      dispatch(settingsUpdateServiceAreaType(userServiceArea))
    })
    .catch((error) => {
      // console.log('Update userServiceArea field Error', error);
      dispatch(settingsErrorType(error.message));
    })
  })
  .catch(error => {
    dispatch(settingsErrorType(error.message));
  });
}

export const removeServiceArea = (city) => dispatch => {
  // console.log('removeServiceArea-city', city);
  // dispatch(settingsLoadingType());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  firestore.collection('users').doc(user.uid).get()
  .then(userDoc => {
    const userCollection = userDoc.data();
    let userServiceArea = userCollection.serviceArea;
    // console.log('removeServiceArea-userServiceArea-BEFORE',userServiceArea);
    if (userServiceArea.indexOf(city) >= 0) {
      // console.log('removeServiceArea-process',city);
      userServiceArea.splice(userServiceArea.indexOf(city), 1 );
    }
    // console.log('removeServiceArea-userServiceArea-AFTER',userServiceArea);
    firestore.collection('users').doc(user.uid).update({
      serviceArea: userServiceArea
    })
    .then(() => {
      // console.log('Update userServiceArea field Success');
      dispatch(settingsUpdateServiceAreaType(userServiceArea))
    })
    .catch((error) => {
      // console.log('Update userServiceArea field Error', error);
      dispatch(settingsErrorType(error.message));
    })
  })
  .catch(error => {
    dispatch(settingsErrorType(error.message));
  });
}

export const updateServiceProvide = (services, aboutMe) => dispatch => {
  // console.log('updateServiceProvide-service', services);
  dispatch(settingsLoadingType());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  firestore.collection('users').doc(user.uid).update({
    serviceProvide: services,
    aboutMe: aboutMe
  })
  .then(() => {
    // console.log('Update userServiceArea field Success');
    dispatch(settingsUpdateServiceProvideType(services))
  })
  .catch((error) => {
    // console.log('Update userServiceArea field Error', error);
    dispatch(settingsErrorType(error.message));
  })

}

export const addServiceProvide = (services) => dispatch => {
  // console.log('addServiceArea-service', service);
  dispatch(settingsLoadingType());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  firestore.collection('users').doc(user.uid).get()
  .then(userDoc => {
    const userCollection = userDoc.data();
    let userServiceProvide = userCollection.serviceProvide;
    // console.log('addServiceProvide-userServiceProvide-BEFORE',userServiceProvide);
    services.forEach(function(service){
      if (userServiceProvide.indexOf(service) < 0) {
        // Add it
        userServiceProvide.push(service);
      }
    })
    // console.log('addServiceProvide-userServiceProvide-AFTER',userServiceProvide);
    firestore.collection('users').doc(user.uid).update({
      serviceProvide: userServiceProvide
    })
    .then(() => {
      // console.log('Update userServiceArea field Success');
      dispatch(settingsUpdateServiceProvideType(services))
    })
    .catch((error) => {
      // console.log('Update userServiceArea field Error', error);
      dispatch(settingsErrorType(error.message));
    })
    
  })
  .catch(error => {
    dispatch(settingsErrorType(error.message));
  });
}

export const removeServiceProvide = (service) => dispatch => {
  // console.log('removeServiceArea-service', service);
  // dispatch(settingsLoadingType());
  const firestore = firebase.firestore();
  const user = firebase.auth().currentUser;
  firestore.collection('users').doc(user.uid).get()
  .then(userDoc => {
    const userCollection = userDoc.data();
    let userServiceProvide = userCollection.serviceProvide;
    // console.log('removeServiceArea-userServiceProvide-BEFORE',userServiceProvide);
    if (userServiceProvide.indexOf(service) >= 0) {
      userServiceProvide.splice(userServiceProvide.indexOf(service), 1 );
      // console.log('removeServiceArea-userServiceProvide-AFTER',userServiceProvide);
      firestore.collection('users').doc(user.uid).update({
        serviceProvide: userServiceProvide
      })
      .then(() => {
        // console.log('Update userServiceArea field Success');
        dispatch(settingsUpdateServiceProvideType(services))
      })
      .catch((error) => {
        // console.log('Update userServiceArea field Error', error);
        dispatch(settingsErrorType(error.message));
      })  
    }
  })
  .catch(error => {
    dispatch(settingsErrorType(error.message));
  });
}

export const updateProviderMode = (providerMode) => dispatch => {
  dispatch(settingsLoadingType());
  console.log('action-updateProviderMode');
  const currentUser = firebase.auth().currentUser; 
  const firestore = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  firestore.settings(settings);
  firestore.collection('users').doc(currentUser.uid).update({providerMode: providerMode})
    .then(function() {
      console.log('action-updateProviderMode');
      dispatch(settingsUpdateProviderModeType(providerMode));
    })
    .catch(function(error) {
      console.log('action-updateProviderMode-ERROR');
      dispatch(settingsErrorType(error.message));
    });
};



// ===================================
// Dispatch
// ===================================

const settingsLoadingType = () => ({
  type: types.SETTINGS_LOADING
});

const settingsSuccessType = () => ({
  type: types.SETTINGS_SUCCESS
});

const settingsDoneType = () => ({
  type: types.SETTINGS_DONE
});

const settingsErrorType = (error) => ({
  type: types.SETTINGS_ERROR,
  error
});

const settingsLoadUserInfoType = (settingsInfo) => ({
  type: types.SETTINGS_LOAD_USER_INFO,
  settingsInfo
});

const settingsUpdateLocationType = (serviceLocation) => ({
  type: types.SETTINGS_UPDATE_LOCATION_SUCCESS,
  serviceLocation
});

const settingsUpdateServiceAreaType = (serviceArea) => ({
  type: types.SETTINGS_UPDATE_SERVICE_AREA_SUCCESS,
  serviceArea
});

const settingsUpdateServiceProvideType = (serviceProvide) => ({
  type: types.SETTINGS_UPDATE_SERVICE_PROVIDE_SUCCESS,
  serviceProvide
});

const settingsUpdateProviderModeType = (providerMode) => ({
  type: types.SETTINGS_UPDATE_PROVIDER_MODE_SUCCESS,
  providerMode
});
