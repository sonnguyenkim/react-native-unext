import * as types from '../../actions/upload/actionsTypes';

const initialState = {
  uploading: false,
  uploaderror: null,
  uploadsuccess: false
};

const uploadReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.UPLOAD_LOADING:
      return { uploading: true, uploaderror: null, uploadsuccess: false };
    case types.UPLOAD_SUCCESS:
      return { uploading: false, uploaderror: null, uploadsuccess: true };
    case types.UPLOAD_ERROR:
      return { uploading: false, uploaderror: action.error, uploadsuccess: false };
    case types.UPLOAD_AVATAR_DONE:
      return { uploading: false, uploaderror: null, uploadsuccess: false };
    default:
      return state;
  }
};

export default uploadReducer;
