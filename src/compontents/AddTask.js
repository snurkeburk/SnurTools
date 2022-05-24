import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../styles/Home.css";
import { FetchProfileInfo } from "./Fetch/FetchProfile";
import { authentication, db } from "../services/firebase-config";

import { AiOutlinePlus } from "react-icons/ai";
import { CirclePicker } from "react-color";
import { Collapse } from "react-collapse";
import { arrayRemove, doc, setDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { MdClose, MdExpandMore, MdWeekend } from "react-icons/md";
import { getCurrentDayAndMonth } from "./DatePick";
import TaskDay from "./Tasks/TaskDay";
import { getCurrentFriendId } from "./Auth/HandleUser";
function AddTask(taskInfo) {
  const [selectedTimeZone, setSelectedTimezone] = useState([]);
  const [currentUsername, setCurrentUsername] = useState([]);
  const [selectedSnur, setSelectedSnur] = useState("0");
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
  const [selectedBg, setSelectedBg] = useState("rgba(255, 255, 255, 0.242)");
  const [timeHeight, setTimeHeight] = useState("10rem");
  const [titleDone, setTitleDone] = useState(false);
  const [timeDone, setTimeDone] = useState(false);
  const [contentDone, setConentDone] = useState(false);
  const [snursDone, setSnursDone] = useState(false);
  const [commentDone, setCommentDone] = useState(false);
  const [previewVisibility, setPreviewVisibility] = useState("block");
  const [finDate, setFinDate] = useState("");
  const [chosenDay, setChosenDay] = useState("");
  const id = useParams().id;
  let hoursAM = ["1", "2", "3"];
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
    switch (taskInfo.day) {
      case "monday":
        setChosenDay("1");
        break;
      case "tuesday":
        setChosenDay("2");
        break;
      case "wednesday":
        setChosenDay("3");
        break;
      case "thursday":
        setChosenDay("4");
        break;
      case "friday":
        setChosenDay("5");
        break;
      case "saturday":
        setChosenDay("6");
        break;
      case "sunday":
        setChosenDay("7");
        break;
      default:
        setChosenDay("0");
        break;
    }
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
      menuSwitch("reset");
    }, 1000);
    let date = new Date();
    let time = date.toLocaleTimeString();
    let uniqueTid = makeid(5);
    await getCurrentDayAndMonth("date").then((re) => {
      setFinDate(re);
      console.log(finDate);
      setGlobTime(time);
      const data = {
        addedBy: currentUsername,
        title: title,
        time: hour + ":" + minute,
        content: content,
        taskOwners: taskInfo.id,
        type: "task",
        snurs: Snur,
        comment: comment,
        completed: false,
        color: selectedBg,
        date: re,
        timeAdded: time,
        tid: re + "$" + hour + ":" + minute + "$" + uniqueTid,
        day: taskInfo.day,
      };
      FinalUpload(data, re, uniqueTid);
    });
  }

  async function FinalUpload(data, re, uniqueTid) {
    await setDoc(
      doc(
        db,
        "users",
        taskInfo.id,
        "tasks",
        taskInfo.week.toString(),
        chosenDay,
        hour + ":" + minute + "$" + uniqueTid
      ),
      data
    );
    setSettingFinal(false);
    setSettingColor(false);
  }

  function menuSwitch(current) {
    switch (current) {
      case "title":
        if (settingTitle) {
          setSettingTitle(false);
          setSettingFinal(true);
          setPreviewVisibility("block");
          setSettingTime(true);
          setTitleDone(true);
          const timer = setTimeout(() => {
            setSettingColor(true);
          }, 500);
        } else {
          setSettingTitle(true);
        }
        break;
      case "time":
        if (!settingTime) {
          setSettingTime(true);
        } else {
          setSettingTime(false);
          setTimeHeight("12rem");
          setSettingContent(true);
          setTimeDone(true);
        }
        break;
      case "content":
        if (!settingContent) {
          setSettingContent(true);
        } else {
          setSettingContent(false);
          setSettingSnurs(true);
          setConentDone(true);
        }
        break;
      case "snurs":
        if (!settingSnurs) {
          setSettingSnurs(true);
        } else {
          setSettingSnurs(false);
          setSettingComment(true);
          setSnursDone(true);
        }
        break;
      case "comment":
        if (!settingComment) {
          setSettingComment(true);
        } else {
          setSettingComment(false);
          setCommentDone(true);
          setSettingFinal(true);
        }
        break;
      case "reset":
        setSettingComment(false);
        setSelectedBg("rgba(255, 255, 255, 0.242)");
        setSettingColor(false);
        setCommentDone(false);
        setSettingFinal(false);
        setSettingTime(false);
        setSettingSnurs(false);
        setSettingTitle(false);
        setSettingContent(false);
        setTitleDone(false);
        setTimeDone(false);
        setConentDone(false);
        setSnursDone(false);
        setCommentDone(false);
        setSnur("0");
        setHour("12");
        setMinute("00");
        setContent("");
        setTitle("");
        setSelectSnurActive(false);

        break;
    }
  }

  const newTaskVariants = {
    slideOut: { x: 0, transition: { duration: 0.5 } },
  };
  return (
    <motion.div className="new-task-container">
      <motion.div className="new-task-wrapper">
        <motion.div
          className="new-task"
          variants={newTaskVariants}
          initial={{ x: "calc(50% - 1rem)" }}
          animate={settingFinal ? "slideOut" : "stop"}
        >
          <div className="new-inner-task">
            {id ? (
              <h1 className="n-t-t-h">New task for {id}</h1>
            ) : (
              <h1 className="n-t-t-h">New task</h1>
            )}
            <p>Give your task a title:</p>
            <Collapse isOpened={settingTitle}>
              <motion.input
                className="newtask-field-title"
                type="text"
                id="title"
                onChange={(e) => setTitle(e.target.value)}
                placeholder={"A nice title"}
                multiple={true}
              ></motion.input>
            </Collapse>
            <Collapse isOpened={true}>
              {titleDone ? (
                <motion.button
                  className="new-task-nxt-btn"
                  onClick={() =>
                    setSettingTitle((settingTitle) => !settingTitle)
                  }
                >
                  <MdExpandMore />
                </motion.button>
              ) : (
                <button
                  className="new-task-nxt-btn"
                  onClick={() => menuSwitch("title")}
                >
                  <MdExpandMore />
                </button>
              )}
            </Collapse>
          </div>
          <div className="new-inner-task">
            <p>Time</p>

            <Collapse isOpened={settingTime}>
              <p>
                {hour} : {minute}
              </p>
              <div className="time-list">
                <motion.div
                  className="hour-list"
                  style={{ maxHeight: timeHeight }}
                >
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
                <motion.div
                  className="minute-list"
                  style={{ maxHeight: timeHeight }}
                >
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
            </Collapse>
            <Collapse isOpened={true}>
              {timeDone ? (
                <button
                  className="new-task-nxt-btn"
                  onClick={() =>
                    settingTime ? setSettingTime(false) : setSettingTime(true)
                  }
                >
                  <MdExpandMore />
                </button>
              ) : (
                <button
                  className="new-task-nxt-btn"
                  onClick={() => menuSwitch("time")}
                >
                  <MdExpandMore />
                </button>
              )}
            </Collapse>
          </div>
          <div className="new-inner-task">
            <p>Additional notes</p>
            <Collapse isOpened={settingContent}>
              <form className="newtask-form">
                <motion.input
                  className="newtask-field"
                  type="text"
                  id="content"
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={"This is what has to be done in detail"}
                ></motion.input>
              </form>
            </Collapse>
            <Collapse isOpened={true}>
              {contentDone ? (
                <button
                  className="new-task-nxt-btn"
                  onClick={() =>
                    settingContent
                      ? setSettingContent(false)
                      : setSettingContent(true)
                  }
                >
                  <MdExpandMore />
                </button>
              ) : (
                <button
                  className="new-task-nxt-btn"
                  onClick={() => menuSwitch("content")}
                >
                  <MdExpandMore />
                </button>
              )}
            </Collapse>
          </div>
          <div className="new-inner-task">
            <p>Award Snurs:</p>
            <Collapse isOpened={settingSnurs}>
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
                          className="snurs-pic"
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
                          className="snurs-pic"
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
            </Collapse>
            <Collapse isOpened={true}>
              {snursDone ? (
                <button
                  className="new-task-nxt-btn"
                  onClick={() =>
                    settingSnurs
                      ? setSettingSnurs(false)
                      : setSettingSnurs(true)
                  }
                >
                  <MdExpandMore />
                </button>
              ) : (
                <button
                  className="new-task-nxt-btn"
                  onClick={() => menuSwitch("snurs")}
                >
                  <MdExpandMore />
                </button>
              )}
            </Collapse>
          </div>
          <div className="new-inner-task">
            <p>Additional comment</p>
            <Collapse isOpened={settingComment}>
              <form className="newtask-form">
                <motion.input
                  className="newtask-field"
                  type="text"
                  id="comment"
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={"You got this, pussy!"}
                ></motion.input>
              </form>
            </Collapse>
            <Collapse isOpened={true}>
              {commentDone ? (
                <button
                  className="new-task-nxt-btn"
                  onClick={() =>
                    settingComment
                      ? setSettingComment(false)
                      : setSettingComment(true)
                  }
                >
                  <MdExpandMore />
                </button>
              ) : (
                <button
                  className="new-task-nxt-btn"
                  onClick={() => menuSwitch("comment")}
                >
                  <MdExpandMore />
                </button>
              )}
            </Collapse>
          </div>
        </motion.div>

        <Collapse isOpened={settingFinal}>
          <motion.div
            className="new-task-preview"
            style={{
              display: previewVisibility,
            }}
          >
            <div className="tasks-inners" style={{ padding: "1rem" }}>
              <div
                className="task"
                style={{
                  backgroundColor: selectedBg,
                }}
              >
                <motion.div>
                  <div className="task-snurs" style={{ paddingTop: "0.2rem" }}>
                    <div className="inner-task-snurs">
                      <img
                        className="snurs-pic"
                        src={
                          "https://cdn.discordapp.com/attachments/937167004165615657/960581859568390254/paintcoin.png"
                        }
                        style={{
                          width: "1.5rem",
                          boxShadow: "2px 2px 4px 1px rgba(0,0,0,0.25)",
                        }}
                      />
                      <h1>{selectedSnur}</h1>
                    </div>
                    <div className="inner-task-snurs-tid">
                      <p></p>
                    </div>
                  </div>
                  <div className="inner-task-main">
                    <div className="task-top">
                      <div className="task-top-title">
                        <h1
                          className="task-title"
                          style={
                            content.length > 0
                              ? { paddingBottom: "1rem" }
                              : {
                                  display: "flex",
                                  justifyContent: "space-between",
                                  paddingTop: "0.5rem",
                                }
                          }
                        >
                          {title}
                          <h1 className="task-time">
                            {hour}:{minute}
                          </h1>
                        </h1>
                      </div>
                    </div>
                  </div>
                  <h1 className="task-content">{content}</h1>
                  {comment.length > 0 ? (
                    <p className="task-comment">
                      "{comment}" - {currentUsername}
                    </p>
                  ) : (
                    <div></div>
                  )}
                </motion.div>
              </div>
            </div>
            <Collapse isOpened={settingColor}>
              <div className="newtask-color">
                <p>Select color:</p>
                <CirclePicker className="colorpicker" onChange={colorChange} />
              </div>
            </Collapse>
            <motion.button
              onClick={() => uploadNewTaskDB()}
              className="upload-task-button"
              type="submit"
            >
              <AiOutlinePlus />
              <p>ADD TASK</p>
            </motion.button>
          </motion.div>
        </Collapse>
      </motion.div>
    </motion.div>
  );
}

export default AddTask;
