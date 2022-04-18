import React from "react";
import { authentication, db } from "../services/firebase-config";
import { motion } from "framer-motion";
import "../styles/CreateProfile.css";
import { doc, setDoc } from "firebase/firestore";
import { signOutOfGoogle } from "../services/firebase-config";
import { addUserToDatabase } from "../compontents/Auth/HandleUser";
function CreateProfile() {
  const saveUsername = (event) => {
    event.preventDefault();
    const elementsArray = [...event.target.elements];
    const formData = elementsArray.reduce((accumulator, currentValue) => {
      if (currentValue.id) {
        accumulator[currentValue.id] = currentValue.value;
      }
      return accumulator;
    }, {});
    let formDataUsername = formData.username;
    addUsernameToProfile(formDataUsername);
  };

  async function addUsernameToProfile(username) {
    const userData = {
      username: username,
    };
    await setDoc(doc(db, "users", authentication.currentUser.uid), userData, {
      merge: true,
    });
    addUserToDatabase(
      username,
      authentication.currentUser.displayName,
      authentication.currentUser.email,
      authentication.currentUser.uid
    ).then(() => window.location.reload(true));
  }
  return (
    <div className="Createprofile-header">
      <h1>Welcome {authentication.currentUser.displayName}</h1>
      <h2>Please set your username below:</h2>
      <p style={{ color: "gray", fontSize: "0.9rem", marginTop: "0.4rem" }}>
        (This is what will be shown to other users)
      </p>
      <div>
        <form
          className="form-submit"
          onSubmit={saveUsername}
          autoComplete="off"
        >
          <motion.input
            className="username-field"
            type="text"
            id="username"
            required
            placeholder={"Keep it below 16 characters, pussy"}
            whileFocus={{ scale: 1.05 }}
          ></motion.input>
          <motion.button
            onClick={() => saveUsername}
            className="submit-username"
          >
            Next
          </motion.button>
        </form>
        <button
          className="create-user-backbtn"
          onClick={() => signOutOfGoogle()}
        >
          <p>Go back</p>
        </button>
      </div>
    </div>
  );
}

export default CreateProfile;
