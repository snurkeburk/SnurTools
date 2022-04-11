import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/Home.css";
import { FetchProfileInfo } from "./Fetch/FetchProfile";
import { authentication, db } from "../services/firebase-config";
import { BsFillCloudUploadFill } from "react-icons/bs";
import {
  SketchPicker,
  GithubPicker,
  HuePicker,
  AlphaPicker,
  CirclePicker,
} from "react-color";
import { Collapse } from "react-collapse";
import { doc, setDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

function AddTask(tid) {
  const [selectedTimeZone, setSelectedTimezone] = useState([]);
  const [currentUsername, setCurrentUsername] = useState([]);
  const [selectedSnur, setSelectedSnur] = useState(false);
  const [title, setTitle] = useState([]);
  const [content, setContent] = useState([]);
  const [comment, setComment] = useState([]);
  const [globTime, setGlobTime] = useState([]);
  const [settingTitle, setSettingTitle] = useState(true);
  const [settingTime, setSettingTime] = useState(false);
  const [settingContent, setSettingContent] = useState(false);
  const [settingSnurs, setSettingSnurs] = useState(false);
  const [settingColor, setSettingColor] = useState(false);
  const [settingComment, setSettingComment] = useState(false);
  const [settingFinal, setSettingFinal] = useState(false);
  const [selectedSnurHover, setSelectedSnurHover] = useState(1);
  const [selectSnurActive, setSelectSnurActive] = useState(false);
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [Snur, setSnur] = useState("0");
  const [selectedBg, setSelectedBg] = useState("#006B76");
  let hoursAM = ["1", "2", "3"];
  const { id } = useParams();
  let snurs = ["1", "2", "3", "4", "5", "6", "7"];
  let hours = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  let minutes = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "67",
    "58",
    "59",
  ];
  //TODO save all selected things to cookie, use cookies as default
  //TODO... if cookie exists. Otherwise use MY defaults
  //TODO remove all created cookies on "upload"
  useEffect(() => {
    FetchProfileInfo(authentication.currentUser.uid).then((re) =>
      setSelectedTimezone(re.split("$")[0])
    );
    FetchProfileInfo(authentication.currentUser.uid).then((re) =>
      setCurrentUsername(re.split("$")[1])
    );
  });
  if (selectedTimeZone == "12") {
    // display timezone in AM/PM
  } else if (selectedTimeZone == "24") {
    // display timezone in 24h
  }
  const nonhoversnur = (e) => {
    if (!selectSnurActive) {
      setSelectedSnur(false);
    }
  };
  const hoversnur = (e) => {
    if (!selectSnurActive) {
      if (snurs.includes(e.target.innerHTML.split(">")[1])) {
        let num = e.target.innerHTML.split(">")[1];
        setSelectedSnur(num);
        setSelectedSnurHover(1.1);
      }
    }
  };
  const setsnur = (e) => {
    if (selectSnurActive) {
      setSelectSnurActive(false);
      setSnur("0");
    } else {
      setSelectSnurActive(true);
      console.log(selectedSnur);
      setSnur(selectedSnur);
    }
  };
  const colorChange = (e) => {
    console.log(e);
    setSelectedBg(e.hex);
  };

  const sethour = (e) => {
    console.log(e.target.innerHTML);
    setHour(e.target.innerHTML);
  };
  const setminute = (e) => {
    console.log(e.target.innerHTML);
    setMinute(e.target.innerHTML);
  };
  const uploadNewTask = (event) => {
    event.preventDefault();
    const elementsArray = [...event.target.elements];
    const taskData = elementsArray.reduce((accumulator, currentValue) => {
      if (currentValue.id) {
        accumulator[currentValue.id] = currentValue.value;
      }
      return accumulator;
    }, {});
    console.log(taskData);
    return taskData;
  };
  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async function uploadNewTaskDB() {
    const timer = setTimeout(() => {
      setSettingTitle(true);
    }, 1000);
    let date = new Date();
    let _date = date.toLocaleDateString();
    let _time = date.toLocaleTimeString();
    let time = _time.split(":")[0] + ":" + _time.split(":")[1];
    let uniqueTid = makeid(5);
    console.log(_date);
    setGlobTime(time);
    const data = {
      addedBy: currentUsername,
      title: title,
      time: hour + ":" + minute,
      content: content,
      taskOwners: [authentication.currentUser.uid],
      type: "task",
      snurs: Snur,
      comment: comment,
      completed: false,
      color: selectedBg,
      date: _date,
      timeAdded: time,
      tid: _date + "$" + hour + ":" + minute + "$" + uniqueTid,
    };

    await setDoc(
      doc(
        db,
        "users",
        authentication.currentUser.uid,
        "tasks",
        _date + "$" + hour + ":" + minute + "$" + uniqueTid
      ),
      data
    );
    setSettingFinal(false);
    setSettingColor(false);
  }

  function menuSwitch(current) {
    switch (current) {
      case "title":
        setSettingTitle(false);
        setSettingTime(true);
        break;
      case "time":
        setSettingTime(false);
        setSettingContent(true);
        break;
      case "content":
        setSettingContent(false);
        setSettingSnurs(true);

        break;
      case "snurs":
        setSettingSnurs(false);
        setSettingComment(true);
        break;
      case "comment":
        setSettingComment(false);
        setSelectedBg("rgba(255, 255, 255, 0.242)");
        setSettingFinal(true);
        setSettingColor(true);
        break;
    }
  }
  return (
    <motion.div className="new-task-container">
      <motion.div
        className="new-task"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.242)" }}
      >
        <Collapse isOpened={settingTitle}>
          {id ? <h1>New task for {id}</h1> : <p>New task</p>}
          <p>Give your task a title:</p>
          <motion.input
            className="newtask-field-title"
            type="text"
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            placeholder={"A nice title"}
          ></motion.input>
          <button onClick={() => menuSwitch("title")}>Next</button>
        </Collapse>
        <Collapse isOpened={settingTime}>
          <p>Time</p>
          <p>
            {hour} : {minute}
          </p>
          <div className="time-list">
            <motion.div className="hour-list">
              {selectedTimeZone == "12" ? (
                hoursAM.length > 0 ? (
                  hoursAM.map((hour) => (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.1 }}
                      key={hour}
                      onClick={sethour}
                    >
                      {hour}
                    </motion.button>
                  ))
                ) : (
                  <div>
                    <p>An error occured with the time thing.</p>
                  </div>
                )
              ) : hours.length > 0 ? (
                hours.map((hour) => (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                    key={hour}
                    onClick={sethour}
                  >
                    {hour}
                  </motion.button>
                ))
              ) : (
                <div>
                  <p>An error occured with the time thing.</p>
                </div>
              )}
            </motion.div>
            <motion.div className="minute-list">
              {minutes.length > 0 ? (
                minutes.map((minute) => (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.1 }}
                    key={minute}
                    onClick={setminute}
                  >
                    {minute}
                  </motion.button>
                ))
              ) : (
                <div>
                  <p>An error occured with the time thing.</p>
                </div>
              )}
            </motion.div>
          </div>
          <button onClick={() => menuSwitch("time")}>Next</button>
        </Collapse>
        <Collapse isOpened={settingContent}>
          <p>Additional notes</p>
          <motion.input
            className="newtask-field"
            type="text"
            id="content"
            onChange={(e) => setContent(e.target.value)}
            placeholder={"This is what has to be done in detail"}
          ></motion.input>
          <button onClick={() => menuSwitch("content")}>Next</button>
        </Collapse>
        <Collapse isOpened={settingSnurs}>
          <p>Award Snurs:</p>
          {snurs.length > 0 ? (
            snurs.map((snur) =>
              snur <= selectedSnur ? (
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.1 }}
                  onMouseEnter={hoversnur}
                  onMouseLeave={nonhoversnur}
                  key={snur}
                  onClick={setsnur}
                  style={{
                    opacity: "100%",
                    borderRadius: "50%",
                    background: "none",
                    borderStyle: "none",
                    scale: selectedSnurHover,
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "yellow",
                      opacity: "100%",
                    }}
                  >
                    <img
                      className="profile-pic"
                      src={
                        "https://cdn.discordapp.com/attachments/937167004165615657/960581859568390254/paintcoin.png"
                      }
                      style={{
                        width: "1.5rem",
                        boxShadow: "2px 2px 4px 1px rgba(0,0,0,0.25)",
                      }}
                    />
                    {snur}
                  </p>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: selectedSnurHover }}
                  transition={{ duration: 0.1 }}
                  onMouseEnter={hoversnur}
                  onMouseLeave={nonhoversnur}
                  key={snur}
                  onClick={setsnur}
                  style={{
                    opacity: "100%",
                    filter: "grayscale(100%)",
                    borderRadius: "50%",
                    background: "none",
                    borderStyle: "none",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "yellow",
                      opacity: "100%",
                    }}
                  >
                    <img
                      className="profile-pic"
                      src={
                        "https://cdn.discordapp.com/attachments/937167004165615657/960581859568390254/paintcoin.png"
                      }
                      style={{
                        width: "1.5rem",
                        boxShadow: "2px 2px 4px 1px rgba(0,0,0,0.25)",
                      }}
                    />
                    {snur}
                  </p>
                </motion.button>
              )
            )
          ) : (
            <div>An error occured.</div>
          )}
          <button onClick={() => menuSwitch("snurs")}>Next</button>
        </Collapse>

        <Collapse isOpened={settingComment}>
          <p>Additional comment</p>
          <motion.input
            className="newtask-field"
            type="text"
            id="comment"
            onChange={(e) => setComment(e.target.value)}
            placeholder={"You got this, pussy!"}
          ></motion.input>
          <button onClick={() => menuSwitch("comment")}>Review</button>
        </Collapse>
        <Collapse isOpened={settingFinal}>
          <motion.div className="new-task-preview">
            <div className="tasks-inner">
              <div className="task" style={{ backgroundColor: selectedBg }}>
                {content.length > 0 ? (
                  <motion.div>
                    <div
                      className="task-snurs"
                      style={{ paddingTop: "0.2rem" }}
                    >
                      <img
                        className="profile-pic"
                        src={
                          "https://cdn.discordapp.com/attachments/937167004165615657/960581859568390254/paintcoin.png"
                        }
                        style={{
                          width: "1.5rem",
                          boxShadow: "2px 2px 4px 1px rgba(0,0,0,0.25)",
                        }}
                      />
                      <h1>{Snur}</h1>
                    </div>
                    <div className="task-top">
                      <div className="task-top-title">
                        <h1 className="task-title">{title}</h1>
                      </div>
                    </div>
                    <h1 className="task-time">{globTime}</h1>
                    <h1 className="task-content">{content}</h1>
                  </motion.div>
                ) : (
                  <motion.div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "12rem",
                    }}
                  >
                    <div className="task-snurs">
                      <img
                        className="profile-pic"
                        src={
                          "https://cdn.discordapp.com/attachments/937167004165615657/960581859568390254/paintcoin.png"
                        }
                        style={{
                          width: "1.5rem",
                          boxShadow: "2px 2px 4px 1px rgba(0,0,0,0.25)",
                        }}
                      />
                      <h1>{Snur}</h1>
                    </div>
                    <h1 className="task-title">{title}</h1>
                    <h1 className="task-time">
                      {hour}:{minute}
                    </h1>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
          <Collapse isOpened={settingColor}>
            <div className="newtask-color">
              <p>Select color:</p>
              <CirclePicker className="colorpicker" onChange={colorChange} />
            </div>
          </Collapse>
          <motion.button
            onClick={() => uploadNewTaskDB()}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
            className="upload-task-button"
            type="submit"
          >
            <h1>Upload</h1>
            <BsFillCloudUploadFill />{" "}
          </motion.button>
        </Collapse>
      </motion.div>
    </motion.div>
  );
}

export default AddTask;
