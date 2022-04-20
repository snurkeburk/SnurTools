import React, { useEffect, useState } from "react";
import "../styles/Settings.css";
import {
  SketchPicker,
  GithubPicker,
  HuePicker,
  AlphaPicker,
  CirclePicker,
  SliderPicker,
} from "react-color";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { MdAdd, MdArrowDownward, MdRefresh } from "react-icons/md";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { authentication, db } from "../services/firebase-config";
function Settings() {
  //TODO: useState(current)
  const [tintColor, setTintColor] = useState("");
  const [tintOpacity, setTintOpacity] = useState(56);
  const [tintBlur, setTintBlur] = useState(20);
  const [bgSuccess, setBgSuccess] = useState(false);
  const [customBg, setCustomBg] = useState("");
  //TODO: if option disabled, gray it out, sliders have built in disabled
  //TODO:
  /* 
        <p>font</p>
        <p>font size</p>
        <p>text color</p>
  */
  useEffect(() => {
    fetchBackground().then((re) => setCustomBg(re));
  }, []);
  async function fetchBackground() {
    const docRef = doc(db, "users", authentication.currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().background;
    } else {
      // doc.data() will be undefined in this case
      return "";
    }
  }
  const tintColorChange = (e) => {
    console.log(e);
    setTintColor(e);
  };
  const tintOpacityChange = (e) => {
    console.log(e.target.value);
    setTintOpacity(e.target.value);
  };
  const tintBlurChange = (e) => {
    console.log(e.target.value);
    setTintBlur(e.target.value);
  };
  const updatePreviewBg = (event) => {
    event.preventDefault();
    console.log(event.target.value);
    if (event.target.value == "") {
      fetchBackground().then((re) => setCustomBg(re));
    }
    if (
      event.target.value.indexOf("jpeg") !== -1 ||
      event.target.value.indexOf("jpg") !== -1 ||
      event.target.value.indexOf("png") !== -1
    ) {
      setCustomBg(event.target.value);
    } else {
      //! invalid image type, display error.
      setCustomBg("");
    }
  };
  const updateBackground = async (e) => {
    e.preventDefault();
    const elementsArray = [...e.target.elements];
    const formData = elementsArray.reduce((accumulator, currentValue) => {
      if (currentValue.id) {
        accumulator[currentValue.id] = currentValue.value;
      }
      return accumulator;
    }, {});
    let formDataURL = formData.url;

    // check if file is valid url
    if (
      formDataURL.indexOf("jpeg") !== -1 ||
      formDataURL.indexOf("jpg") !== -1 ||
      formDataURL.indexOf("png") !== -1
    ) {
      // valid image
      updateBackgroundFunction(formDataURL).then(setBgSuccess(true));
    } else {
      //! invalid image type, display error.
    }
  };
  async function updateBackgroundFunction(url) {
    try {
      const docRef = doc(db, "users", authentication.currentUser.uid);
      const _doc = await getDoc(docRef);
      const userData = {
        background: url,
      };
      await setDoc(doc(db, "users", authentication.currentUser.uid), userData, {
        merge: true,
      });
    } catch (e) {
      console.log("Error uploading background: " + e);
    }
  }
  const variants = {
    showbg: {
      opacity: 1,
      display: "",
      transition: { duration: 0.2, delay: 0.2 },
    },
    hidebg: { opacity: 0, duration: 0.5, display: "none" },
  };
  return (
    <div className="settings-header">
      <h1>Settings</h1>
      <div className="s-theme">
        <p style={{ marginBottom: "0rem" }}>Background image</p>
        <div className="s-theme-bg s-theme-inner">
          <motion.div
            className="new-bg-inner"
            style={
              customBg != ""
                ? { backgroundImage: "url(" + customBg + ")" }
                : { background: "none" }
            }
          >
            <form
              className="form-submit-addfriend"
              onSubmit={updateBackground}
              autoComplete="off"
            >
              <motion.input
                className="friend-field bg-field"
                style={{
                  backdropFilter: "blur(2px)",
                  color: "white",
                }}
                type="text"
                id="url"
                required
                onChange={updatePreviewBg}
                placeholder={"Enter URL to background here!"}
              ></motion.input>
              <div className="new-pfp-btn-wrapper">
                <motion.button
                  onClick={() => updateBackground}
                  className="submit-profile-pic"
                >
                  <MdAdd />
                </motion.button>
              </div>
            </form>
            <motion.div
              initial={{ opacity: 0 }}
              variants={variants}
              animate={bgSuccess ? "showbg" : "hidebg"}
              className="bg-success-msg"
            >
              <p style={{ display: "flex" }}>
                Success, refresh to see changes!{" "}
                <button
                  className="s-seen-bg-info-btn"
                  onClick={() => window.location.reload(true)}
                >
                  <MdRefresh style={{ fontSize: "1rem" }} />
                </button>
              </p>
            </motion.div>
          </motion.div>
        </div>

        <p
          style={{
            fontSize: "1rem",
            backgroundColor: "red",
            padding: "0",
            opacity: "80%",
          }}
        >
          <MdArrowDownward />
          WORK IN PROGRESS
          <MdArrowDownward />
        </p>
        <div className="s-theme-tint s-theme-inner">
          <h2>Tint settings</h2>
          <p>Color</p>
          <div className="s-tint-color">
            <SliderPicker color={tintColor} onChange={tintColorChange} />
          </div>

          <p>Opacity</p>
          <Box sx={{ width: "100%", color: "white" }}>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1, mt: 3 }}
              alignItems="center"
            >
              <Slider
                aria-label="Tint opacity"
                value={tintOpacity}
                onChange={tintOpacityChange}
                style={{ color: "white" }}
                valueLabelDisplay="on"
              />
            </Stack>
          </Box>
          <p>Blur</p>
          <Box sx={{ width: "100%", color: "white" }}>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1, mt: 3 }}
              alignItems="center"
            >
              <Slider
                aria-label="Tint blur"
                value={tintBlur}
                onChange={tintBlurChange}
                style={{ color: "white" }}
                valueLabelDisplay="on"
              />
            </Stack>
          </Box>
        </div>
      </div>
      <div className="s-theme"></div>
    </div>
  );
}

export default Settings;
