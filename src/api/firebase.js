import app from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: "AIzaSyDVm2Rsk5C42Ea1VsBW0Q3r80ud9Lj7ryk",
  authDomain: "throw-away-6a0ab.firebaseapp.com",
  databaseURL: "https://throw-away-6a0ab.firebaseio.com",
  projectId: "throw-away-6a0ab",
  storageBucket: "throw-away-6a0ab.appspot.com",
  messagingSenderId: "837652835200",
  appId: "1:837652835200:web:7ad1d76b79e234ed",
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.db = app.database();
    this.storage = app.storage();
  }
}

export default Firebase;
