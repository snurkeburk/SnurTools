import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { authentication, db } from "../../services/firebase-config";

export const DeleteTask = async (tid, id, week, day) => {
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

  let _tid = tid.split("$")[1] + "$" + tid.split("$")[2];

  await deleteDoc(
    doc(db, "users", id, "tasks", week.toString(), day.toString(), _tid)
  );
};
