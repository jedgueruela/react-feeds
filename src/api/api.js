import Firebase from './firebase';

class Post {
  constructor(firebase) {
    this.firebase = firebase;
    this.db = firebase.db;
    this.dbRef = this.db.ref('posts');
  }

  async create(post) {
    const postid = this.dbRef.push().key;
    const attachments = post.attachments;
    const userID = "uid0";
    const data = {
      body: post.body,
      attachments: [],
      userID
    };
    
    if (attachments.length) {
      const attachment = attachments[0];
      const storageRef = this.firebase.storage.ref();
      const attachmentRef = storageRef.child(`posts/${postid}/${attachment.name}`);
      const uploadTask = await attachmentRef.put(attachment)
      const downloadURL = await uploadTask.ref.getDownloadURL();

      data.attachments.push({
        type: attachment.type,
        downloadURL
      });
    }

    return this.dbRef.child(`${postid}`).set(data);
  }

  remove(key) {
    return this.dbRef.child(key).remove();
  }
}

class Timeline {
  constructor(firebase) {
    this.db = firebase.db;
    this.dbRef = this.db.ref('timelines');
  }

  byUserID(userID) {
    return this.dbRef.child(userID);
  }
}

const firebase = new Firebase();
const API = {
  Post: new Post(firebase),
  Timeline: new Timeline(firebase)
};

export default API;
