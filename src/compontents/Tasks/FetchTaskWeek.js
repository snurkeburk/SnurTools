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
import { FetchProfileId } from "../Fetch/FetchProfileId";

export const FetchWeekNumber = (i) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  let month;
  var weekNumber = Math.ceil(days / 7);

  // Display the calculated result
  return weekNumber + i.pm;
};

export const FetchMonthName = (i) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  let month;
  var weekNumber = Math.ceil(days / 7);
  if (weekNumber + i.pm > 0 && weekNumber + i.pm < 5) {
    month = 1;
  }
  if (weekNumber + i.pm > 4 && weekNumber + i.pm < 9) {
    month = 2;
  }
  if (weekNumber + i.pm > 8 && weekNumber + i.pm < 13) {
    month = 3;
  }
  if (weekNumber + i.pm > 12 && weekNumber + i.pm < 17) {
    month = 4;
  }
  if (weekNumber + i.pm > 16 && weekNumber + i.pm < 22) {
    month = 5;
  }
  if (weekNumber + i.pm > 21 && weekNumber + i.pm < 26) {
    month = 6;
  }
  if (weekNumber + i.pm > 25 && weekNumber + i.pm < 31) {
    month = 7;
  }
  if (weekNumber + i.pm > 30 && weekNumber + i.pm < 35) {
    month = 8;
  }
  if (weekNumber + i.pm > 34 && weekNumber + i.pm < 39) {
    month = 9;
  }
  if (weekNumber + i.pm > 38 && weekNumber + i.pm < 44) {
    month = 10;
  }
  if (weekNumber + i.pm > 43 && weekNumber + i.pm < 48) {
    month = 11;
  }
  if (weekNumber + i.pm > 47 && weekNumber + i.pm < 52) {
    month = 12;
  }
  let monthName;
  if (month == 1) {
    monthName = "January";
  }
  if (month == 2) {
    monthName = "February";
  }
  if (month == 3) {
    monthName = "March";
  }
  if (month == 4) {
    monthName = "April";
  }
  if (month == 5) {
    monthName = "May";
  }
  if (month == 6) {
    monthName = "June";
  }
  if (month == 7) {
    monthName = "July";
  }
  if (month == 8) {
    monthName = "August";
  }
  if (month == 9) {
    monthName = "September";
  }
  if (month == 10) {
    monthName = "October";
  }
  if (month == 11) {
    monthName = "November";
  }
  if (month == 12) {
    monthName = "December";
  }
  if (month == 13) {
    monthName = "January";
  }
  return monthName;
};

export const FetchNewWeek = async (j, id) => {
  console.log(j, id.uid);
  if (!id.uid) {
    let tasks = [];
    let task = [];
    for (let i = 1; i <= 7; i++) {
      const taskRef = collection(
        db,
        "users",
        id,
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
  } else {
    let tasks = [];
    let task = [];
    for (let i = 1; i <= 7; i++) {
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
  }
};

export const FetchWeek = async (id) => {
  console.log(id);
  if (!id.uid) {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

    var weekNumber = Math.ceil(days / 7);
    // fetch collection called 1 from the database
    let w = weekNumber;
    // convert to string
    w = w.toString();
    let tasks = [];
    let task = [];
    for (let i = 1; i <= 7; i++) {
      const taskRef = collection(db, "users", id, "tasks", w, i.toString());
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
  } else {
    // get the number of the current week
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

    var weekNumber = Math.ceil(days / 7);
    // fetch collection called 1 from the database
    let w = weekNumber;
    // convert to string
    w = w.toString();
    let tasks = [];
    let task = [];
    for (let i = 1; i <= 7; i++) {
      const taskRef = collection(db, "users", id.uid, "tasks", w, i.toString());
      const q = query(taskRef);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((_doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(_doc.data());
        if (_doc.data()) task.push(...[_doc.data()]);
      });
    }
    console.log(task);
  }
};
