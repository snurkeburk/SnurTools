// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { HandleUser } from "../compontents/HandleUser";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import firebase from "firebase/compat/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBO4nE5IxyUiLbGTCcUb-J0EFAqRvnLmaA",
  authDomain: "snurktools.firebaseapp.com",
  projectId: "snurktools",
  storageBucket: "snurktools.appspot.com",
  messagingSenderId: "852556282600",
  appId: "1:852556282600:web:595274b4fffdce2eada75d",
  measurementId: "G-G2NBJDQD16",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const authentication = getAuth(app);
export { authentication, db };
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(authentication, provider)
    .then((re) => {
      console.log(re);
      HandleUser(re.user.displayName, re.user.email, re.user.uid);
    })
    .catch((err) => {
      console.log(err);
    });
};
