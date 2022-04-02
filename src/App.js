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

function App() {
  const [allowed, setAllowed] = useState(false);
  // use comonentDidMount lifecycle method
  async function awaitAuthenticationFetch() {
    // awaits google auth fetch to complete before calling func
    if (authentication.currentUser == undefined) {
      console.log("undefined");
      const timer = setTimeout(() => {
        awaitAuthenticationFetch();
      }, 1000);
    } else {
      FetchProfileInfo(authentication.currentUser.uid);
      setAllowed(true);
    }
  }
  //TODO:
  // create coookie with uid for fast access to info in Firebase
  /// chheck if cookie existsts
  // check if id exists && mattch cookie
  // if id exists --> go to home page
  // else go to login page
  useEffect(() => {
    let cookie = Cookies.get("uid");
    // check cookie
    if (cookie) {
      console.log("cookie exists"); // => compare ids
      setAllowed(true);
    } else {
      console.log("cookie does not exist"); // => user has to log in
      setAllowed(false);
    }
    // compare cookie to database

    //
  });
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
