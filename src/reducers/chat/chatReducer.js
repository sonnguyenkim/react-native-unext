import * as types from '../../actions/chat/actionsTypes';

const initialState = {
  loading: false,
  error: null,
  conversationList: [],

  messages: [],

  messageLoadedSuccess: false,
  messageSentSuccess: false,

  sending: false,
  sendingError: null,
  
  loadMessagesError: null
}

// {
//   _id: Math.round(Math.random() * 1000000),
//   text: '',
//   createdAt: new Date(),
//   user: {
//     _id: 2,
//     name: 'Seact Native',
//     avatar: "https://firebasestorage.googleapis.com/v0/b/chatapp-946c0.appspot.com/o/avatar%2Fanimal-creature-cute-47547.jpg?alt=media&token=909d8f37-11a5-4e86-a12b-26af06e274d5"
//   },
//   sent: true,
//   received: true,
//   location: {
//     latitude: 35.775392,
//     longitude: -78.761878
//   },
// },


const chatReducer = (state = initialState, action) => {
  switch(action.type) {
    case types.MESSAGE_LOADING:
      return { ...state, loading: true, error: null, messageSentSuccess: false, messageLoadedSuccess: false }
    case types.MESSAGE_ERROR:
      return { ...state, loading: false, error: action.error, messageSentSuccess: false, messageLoadedSuccess: false }
    case types.MESSAGE_CONVERSATION_LIST_LOAD_SUCCESS:
      return { ...state, loading: false, error: null, messageSentSuccess: false, messageLoadedSuccess: false, conversationList: action.conversationList }
    case types.MESSAGE_LOADED_SUCCESS:
      return { ...state, loading: false, error: null, messageSentSuccess: false, messageLoadedSuccess: true, messages: action.messages }
    case types.MESSAGE_LOADED_SUCCESS_AFFIRMATION:
      return { ...state, loading: false, error: null, messageSentSuccess: false, messageLoadedSuccess: false }
    case types.MESSAGE_LOADED_SNAPSHOT_SUCCESS:
      return { ...state, loading: false, error: null, messageSentSuccess: false, messageLoadedSuccess: false, messages: action.messages }
    case types.MESSAGE_SENT_SUCCESS:
      return { ...state, loading: false, error: null, messageSentSuccess: true, messageLoadedSuccess: false }
    
      

    case types.CHAT_MESSAGE_LOADING:
      return { ...state, loading: true, sending: false, sendingError: null }
    case types.CHAT_MESSAGE_ERROR:
      return { ...state, loading: false, sending: false, sendingError: action.error }
    case types.CHAT_MESSAGE_SUCCESS:
      return { ...state, loading: false, sending: false, sendingError: null, message: '' }
    case types.CHAT_MESSAGE_UPDATE:
      return { ...state, loading: false, sending: false, message: action.text, sendingError: null }
    case types.CHAT_LOAD_MESSAGES_SUCCESS:
      return { ...state, loading: false, sending: false, messages: action.messages, loadMessagesError: null }
    case types.CHAT_LOAD_MESSAGES_ERROR:
      return { ...state, loading: false, sending: false, messages: null, loadMessagesError: action.error }
    default:
      return state
  }
}

export default chatReducer

