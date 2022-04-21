import react, { useState, useEffect } from "react";
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
  where,
  query,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { getCurrentDayAndMonth, GetTaskDate } from "../DatePick";
async function FetchTasks(uid, opt, day, month) {
  let s = [];
  await GetTaskDate(uid, opt, day, month).then((re) => {
    // await => waits until fetch is complete
    re.forEach((element) => {
      s.push(...[element]);
    });
  });
  console.log(s);
  return s;
}
export default FetchTasks;
