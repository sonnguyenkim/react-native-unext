
import firebase from 'react-native-firebase';
import * as types from './actionsTypes';

export const loadUserList = (includeCurrentUser) => dispatch => {
  // console.log('actions-getUserList');
  dispatch(serviceLoading());
  var userList = [];
  const currentUser = firebase.auth().currentUser;
  const firestore = firebase.firestore();
  firestore.collection('users').get()
  .then(snapshot => {
    snapshot
    .docs.forEach(doc => {
      // const userInfo = {
      //   displayName: doc._data.displayName , 
      //   email: doc._data.email, 
      //   firstName: doc._data.firstName, 
      //   lastName: doc._data.lastName, 
      //   photoURL: doc._data.photoURL, 
      //   uid: doc._data.uid
      // };
      const userInfo = {
        name: doc._data.firstName + ' ' + doc._data.lastName, 
        email: doc._data.email, 
        avatar: doc._data.photoURL, 
        senderId: doc._data.uid,
        displayName: doc._data.displayName 
      };
      if (includeCurrentUser == true) {
        userList.push(userInfo);
      } else {
        if (currentUser.email != userInfo.email ) {
          userList.push(userInfo);
        }
      }
      
    });
    // console.log('actions-getUserList-snapshot', userList);
    dispatch(serviceLoadUserSuccess(userList));
  })
  .catch(error => {
    dispatch(serviceError(error.message));
  });
}


const serviceLoading = () => ({
  type: types.SERVICE_LOADING
});

const serviceSuccess = () => ({
  type: types.SERVICE_SUCCESS
});

const serviceError = error => ({
  type: types.SERVICE_ERROR,
  error
});

const serviceLoadUserSuccess = (userList) => ({
  type: types.SERVICE_LOAD_USER_SUCCESS,
  userList
});


