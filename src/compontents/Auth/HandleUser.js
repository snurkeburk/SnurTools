import react, { useEffect, useState } from "react";
import { auth, authentication, db } from "../../services/firebase-config";
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
import { Navigate, useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";
import { getAuth } from "firebase/auth";
import App from "../../App";

export async function addUserToDatabase(username, name, email, uid) {
  const userData = {
    name: name,
    dateCreated: new Date(),
    profilePic: "",
    snurs: 10,
    email: email,
    background: "",
    tag: "",
    username: username,
    friends: [], //TODO? add tutorial Ederraviel as friend from beginning
    timezone: "24",
    uid: uid,
  };
  await setDoc(doc(db, "users", uid), userData);
  //TODO: ADD UID TO ID ARRAY IN DB
}

export async function HandleUser(name, email, uid) {
  let authed = false;
  const uidCookie = Cookies.get("uid");
  if (uid == undefined && !uidCookie) {
    // uidCookie nor uid exists, not allowed
    console.log("uid undefined and cookie does not exist");
    authed = false;
    return false;
  } else if (uid == undefined && uidCookie) {
    // uid undefined but uidCookie exists => validate using cookie
    await FetchProfileInfo(uidCookie).then((re) => {
      if (re) {
        authed = true;
        return true;
      } else {
        //? here, user had cookie, but cookie didn't match db => do nothing
        authed = "req-username";
        return false;
      }
    });
  } else {
    // if uid != undefined, go by uid
    await FetchProfileInfo(uid).then((re) => {
      if (re) {
        // user exists in db
        authed = true;
        return true;
      }
    });
  }
  console.log(authed);
  if (!authed) {
    window.location.reload(true);
  }
  return authed;
}

export async function HandaleUser(name, email, uid) {
  let goByCookie;
  let allowed = false;
  const uidCookie = Cookies.get("uid");
  if (uid == undefined) {
    if (uidCookie.length > 0 && uidCookie != "undefined") {
      //console.log("cookie exists: " + uidCookie);
      goByCookie = true;
    }
  } else {
    goByCookie = false;
    Cookies.set("uid", uid);
  }
  // if uid => undefined, await fetch
  const docRef = doc(db, "users", "ids");
  if (!goByCookie) {
    try {
      const doc = await getDoc(docRef);
      doc.data().uid.forEach((element) => {
        if (element == uid) {
          console.log("user exists");
          allowed = true;
          return true;
        } else {
          console.log("user doesnt exists");
          //addUserToDatabase(name, email, uid);
          //=> redirect to create profile.
          allowed = false;
          return false;
        }
      });
    } catch (e) {
      console.log("Error getting cached document:", e);
    }
  } else {
    try {
      const doc = await getDoc(docRef);
      doc.data().uid.forEach((element) => {
        if (element == uidCookie) {
          //! cookie exists but auth.uid was undefined.
          //! re-check auth.uid before allowing authentication!
          FetchProfileInfo(uidCookie).then((re) => {
            if (re) {
              console.log("user confirmed exists");
            }
          });
          allowed = true;
          return true;
        } else {
          //console.log("user doesnt exists (go by cookie)");
          //addUserToDatabase(name, email, uid);
          allowed = false;
          return false;
        }
      });
    } catch (e) {
      console.log("Error getting cached document:", e);
    }
  }
  //console.log("Handle user finished: " + allowed);
  return allowed;
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
