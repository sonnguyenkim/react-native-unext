import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import * as types from './actionsTypes';


// const saveUserInfo = async userInfo => {
//   try {
//     const jsonUserInfo = JSON.stringify(userInfo);
//     await AsyncStorage.setItem('userInfo', jsonUserInfo);
//   } catch (error) {
//     console.log(error);
//   }
// }
// const getUserInfo = async () => {
//   let userInfo = null;
//   try {
//     const jsonUserInfo = await AsyncStorage.getItem('userInfo')
//     if (jsonUserInfo) {
//       userInfo = JSON.parse(jsonUserInfo);
//     }
//   } catch (error) {
//     console.log(error);
//   }
//   return userInfo;
// }

export const signinError = () => dispatch => {
  dispatch(sessionSigninError());
}

export const restoreSession = () => dispatch => {
  dispatch(sessionRestoring());
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const firestore = firebase.firestore();
      firestore.collection('users').doc(user.uid).get()
        .then(userDoc => {
          const userCollection = userDoc.data();
          const userInfo = { ...user, ...userCollection};
          // Update Last Sign In
          const settings = { timestampsInSnapshots: true };
          const lastSignin = new Date();
          firestore.settings(settings);
          firestore.collection('users').doc(user.uid).update({lastSignin: lastSignin})
            .then(function() {
              // console.log('updateLastSignin-success');
            })
            .catch(function(error) {
              dispatch(sessionError(error.message));
            });

          dispatch(sessionSuccess(userInfo));
        })
        .catch(error => {
          dispatch(sessionError(error.message));
        });
    } else {
      dispatch(sessionLogout());
    }
  });
};

export const loginUser = (email, password) => dispatch => {
  dispatch(sessionLoading());
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      // ========================================
      // Cloud Store
      const firestore = firebase.firestore();
      const settings = { timestampsInSnapshots: true };
      firestore.settings(settings);
      firestore.collection('users').doc(user.user.uid).get()
        .then(userDoc => {
          const userCollection = userDoc.data();
          // const userInfo = { ...user.user, ...userCollection };
          // dispatch(sessionSuccess(userInfo));
          if (userDoc.exists) {
            console.log('userDoc.exists')
            dispatch(sessionSignInSuccessType())
          } else {
            dispatch(sessionError("User's data does not exists!"));
          }
         
        })
        .catch(error => {
          dispatch(sessionError(error.message));
        });
    })
    .catch(error => {
      dispatch(sessionError(error.message));
    });
};

export const signupUser = (email, password, firstName, middleName, lastName, isServiceProvider) => dispatch => {
  dispatch(sessionLoading());

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      const userCollection = {
        displayName: firstName[0].toUpperCase() + lastName[0].toUpperCase(),
        firstName: firstName.slice(0,1).toUpperCase() + firstName.slice(1, firstName.length),
        middleName: middleName,
        lastName: lastName.slice(0,1).toUpperCase() + lastName.slice(1,lastName.length),
        email: email,
        uid: user.user.uid,
        photoURL: '',
        phoneNumber: '',
        fcmToken: [],
        ratingAsProvider: 0.0,
        ratingCountAsProvider: 0,
        ratingAsConsumer: 0.0,
        ratingCountAsConsumer: 0,
        location: '',
        serviceArea: [],
        serviceProvide: [],
        isServiceProvider: isServiceProvider,
        providerMode: false
      }
      const firestore = firebase.firestore();
      const settings = { timestampsInSnapshots: true };
      firestore.settings(settings);
      firestore.collection('users').doc(user.user.uid).set(userCollection)
        .then(function() {
          const userInfo = { ...user.user, ...userCollection };
          // Update User Profile if needed
          dispatch(signupSuccess(userInfo));
        })
        .catch(function(error) {
          // console.error("Error writing document: ", error);
          dispatch(sessionError(error.message));
        });
    })
    .catch(error => {
      dispatch(sessionError(error.message));
    });
};

export const logoutUser = () => dispatch => {
  dispatch(sessionLoading());

  firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(sessionLogout());
    })
    .catch(error => {
      dispatch(sessionError(error.message));
    });
};

export const sendPasswordResetEmail = (email) => dispatch => {
  dispatch(sessionLoading());
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      dispatch(sessionPasswordReset());
    })
    .catch(error => {
      dispatch(sessionError(error.message));
    });
};

export const sessionPasswordResetDone = () => dispatch => {
  dispatch(sessionPasswordResetDoneType())
}


