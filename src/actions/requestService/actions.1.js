import firebase from 'react-native-firebase';
import * as types from './actionsTypes';

export const requestServiceDone = () => dispatch => {
  dispatch(requestServiceDoneType());
}

export const sendRequestService = (message, providerId) => dispatch => {
  dispatch(requestServiceLoadingType());
  let currentUser = firebase.auth().currentUser;
  let requestorId = currentUser.uid;
  let requestDocId = ''
  if (requestorId < providerId) {
    requestDocId = requestorId + '_' + providerId;
  } else {
    requestDocId = providerId + '_' + requestorId;
  }
  let requestDoc = {
    startDate: new Date(),
    endDate: new Date(),
    requestText: message.text,

    reviewedByProvider: '',
    ratingByProvider: 0,
    ratingByProviderDone: false,

    reviewedByRequestor: '',
    ratingByRequestor: 0,
    ratingByRequestorDone: false,

    requestorInfo: {
      uid: requestorId,
      displayName: '',
      name: '',
      email: '',
      phone: '',
      photoURL: '',
      rating: 0,
      ratingCount: 0,
      },
    providerInfo: {
      uid: providerId,
      displayName: '',
      name: '',
      email: '',
      phone: '',
      photoURL: '',
      rating: 0,
      ratingCount: 0,
    },
  }

  const firestore = firebase.firestore();
  const requestorRef = firestore.collection('users').doc(requestorId);
  const providerRef = firestore.collection('users').doc(providerId);
  requestorRef.get()
    .then(requestorDoc => {
      requestDoc.requestorInfo = {
        uid: requestorDoc.data().uid,
        displayName: requestorDoc.data().displayName,
        name: requestorDoc.data().firstName + ' ' + requestorDoc.data().lastName,
        email: requestorDoc.data().email,
        phone: requestorDoc.data().phone,
        photoURL: requestorDoc.data().photoURL,
        rating: requestorDoc.data().ratingAsConsumer,
        ratingCount: requestorDoc.data().ratingCountAsConsumer
      };

      providerRef.get()
      .then(providerDoc => {
        requestDoc.providerInfo = {
          uid: providerDoc.data().uid,
          displayName: providerDoc.data().displayName,
          name: providerDoc.data().firstName + ' ' + providerDoc.data().lastName,
          email: providerDoc.data().email,
          phone: providerDoc.data().phone,
          photoURL: providerDoc.data().photoURL,
          rating: providerDoc.data().ratingAsProvider,
          ratingCount: providerDoc.data().ratingCountAsProvider
        };
        
        let documentRef = firestore.collection('requestService').doc(requestDocId);
        documentRef.get()
        .then(doc => {
          if (doc.exists) {
            documentRef.update({
              jobs: firebase.firestore.FieldValue.arrayUnion(requestDoc)
            })
            .then(() => {
              dispatch(requestServiceSuccessType());
            })
            .catch(error => {
              dispatch(requestServiceErrorType(error.message));
            })

          } else {
            // Add new Doc
            let contactInfo = []
            contactInfo.push(requestorId)
            contactInfo.push(providerId)
            
            documentRef.set({
              contactInfo: contactInfo,
              jobs: firebase.firestore.FieldValue.arrayUnion(requestDoc)
            })
            .then(() => {
              dispatch(requestServiceSuccessType());
            })
            .catch(error => {
              dispatch(requestServiceErrorType(error.message));
            })
          }  
        })
        .catch(error => {
          dispatch(requestServiceErrorType(error.message));
        })
      })
      .catch(error => {
        dispatch(requestServiceErrorType(error.message));
      })
    })
    .catch(error => {
      dispatch(requestServiceErrorType(error.message));
    })

}

export const updateReviewAndRating = (requestServiceId, jobIndex, beRatedUserId, comment, rating) => dispatch => {
  const firestore = firebase.firestore();
  const requestRef = firestore.collection('requestService').doc(requestServiceId);
  const userRef = firestore.collection('users').doc(beRatedUserId);
  let reRatingCount = 0;
  let reRating = 0;
  let ratedByProvide = false
  // Load request based on Index
  requestRef.get()
  .then(doc => {
    if (doc.exists) {
      let allJobs = doc.data().jobs
      let jobToBeUpdated = allJobs[jobIndex]
      if (beRatedUserId === jobToBeUpdated.providerInfo.uid && !jobToBeUpdated.ratingByRequestorDone) { // Rating your Service Provider
        jobToBeUpdated.reviewedByRequestor = comment
        jobToBeUpdated.ratingByRequestor = rating
        jobToBeUpdated.ratingByRequestorDone = true
        jobToBeUpdated.endDate = new Date()
        // Recalculate Provider rated by Customer
        ratedByProvide = false
        reRatingCount = jobToBeUpdated.providerInfo.ratingCount + 1
        reRating = ( (jobToBeUpdated.providerInfo.rating * jobToBeUpdated.providerInfo.ratingCount) + rating ) / reRatingCount

        allJobs[jobIndex] = jobToBeUpdated
      } else if (beRatedUserId === jobToBeUpdated.requestorInfo.uid && !jobToBeUpdated.ratingByProviderDone) { // Rating your Customer
        jobToBeUpdated.reviewedByProvider = comment
        jobToBeUpdated.ratingByProvider = rating
        jobToBeUpdated.ratingByProviderDone = true
        // Recalculate Customer rated by Provider
        ratedByProvide = true
        reRatingCount = jobToBeUpdated.requestorInfo.ratingCount + 1
        reRating = ( (jobToBeUpdated.requestorInfo.rating * jobToBeUpdated.requestorInfo.ratingCount) + rating ) / reRatingCount

        allJobs[jobIndex] = jobToBeUpdated
      }   
      requestRef.update({
        jobs: allJobs
      })
      .then(() => {
        // Update User Rating
        if (ratedByProvide) {
          userRef.update({
            ratingAsConsumer: reRating,
            ratingCountAsConsumer: reRatingCount
          })
          .then(() => {
            // console.log('ratedByProvide-ratingCountAsConsumer',reRatingCount)
          })
          .catch(error => {
            dispatch(requestServiceErrorType(error.message));
          })
        } else {
          userRef.update({
            ratingAsProvider: reRating,
            ratingCountAsProvider: reRatingCount
          })
          .then(() => {
            // console.log('ratedByCustomer-ratingCountAsProvider',reRatingCount)
          })
          .catch(error => {
            dispatch(requestServiceErrorType(error.message));
          })    
        }
        dispatch(requestServiceSuccessType());
      })
    }
  })
  .catch(error => {
    dispatch(requestServiceErrorType(error.message));
  })  

}

