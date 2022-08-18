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
import UserTasks from "./UserTasks";
import Cookies from "js-cookie";
import TasksTop from "../compontents/Tasks/TasksTop";
function Home() {
  const [background, setBackground] = useState("");
  const [fid, setFid] = useState("");
  const { id } = useParams();
  useEffect(() => {
    FetchBackground();
    getCurrentFriendId(id).then((re) => setFid(re[0]));
  });
  // Fetch the background for current user
  async function FetchBackground() {
    console.log("Fetching background...");
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
        // check if background cookie is emepty
        if (Cookies.get("background") === "") {
          Cookies.set("background", docSnap.data().background);
        } else {
          // check if background cookie is different from the background
          if (Cookies.get("background") !== docSnap.data().background) {
            Cookies.set("background", docSnap.data().background);
          }
        }
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
          <Sidebar uid={authentication.currentUser.uid} />
        </div>
        <div className="home-tasks-container">
          <UserTasks uid={authentication.currentUser.uid} />
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
          <Sidebar uid={fid} />
        </div>
        <div className="home-tasks-container">
          <UserTasks uid={fid} />
        </div>
      </div>
    );
  }
}

export default Home;
