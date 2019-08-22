const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const fanOutPost = async (post, lookup, postKey, userKey) => {
  
}

exports.postCreated = functions.database.ref('/posts/{postKey}')
  .onCreate(async (snapshot, context) => {
    const post = snapshot.val();
    const postKey = context.params.postKey;
    const postUserKey = post.userID;
    const fanOutObj = {
      [`timelines/${postUserKey}/${postKey}`]: post,
      [`post_timelines/${postKey}/${postUserKey}`]: true
    };

    // Get all user's connections
    const promise = await admin.database().ref(`connections/${postUserKey}`).once('value');
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

exports.connectionsDeleted = functions.database.ref('/connections/{userKey}/{connectionKey}')
  .onDelete(async (snapshot, context) => {
    const userKey = context.params.userKey;
    const connectionKey = context.params.connectionKey;
    const fanOutObj = {
      [`connections/${connectionKey}/${userKey}`]: null
    };

    // Get all connection's posts from the user's timeline
    const cp = await admin.database().ref(`timelines/${userKey}`)
      .ref
      .orderByChild('userID')
      .equalTo(connectionKey)
      .once('value');

    const connectionPosts = cp.val();

    // Create paths for removing connection's posts from the user's timeline
    if(connectionPosts) {
      Object.keys(connectionPosts).forEach(post => {
        fanOutObj[`timelines/${userKey}/${post}`] = null;
        fanOutObj[`post_timelines/${post}/${userKey}`] = null;
      });
    }

    // Get all user's posts from the connection's timeline
    const up = await admin.database().ref(`timelines/${connectionKey}`)
      .ref
      .orderByChild('userID')
      .equalTo(userKey)
      .once('value');

    const userPosts = up.val();

    // Create paths for removing user's posts from the connection's timeline
    if(userPosts) {
      Object.keys(userPosts).forEach(post => {
        fanOutObj[`timelines/${connectionKey}/${post}`] = null;
        fanOutObj[`post_timelines/${post}/${connectionKey}`] = null;
      });
    }

    return admin.database().ref().update(fanOutObj);
  });