// export const updateProviderMode = (providerMode) => dispatch => {
//   dispatch(sessionLoading());
//   // const userInfo = {
//   //   providerMode: providerMode,
//   // }
//   console.log('action-updateProviderMode');
//   const currentUser = firebase.auth().currentUser; 
//   const firestore = firebase.firestore();
//   const settings = { timestampsInSnapshots: true };
//   firestore.settings(settings);
//   firestore.collection('users').doc(currentUser.uid).update({providerMode: providerMode})
//     .then(function() {
//       // dispatch(sessionUpdateProfileSuccess());
//       console.log('action-updateProviderMode-sessionUpdateProviderModeType');
//       dispatch(sessionUpdateProviderModeType(providerMode));
//     })
//     .catch(function(error) {
//       console.log('action-updateProviderMode-ERROR');
//       dispatch(sessionError(error.message));
//     });
// };


export const updateProfile = (user) => dispatch => {
  const userInfo = {
    // email: email,
    // uid: user.user.uid,
    // location: user.location,
    displayName: user.firstName[0].toUpperCase() + user.lastName[0].toUpperCase(),
    // photoURL: user.photoURL,
    firstName: user.firstName.trim().slice(0,1).toUpperCase() + user.firstName.trim().trim().slice(1, user.firstName.trim().length),
    middleName: user.middleName.trim(),
    lastName: user.lastName.trim().slice(0,1).toUpperCase() + user.lastName.trim().slice(1,user.lastName.trim().length),
    phoneNumber: user.phoneNumber,
    fcmToken: user.fcmToken,
    ratingAsProvider: user.ratingAsProvider,
    ratingCountAsProvider: user.ratingCountAsProvider,
    ratingAsConsumer: user.ratingAsConsumer,
    ratingCountAsConsumer: user.ratingCountAsConsumer,
    serviceArea: user.serviceArea,
    serviceProvide: user.serviceProvide,
    isServiceProvider: user.isServiceProvider,
    providerMode: user.providerMode,
    aboutMe: user.aboutMe
  }
  dispatch(sessionLoading());
  // console.log('action-updateProfile');
  // let currentUser = firebase.auth().currentUser; 
  const firestore = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  firestore.settings(settings);
  firestore.collection('users').doc(user.uid).update({...userInfo})
    .then(function() {
      dispatch(sessionUpdateProfileSuccess());
    })
    .catch(function(error) {
      dispatch(sessionError(error.message));
    });
};

export const updateProfileDone = () => dispatch => {
  dispatch(sessionUpdateProfileDone());
};

export const updateLastSignin = () => dispatch => {
  // console.log('updateLastSignin');
  let currentUser = firebase.auth().currentUser; 
  const firestore = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  const lastSignin = new Date();
  firestore.settings(settings);
  firestore.collection('users').doc(currentUser.uid).update({lastSignin: lastSignin})
    .then(function() {
      // console.log('updateLastSignin-success');
    })
    .catch(function(error) {
      dispatch(sessionError(error.message));
    });
};

// export const loadProvidersByPlaceAndSearchStr = (place, searchStr) => dispatch => {
//   const httpsCallable = firebase.functions().httpsCallable('loadProvidersByPlaceAndSearchStr')

//   httpsCallable({place: place, searchStr: searchStr})
//     .then(function(data) {
//       console.log('data return', data)
//     })
//     .catch(function(error) {
//       dispatch(sessionError(error.message));
//     });
// };

const sessionSigninError = () => ({
  type: types.SESSION_SIGNIN_ERROR
});

const sessionRestoring = () => ({
  type: types.SESSION_RESTORING
});

const sessionLoading = () => ({
  type: types.SESSION_LOADING
});

const sessionSuccess = user => ({
  type: types.SESSION_SUCCESS,
  user
});

const signupSuccess = user => ({
  type: types.SIGNUP_SUCCESS,
  user
});

const sessionError = error => ({
  type: types.SESSION_ERROR,
  error
});

const sessionLogout = () => ({
  type: types.SESSION_LOGOUT
});

const sessionPasswordReset = () => ({
  type: types.SESSION_PASSWORD_RESET
});

const sessionUpdateProfileSuccess = () => ({
  type: types.SESSION_UPDATE_PROFILE_SUCCESS
});

const sessionUpdateProfileDone = () => ({
  type: types.SESSION_UPDATE_PROFILE_DONE
});

const sessionLoadProviderType = () => ({
  type: types.SESSION_LOADED_PROVIDERS_SUCCESS,
  providerList
});

const sessionUpdateProviderModeType = (providerMode) => ({
  type: types.SESSION_UPDATE_PROVIDER_MODE,
  providerMode
});

const sessionPasswordResetDoneType = () => ({
  type: types.SESSION_PASSWORD_RESET_DONE
});


const sessionSignInSuccessType = () => ({
  type: types.SESSION_SIGNIN_SUCCESS
});


