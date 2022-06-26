import React, { Component, Fragment, useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebase-config";
import Cookies from "js-cookie";

export const CheckOnline = async (state, uid) => {
  try {
    console.log("setting online to " + state + " for " + uid);
    const docRef = doc(db, "users", uid);
    const _doc = await getDoc(docRef);
    const userData = {
      online: state,
    };
    await setDoc(doc(db, "users", uid), userData, {
      merge: true,
    });
  } catch (e) {
    console.log("Error uploading online state: " + e);
  }
};
