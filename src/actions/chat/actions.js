
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

const messageBox = 'messageBox';

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
      let responseData = response.data
      dispatch(messageConversationListLoadSuccess(responseData));
    })
    .catch(function(error) {
      dispatch(messageError(error.message));
    });
}

// export const getConversationList = () => dispatch => {
//   dispatch(messageLoading());
//   let conversationList = [];
//   let currentUser = firebase.auth().currentUser; 
//   let currentId = currentUser.uid;
//   const firestore = firebase.firestore();
//   const conversationsRef = firestore.collection(CONVERSATIONS_ROOT);
//   // Search for Conversation list based on Receiver Id
//   conversationsRef.where('contactInfo','array-contains',currentId).get()
//     .then(docs => {
//       docs.forEach(doc => {
//         const contactInfoDetail = doc.data().contactInfoDetail;
//         if (contactInfoDetail[0].senderId == currentId) {
//           conversationList.push(contactInfoDetail[1]);
//         } else {
//           conversationList.push(contactInfoDetail[0]);
//         }
//       });
//       dispatch(messageConversationListLoadSuccess(conversationList));
//     })
//     .catch(error => {
//       dispatch(messageError(error.message));
//     })
// }

export const sendMessage = (message, receiverId) => {
  return (dispatch) => {
    // dispatch(messageLoading());
    let senderIndex = 0;
    let currentUser = firebase.auth().currentUser;
    let senderId = currentUser.uid;
    let conversationId = '';
    let contactInfo = [];
    let contactInfoDetail = [];
    let msg = {
      text: message.text,
      createdAt: message.createdAt,
      senderId: senderId
    };
    contactInfo.push(receiverId);
    contactInfo.push(senderId);

    if (receiverId < senderId) {
      conversationId = receiverId + '_' + senderId;
    } else {
      conversationId = senderId + '_' + receiverId;
    }
    const firestore = firebase.firestore();
    firestore.collection('users').doc(senderId).get()
      .then(senderDoc => {
        const senderData = senderDoc.data();
        const senderDetail = {
          uid: senderData.uid,
          senderId: senderData.uid,
          email: senderData.email,
          firstName: senderData.firstName,
          lastName: senderData.lastName, 
          name: senderData.firstName + ' ' + senderData.lastName,
          displayName: senderData.displayName,
          avatar: senderData.photoURL,
          fcmToken: senderData.fcmToken,
          lastMessageTime: new Date(),
          lastMessage: msg,
          unseenCount: 1
        };        
        firestore.collection('users').doc(receiverId).get()
        .then(receiverDoc => {
          const receiverData = receiverDoc.data();
          const receiverDetail = {
            uid: receiverData.uid,
            senderId: receiverData.uid,
            email: receiverData.email,
            firstName: receiverData.firstName,
            lastName: receiverData.lastName, 
            name: receiverData.firstName + ' ' + receiverData.lastName,
            displayName: receiverData.displayName,
            avatar: receiverData.photoURL,
            fcmToken: receiverData.fcmToken,
            lastMessageTime: new Date(),
            lastMessage: {},
            unseenCount: 0
          };
          contactInfoDetail.push(receiverDetail);
          contactInfoDetail.push(senderDetail);
          // Save to DB
          let documentRef = firestore.collection(CONVERSATIONS_ROOT).doc(conversationId);
          documentRef.get()
          .then(doc => {
            if (doc.exists) {
              // Get unseenCOunt from contactInfoDetail
              const docContactInfoDetail = doc.data().contactInfoDetail;
              const conatct_0 = docContactInfoDetail[0];
              const conatct_1 = docContactInfoDetail[1];
              if (conatct_0.senderId === senderDetail.senderId) {
                senderDetail.unseenCount = conatct_0.unseenCount + 1;
                senderIndex = 0;
              } else {
                senderDetail.unseenCount = conatct_1.unseenCount + 1;    
                senderIndex = 1;
              }
              docContactInfoDetail[senderIndex] = senderDetail;
              // Update data: contactInfoDetail & message
              documentRef.update({
                contactInfoDetail: docContactInfoDetail,
                messages: firebase.firestore.FieldValue.arrayUnion(msg)
              })
              .then(() => {
                // **************************************************
                // re-load loadConversationForContactId to receiverId
                dispatch(messageSentSuccess());
              })
              .catch(error => {
                dispatch(messageError(error.message));
              })
            } else {
              // Add new Doc
              documentRef.set({
                contactInfo: contactInfo,
                contactInfoDetail: contactInfoDetail,
                messages: firebase.firestore.FieldValue.arrayUnion(msg)
              })
              .then(() => {
                dispatch(messageSentSuccess());
              })
              .catch(error => {
                dispatch(messageError(error.message));
              })
            }
          })
        })
        .catch(error => {
          dispatch(messageError(error.message));
        })
      })
      .catch(error => {
        dispatch(messageError(error.message));
      })
  }
}

