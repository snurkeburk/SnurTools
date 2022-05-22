import React from "react";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebase-config";

export const FetchDayTask = async (week, day, id) => {
  switch (day) {
    case "monday":
      day = 1;
      break;
    case "tuesday":
      day = 2;
      break;
    case "wednesday":
      day = 3;
      break;
    case "thursday":
      day = 4;
      break;
    case "friday":
      day = 5;
      break;
    case "saturday":
      day = 6;
      break;
    case "sunday":
      day = 7;
      break;
    default:
      day = 1;
      break;
  }
  let task = [];
  console.log(week, day, id);

  const taskRef = collection(
    db,
    "users",
    id,
    "tasks",
    week.toString(),
    day.toString()
  );
  const q = query(taskRef);
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((_doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(_doc.data());
    task.push(...[_doc.data()]);
  });
  console.log(task);
  return task;
};
