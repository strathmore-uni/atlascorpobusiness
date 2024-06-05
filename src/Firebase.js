import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4c-zoks-ww5qc62iSIyv8D6gMe1Lmrqw",
  authDomain: "ultra-mediator-423907-a4.firebaseapp.com",
  projectId: "ultra-mediator-423907-a4",
  storageBucket: "ultra-mediator-423907-a4.appspot.com",
  messagingSenderId: "595577353691",
  appId: "1:595577353691:web:c13237649f56fb803de3fe",
  measurementId: "G-GDQ1G54LTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
