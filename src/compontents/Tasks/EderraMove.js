import React from "react";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebase-config";
function EderraMove() {
  // TODO: Move ederras tasks to the next week
  // iFuckedUp();
  test();
  function test() {
    console.log("HELLO");
  }

  async function iFuckedUp() {
    console.log("i fucked up");
    let task = [];
    for (let i = 1; i <= 7; i++) {
      const taskRef = collection(
        db,
        "users",
        "rGPVr7xOargeGOx3TFaFa0dohg92",
        "tasks",
        "20",
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
    for (let j = 0; j < task.length; j++) {
      const data = {
        addedBy: task[j].addedBy,
        title: task[j].title,
        time: task[j].time,
        content: task[j].content,
        taskOwners: task[j].taskOwners,
        type: "task",
        snurs: task[j].snurs,
        comment: task[j].comment,
        completed: false,
        color: task[j].color,
        date: task[j].date,
        timeAdded: task[j].timeAdded,
        tid: task[j].tid,
        day: task[j].day,
      };
      let ui = task[j].tid.split("$")[1] + "$" + task[j].tid.split("$")[2];
      console.log(ui);
      if (task[j].day === "monday") {
        await setDoc(
          doc(
            db,
            "users",
            "rGPVr7xOargeGOx3TFaFa0dohg92",
            "tasks",
            "21",
            "1",
            ui
          ),
          data
        );
      }
      if (task[j].day === "tuesday") {
        await setDoc(
          doc(
            db,
            "users",
            "rGPVr7xOargeGOx3TFaFa0dohg92",
            "tasks",
            "21",
            "2",
            ui
          ),
          data
        );
      }
      if (task[j].day === "wednesday") {
        await setDoc(
          doc(
            db,
            "users",
            "rGPVr7xOargeGOx3TFaFa0dohg92",
            "tasks",
            "21",
            "3",
            ui
          ),
          data
        );
      }
      if (task[j].day === "thursday") {
        await setDoc(
          doc(
            db,
            "users",
            "rGPVr7xOargeGOx3TFaFa0dohg92",
            "tasks",
            "21",
            "4",
            ui
          ),
          data
        );
      }
      if (task[j].day === "friday") {
        await setDoc(
          doc(
            db,
            "users",
            "rGPVr7xOargeGOx3TFaFa0dohg92",
            "tasks",
            "21",
            "5",
            ui
          ),
          data
        );
      }
      if (task[j].day === "saturday") {
        await setDoc(
          doc(
            db,
            "users",
            "rGPVr7xOargeGOx3TFaFa0dohg92",
            "tasks",
            "21",
            "6",
            ui
          ),
          data
        );
      }
      if (task[j].day === "sunday") {
        await setDoc(
          doc(
            db,
            "users",
            "rGPVr7xOargeGOx3TFaFa0dohg92",
            "tasks",
            "21",
            "7",
            ui
          ),
          data
        );
      }
    }
  }
  return <div>EderraMove</div>;
}

export default EderraMove;