export const getUserListToBeRated = (currentUser) => dispatch => {
  const firestore = firebase.firestore();
  const requestRef = firestore.collection('requestService');
  let ratingList = []
  // Search for RequestService list based on User Id
  requestRef.where('contactInfo','array-contains',currentUser.uid).get()
  .then(docs => {
    docs.forEach(doc => {
      const jobs = doc.data().jobs;
      const jobsLength = jobs.length;
      for( let i=0; i<jobsLength; i++) {
        let job = jobs[i]
        if (currentUser.providerMode) { 
          // Get Request Service List which is Provider does not rate yet  - Requestor to be Reviewed
          if ((job.providerInfo.uid === currentUser.uid) && !job.ratingByProviderDone) {
            let info = {
              id: doc.id + '_' + i.toString(),
              requestServiceId: doc.id,
              requestDate: job.startDate,
              jobIndex: i,
              userInfo: job.requestorInfo
            }
            ratingList.push(info)
  
          }          
        } else { // Get Request Service List which is Requestor does not rate yet - Provider to be Reviewed
          if ((job.requestorInfo.uid === currentUser.uid) && !job.ratingByRequestorDone) {
            
            let info = {
              id: doc.id + '_' + i.toString(),
              requestServiceId: doc.id,
              requestDate: job.startDate,
              jobIndex: i,
              userInfo: job.providerInfo
            }

            ratingList.push(info)
          } 

        }        
      } 

    });
    dispatch(requestServiceListLoadedSuccessType(ratingList));
  })
  .catch(error => {
    dispatch(requestServiceErrorType(error.message));
  })

}

export const getAllReviews = (userId, asProvider) => dispatch => {
  // asProvider = true, if userId is reviewed as a Provider
  // asProvider = false, if userId is reviewed as a Customer
  // console.log('getAllReviews',userId)
  const firestore = firebase.firestore();
  const requestRef = firestore.collection('requestService');
  let reviewsList = []
  let review = {}
  requestRef.where('contactInfo','array-contains',userId).get()
  .then(docs => {
    docs.forEach(doc => {
      const jobs = doc.data().jobs;
      // console.log('getAllReviews-jobs',jobs)
      jobs.forEach(job => {
        // console.log('getAllReviews-job',job)
        if (asProvider) { // userId is reviewed as Provider > load reviews by Customers
          // console.log('getAllReviews-asProvider',asProvider)
          if (job.providerInfo.uid === userId) { // Load review 
            if (job.ratingByRequestorDone) {
              review = {
                reviewerInfo: job.requestorInfo,
                rating: job.ratingByRequestor,
                review: job.reviewedByRequestor,
                date: job.endDate
              }  
              reviewsList.push(review)
            }
          }
          // Load ratingByRequestor if ratingByRequestorDone
        } else { // userId is reviewed as Customer > load reviews by Provider
          // console.log('getAllReviews-asProvider',asProvider)
          // console.log('getAllReviews-job.requestorInfo.uid',job.requestorInfo.uid)
          // console.log('getAllReviews-userId',userId)
          if (job.requestorInfo.uid === userId) {

            if (job.ratingByProviderDone) {
              review = {
                reviewerInfo: job.providerInfo,
                rating: job.ratingByProvider,
                review: job.reviewedByProvider,
                date: job.endDate
              }
              reviewsList.push(review)
            }
          }

        }
      })
    })
    // console.log('getAllReviews-reviewsList',reviewsList)
    dispatch(requestServiceReviewsLoadedSuccessType(reviewsList))
  })
  .catch(error => {
    dispatch(requestServiceErrorType(error.message));
    // dispatch(requestServiceErrorType('Have no review yet.'));
  })

}

// ===================================
// Dispatch
// ===================================

const requestServiceLoadingType = () => ({
  type: types.REQUEST_SERVICE_LOADING
});

const requestServiceSuccessType = () => ({
  type: types.REQUEST_SERVICE_SUCCESS
});

const requestServiceDoneType = () => ({
  type: types.REQUEST_SERVICE_DONE
});

const requestServiceErrorType = (error) => ({
  type: types.REQUEST_SERVICE_ERROR,
  error
});

const requestServiceListLoadedSuccessType = (userRatingList) => ({
  type: types.REQUEST_SERVICE_LIST_LOADED_SUCCESS,
  userRatingList
});

const requestServiceReviewsLoadedSuccessType = (reviewsList) => ({
  type: types.REQUEST_SERVICE_REVIEWS_LOADED_SUCCESS,
  reviewsList
});

