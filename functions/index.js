const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const fanOutPost = async (post, lookup, postKey, userKey) => {
  
}

exports.postCreated = functions.database.ref('/posts/{postKey}')
  .onCreate(async (snapshot, context) => {
    const post = snapshot.val();
    const postKey = context.params.postKey;
    const postUserID = post.userID;
    const fanOutObj = {
      [`timelines/${postUserID}/${postKey}`]: post,
      [`post_timelines/${postKey}/${postUserID}`]: true
    };

    // Get all user's connections
    const promise = await admin.database().ref(`connections/${postUserID}`).once('value');
    const connections = promise.val();

    if(connections) {
      Object.keys(connections).forEach(connectionKey => {
        fanOutObj[`timelines/${connectionKey}/${postKey}`] = post;
        fanOutObj[`post_timelines/${postKey}/${connectionKey}`] = true;
      });
    }

    return admin.database().ref().update(fanOutObj);
  });

exports.postDeleted = functions.database.ref('/posts/{postKey}')
  .onDelete(async (snapshot, context) => {
    const postKey = context.params.postKey;
    const fanOutObj = {
      [`post_timelines/${postKey}`]: null
    };

    // Get all timelines which has the post
    const promise = await admin.database().ref(`post_timelines/${postKey}`).once('value');
    const timelines = promise.val();

    if(timelines) {
      Object.keys(timelines).forEach(key => {
        fanOutObj[`timelines/${key}/${postKey}`] = null;
      });
    }

    return admin.database().ref().update(fanOutObj);
  });
