import firebase from "firebase";
require("@firebase/firestore");

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB2IBtYIY6s47ge7DRHX1lu7nifjwe4vnI",
  authDomain: "willy-316db.firebaseapp.com",
  projectId: "willy-316db",
  storageBucket: "willy-316db.appspot.com",
  messagingSenderId: "674049508712",
  appId: "1:674049508712:web:8b0e932eea6471e64a82dd",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
