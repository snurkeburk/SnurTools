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
function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (authentication.currentUser) {
        console.log("user logged in");
        setIsSignedIn(true);
      } else {
        console.log("user not logged in");
        setIsSignedIn(false);
      }
    }, 500);
  });

  return (
    <BrowserRouter>
      {isSignedIn ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<Home />} />
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
