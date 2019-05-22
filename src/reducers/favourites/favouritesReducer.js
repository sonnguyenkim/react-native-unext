import * as types from '../../actions/favourites/actionsTypes';


const initialState = {
  favouritesLoading: false,
  favouritesError: null,
  favouritesSuccess: false,
  favouritesAddedSuccess: false,
  favouritesRemovedSuccess: false,
  favouritesLoadedSuccess: false,

  favouritesProviderList: []
};

const favouritesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FAVOURITES_LOADING:
      return { ...state, favouritesLoading: true, favouritesError: null, favouritesSuccess: false,
                favouritesAddedSuccess: false, favouritesRemovedSuccess: false, favouritesLoadedSuccess: false };
    case types.FAVOURITES_SUCCESS:
      return { ...state, favouritesLoading: false, favouritesError: null, favouritesSuccess: false,
                favouritesAddedSuccess: false, favouritesRemovedSuccess: false, favouritesLoadedSuccess: false};
    case types.FAVOURITES_ERROR:
      return { ...state, favouritesLoading: false, favouritesError: action.error, favouritesSuccess: false,
                favouritesAddedSuccess: false, favouritesRemovedSuccess: false, favouritesLoadedSuccess: false};
    case types.FAVOURITES_ADDED_SUCCESS:
      return { ...state, favouritesLoading: false, favouritesError: null, favouritesSuccess: false,
                favouritesAddedSuccess: true, favouritesRemovedSuccess: false, favouritesLoadedSuccess: false};
    case types.FAVOURITES_REMOVED_SUCCESS:
      return { ...state, favouritesLoading: false, favouritesError: null, favouritesSuccess: false,
                favouritesAddedSuccess: false, favouritesRemovedSuccess: true, favouritesLoadedSuccess: false};
    case types.FAVOURITES_LOADED_SUCCESS:
      return { ...state, favouritesLoading: false, favouritesError: null, favouritesSuccess: false, 
                favouritesAddedSuccess: false, favouritesRemovedSuccess: false, favouritesLoadedSuccess: true,
                favouritesProviderList: action.favouritesProviderList };
    // case types.FAVOURITES_DONE:
    //   return { ...state, favouritesLoading: false, favouritesError: null, favouritesSuccess: false,
    //           favouritesRemovedSuccess: false };
                        
    default:
      return state;
  }
};

export default favouritesReducer;
