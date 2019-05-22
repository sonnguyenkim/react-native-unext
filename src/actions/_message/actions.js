
import firebase from 'react-native-firebase';
import * as types from './actionsTypes';

{/*
  Messages (collections)
    -> receiverID (Doc)
      message: [
          {
            newMessage: true
            text:
            createAt:
            senderId:
            sender: {
              id: 
              email:
              name:
              avatar:
            }  
          },
          {

          },
        
      ]

*/}
  // Messages are separate from data we may want to iterate quickly
  // but still easily paginated and queried, and organized by chat
  // conversation ID
  // "messages": {
  //   "one": {
  //     "m1": {
  //       "name": "eclarke",
  //       "message": "The relay seems to be malfunctioning.",
  //       "timestamp": 1459361875337
  //     },
  //     "m2": { ... },
  //     "m3": { ... }
  //   },
  //   "two": { ... },
  //   "three": { ... }
  // }

  {/* 
    message: [
      text: 'Message',
      createdAt: new Date(),
      newMessage: true,
      senderId: 'abc'
    ]
  
  */}

const FIREBASE_REF_MESSAGES = firebase.firestore().collection('Messages');
const FIREBASE_DBREF_MESSAGES = firebase.database().ref('Messages')
const FIREBASE_REF_MESSAGES_LIMIT = 20;

// var sfRef = db.collection('cities').doc('SF');
// sfRef.getCollections().then(collections => {
//   collections.forEach(collection => {
//     console.log('Found subcollection with id:', collection.id);
//   });
// });

export const getUserList = () => dispatch => {
  var userMessageList = [];
  const currentUser = firebase.auth().currentUser;
  console.log('uid', currentUser.uid);

}

export const getConversationList = () => dispatch => {
  // dispatch(chatMessageLoading());
  var conversationList = [];
  let currentUser = firebase.auth().currentUser;
  const firestore = firebase.firestore();
  console.log('uid', currentUser.uid);
  let documentRef = firestore.doc('Messages/'+currentUser.uid);

  documentRef.get().then(doc => {

      console.log(`Doc: ${doc}`);

  });

}


export const getUserMessageList1 = () => dispatch => {
  // console.log('actions-getUserList');
  // dispatch(chatMessageLoading());
  var userMessageList = [];
  const currentUser = firebase.auth().currentUser;
  console.log('uid', currentUser.uid);
  // const receiverId = currentUser.uid;
  // FIREBASE_REF_MESSAGES.doc(currentUser.uid).getCollections()



  const firestore = firebase.firestore();
  let documentRef = firestore.doc('Messages/'+currentUser.uid);

  documentRef.getCollections().then(collections => {
    for (let collection of collections) {
      console.log(`Found subcollection with id: ${collection.id}`);
    }
  });
}

export const sendMessage = (message,receiverId) => {
  return (dispatch) => {
    // dispatch(chatMessageLoading());
    let currentUser = firebase.auth().currentUser;
    const firestore = firebase.firestore();
    firestore.collection('users').doc(currentUser.uid).get()
      .then(userDoc => {
        const userCollection = userDoc.data();
        let chatMessage = {
            text: message.text,
            createdAt: message.createdAt,
            newMessage: true,
            senderId: userCollection.uid,
            user: {
              id: userCollection.uid,
              email: userCollection.email,
              name: userCollection.firstName + ' ' + userCollection.lastName,
              avatar: userCollection.photoURL
            }
        };
        var messageRef = firestore.collection("Messages").doc(receiverId);
        messageRef.update({
            message: firebase.firestore.FieldValue.arrayUnion(chatMessage)
            //arrayRemove
        })
        .then(function() {
          console.log("Add Message to DB successfully !!!");
          // dispatch(chatMessageSuccess(userInfo));
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
          // dispatch(chatMessageError(error.message));
        });
      })
      .catch(error => {
        console.error("Error writing document: ", error);
        // dispatch(chatMessageError(error.message));
      });
  }
}

export const updateMessage = text => {
  return (dispatch) => {
    dispatch(chatUpdateMessage(text))
  }
}

export const loadMessages = () => {
  return (dispatch) => {
    FIREBASE_REF_MESSAGES.limitToLast(FIREBASE_REF_MESSAGES_LIMIT).on('value', (snapshot) => {
      dispatch(loadMessagesSuccess(snapshot.val()))
    }, (errorObject) => {
      dispatch(loadMessagesError(errorObject.message))
    })
  }
}

const chatMessageLoading = () => ({
  type: types.MESSAGE_LOADING
})

const chatMessageSuccess = () => ({
  type: types.MESSAGE_SUCCESS
})

const chatMessageError = error => ({
  type: types.MESSAGE_ERROR,
  error
})

const chatUpdateMessage = text => ({
  type: types.MESSAGE_UPDATE,
  text
})

const loadMessagesSuccess = messages => ({
  type: types.MESSAGES_LOAD_SUCCESS,
  messages
})

const loadMessagesError = error => ({
  type: types.MESSAGES_LOAD_ERROR,
  error
})
