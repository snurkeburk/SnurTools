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

export const FetchWeekNumber = (i) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  var weekNumber = Math.ceil((currentDate.getDay() + 1 + days) / 7);
  // Display the calculated result
  console.log(weekNumber - 1);
  return weekNumber - 1 + i.pm;
};

export const FetchNewWeek = async (j, id) => {
  console.log(j, id.uid);
  let tasks = [];
  let task = [];
  for (let i = 1; i < 7; i++) {
    const taskRef = collection(
      db,
      "users",
      id.uid,
      "tasks",
      j.toString(),
      i.toString()
    );
    const q = query(taskRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((_doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(_doc.data());
      task.push(...[_doc.data()]);
    });
  }
  console.log(task);
  return task;
};

export const FetchWeek = async (id) => {
  console.log(id);
  // get the number of the current week
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  var weekNumber = Math.ceil((currentDate.getDay() + 1 + days) / 7);
  // Display the calculated result
  console.log(weekNumber - 1);
  // fetch collection called 1 from the database
  let w = weekNumber - 1;
  // convert to string
  w = w.toString();
  let tasks = [];
  let task = [];
  for (let i = 1; i < 7; i++) {
    const taskRef = collection(db, "users", id.uid, "tasks", w, i.toString());
    const q = query(taskRef);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((_doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(_doc.data());
      task.push(...[_doc.data()]);
    });
  }
  console.log(task);
  return task;
};
