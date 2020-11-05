import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCf5xJwGp2wDfoCophOamuVHqzCrkPMo8Y",
  authDomain: "clone-a07e8.firebaseapp.com",
  databaseURL: "https://clone-a07e8.firebaseio.com",
  projectId: "clone-a07e8",
  storageBucket: "clone-a07e8.appspot.com",
  messagingSenderId: "1038520884375",
  appId: "1:1038520884375:web:f216821c7bb95bf619ddd2",
  measurementId: "G-3E73C6VECV",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

export { db, auth };
