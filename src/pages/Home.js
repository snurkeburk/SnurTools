import React, { useEffect, useState } from "react";
import Sidebar from "../compontents/Sidebar";
import "../styles/Home.css";
import Tasks from "../compontents/Tasks/Tasks";
import TasksChild from "../compontents/Tasks/TasksChild";
import FetchTasks from "../compontents/Fetch/FetchTasks";
import { authentication, db } from "../services/firebase-config";
import SwitchView from "./SwitchView";
import FriendTasks from "../compontents/Tasks/FriendTasks";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import TestPage from "./TestPage";
import { getCurrentFriendId } from "../compontents/Auth/HandleUser";
import { doc, getDoc } from "firebase/firestore";
function Home() {
  const [background, setBackground] = useState("");
  const [fid, setFid] = useState("");
  const { id } = useParams();
  useEffect(() => {
    FetchBackground();
  });
  // Fetch the background for current user
  async function FetchBackground() {
    if (id) {
      await getCurrentFriendId(id).then((re) => setFid(re[0]));
      const docRef = doc(db, "users", fid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBackground(docSnap.data().background);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    } else if (!id) {
      const docRef = doc(db, "users", authentication.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBackground(docSnap.data().background);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }
  }
  if (!id) {
    return (
      <div
        className="Home-header"
        style={{ backgroundImage: "url(" + background + ")" }}
      >
        <div className="home-sidebar-container">
          {" "}
          <Sidebar />
        </div>
        <div className="home-tasks-container">
          <Tasks uid={authentication.currentUser.uid} />
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="Home-header"
        style={{ backgroundImage: "url(" + background + ")" }}
      >
        <div className="home-sidebar-container">
          {" "}
          <Sidebar />
        </div>
        <div className="home-tasks-container">
          <FriendTasks username={id} />
        </div>
      </div>
    );
  }
}

export default Home;
