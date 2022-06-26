import React, { useEffect, useState } from "react";
import { signInWithGoogle, signOutOfGoogle } from "../services/firebase-config";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

function Login() {
  const [background, setBackground] = useState("");
  useEffect(() => {
    // get the background url from the cookies
    const bg = Cookies.get("background");
    if (bg) {
      setBackground(bg);
    }
  }, []);
  return (
    <header
      className="App-header"
      style={{
        ...(background
          ? {
              backgroundImage: "url(" + background + ")",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}),
      }}
    >
      <motion.div className="login-container">
        <img
          className="login-logo"
          src={
            "https://cdn.discordapp.com/attachments/937167004165615657/960581859245453322/paintcoin.gif"
          }
          alt="loading..."
          style={{ width: "4rem", marginRight: "0rem", marginTop: "-5rem" }}
        />
        <div style={{ display: "flex", marginTop: "-5rem" }}>
          <motion.h1
            className="login-title-one"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Snur
          </motion.h1>
          <motion.h1
            className="login-title-two"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Tools
          </motion.h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="sign-in-btn"
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </motion.button>
      </motion.div>
      <p className="login-bottom-text">
        By signing in you agree to SnurTools shitty terms of service, which
        consists of absolutely nothing. SnurTools 2022 &copy;
      </p>
    </header>
  );
}

export default Login;
