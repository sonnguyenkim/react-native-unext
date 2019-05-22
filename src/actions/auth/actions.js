import firebase from 'react-native-firebase';
import * as types from './actionsTypes';


export const authSuccess = () => dispatch => {
  dispatch(authSuccessType())
}

export const authSignIn = (email, password) => dispatch => {
  dispatch(authLoadingType())
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
          if (userDoc.exists) {
            // console.log('userDoc.exists')
            const authUser = userDoc.data()
            dispatch(authSignInSuccessType(authUser))
          } else {
            dispatch(authErrorType("User's data does not exists!"))
          }
        })
        .catch(error => {
          dispatch(authErrorType(error.message))
        })
    })
    .catch(error => {
      dispatch(authErrorType(error.message))
    })
}

export const authSignInDone = () => dispatch => {
  dispatch(authSignInDoneType())
}

// export const authSignUp = (email, password, firstName, middleName, lastName, isServiceProvider) => dispatch => {
//   dispatch(authLoadingType());
//   firebase
//     .auth()
//     .createUserWithEmailAndPassword(email, password)
//     .then(user => {
//       const authUser = {
//         displayName: firstName[0].toUpperCase() + lastName[0].toUpperCase(),
//         firstName: firstName.slice(0,1).toUpperCase() + firstName.slice(1, firstName.length),
//         middleName: middleName,
//         lastName: lastName.slice(0,1).toUpperCase() + lastName.slice(1,lastName.length),
//         email: email,
//         uid: user.user.uid,
//         photoURL: '',
//         phoneNumber: '',
//         fcmToken: [],
//         ratingAsProvider: 0.0,
//         ratingCountAsProvider: 0,
//         ratingAsConsumer: 0.0,
//         ratingCountAsConsumer: 0,
//         location: '',
//         serviceArea: [],
//         serviceProvide: [],
//         isServiceProvider: isServiceProvider,
//         providerMode: false
//       }
//       const firestore = firebase.firestore();
//       const settings = { timestampsInSnapshots: true };
//       firestore.settings(settings);
//       firestore.collection('users').doc(user.user.uid).set(authUser)
//         .then(function() {
//           dispatch(authSignUpSuccessType(authUser));
//         })
//         .catch(function(error) {
//           dispatch(authErrorType(error.message))
//         });
//     })
//     .catch(error => {
//       dispatch(authErrorType(error.message))
//     });
// }

export const authSignUp = (email, password, firstName, middleName, lastName, isServiceProvider) => dispatch => {
  dispatch(authLoadingType());
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(user => {
      const authUser = {
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
        providerMode: isServiceProvider
      }
      const firestore = firebase.firestore();
      const settings = { timestampsInSnapshots: true };
      firestore.settings(settings);
      firestore.collection('users').doc(user.user.uid).set(authUser)
        .then(function() {
          dispatch(authSignUpSuccessType(authUser));
        })
        .catch(function(error) {
          dispatch(authErrorType(error.message))
        });
    })
    .catch(error => {
      dispatch(authErrorType(error.message))
    });
}


export const authSignUpDone = () => dispatch => {
  dispatch(authSignUpDoneType())
}

export const authSignOut = () => dispatch => {
  dispatch(authLoadingType());
  firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(authSignOutSuccessType());
    })
    .catch(error => {
      dispatch(authErrorType(error.message));
    });
}

export const authSignOutDone = () => dispatch => {
  dispatch(authSignOutDoneType())
}


export const authSendPasswordResetEmail = (email) => dispatch => {
  dispatch(authLoadingType());
  firebase
    .auth()
    .sendPasswordResetEmail(email)
    .then(() => {
      dispatch(authPasswordResetSuccessType());
    })
    .catch(error => {
      dispatch(authErrorType(error.message));
    });
}

export const authPasswordResetDone = () => dispatch => {
  dispatch(authPasswordResetDoneType())
}

export const authUpdateProfile = (user) => dispatch => {
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
  dispatch(authLoadingType());
  // console.log('action-updateProfile');
  // let currentUser = firebase.auth().currentUser; 
  const firestore = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  firestore.settings(settings);
  firestore.collection('users').doc(user.uid).update({...userInfo})
    .then(function() {
      dispatch(authUpdateProfileSuccessType());
    })
    .catch(function(error) {
      dispatch(authErrorType(error.message));
    });
}

export const authUpdateProfileDone = () => dispatch => {
  dispatch(authUpdateProfileDoneType());
}

export const authUpdateLastSignin = () => dispatch => {
  let currentUser = firebase.auth().currentUser; 
  const firestore = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  const lastSignin = new Date();
  firestore.settings(settings);
  firestore.collection('users').doc(currentUser.uid).update({lastSignin: lastSignin})
    .catch(function(error) {
      dispatch(authErrorType(error.message));
    });
}

//==============================================

const authLoadingType = () => ({
  type: types.AUTH_LOADING
})

const authSuccessType = () => ({
  type: types.AUTH_SUCCESS
})

const authErrorType = (error) => ({
  type: types.AUTH_ERROR,
  error
})

const authSignUpSuccessType = (authUser) => ({
  type: types.AUTH_SIGNUP_SUCCESS,
  authUser
})

const authSignUpDoneType = () => ({
  type: types.AUTH_SIGNUP_DONE
})

const authSignInSuccessType = (authUser) => ({
  type: types.AUTH_SIGNIN_SUCCESS,
  authUser
})

const authSignInDoneType = () => ({
  type: types.AUTH_SIGNIN_DONE
})


const authSignOutSuccessType = () => ({
  type: types.AUTH_SIGNOUT_SUCCESS
})

const authSignOutDoneType = () => ({
  type: types.AUTH_SIGNOUT_DONE
})



const authPasswordResetSuccessType = () => ({
  type: types.AUTH_PASSWORD_RESET_SUCCESS
})

const authPasswordResetDoneType = () => ({
  type: types.AUTH_PASSWORD_RESET_DONE
})

const authUpdateProfileSuccessType = () => ({
  type: types.AUTH_UPDATE_PROFILE_SUCCESS
})

const authUpdateProfileDoneType = () => ({
  type: types.AUTH_UPDATE_PROFILE_DONE
})

