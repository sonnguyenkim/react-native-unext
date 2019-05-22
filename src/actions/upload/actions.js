
import firebase from 'react-native-firebase';
import * as types from './actionsTypes';

export const uploadAvatar = (imagePathSrc) => dispatch => {
  dispatch(uploadLoadingType());
  /*
  * Begin upload avatar
  */
  const user = firebase.auth().currentUser;
  // console.log('Upload Get-user', user);

  // Note: jpg / png
  const imageRef = firebase
    .storage()
    .ref('userPhoto')
    .child(user.uid + '.jpg');

  let mime = 'image/jpg';

  imageRef
    .put(imagePathSrc, { contentType: mime })
    .then(() => {
      return imageRef.getDownloadURL();
    })
    .then(url => {
      // console.log('URL', url);
      // Now update users avatar
      // console.log('Upload Success', url);

      const firestore = firebase.firestore();
      // const user = firebase.auth().currentUser;
      // console.log('Upload Success-user', user);

      firestore.collection('users').doc(user.uid).update({
        photoURL: url
      })
      .then(() => {
        // console.log('Update Avatar field Success');
        dispatch(uploadSuccessType());
      })
      .catch((error) => {
        // console.log('Update Avatar field Error', error);
        dispatch(uploadErrorType(error));
      })
    })
    .catch((error) => {
      // console.log('Upload Error', error);
      dispatch(uploadErrorType(error));
    });     
};

export const uploadAvatarDone = () => dispatch => {
  dispatch(uploadAvatarDoneType());
};

const uploadLoadingType = () => ({
  type: types.UPLOAD_LOADING
});

const uploadImageType = () => ({
  type: types.UPLOAD_IMAGE
});

const uploadAvatarType = () => ({
  type: types.UPLOAD_AVATAR
});

const uploadSuccessType = user => ({
  type: types.UPLOAD_SUCCESS,
  user
});

const uploadErrorType = error => ({
  type: types.UPLOAD_ERROR,
  error
});

const uploadAvatarDoneType = () => ({
  type: types.UPLOAD_AVATAR_DONE
});