export const loadConversationForContactId = (contactId) => dispatch => {
  // dispatch(messageLoading());
  var messages = [];
  let currentUser = firebase.auth().currentUser;
  let currentId = currentUser.uid;
  let conversationId = '';
  if (currentId < contactId) {
    conversationId = currentId + '_' + contactId;
  } else {
    conversationId = contactId + '_' + currentId;
  }

  const firestore = firebase.firestore();
  let documentRef = firestore.collection(CONVERSATIONS_ROOT).doc(conversationId);
  documentRef.get()
  .then(doc => {
    if (doc.exists) {
      const docContactInfoDetail = doc.data().contactInfoDetail;
      const contact_0 = docContactInfoDetail[0];
      const contact_1 = docContactInfoDetail[1];
      const docMessages = doc.data().messages;
      var index = 0;
      for( var i = docMessages.length-1; i >= 0; i--) {
        let _id = i;
        let _id_user = docMessages[i].senderId;
        let avatar = '';
        let name = '';
        // Get user info
        if (_id_user == contact_0.senderId) {
          avatar = contact_0.avatar;
          name = contact_0.name;
        } else {
          avatar = contact_1.avatar;
          name = contact_1.name;
        }
        let msg = {
          _id: _id,
          text: docMessages[i].text,
          createdAt: docMessages[i].createdAt,
          user: {
            _id: _id_user,
            name: name,
            avatar: avatar
          }
        }
        messages.push(msg);
      }
    }
    dispatch(messageLoadedSuccess(messages));
  })
  .catch(error => {
    dispatch(messageError(error.message));
  });
}

export const loadConversationForContactIdSnapshot = (contactId) => dispatch => {
  // dispatch(messageLoading());
  var messages = [];
  let currentUser = firebase.auth().currentUser;
  let currentId = currentUser.uid;
  let conversationId = '';
  if (currentId < contactId) {
    conversationId = currentId + '_' + contactId;
  } else {
    conversationId = contactId + '_' + currentId;
  }

  const firestore = firebase.firestore();
  let documentRef = firestore.collection(CONVERSATIONS_ROOT).doc(conversationId);
  documentRef.get()
  .then(doc => {
    if (doc.exists) {
      const docContactInfoDetail = doc.data().contactInfoDetail;
      const contact_0 = docContactInfoDetail[0];
      const contact_1 = docContactInfoDetail[1];
      const docMessages = doc.data().messages;
      // console.log('docMessages', docMessages);
      var index = 0;
      for( var i = docMessages.length-1; i >= 0; i--) {
        let _id = i;
        let _id_user = docMessages[i].senderId;
        let avatar = '';
        let name = '';
        // Get user info
        if (_id_user == contact_0.senderId) {
          avatar = contact_0.avatar;
          name = contact_0.name;
        } else {
          avatar = contact_1.avatar;
          name = contact_1.name;
        }
        let msg = {
          _id: _id,
          text: docMessages[i].text,
          createdAt: docMessages[i].createdAt,
          user: {
            _id: _id_user,
            name: name,
            avatar: avatar
          }
        }
        messages.push(msg);
      }
    }
    dispatch(messageLoadedSnapshotSuccess(messages));
  })
  .catch(error => {
    dispatch(messageError(error.message));
  });
}

export const messageSentRequestConfirm = () => dispatch => {
  dispatch(messageSentRequestDone());
}

export const loadConversationForContactIdAffirmation = (contactId) => dispatch => {
  // dispatch(messageLoading());
  let contactInfoDetail = [];
  let currentUser = firebase.auth().currentUser;
  let currentId = currentUser.uid;
  let conversationId = '';
  if (currentId < contactId) {
    conversationId = currentId + '_' + contactId;
  } else {
    conversationId = contactId + '_' + currentId;
  }
  const firestore = firebase.firestore();
  let documentRef = firestore.collection(CONVERSATIONS_ROOT).doc(conversationId);
  documentRef.get()
  .then(doc => {
    if (doc.exists) {
      const docContactInfoDetail = doc.data().contactInfoDetail;
      const contact_0 = docContactInfoDetail[0];
      const contact_1 = docContactInfoDetail[1];
      if (contact_0.senderId === contactId) {
        contact_0.unseenCount = 0;
      } else {
        contact_1.unseenCount = 0; 
      }
      contactInfoDetail.push(contact_0);
      contactInfoDetail.push(contact_1);
      documentRef.update({
        contactInfoDetail: contactInfoDetail,
      })
      .catch(error => {
        dispatch(messageError(error.message));
      });
    }
  })
  dispatch(messageLoadedSuccessAffirmation());
}

// const chatMessageLoading = () => ({
//   type: types.CHAT_MESSAGE_LOADING
// })

// const chatMessageSuccess = () => ({
//   type: types.CHAT_MESSAGE_SUCCESS
// })

// const chatMessageError = error => ({
//   type: types.CHAT_MESSAGE_ERROR,
//   error
// })

// const chatUpdateMessage = text => ({
//   type: types.CHAT_MESSAGE_UPDATE,
//   text
// })

// const loadMessageSuccess = messages => ({
//   type: types.CHAT_LOAD_MESSAGES_SUCCESS,
//   messages
// })

// const loadMessagesError = error => ({
//   type: types.CHAT_LOAD_MESSAGES_ERROR,
//   error
// })



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
