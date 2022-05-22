import react, { useState } from "react";
import { authentication, db } from "../../services/firebase-config";
import Cookies from "js-cookie";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function FetchProfileId(username) {
  console.log("USERNAME: " + username);
  // find the document where username is equal to username and return the data
  const docRef = collection(db, "users");
  const q = query(docRef, where("username", "==", username));
  const docSnap = await getDocs(q);
  if (docSnap.empty) {
    return "";
  } else {
    console.log(docSnap.docs[0].id);
    return docSnap.docs[0].id;
  }
}
