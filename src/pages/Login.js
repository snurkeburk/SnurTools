import React from "react";
import { signInWithGoogle, signOutOfGoogle } from "../services/firebase-config";
import { motion } from "framer-motion";
function Login() {
  return (
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
        <button className="sign-in-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
        <button className="sign-in-btn" onClick={signOutOfGoogle}>
          Sign out of Google
        </button>
      </motion.div>
    </header>
  );
}

export default Login;
