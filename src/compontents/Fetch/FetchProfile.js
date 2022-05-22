import react, { useState } from "react";
import { authentication, db } from "../../services/firebase-config";
import Cookies from "js-cookie";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  setDoc,
  updateDoc,
  FieldValue,
  arrayUnion,
  onSnapshot,
  getDocFromCache,
  getDoc,
} from "firebase/firestore";

export async function FetchProfileInfo(uid) {
  console.log("UID: " + uid);
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().timezone + "$" + docSnap.data().username;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
}
