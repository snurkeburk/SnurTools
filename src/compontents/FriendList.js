import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, authentication } from "../services/firebase-config";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { useCookies } from "react-cookie";
import { switchDay } from "./DatePick";
import FetchTasks from "./Fetch/FetchTasks";
import { Link } from "react-router-dom";
import "../styles/animations.css";
import { BsDot } from "react-icons/bs";
function FriendList() {
  const [finalFriendList, setFinalFriendList] = useState([]);
  const [loadingFriends, setloadingFriends] = useState(true);
  useEffect(() => {
    onSnapshot(doc(db, "users", authentication.currentUser.uid), (doc) => {
      fetchFriendList();
    });
  }, []);

  async function fetchFriendList(stealth) {
    if (!stealth) {
      setloadingFriends(true);
      setFinalFriendList([]);
    }
    const friendlist = [];
    const innerFriendList = [];
    let uid = authentication.currentUser.uid;
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const db_friendlist = docSnap.data().friends;
      db_friendlist.forEach((f) => {
        friendlist.push(...[f]);
      });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    for (let i = 0; i < friendlist.length; i++) {
      const friendRef = doc(db, "users", friendlist[i]);
      const friendSnap = await getDoc(friendRef);
      //TODO: if status.length > ~20-25 chars, make it 20 + "..."
      innerFriendList.push([
        friendSnap.data().username,
        friendSnap.data().status,
        friendSnap.data().profilePic,
        friendSnap.data().uid,
        friendSnap.data().online,
      ]);
      if (i == friendlist.length - 1) {
        setFinalFriendList(innerFriendList);
        setloadingFriends(false);
      }
    }
    setloadingFriends(false);
  }

  // create a function that repeats every 1 second
  useEffect(() => {
    console.log("fetching friendlist");
    const interval = setInterval(() => {
      fetchFriendList(true);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      {loadingFriends ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <svg className="svg-loading-friends" viewBox="25 25 50 50">
            <circle
              className="circle-loading-friends"
              cx="50"
              cy="50"
              r="20"
            ></circle>
          </svg>
        </div>
      ) : (
        <div>
          {finalFriendList.length > 0 ? (
            finalFriendList.map((friend, index) => (
              <div key={friend}>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{
                    backgroundColor: "rgba(199, 199, 199, 0.137)",
                  }}
                  className="friend"
                >
                  <Link
                    to={`/${friend[0]}`}
                    className="friend-inner"
                    style={{ textDecoration: "none" }}
                  >
                    <img
                      style={
                        friend[4]
                          ? { borderColor: "rgb(120, 216, 107)" }
                          : { borderStyle: "none" }
                      }
                      className="friend-pic"
                      src={friend[2]}
                    />

                    <div className="friend-top">
                      <h5>{friend[0]}</h5>
                      <p>{friend[1]}</p>
                    </div>
                  </Link>
                </motion.button>
              </div>
            ))
          ) : (
            <div className="no-friends">
              <p>no friends :(</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FriendList;
