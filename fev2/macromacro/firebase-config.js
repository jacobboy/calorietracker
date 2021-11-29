// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoA1jJWPwnpoA6H0iHuRu5v9b6Xje1k8I",
  authDomain: "macromacro.firebaseapp.com",
  databaseURL: "https://macromacro.firebaseio.com",
  projectId: "macromacro",
  storageBucket: "macromacro.appspot.com",
  messagingSenderId: "706551309842",
  appId: "1:706551309842:web:44fddd6f26da94ce2adacb",
  measurementId: "G-BBWYX68GKG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
