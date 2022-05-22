import React from "react";
import { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebase-config";
import { FetchDayTask } from "./FetchTaskDays";
import { DeleteTask } from "./DeleteTask";
import { motion } from "framer-motion";
import { RiCloseFill } from "react-icons/ri";
import AddTask from "../AddTask";
import { MdAdd } from "react-icons/md";

function TaskDay(n) {
  const [newTask, setNewTask] = useState(false);
  const [task, setTask] = useState([]);
  useEffect(() => {
    FetchDayTask(n.week, n.day, n.uid).then((re) => setTask(re));
  }, []);
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
  return (
    <div className="Task-header">
      <div className="tasks-main">
        {task.map((task, i) => {
          return (
            <div
              key={i}
              className="task"
              style={{
                backgroundColor: task.color,
              }}
            >
              <motion.div className="inner-rect">
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
                    <button
                      className="delete-task-button"
                      onClick={() => {
                        console.log("pressed");
                        DeleteTask(task.tid, n.uid, n.week, n.day);
                        handleRemove(i);
                      }}
                    >
                      <RiCloseFill />
                    </button>
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
                        <h1 className="task-time">{task.time}</h1>
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
            </div>
          );
        })}
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
              onClick={() => setNewTask((newTask) => !newTask)}
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

        {newTask ? (
          <AddTask week={n.week} day={n.day} id={n.uid} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default TaskDay;
