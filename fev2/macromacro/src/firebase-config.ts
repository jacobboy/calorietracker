import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhA_vPB41PhAvGy4-AfHaQPdJXrMPKG6w",
  authDomain: "macro-macro.firebaseapp.com",
  projectId: "macro-macro",
  storageBucket: "macro-macro.appspot.com",
  messagingSenderId: "98127882402",
  appId: "1:98127882402:web:3844a154a18c4c080ecffb",
  measurementId: "G-HCMQNGPE9P"
};

export function initFirebaseApp(): void {
  initializeApp(firebaseConfig);
  // const analytics = getAnalytics(firebaseApp);

  if (process.env.NODE_ENV === 'test') {
    const db = getFirestore();
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
}
