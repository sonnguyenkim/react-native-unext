
import firebase from 'react-native-firebase';
import * as types from './actionsTypes';

{/*
  conversations (collections)
    -> conversationId [smallId_largeId] (Doc)
        contactInfo [1st_id, 2nd_id]
        contactInfoDetial [
          { contactId: '', name: '', avatar: '', email: '', displayName: '' },
          { contactId: '', name: '', avatar: '', email: '', displayName: '' }
        ]
        messages: [
            { text: 'message 1', createAt: new Date(), senderId: ''},   
            { text: 'message 1', createAt: new Date(), senderId: ''},
            { text: 'message 1', createAt: new Date(), senderId: ''},
            { text: 'message 1', createAt: new Date(), senderId: ''},
            ....
        ]

*/}

// const Collection_Conversations = 'conversations';

const FIREBASE_REF_MESSAGES_LIMIT = 20;

const CONVERSATIONS_ROOT = 'conversations';

export const getConversationList = () => dispatch => {
  dispatch(messageLoading());
  let conversationList = [];
  let currentUser = firebase.auth().currentUser; 
  let currentId = currentUser.uid;
  const httpsCallable = firebase.functions().httpsCallable('getConversationList')
  httpsCallable({userId: currentId})
    .then(function(response) {
      // console.log('getConversationList-response.data', response.data)
      let responseData = response.data
      dispatch(messageConversationListLoadSuccess(responseData));
    })
    .catch(function(error) {
      dispatch(messageError(error.message));
    });
}

export const sendMessage = (message, receiverId) => dispatch => {
    let currentUser = firebase.auth().currentUser;
    let senderId = currentUser.uid;
    const httpsCallable = firebase.functions().httpsCallable('sendMessage')
    httpsCallable({senderId: senderId, receiverId: receiverId, message: message})
      .then(function(response) {
        // console.log('getConversationList-response.data', response.data)
        dispatch(messageSentSuccess());
      })
      .catch(function(error) {
        dispatch(messageError(error.message));
      });
  
}

export const loadConversationForContactId = (contactId) => dispatch => {
  var messages = [];
  let currentUser = firebase.auth().currentUser;
  let currentId = currentUser.uid;
  const httpsCallable = firebase.functions().httpsCallable('loadConversationForContactId')
  httpsCallable({currentId: currentId, contactId: contactId})
    .then(function(response) {
      // console.log('getConversationList-response.data', response.data)
      messages = response.data
      // console.log('loadConversationForContactId-messages', messages);
      dispatch(messageLoadedSuccess(messages));
    })
    .catch(function(error) {
      dispatch(messageError(error.message));
    });
}

//===========================
// Update unseenCount message
//===========================
export const loadConversationForContactIdAffirmation = (contactId) => dispatch => {
  var messages = [];
  let currentUser = firebase.auth().currentUser;
  let currentId = currentUser.uid;
  const httpsCallable = firebase.functions().httpsCallable('loadConversationForContactIdAffirmation')
  httpsCallable({currentId: currentId, contactId: contactId})
    .then(function(response) {
      // console.log('loadConversationForContactIdAffirmation-response.data', response.data)      
      dispatch(messageLoadedSuccessAffirmation());
    })
    .catch(function(error) {
      dispatch(messageError(error.message));
    });
}


export const messageSentRequestConfirm = () => dispatch => {
  dispatch(messageSentRequestDone());
}

//============================================

const chatMessageLoading = () => ({
  type: types.CHAT_MESSAGE_LOADING
})

const chatMessageSuccess = () => ({
  type: types.CHAT_MESSAGE_SUCCESS
})

const chatMessageError = error => ({
  type: types.CHAT_MESSAGE_ERROR,
  error
})

const chatUpdateMessage = text => ({
  type: types.CHAT_MESSAGE_UPDATE,
  text
})

const loadMessageSuccess = messages => ({
  type: types.CHAT_LOAD_MESSAGES_SUCCESS,
  messages
})

const loadMessagesError = error => ({
  type: types.CHAT_LOAD_MESSAGES_ERROR,
  error
})



const messageLoading = () => ({
  type: types.MESSAGE_LOADING
})

const messageLoadedSuccess = messages => ({
  type: types.MESSAGE_LOADED_SUCCESS,
  messages 
})

const messageLoadedSnapshotSuccess = messages => ({
  type: types.MESSAGE_LOADED_SNAPSHOT_SUCCESS,
  messages 
})

const messageSentRequestDone = () => ({
  type: types.MESSAGE_LOADED_SUCCESS_AFFIRMATION
})

const messageLoadedSuccessAffirmation = () => ({
  type: types.MESSAGE_LOADED_SUCCESS_AFFIRMATION
})


const messageError = error => ({
  type: types.MESSAGES_ERROR,
  error
})

const messageConversationListLoadSuccess = conversationList => ({
  type: types.MESSAGE_CONVERSATION_LIST_LOAD_SUCCESS,
  conversationList
})

const messageSentSuccess = () => ({
  type: types.MESSAGE_SENT_SUCCESS
})
