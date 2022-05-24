import React, { cloneElement, useEffect, useState } from "react";
import {
  FetchNewWeek,
  FetchWeek,
  FetchWeekNumber,
} from "../compontents/Tasks/FetchTaskWeek";
import "././../styles/Tasks.css";
import { motion, AnimatePresence } from "framer-motion";
import Clock from "react-live-clock";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import Tasks from "../compontents/Tasks/Tasks";
import TaskDay from "../compontents/Tasks/TaskDay";
import { Link, useParams } from "react-router-dom";
import { FetchProfileInfo } from "../compontents/Fetch/FetchProfile";
import { authentication } from "../services/firebase-config";
import { FetchProfileId } from "../compontents/Fetch/FetchProfileId";
import EderraMove from "../compontents/Tasks/EderraMove";
import SelectDaysButton from "../compontents/Tasks/SelectDaysButton";

function UserTasks(id) {
  //EderraMove(); //! <<<< Use only to move weeks!!!!
  const [tasks, setTasks] = useState([]);
  const [displayWeek, setDisplayWeek] = useState(true);
  const [weekCounter, setWeekCounter] = useState(0);
  const [switchingWeek, setSwitchingWeek] = useState(0);
  const [switchingWeekCount, setSwitchingWeekCount] = useState(0);
  const [currentWeek, setCurrentWeek] = useState("");
  const [displayDay, setDisplayDay] = useState("");
  const [idCount, setIdCount] = useState(0);
  const [currentUsername, setCurrentUsername] = useState("");
  const [daysToAdd, setDaysToAdd] = useState([]);
  const [viewingOtherProfile, setViewingOtherProfile] = useState(false);
  let _id = useParams().id; // gets the username from the url
  console.log(idCount);
  useEffect(() => {
    FetchProfileInfo(authentication.currentUser.uid).then((re) =>
      setCurrentUsername(re.split("$")[1])
    );
    console.log(currentUsername);
    FetchWeek(id).then((re) => setTasks(re));
    let k = parseInt(document.getElementById("nr").innerHTML.split(" ")[1]);
    setCurrentWeek(k);
  }, []);
  // create a function to see if the url changes and if so, update the tasks
  useEffect(() => {
    setTasks([]);
    if (id.uid != authentication.currentUser.uid) {
      setViewingOtherProfile(true);
    }
    FetchWeek(id.uid).then((re) => setTasks(re));
    let k = parseInt(document.getElementById("nr").innerHTML.split(" ")[1]);
    setCurrentWeek(k);
  }, [id.uid]);

  function weekSwitch(i) {
    setSwitchingWeek(1);
    setSwitchingWeekCount(i);
    if (i > 0) {
      let k =
        parseInt(document.getElementById("nr").innerHTML.split(" ")[1]) + 1;
      setCurrentWeek(k);
      FetchNewWeek(k, id.uid).then((re) => {
        const timer = setTimeout(() => {
          setTasks(re);
        }, 100);
      });
      const timer = setTimeout(() => {
        setSwitchingWeek(0);
      }, 600);
    } else {
      // k = new week number
      let k =
        parseInt(document.getElementById("nr").innerHTML.split(" ")[1]) - 1;
      setCurrentWeek(k);
      FetchNewWeek(k, id.uid).then((re) => setTasks(re));
      const timer = setTimeout(() => {
        setSwitchingWeek(0);
      }, 400);
    }
  }

  const dayStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.252)",
    cursor: "pointer",
  };
  const taskRowStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  };
  const container = {
    hidden: {
      opacity: 0,
      height: "calc(10vh - 35px)",
      transition: {
        duration: 0.1,
        delay: 1,
        delayChildren: 0.2,
        staggerChildren: switchingWeekCount / 3,
      },
    },
    show: {
      opacity: 1,
      height: "calc(95vh - 35px)",
      transition: {
        duration: 0.54,
        delay: 0.5,
        delayChildren: 0.1,

        staggerChildren: switchingWeekCount / 3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 100 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
      },
    },
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="task-top-container"
      >
        <div className="task-top-left">
          <p className="task-current-time">
            <Clock
              format={"HH:mm:ss"}
              ticking={true}
              timezone={"Europe/Stockholm"}
            />
          </p>
        </div>
        {displayWeek ? (
          <div className="task-top-mid">
            <button
              onClick={() => {
                setWeekCounter(weekCounter - 1);
                weekSwitch(-0.1);
              }}
              className="task-date-button"
            >
              <BsArrowLeftCircle pm={weekCounter} />
            </button>
            <p id="nr">
              Week <FetchWeekNumber pm={weekCounter} />
            </p>
            <button
              onClick={() => {
                setWeekCounter(weekCounter + 1);
                weekSwitch(0.1);
              }}
              className="task-date-button"
            >
              <BsArrowRightCircle />
            </button>
          </div>
        ) : (
          <div className="task-top-mid">
            <p id="nr">{displayDay} </p>
            <p
              style={{
                marginLeft: "1rem",
                fontSize: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              (week {currentWeek.toString()})
            </p>
          </div>
        )}

        {!displayWeek ? (
          <button
            className="bfd-button"
            onClick={() => {
              setDisplayWeek((displayWeek) => !displayWeek);
              FetchNewWeek(currentWeek, id.uid).then((re) => setTasks(re));
            }}
          >
            Back
          </button>
        ) : (
          <div className="task-top-right">
            {viewingOtherProfile ? (
              <Link
                onClick={() => {
                  setTasks([]);
                  setViewingOtherProfile(false);
                }}
                className="rtp-link"
                to="/"
              >
                Return to profile
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {displayWeek && (
          <motion.div
            className="UserTasks-container"
            variants={container}
            initial={"hidden"}
            animate={switchingWeek == 0 ? "show" : "hidden"}
            exit={{ opacity: 0, height: 0 }}
          >
            {/* <SelectDaysButton day={"monday"} week={currentWeek.toString()} />
            <SelectDaysButton day={"tuesday"} week={currentWeek.toString()} />
            <SelectDaysButton day={"wednesday"} week={currentWeek.toString()} />
            <SelectDaysButton day={"thursday"} week={currentWeek.toString()} />
            <SelectDaysButton day={"friday"} week={currentWeek.toString()} />
            <SelectDaysButton day={"saturday"} week={currentWeek.toString()} />
            <SelectDaysButton day={"sunday"} week={currentWeek.toString()} />
            */}
            <motion.button
              whileHover={dayStyle}
              className="mon"
              variants={item}
              onClick={() => {
                setDisplayWeek((displayWeek) => !displayWeek);
                setDisplayDay("monday");
              }}
            >
              <p>Monday</p>
              {tasks.map((task, index) => {
                return (
                  <div key={index} style={taskRowStyle}>
                    {task.day == "monday" ? (
                      <motion.div
                        key={index}
                        style={{ backgroundColor: task.color }}
                        className="task-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div>{task.title}</div>
                        <div className="week-task-s">
                          <p>{task.snurs}</p>
                        </div>
                        <div>{task.time}</div>
                        <div>{task.content}</div>
                        {authentication.currentUser.uid != id.uid ||
                        task.addedBy != currentUsername ? (
                          <div className="task-week-addedby">
                            Added by: {task.addedBy}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </motion.div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              })}
            </motion.button>
            <motion.button
              className="tue"
              variants={item}
              whileHover={dayStyle}
              onClick={() => {
                setDisplayWeek((displayWeek) => !displayWeek);
                setDisplayDay("tuesday");
              }}
            >
              <p>Tuesday</p>
              {tasks.map((task, index) => {
                return (
                  <div key={index} style={taskRowStyle}>
                    {task.day == "tuesday" ? (
                      <motion.div
                        key={index}
                        style={{ backgroundColor: task.color }}
                        className="task-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div>{task.title}</div>
                        <div className="week-task-s">
                          <p>{task.snurs}</p>
                        </div>
                        <div>{task.time}</div>
                        <div>{task.content}</div>
                        {authentication.currentUser.uid != id.uid ||
                        task.addedBy != currentUsername ? (
                          <div className="task-week-addedby">
                            Added by: {task.addedBy}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </motion.div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              })}
            </motion.button>
            <motion.button
              variants={item}
              className="wed"
              whileHover={dayStyle}
              onClick={() => {
                setDisplayWeek((displayWeek) => !displayWeek);
                setDisplayDay("wednesday");
              }}
            >
              <p>Wednesday</p>
              {tasks.map((task, index) => {
                return (
                  <div key={index} style={taskRowStyle}>
                    {task.day == "wednesday" ? (
                      <motion.div
                        key={index}
                        style={{ backgroundColor: task.color }}
                        className="task-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div>{task.title}</div>
                        <div className="week-task-s">
                          <p>{task.snurs}</p>
                        </div>
                        <div>{task.time}</div>
                        <div>{task.content}</div>
                        {authentication.currentUser.uid != id.uid ||
                        task.addedBy != currentUsername ? (
                          <div className="task-week-addedby">
                            Added by: {task.addedBy}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </motion.div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              })}
            </motion.button>
            <motion.button
              variants={item}
              className="thu"
              whileHover={dayStyle}
              onClick={() => {
                setDisplayWeek((displayWeek) => !displayWeek);
                setDisplayDay("thursday");
              }}
            >
              <p>Thursday</p>
              {tasks.map((task, index) => {
                return (
                  <div key={index} style={taskRowStyle}>
                    {task.day == "thursday" ? (
                      <motion.div
                        key={index}
                        style={{ backgroundColor: task.color }}
                        className="task-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div>{task.title}</div>
                        <div className="week-task-s">
                          <p>{task.snurs}</p>
                        </div>
                        <div>{task.time}</div>
                        <div>{task.content}</div>
                        {authentication.currentUser.uid != id.uid ||
                        task.addedBy != currentUsername ? (
                          <div className="task-week-addedby">
                            Added by: {task.addedBy}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </motion.div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              })}
            </motion.button>
            <motion.button
              variants={item}
              className="fri"
              whileHover={dayStyle}
              onClick={() => {
                setDisplayWeek((displayWeek) => !displayWeek);
                setDisplayDay("friday");
              }}
            >
              <p>Friday</p>
              {tasks.map((task, index) => {
                return (
                  <div key={index} style={taskRowStyle}>
                    {task.day == "friday" ? (
                      <motion.div
                        key={index}
                        style={{ backgroundColor: task.color }}
                        className="task-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div>{task.title}</div>
                        <div className="week-task-s">
                          <p>{task.snurs}</p>
                        </div>
                        <div>{task.time}</div>
                        <div>{task.content}</div>
                        {authentication.currentUser.uid != id.uid ||
                        task.addedBy != currentUsername ? (
                          <div className="task-week-addedby">
                            Added by: {task.addedBy}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </motion.div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              })}
            </motion.button>
            <motion.button
              variants={item}
              className="sat"
              whileHover={dayStyle}
              onClick={() => {
                setDisplayWeek((displayWeek) => !displayWeek);
                setDisplayDay("saturday");
              }}
            >
              <p>Saturday</p>
              {tasks.map((task, index) => {
                return (
                  <div key={index} style={taskRowStyle}>
                    {task.day == "saturday" ? (
                      <motion.div
                        key={index}
                        style={{ backgroundColor: task.color }}
                        className="task-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div>{task.title}</div>
                        <div className="week-task-s">
                          <p>{task.snurs}</p>
                        </div>
                        <div>{task.time}</div>
                        <div>{task.content}</div>
                        {authentication.currentUser.uid != id.uid ? (
                          <div className="task-week-addedby">
                            Added by: {task.addedBy}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </motion.div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              })}
            </motion.button>
            <motion.button
              variants={item}
              className="sun"
              whileHover={dayStyle}
              onClick={() => {
                setDisplayWeek((displayWeek) => !displayWeek);
                setDisplayDay("sunday");
              }}
            >
              <p>Sunday</p>
              {tasks.map((task, index) => {
                return (
                  <div key={index} style={taskRowStyle}>
                    {task.day == "sunday" ? (
                      <motion.div
                        key={index}
                        style={{ backgroundColor: task.color }}
                        className="task-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div>{task.title}</div>
                        <div className="week-task-s">
                          <p>{task.snurs}</p>
                        </div>
                        <div>{task.time}</div>
                        <div>{task.content}</div>
                        {authentication.currentUser.uid != id.uid ? (
                          <div className="task-week-addedby">
                            Added by: {task.addedBy}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </motion.div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                );
              })}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!displayWeek && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: "calc(95vh - 35px)",
              transition: { duration: 0.54, delay: 0.5 },
            }}
            exit={{ opacity: 0, height: 0 }}
            className="task-day-container"
          >
            <TaskDay day={displayDay} uid={id.uid} week={currentWeek} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UserTasks;
