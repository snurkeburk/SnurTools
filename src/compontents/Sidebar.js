import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { AiOutlineQuestion } from "react-icons/ai";
import { MdRemove, MdAdd } from "react-icons/md";
import { motion } from "framer-motion";
import "../styles/Sidebar.css";
import { authentication, signOutOfGoogle } from "../services/firebase-config";
import { db } from "../services/firebase-config";
import Cookies from "js-cookie";
import { doc, FieldValue, getDoc, setDoc } from "firebase/firestore";
import { User } from "./Auth/User";
import { getAuth, signOut } from "firebase/auth";
import FriendList from "./FriendList";
import { Collapse } from "react-collapse";
import Settings from "./Settings";
//https://cdn.discordapp.com/attachments/937167004165615657/960581859245453322/paintcoin.gif
function Sidebar(e) {
  var user;
  const [name, setName] = useState([]);
  const [tag, setTag] = useState([]);
  const [friendAlreadyAdded, setFriendAlreadyAdded] = useState(true);
  const [username, setUsername] = useState([]);
  const [snurs, setSnurs] = useState([]);
  const [settings, setSettings] = useState(false);
  const [addFriend, setAddFriend] = useState(false);

  useEffect(() => {
    FetchProfileInfo(authentication.currentUser.uid);
  });
  async function FetchProfileInfo(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setName(docSnap.data().name);
      setSnurs(docSnap.data().snurs);
      setTag(docSnap.data().tag);
      setUsername(docSnap.data().username);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  }
  // ------------ ADD FRIEND  ------------
  const addFriendWithCode = (event) => {
    event.preventDefault();
    const elementsArray = [...event.target.elements];
    const formData = elementsArray.reduce((accumulator, currentValue) => {
      if (currentValue.id) {
        accumulator[currentValue.id] = currentValue.value;
      }
      return accumulator;
    }, {});
    let formDataFid = formData.username;
    addFriendFunction(formDataFid);
  };

  async function addFriendFunction(fid) {
    const docRef = doc(db, "users", authentication.currentUser.uid);
    const docSnap = await getDoc(docRef);
    let friendExists;
    for (let i = 0; i < docSnap.data().friends.length; i++) {
      console.log(docSnap.data().friends[i] + "..." + fid);
      if (docSnap.data().friends[i] == fid) {
        console.log("Friend already added!");
        setFriendAlreadyAdded(true);
        friendExists = true;
        i = docSnap.data().friends.length;
      }
      if (i == docSnap.data().friends.length - 1) {
        console.log("Finished (last id: " + docSnap.data().friends[i] + ")");
        if (!friendExists) {
          console.log("User is not friend. Adding friend...");
          friendExists = false;
        }
      }
    }
    if (fid == authentication.currentUser.uid) {
      console.log("Cannot add own id.");
    } else {
      if (!friendExists) {
        const docRef = doc(db, "users", authentication.currentUser.uid);
        const _doc = await getDoc(docRef);
        const userData = {
          friends: [..._doc.data().friends, fid],
        };
        await setDoc(
          doc(db, "users", authentication.currentUser.uid),
          userData,
          {
            merge: true,
          }
        );
      }
    }
  }
  return (
    <div className="sidebar-whole">
      <div className="Sidebar-header">
        <div className="inner-sb">
          <Collapse isOpened={settings}>
            <Settings />
          </Collapse>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="sidebar-main"
          >
            <Collapse isOpened={!settings}>
              <div className="snurs">
                <img
                  src={
                    "https://cdn.discordapp.com/attachments/937167004165615657/960581859245453322/paintcoin.gif"
                  }
                  alt="loading..."
                  style={{ width: "2rem", marginRight: "1rem" }}
                />
                <p>{snurs}</p>
              </div>
              <div className="profile-container">
                <img
                  className="profile-pic"
                  src={require("../images/pp.jpg")}
                />
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
                {!addFriend ? (
                  <button
                    className="addFriend"
                    onClick={() => setAddFriend(true)}
                  >
                    <MdAdd />
                  </button>
                ) : (
                  <button
                    className="addFriend"
                    onClick={() => setAddFriend(false)}
                  >
                    <MdRemove />
                  </button>
                )}
              </div>
              <div className="addfriend-coll" style={{ marginBottom: "1rem" }}>
                <Collapse isOpened={addFriend}>
                  <p>Enter friend code:</p>
                  <form
                    className="form-submit-addfriend"
                    onSubmit={addFriendWithCode}
                    autoComplete="off"
                  >
                    <motion.input
                      className="friend-field"
                      type="text"
                      id="username"
                      required
                      placeholder={"rGPVr7xOargeGOx3TFaFa0dohg92"}
                    ></motion.input>
                    <motion.button
                      onClick={() => addFriendWithCode}
                      className="submit-friend"
                    >
                      <MdAdd />
                      Add friend
                    </motion.button>
                  </form>
                </Collapse>
              </div>
              <div className="contacts">
                <FriendList />
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
            </Collapse>
          </motion.div>
        </div>
      </div>
      <div className="sidebar-buttons-bot">
        <div>
          <button className="button signout" onClick={() => signOutOfGoogle()}>
            <FaSignOutAlt />
          </button>
        </div>
        <div className="sidebar-buttons-bot-l">
          <button className="button">
            <AiOutlineQuestion />
          </button>
          <button
            className="button"
            onClick={() => (settings ? setSettings(false) : setSettings(true))}
          >
            <FiSettings />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
