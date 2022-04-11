import React, { useState } from "react";
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

function Settings() {
  //TODO: useState(current)
  const [tintColor, setTintColor] = useState("");
  const [tintOpacity, setTintOpacity] = useState(56);
  const [tintBlur, setTintBlur] = useState(20);
  //TODO: if option disabled, gray it out, sliders have built in disabled
  //TODO:
  /* 
        <p>font</p>
        <p>font size</p>
        <p>text color</p>
  */

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
  return (
    <div className="settings-header">
      <h1>Settings</h1>

      <div className="s-theme">
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
        <div className="s-theme-bg s-theme-inner">
          <p>background image</p>
        </div>
      </div>
      <div className="s-theme"></div>
    </div>
  );
}

export default Settings;
