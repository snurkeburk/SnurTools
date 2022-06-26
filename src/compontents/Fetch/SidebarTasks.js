import React from "react";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebase-config";
import { FetchProfileId } from "../Fetch/FetchProfileId";
import { FetchWeekNumber } from "../Tasks/FetchTaskWeek";

export const FetchTasksLeft = async (id) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  var weekNumber = Math.ceil(days / 7);
  const day = currentDate.getDay();
  let i = 0;
  const q = query(
    collection(db, "users", id, "tasks", weekNumber.toString(), day.toString()),
    where("completed", "==", false)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    i++;
  });
  const taskRef = doc(db, "users", id);
  await updateDoc(taskRef, {
    tasksLeft: i,
  });
  return i;
};
export const FetchTasksDone = async (id) => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  var weekNumber = Math.ceil(days / 7);
  const day = currentDate.getDay();
  // fetch the tasks where completed is false
  let i = 0;
  const q = query(
    collection(db, "users", id, "tasks", weekNumber.toString(), day.toString()),
    where("completed", "==", true)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    i++;
  });
  const taskRef = doc(db, "users", id);
  await updateDoc(taskRef, {
    tasksDone: i,
  });
  return i;
};
export const FetchCurrentSidebarTask = async (id) => {
  // get the current time in hours and minutes
  const currentDate = new Date();
  const currentHours = currentDate.getHours();
  const currentMinutes = currentDate.getMinutes();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  var weekNumber = Math.ceil(days / 7);
  const day = currentDate.getDay();
  console.log(currentHours);
  console.log(currentMinutes);
  const currentTime = currentHours + ":" + currentMinutes;
  console.log(currentTime);
  // time < current < endTime
  // fetch the tasks where completed is false
  const q = query(
    collection(db, "users", id, "tasks", weekNumber.toString(), day.toString()),
    where("completed", "==", false)
  );

  let _task = "";
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    let task = doc.data().title;
    let taskTime = doc.data().time;
    console.log(task);

    if (taskTime.split(":")[0] < currentHours) {
      // check end hours
      if (doc.data().endTime.split(":")[0] == currentHours) {
        // check end minutes
        if (doc.data().endTime.split(":")[1] >= currentMinutes) {
          if (_task == "") {
            _task = task;
          } else {
            _task += " , " + task;
          }
        }
      }
      if (doc.data().endTime.split(":")[0] > currentHours) {
        if (_task == "") {
          _task = task;
        } else {
          _task += " , " + task;
        }
      }
    } else if (taskTime.split(":")[0] == currentHours) {
      // check minutes
      if (taskTime.split(":")[1] <= currentMinutes) {
        if (doc.data().endTime.split(":")[0] == currentHours) {
          // check end minutes
          if (doc.data().endTime.split(":")[1] >= currentMinutes) {
            if (_task == "") {
              _task = task;
            } else {
              _task += " , " + task;
            }
          }
        }
      }
    }
  });
  console.log(_task);
  let i;
  if (_task == "") {
    i = 0;
  } else if (_task.includes(",")) {
    //count how many "," there are
    i = _task.split(",").length;
  } else {
    i = 1;
  }
  const taskRefTwo = doc(db, "users", id);
  await updateDoc(taskRefTwo, {
    tasksCurrent: i,
  });
  // set the _task to the status of the user
  const taskRef = doc(db, "users", id);
  await updateDoc(taskRef, {
    status: _task,
  });
  return _task;
};
