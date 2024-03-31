// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl32cDF1tK9LvR3FSDZsTFSFtdOVjwTVY",
  authDomain: "tictactoe-e4427.firebaseapp.com",
  projectId: "tictactoe-e4427",
  storageBucket: "tictactoe-e4427.appspot.com",
  messagingSenderId: "842616688154",
  appId: "1:842616688154:web:d121f57093a3de50e08ba3",
  measurementId: "G-NQ4P88LBC7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase();

const firebase = app;

export { firebase, db };
