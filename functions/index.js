const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const fanOutPost = async (data, postKey, userKey) => {
  // First path updates an entry on user's timeline
  const fanOutObj = {
    [`timelines/${userKey}/${postKey}`]: data
  };

  // Get user's connections
  const promise = await admin.database().ref(`connections/${userKey}`).once('value');
  const connections = promise.val();

  // Update an entry for each connections' timeline
  if(connections) {
    Object.keys(connections).forEach(connectionKey => {
      fanOutObj[`timelines/${connectionKey}/${postKey}`] = data;
    });
  }

  return admin.database().ref().update(fanOutObj);
}

exports.postCreated = functions.database.ref('/posts/{postKey}')
  .onCreate((snapshot, context) => {
    const post = snapshot.val();

    return fanOutPost(
      post,
      context.params.postKey,
      post.userID
    );
  });

exports.postDeleted = functions.database.ref('/posts/{postKey}')
  .onDelete((snapshot, context) => {
    return fanOutPost(
      null,
      context.params.postKey,
      snapshot.val().userID
    );
  });
