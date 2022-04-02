import react, { useEffect, useState } from "react";
import { db } from "../services/firebase-config";
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
export const allowed = true;
async function addUserToDatabase(name, email, uid) {
  const userData = {
    name: name,
    dateCreated: new Date(),
    snurs: 0,
    tag: "",
    username: "",
    friends: ["Ederraviel", "Quashera"],
  };
  await setDoc(doc(db, "users", uid), userData);
}
export async function HandleUser(name, email, uid) {
  const docRef = doc(db, "users", "ids");
  let matches = 0;
  let misses = 0;
  try {
    const doc = await getDoc(docRef);
    console.log("Cached document data:", doc.data());

    doc.data().uid.forEach((element) => {
      if (element == uid) {
        //=> user exists in db
        console.log("gii");
        // end here
        matches++;
      } else {
        //=> user does not exist in db
        console.log("fsii");
        misses++;
      }
    });
  } catch (e) {
    console.log("Error getting cached document:", e);
  }
  try {
    if (matches > 0) {
      console.log("user exists");
    } else {
      console.log("user doesn not exists");
      addUserToDatabase(name, email, uid);
    }
  } catch (e) {
    console.log("Error adding user:", e);
  }
  try {
    await updateDoc(docRef, {
      uid: arrayUnion(uid),
    });
  } catch (err) {
    console.log(err);
  }
  Cookies.set("uid", uid); // => redirect to home
  window.location.reload(true);
}
