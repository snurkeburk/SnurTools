import React, { Component, Fragment, useEffect, useState } from "react";
import {
  authentication,
  signInWithGoogle,
  signOutOfGoogle,
  uiConfig,
} from "./services/firebase-config";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { db } from "./services/firebase-config";
import firebase from "firebase/compat/app";
import Home from "./pages/Home";
import "./App.css";
import TestPage from "./pages/TestPage";
import Sidebar from "./compontents/Sidebar";
import Tasks from "./compontents/Tasks/Tasks";
import {
  BrowserRouter,
  Navigate,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";
import { AuthUser } from "./compontents/Auth/AuthUser";
import { FetchProfileInfo } from "./compontents/Fetch/FetchProfile";
import { HandleUser } from "./compontents/Auth/HandleUser";
import { getAuth } from "firebase/auth";
import CreateProfile from "./pages/CreateProfile";
import PageNotFound from "./pages/PageNotFound";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { CheckOnline } from "./compontents/Auth/CheckOnline";
function App() {
  window.addEventListener(
    "beforeunload",
    () => {
      CheckOnline(false, authentication.currentUser.uid);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    { once: true }
  );
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [reqUsername, setReqUsername] = useState(false);
  useEffect(() => {
    // if user exits browser, sign them out

    HandleUser().then((re) => {
      if (re != "req-username") {
        setIsSignedIn(re);
        // set cookie with uid
        if (re) {
          const uid = authentication.currentUser.uid;
          CheckOnline(isSignedIn, authentication.currentUser.uid);
          Cookies.set("uid", uid);
        }
      } else {
        setReqUsername(true);
      }
    });
  });

  return (
    <BrowserRouter>
      {isSignedIn && !reqUsername ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      ) : reqUsername ? (
        <Routes>
          <Route path="/" element={<CreateProfile />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
