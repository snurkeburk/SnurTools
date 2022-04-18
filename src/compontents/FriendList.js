import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { db, authentication } from "../services/firebase-config";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { useCookies } from "react-cookie";
import { switchDay } from "./DatePick";
import FetchTasks from "./Fetch/FetchTasks";
import { Link } from "react-router-dom";

function FriendList() {
  const [finalFriendList, setFinalFriendList] = useState([]);
  const [loadingFriends, setloadingFriends] = useState(true);
  useEffect(() => {
    onSnapshot(doc(db, "users", authentication.currentUser.uid), (doc) => {
      fetchFriendList();
    });
  }, []);

  async function fetchFriendList() {
    setloadingFriends(true);
    setFinalFriendList([]);
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
        friendSnap.data().profilepic,
        friendSnap.data().uid,
      ]);
      if (i == friendlist.length - 1) {
        setFinalFriendList(innerFriendList);
        setloadingFriends(false);
      }
    }
    setloadingFriends(false);
  }

  return (
    <div>
      {loadingFriends ? (
        <div>loading</div>
      ) : (
        <div>
          {finalFriendList.length > 0 ? (
            finalFriendList.map((friend, index) => (
              <div key={friend}>
                <motion.button
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
                    <img className="friend-pic" src={friend[2]} />
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
