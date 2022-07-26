import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCTRQ73E79z2x__-1HYHq31nMEu8AGN1lM",
    authDomain: "instagram-clone-bb114.firebaseapp.com",
    projectId: "instagram-clone-bb114",
    storageBucket: "instagram-clone-bb114.appspot.com",
    messagingSenderId: "1021226905602",
    appId: "1:1021226905602:web:a97d4011df7fa68bd4f71b"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth()
export { db, auth };