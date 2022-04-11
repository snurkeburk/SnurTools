import "./App.css";
import react, { Component, useEffect, useState } from "react";
import { db } from "./services/firebase-config";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { authentication, signInWithGoogle } from "./services/firebase-config";
import {
  BrowserRouter,
  Link,
  Route,
  Switch,
  useNavigate,
  Navigate,
} from "react-router-dom";

//pages
import Home from "./pages/Home";
import ValidateUser from "./pages/ValidateUser";
import PageNotFound from "./pages/PageNotFound";
import { FetchProfileInfo } from "./compontents/FetchProfile";
import { checkUsername, verifyUser } from "./compontents/HandleUser";
import { doc, getDoc } from "firebase/firestore";
import CreateProfile from "./pages/CreateProfile";

function App() {
  const [allowed, setAllowed] = useState(false);
  const [requiresUsername, setRequiresUsername] = useState(true);
  // use comonentDidMount lifecycle method
  //Check user
  useEffect(() => {
    awaitAuthenticationFetch();
  });

  async function awaitAuthenticationFetch() {
    // awaits google auth fetch to complete before calling func
    if (authentication.currentUser == undefined) {
      const timer = setTimeout(() => {
        awaitAuthenticationFetch().then(() => verifyUser());
      }, 1000);
    } else {
      FetchProfileInfo(authentication.currentUser.uid);
    }
  }
  async function verifyUser() {
    let cookie = Cookies.get("uid");

    const loggedIn = authentication.currentUser.uid.length > 0;
    // check if cookie and user exists
    if (Cookies.get("uid") && loggedIn) {
      setAllowed(true);
      checkUsername();
    } else if (!Cookies.get("uid") && loggedIn) {
      Cookies.set("uid", authentication.currentUser.uid);
      setAllowed(true);
      checkUsername();
    } else if (Cookies.get("uid") && !loggedIn) {
      // NOT ALLOWED --> REMOVE COOKIE
      Cookies.remove("uid");
    } else if (!Cookies.get("uid") && !loggedIn) {
      // NOT ALLOWED
    }
  }
  async function checkUsername() {
    const docRef = doc(db, "users", authentication.currentUser.uid);
    const _doc = await getDoc(docRef);
    if (_doc.data().username.length > 0) {
      //TODO FIX THIS SHIT LOADING BEFORE INIZ
      //=> redirect to create username
      setRequiresUsername(false);
    } else {
      setRequiresUsername(true);
      //=> redirect to CreateProfile.js
      // in CreateProfile.js --> let there be options to..
      // ..add friends (with codes) and add your first task
      // Idea: first task (during tutorial) is "Complete tutorial", gives X snurs
      // clear
    }
  }
  return (
    <div className="App">
      <BrowserRouter>
        {!allowed ? (
          <header className="App-header">
            <motion.div className="login-container">
              <div style={{ display: "flex" }}>
                <motion.h1
                  style={{ color: "#7A80A0" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Snur
                </motion.h1>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  Tools
                </motion.h1>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <button className="sign-in-btn" onClick={signInWithGoogle}>
                  Sign in with Google
                </button>
              </motion.div>
            </motion.div>
          </header>
        ) : requiresUsername && allowed ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <CreateProfile />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0, duration: 0.5 }}
          >
            <Home />
          </motion.div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
