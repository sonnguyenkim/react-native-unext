import * as types from '../../actions/requestService/actionsTypes';

const initialState = {
  requestServiceLoading: false,
  requestServiceError: null,
  requestServiceSuccess: false,
  userRatingList: [],
  reviewsList: []
};

const requestServiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.REQUEST_SERVICE_LOADING:
      return { ...state, requestServiceLoading: true, requestServiceError: null, requestServiceSuccess: false };
    case types.REQUEST_SERVICE_SUCCESS:
      return { ...state, requestServiceLoading: false, requestServiceError: null, requestServiceSuccess: true };
    case types.REQUEST_SERVICE_DONE:
      return { ...state, requestServiceLoading: false, requestServiceError: null, requestServiceSuccess: false };
    case types.REQUEST_SERVICE_ERROR:
      return { ...state, requestServiceLoading: false, requestServiceError: action.error, requestServiceSuccess: false };
    case types.REQUEST_SERVICE_LIST_LOADED_SUCCESS:
      return { ...state, requestServiceLoading: false, requestServiceError: null, 
                requestServiceSuccess: false, userRatingList: action.userRatingList };
    case types.REQUEST_SERVICE_REVIEWS_LOADED_SUCCESS:
      return { ...state, requestServiceLoading: false, requestServiceError: null, 
              requestServiceSuccess: false, reviewsList: action.reviewsList };
                
    default:
      return state;
  }
};

export default requestServiceReducer;
