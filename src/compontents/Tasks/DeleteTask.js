import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { authentication, db } from "../../services/firebase-config";

export const DeleteTask = async (tid) => {
  console.log(tid);
  await deleteDoc(
    doc(db, "users", authentication.currentUser.uid, "tasks", tid)
  );
};
