import react, { useEffect, useState } from "react";
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
  where,
  getDocs,
  query,
} from "firebase/firestore";
import { FetchProfileInfo } from "../Fetch/FetchProfile";
import PageNotFound from "../../pages/PageNotFound";
import { Navigate } from "react-router-dom";

async function addUserToDatabase(name, email, uid) {
  const userData = {
    name: name,
    dateCreated: new Date(),
    snurs: 0,
    email: email,
    tag: "",
    username: "",
    friends: [], //TODO? add tutorial Ederraviel as friend from beginning
    timezone: "24",
    uid: uid,
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
}

export async function getCurrentFriendId(username) {
  let friend = [];
  const taskRef = collection(db, "users");
  const q = query(taskRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((_doc) => {
    // doc.data() is never undefined for query doc snapshots
    friend.push(...[_doc.data().uid]);
  });
  return friend;
}
