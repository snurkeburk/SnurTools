import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { FiCopy, FiSettings } from "react-icons/fi";
import { AiOutlineQuestion } from "react-icons/ai";
import {
  MdRemove,
  MdAdd,
  MdOutlineCopyAll,
  MdArrowDownward,
  MdArrowLeft,
} from "react-icons/md";
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
import { IoMdArrowBack } from "react-icons/io";
import defaultProfilePic from "../images/snurtools-defaultpfp.png";
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
  const [ownId, setOwnId] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [editPfp, setEditPfp] = useState(false);
  const [previewPfp, setPreviewPfp] = useState("");
  const [backgroundIsChosen, setBackgroundIsChosen] = useState(true);
  const [seenBgInfo, setSeenBgInfo] = useState(false);
  useEffect(() => {
    FetchProfileInfo(authentication.currentUser.uid);
  });
  async function FetchProfileInfo(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      if (docSnap.data().background == "") {
        setBackgroundIsChosen(false);
      }
      setName(docSnap.data().name);
      setSnurs(docSnap.data().snurs);
      setTag(docSnap.data().tag);
      setUsername(docSnap.data().username);
      setOwnId(docSnap.data().uid);
      if (docSnap.data().profilePic != "") {
        setProfilePic(docSnap.data().profilePic);
      } else {
        setProfilePic(defaultProfilePic);
      }
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
  // ------------ CHANGE PROFILE PICTURE  ------------
  const updatePreviewPic = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    if (
      event.target.value.indexOf("jpeg") !== -1 ||
      event.target.value.indexOf("jpg") !== -1 ||
      event.target.value.indexOf("png") !== -1
    ) {
      setPreviewPfp(event.target.value);
    } else {
      //! invalid image type, display error.
      setPreviewPfp("");
    }
  };
  const updateProfilePic = (event) => {
    event.preventDefault();
    const elementsArray = [...event.target.elements];
    const formData = elementsArray.reduce((accumulator, currentValue) => {
      if (currentValue.id) {
        accumulator[currentValue.id] = currentValue.value;
      }
      return accumulator;
    }, {});
    let formDataURL = formData.url;
    setProfilePic(formDataURL);
    // check if file is valid url
    if (
      formDataURL.indexOf("jpeg") !== -1 ||
      formDataURL.indexOf("jpg") !== -1 ||
      formDataURL.indexOf("png") !== -1
    ) {
      // valid image
      updateProfilePicFunction(formDataURL).then(() => {
        setEditPfp(false);
      });
    } else {
      //! invalid image type, display error.
    }
  };
  async function updateProfilePicFunction(url) {
    try {
      const docRef = doc(db, "users", authentication.currentUser.uid);
      const _doc = await getDoc(docRef);
      const userData = {
        profilePic: url,
      };
      await setDoc(doc(db, "users", authentication.currentUser.uid), userData, {
        merge: true,
      });
    } catch (e) {
      console.log("Error uploading profile picture: " + e);
    }
  }
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
  const variants = {
    open: {
      opacity: 1,
      display: "",
      transition: { duration: 0.2, delay: 0.2 },
    },
    closed: { opacity: 0, duration: 0.5, display: "none" },
    exitInfo: { opacity: 0 },
    showInfo: {
      x: "5px",
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
      },
    },
  };
  return (
    <div className="sidebar-whole">
      <motion.div
        variants={variants}
        initial={"closed"}
        animate={editPfp ? "open" : "closed"}
        className="upload-profilePic-container"
      >
        <div className="pfp-preview-container">
          <motion.img
            whileHover={{ opacity: "20%" }}
            className="profile-pic-current"
            src={profilePic}
          />
          <MdArrowDownward />

          {previewPfp != "" ? (
            <div>
              <motion.img
                whileHover={{ opacity: "20%" }}
                className="profile-pic-current"
                src={previewPfp}
              />
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "white",
                  marginTop: ".2rem",
                }}
              >
                (selected)
              </p>
            </div>
          ) : (
            <div>
              <motion.img
                whileHover={{ opacity: "20%" }}
                className="profile-pic-current"
                src={defaultProfilePic}
              />
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "white",
                  marginTop: ".2rem",
                }}
              >
                (not selected)
              </p>
            </div>
          )}
        </div>
        <div className="new-pfp-inner">
          <p>Enter url here:</p>
          <form
            className="form-submit-addfriend"
            onSubmit={updateProfilePic}
            autoComplete="off"
          >
            <motion.input
              className="friend-field"
              type="text"
              id="url"
              required
              placeholder={"Enter URL to image here!"}
              onChange={updatePreviewPic}
            ></motion.input>
            <div className="new-pfp-btn-wrapper">
              <button
                className="new-pfp-back-btn"
                onClick={() => setEditPfp(false)}
              >
                <IoMdArrowBack />
              </button>
              <motion.button
                onClick={() => updateProfilePic}
                className="submit-profile-pic"
              >
                <MdAdd />
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
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
                <motion.img
                  whileHover={{ opacity: "20%" }}
                  className="profile-pic-main"
                  src={profilePic}
                  onClick={() => setEditPfp((editPfp) => !editPfp)}
                />
                <motion.div className="username-container">
                  <h1 className="username">
                    {username}{" "}
                    <button
                      className="profile-copy-id"
                      onClick={() => {
                        navigator.clipboard.writeText(ownId);
                      }}
                    >
                      <MdOutlineCopyAll />
                    </button>
                  </h1>
                  <p className="profile-tag">{tag}</p>
                </motion.div>
                <div className="quick-view-todo" style={{ opacity: "70%" }}>
                  <p className="qvt-p">You have X things left to do!</p>
                  <p>You have completed X task today.</p>
                  <div className="currrent-todo">
                    <h2>{"{current task}"}</h2>
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
                  <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
                    Enter friend code:
                  </p>
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
                      placeholder={"paste the code here!"}
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
                <p>
                  Groups <p style={{ fontSize: "0.55rem" }}>[coming soontm]</p>
                </p>
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
      {!backgroundIsChosen ? (
        <motion.div
          initial={{ x: "0" }}
          variants={variants}
          animate={seenBgInfo ? "exitInfo" : "showInfo"}
          className="sidebar-settings-alert"
        >
          <p>
            <MdArrowLeft style={{ fontSize: "2rem", marginLeft: "-.5rem" }} />
            You can change your wallpaper here!{" "}
            <button
              className="seen-bg-info-btn"
              onClick={() => setSeenBgInfo(true)}
            >
              got it!
            </button>
          </p>
        </motion.div>
      ) : (
        <div></div>
      )}
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
