import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { AiOutlineQuestion } from "react-icons/ai";
import { motion } from "framer-motion";
import "../styles/Sidebar.css";
import { authentication } from "../services/firebase-config";
import { db } from "../services/firebase-config";
import Cookies from "js-cookie";
import { doc, getDoc } from "firebase/firestore";
import { User } from "../compontents/User";
function Sidebar() {
  var user;
  const [ready, setReady] = useState(false);
  const [name, setName] = useState([]);
  const [tag, setTag] = useState([]);
  const [username, setUsername] = useState([]);
  const [snurs, setSnurs] = useState([]);
  async function FetchProfileInfo(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setName(docSnap.data().name);
      setSnurs(docSnap.data().snurs);
      setTag(docSnap.data().tag);
      setUsername(docSnap.data().username);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }

  useEffect(() => {
    let cookie = Cookies.get("uid");
    if (cookie.length > 0) {
      FetchProfileInfo(cookie).then(() => setReady(true));
    } else {
    }
  });

  return (
    <div>
      {ready ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sidebar-main"
        >
          <div className="snurs">
            <p>{snurs} Snurs</p>
          </div>
          <div className="profile-container">
            <img className="profile-pic" src={require("../images/pp.jpg")} />
            <motion.div className="username-container">
              <h1 className="username">{username}</h1>
              <p className="profile-tag">{tag}</p>
            </motion.div>
            <div className="quick-view-todo">
              <p className="qvt-p">You have 3 things left to do!</p>
              <p>You have completed 1 task today.</p>
              <div className="currrent-todo">
                <h2>15:30-17:00(now): "Study..."</h2>
              </div>
            </div>
          </div>
          <div className="contacts-title">
            <p>Friends</p>
          </div>
          <div className="contacts">
            <motion.div
              whileHover={{ backgroundColor: "rgba(199, 199, 199, 0.137)" }}
              className="friend"
            >
              <div
                className="friend-pic"
                style={{ backgroundColor: "#A667C3" }}
              ></div>
              <div className="friend-top">
                <h5>Ederraviel</h5>
                <p>Work</p>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ backgroundColor: "rgba(199, 199, 199, 0.137)" }}
              className="friend"
            >
              <div
                className="friend-pic"
                style={{ backgroundColor: "#FFA7BC" }}
              ></div>
              <div className="friend-top">
                <h5>Quashera</h5>
                <p>Making stupid comments...</p>
              </div>
            </motion.div>
          </div>
          <div className="groups-title">
            <p>Groups</p>
          </div>
          <div className="groups">
            <motion.div
              whileHover={{ backgroundColor: "rgba(199, 199, 199, 0.137)" }}
              className="group"
            >
              <div
                className="group-pic"
                style={{ backgroundColor: "#FF8F0B" }}
              ></div>
              <div className="group-top">
                <h5>Group #1</h5>
                <p>5 users</p>
              </div>
            </motion.div>
          </div>
          <div className="sidebar-buttons-bot">
            <div>
              <button className="button signout">
                <FaSignOutAlt />
              </button>
            </div>
            <div className="sidebar-buttons-bot-l">
              <button className="button">
                <AiOutlineQuestion />
              </button>
              <button className="button">
                <FiSettings />
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Sidebar;
