import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCuvbUG9b0QKlb_f9cUavhT2iUi2XmHr0Q",
    authDomain: "shopping-list-1d506.firebaseapp.com",
    databaseURL: "https://shopping-list-1d506.firebaseio.com",
    projectId: "shopping-list-1d506",
    storageBucket: "shopping-list-1d506.appspot.com",
    messagingSenderId: "219622571466",
    appId: "1:219622571466:web:00e79a532fe70858f96333"
  };
  // Initialize Firebase
  const fb = firebase.initializeApp(firebaseConfig);
  export const db = fb.firestore()
  export const auth = fb.auth()