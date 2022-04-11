import React, { useEffect, useState } from "react";
import { authentication, db } from "../../services/firebase-config";
import "../../styles/Home.css";
import { motion } from "framer-motion";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { months } from "../Lists";
import Clock from "react-live-clock";
import { RiArrowGoBackFill } from "react-icons/ri";
import {
  DatePick,
  switchDay,
  day,
  getCurrentDay,
  getCurrentDate,
  getCurrentMonth,
} from "../DatePick";

import FetchTasks from "../Fetch/FetchTasks";
import { MdAdd, MdRemove } from "react-icons/md";
import AddTask from "../AddTask";
import TasksTop from "./TasksTop";
import { GetTaskDate, ThemedButton } from "../DatePick";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { getCurrentFriendId } from "../Auth/HandleUser";
const Tasks = (e) => {
  const [chosenDay, setChosenDay] = useState("not selected");
  const [fetchedDate, setFetchedDate] = useState("loading date...");
  const [chosenDate, setChosenDate] = useState("loading date...");
  const [fid, setFid] = useState("");
  // when you press arrow button, call function that replaces date
  // if button has been pressed, change view
  useEffect(() => {
    getCurrentFriendId(e.username).then((re) => setFid(re[0])); //=> sets friend id
    getCurrentDate().then((re) => setFetchedDate(re));
    setChosenDate(fetchedDate.split(" ")[1]);
  });
  const [finalTaskList, setFinalTaskList] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [newTask, setNewTask] = useState(false);
  const [AddTaskDisplay, setAddTaskDisplay] = useState("block");
  // Function to convert from username to user id

  useEffect(() => {
    getCurrentMonth().then((re) => setChosenDate(re));
    getCurrentDay().then((re) => setChosenDay(re));
    setLoadingTasks(false);
  }, []);

  function newTastFunction() {
    if (newTask) {
      setNewTask(false);
      const timer = setTimeout(() => {
        setAddTaskDisplay("none");
      }, 300);
    } else {
      setAddTaskDisplay("block");
      setNewTask(true);
    }
  }

  async function handleDateSwitch(opt) {
    setLoadingTasks(true);
    setFinalTaskList([]);
    switchDay(opt, chosenDay, chosenDate).then((re) => setChosenDay(re));
    await FetchTasks(fid, opt, chosenDay, chosenDate).then((re) => {
      setFinalTaskList(re);
      setLoadingTasks(false);
    });
  }

  return (
    <div className="Tasks-header">
      <div>
        <div className="tasks-top">
          <div className="tasks-top-left-friend">
            <div className="friend-tasks-back-btn">
              <Link to="/" className="f-t-b-btn" style={{ color: "white" }}>
                <RiArrowGoBackFill />
              </Link>
            </div>{" "}
            <p className="task-current-time">
              <Clock
                format={"HH:mm:ss"}
                ticking={true}
                timezone={"Europe/Stockholm"}
              />
            </p>
          </div>

          <div className="task-top-middle">
            <button
              className="task-date-button"
              onClick={() => handleDateSwitch("decrement")}
            >
              <BsArrowLeftCircle />
            </button>
            {chosenDay == "not selected" ? (
              <p className="task-selected-date">
                {" "}
                <Clock format={"dddd,"} timezone={"Europe/Stockholm"} />
                {fetchedDate}
              </p>
            ) : (
              <p className="task-selected-date">
                {" "}
                <Clock format={"dddd,"} timezone={"Europe/Stockholm"} />{" "}
                {chosenDate} {chosenDay}
              </p>
            )}

            <button
              className="task-date-button"
              onClick={() => handleDateSwitch("increment")}
            >
              <BsArrowRightCircle />
            </button>
          </div>
          <div>
            <p className="task-edit-permissions">Edit permissions</p>
          </div>
        </div>
        <motion.div className="tasks-main">
          {!loadingTasks ? (
            <div className="tasks-inner">
              {finalTaskList.length > 0 ? (
                finalTaskList.map((task, index) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0 }}
                    className="task"
                    key={task.tid}
                    style={{ backgroundColor: task.color }}
                  >
                    {task.content ? (
                      <motion.div>
                        <div
                          className="task-snurs"
                          style={{ paddingTop: "0.2rem" }}
                        >
                          <div className="inner-task-snurs">
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
                            <h1>{task.snurs}</h1>
                          </div>
                          <div className="inner-task-snurs-tid">
                            <p>{task.tid}</p>
                          </div>
                        </div>
                        <div className="task-top">
                          <div className="task-top-title">
                            <h1 className="task-title">{task.title}</h1>
                          </div>
                        </div>
                        <h1 className="task-time">{task.time}</h1>
                        <h1 className="task-content">{task.content}</h1>
                        {task.comment.length > 0 ? (
                          <p className="task-comment">
                            "{task.comment}" - {task.addedBy}
                          </p>
                        ) : (
                          <div></div>
                        )}
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
                          <h1>{task.snurs}</h1>
                        </div>
                        <h1 className="task-title">{task.title}</h1>
                        <h1 className="task-time">{task.time}</h1>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div>
                  <h1></h1>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p>Loading tasks...</p>
            </div>
          )}
          {newTask ? (
            <motion.div
              initial={{ y: 1, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, type: "just", stiffness: 100 }}
            >
              <AddTask />
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              style={{ display: AddTaskDisplay }}
            >
              <AddTask />
            </motion.div>
          )}
          <div className="tasks-bot">
            <div className="inner-bot">
              <button
                className="add-task-button"
                onClick={() => newTastFunction()}
              >
                <MdAdd />
              </button>
              <p className="under-btn-text">FORCE TASK</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default Tasks;
