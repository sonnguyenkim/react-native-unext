import firebase from 'react-native-firebase';
import * as types from './actionsTypes';


export const sidebarRestore = () => dispatch => {
  dispatch(sidebarRestoringType())
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const firestore = firebase.firestore();
      firestore.collection('users').doc(user.uid).get()
        .then(userDoc => {
          const userCollection = userDoc.data();
          const userInfo = { ...userCollection};
          // Update Last Sign In
          // const settings = { timestampsInSnapshots: true };
          // const lastSignin = new Date();
          // firestore.settings(settings);
          // firestore.collection('users').doc(user.uid).update({lastSignin: lastSignin})
          //   .catch(function(error) {
          //     dispatch(sidebarErrorType(error.message));
          //   });

          dispatch(sidebarSuccessType(userInfo));
        })
        .catch(error => {
          dispatch(sidebarErrorType(error.message));
        });
    } else {
      
    }
  });
}

export const sidebarNeedToReload = () => dispatch => {
  dispatch(sidebarNeedToReloadType());
}

export const sidebarDone = () => dispatch => {
  dispatch(sidebarDoneType());
}

//=======================================
const sidebarRestoringType = () => ({
  type: types.SIDEBAR_RESTORING
})

const sidebarSuccessType = userInfo => ({
  type: types.SIDEBAR_SUCCESS,
  userInfo
})

const sidebarErrorType = error => ({
  type: types.SIDEBAR_ERROR,
  error
})

const sidebarDoneType = () => ({
  type: types.SIDEBAR_DONE
})

const sidebarNeedToReloadType = () => ({
  type: types.SIDEBAR_NEED_TO_RELOAD
});


