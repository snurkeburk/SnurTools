import React from "react";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { authentication, db } from "../../services/firebase-config";
import { FetchDayTask } from "./FetchTaskDays";
import { DeleteTask } from "./DeleteTask";
import { motion } from "framer-motion";
import { RiCloseFill } from "react-icons/ri";
import AddTask from "../AddTask";
import { MdAdd, MdEditCalendar, MdEditNote } from "react-icons/md";
import { FetchProfileId } from "../Fetch/FetchProfileId";
import { Collapse } from "@mui/material";
import { IoMdCheckmarkCircleOutline, IoMdTrash } from "react-icons/io";
import { BsTrash } from "react-icons/bs";
import { CgClose, CgEditUnmask, CgPen } from "react-icons/cg";
import {
  FetchCurrentSidebarTask,
  FetchTasksDone,
  FetchTasksLeft,
} from "../Fetch/SidebarTasks";

function TaskDay(n) {
  const [taskInfo, setTaskInfo] = useState({});
  const [newTask, setNewTask] = useState(false);
  const [task, setTask] = useState([]);
  const [selectedTask, setSelectedTask] = useState(-1);
  const [hoverCompleted, setHoverCompleted] = useState(false);

  useEffect(() => {
    console.log(n);
    FetchDayTask(n.week, n.day, n.uid).then((re) => setTask(re));
  }, [n.uid]);

  function handleRemove(id) {
    const newArr = [];
    for (let i = 0; i < task.length; i++) {
      if (i == id) {
        // skipping position id
      } else {
        newArr.push(...[task[i]]);
      }
    }
    setTask(newArr);
  }
  async function completeTask(id) {
    let _id = id.split("$")[1] + "$" + id.split("$")[2];

    let day = n.day;
    switch (day) {
      case "monday":
        day = 1;
        break;
      case "tuesday":
        day = 2;
        break;
      case "wednesday":
        day = 3;
        break;
      case "thursday":
        day = 4;
        break;
      case "friday":
        day = 5;
        break;
      case "saturday":
        day = 6;
        break;
      case "sunday":
        day = 7;
        break;
      default:
        day = 1;
        break;
    }
    console.log(_id, n.uid, n.week, n.day);
    const taskRef = doc(
      db,
      "users",
      n.uid,
      "tasks",
      n.week.toString(),
      day.toString(),
      _id
    );

    const task = await getDoc(taskRef);
    await updateDoc(taskRef, {
      completed: !task.data().completed,
    });
    if (!task.data().completed) {
      const profRef = doc(db, "users", n.uid);
      const prof = await getDoc(profRef);
      await updateDoc(profRef, {
        snurs: parseInt(prof.data().snurs) + parseInt(task.data().snurs),
      });
    } else {
      const profRef = doc(db, "users", n.uid);
      const prof = await getDoc(profRef);
      await updateDoc(profRef, {
        snurs: parseInt(prof.data().snurs) - parseInt(task.data().snurs),
      });
    }
    FetchCurrentSidebarTask(n.uid);
    FetchTasksDone(n.uid);
    FetchTasksLeft(n.uid);
  }
  return (
    <div className="Task-header">
      <div className="tasks-main">
        {task.map((task, i) => {
          return (
            <motion.div
              whileHover={{ cursor: "pointer" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                // check if id is in taskOwners array
                if (task.taskOwners.includes(authentication.currentUser.uid)) {
                  selectedTask == i ? setSelectedTask(-1) : setSelectedTask(i);
                } else {
                }
              }}
              key={i}
              className="task"
              style={{
                backgroundColor: task.color,
              }}
            >
              <Collapse
                in={selectedTask == i}
                style={{
                  position: "absolute",
                  zIndex: "2000",
                  width: "inherit",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxWidth: "17rem",
                }}
              >
                <motion.div className="task-selected-container">
                  <div className="task-selected-complete">
                    <motion.button
                      onHoverStart={() => setHoverCompleted(true)}
                      onHoverEnd={() => setHoverCompleted(false)}
                      onClick={() => {
                        completeTask(task.tid);
                      }}
                      whileHover={{
                        scale: 1.1,
                        cursor: "pointer",
                        backdropFilter: "blur(10px)",
                        color: "rgba(127, 187, 127)",
                      }}
                      className="complete-task"
                    >
                      <IoMdCheckmarkCircleOutline />
                    </motion.button>
                  </div>
                  <div className="task-selected-edit-remove">
                    <motion.button
                      whileHover={{ scale: 1.1, cursor: "pointer" }}
                      className="edit-task-button"
                      onClick={() => {
                        setTaskInfo({
                          ...task,
                        });
                        setNewTask(true);
                      }}
                    >
                      <MdEditCalendar />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, cursor: "pointer" }}
                      className="delete-task-button"
                      onClick={() => {
                        DeleteTask(task.tid, n.uid, n.week, n.day);
                        handleRemove(i);
                      }}
                    >
                      <BsTrash />
                    </motion.button>
                  </div>
                </motion.div>
              </Collapse>
              <motion.div
                className="inner-rect"
                {...(selectedTask == i
                  ? {
                      style: {
                        filter: "blur(2px)",
                      },
                    }
                  : {})}
              >
                <div className="task-snurs" style={{ paddingTop: "0.2rem" }}>
                  <div className="inner-task-snurs">
                    <img
                      className="snurs-pic"
                      src={
                        "https://cdn.discordapp.com/attachments/937167004165615657/960581859568390254/paintcoin.png"
                      }
                      style={{
                        width: "1.6rem",
                        boxShadow: "2px 2px 4px 1px rgba(0,0,0,0.25)",
                      }}
                    />
                    <h1>{task.snurs}</h1>
                  </div>
                  <div className="inner-task-snurs-tid">
                    <p>{task.tid}</p>
                  </div>
                </div>
                <div className="inner-task-main">
                  <div className="task-top">
                    <div className="task-top-title">
                      <h1
                        className="task-title"
                        style={
                          task.content.length > 0
                            ? { paddingBottom: "1rem" }
                            : {
                                display: "flex",
                                justifyContent: "space-between",
                                paddingTop: "0.5rem",
                              }
                        }
                      >
                        {task.title}
                        <h1 className="task-time">
                          {task.time} - {task.endTime}
                        </h1>
                      </h1>
                    </div>
                  </div>
                </div>
                <h1
                  className="task-content"
                  style={
                    task.content.length > 30
                      ? { textAlign: "left" }
                      : { textAlign: "center" }
                  }
                >
                  {task.content}
                </h1>
                {task.comment.length > 0 ? (
                  <p className="task-comment">
                    "{task.comment}" - {task.addedBy}
                  </p>
                ) : (
                  <div></div>
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {newTask ? (
          <div>
            <div className="new-task-container-task">
              <AddTask week={n.week} day={n.day} id={n.uid} info={taskInfo} />
            </div>
            <div className="new-task-container-btn">
              <button
                className="clear-all-button"
                style={{ width: "3rem", height: "3rem" }}
                onClick={() => {
                  setNewTask((newTask) => !newTask);
                  setTaskInfo({});
                }}
              >
                <CgClose />
              </button>
            </div>
          </div>
        ) : (
          <div className="tasks-bot">
            <div className="inner-bot">
              <button className="newpage-button">
                <MdAdd />
              </button>
              <p className="under-btn-text">NEW PAGE</p>
            </div>
            <div className="inner-bot">
              <button
                className="add-task-button"
                onClick={() => {
                  setNewTask((newTask) => !newTask);
                  setTaskInfo({});
                }}
              >
                <MdAdd />
              </button>
              <p className="under-btn-text">ADD TASK</p>
            </div>
            <div className="inner-bot">
              <button className="clear-all-button">X</button>
              <p className="under-btn-text">CLEAR ALL</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDay;
