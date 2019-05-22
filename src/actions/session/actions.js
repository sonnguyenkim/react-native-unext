import firebase from 'react-native-firebase';
import * as types from './actionsTypes';


export const sessionRestore = () => dispatch => {
  dispatch(sessionRestoringType());
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const firestore = firebase.firestore();
      firestore.collection('users').doc(user.uid).get()
        .then(userDoc => {
          const userCollection = userDoc.data();
          const userInfo = { ...userCollection};
          // Update Last Sign In
          const settings = { timestampsInSnapshots: true };
          const lastSignin = new Date();
          firestore.settings(settings);
          firestore.collection('users').doc(user.uid).update({lastSignin: lastSignin})
            .catch(function(error) {
              dispatch(sessionErrorType(error.message));
            });

          dispatch(sessionSuccessType(userInfo));
        })
        .catch(error => {
          dispatch(sessionErrorType(error.message));
        });
    } else {
      dispatch(sessionSignOut());
    }
  });
};

export const sessionDone = () => dispatch => {
  dispatch(sessionDoneType());
}

export const sessionNeedToReload = () => dispatch => {
  dispatch(sessionNeedToReloadType());
}

export const sessionSignOut = () => dispatch => {
  dispatch(sessionSignOutType());
}

//======================================

const sessionSignOutType = () => ({
  type: types.SESSION_SIGNOUT
});

const sessionNeedToReloadType = () => ({
  type: types.SESSION_NEED_TO_RELOAD
});

const sessionRestoringType = () => ({
  type: types.SESSION_RESTORING
});

const sessionDoneType = () => ({
  type: types.SESSION_DONE
});

const sessionSuccessType = userInfo => ({
  type: types.SESSION_SUCCESS,
  userInfo
});

const sessionErrorType = error => ({
  type: types.SESSION_ERROR,
  error
});

