import React, { useEffect, useState } from "react";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { months } from "../Lists";
import Clock from "react-live-clock";

import {
  DatePick,
  switchDay,
  day,
  getCurrentDay,
  getCurrentDate,
} from "../DatePick";
import Tasks from "./Tasks";

function TasksTop() {
  const [chosenDay, setChosenDay] = useState("not selected");
  const [fetchedDate, setFetchedDate] = useState("loading date...");
  const [chosenDate, setChosenDate] = useState("loading date...");
  const [currentDate, setCurrentDate] = useState("");
  // when you press arrow button, call function that replaces date
  // if button has been pressed, change view
  useEffect(() => {
    getCurrentDate().then((re) => setFetchedDate(re));
    console.log(fetchedDate.split(" ")[1]);
    setChosenDate(fetchedDate.split(" ")[1]);
  });

  return (
    <div className="tasks-top">
      <div>
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
          onClick={() =>
            switchDay("decrement", chosenDay, chosenDate).then((re) =>
              setChosenDay(re)
            )
          }
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
          onClick={() =>
            switchDay("increment", chosenDay, chosenDate).then((re) =>
              setChosenDay(re)
            )
          }
        >
          <BsArrowRightCircle />
        </button>
      </div>
      <div>
        <p className="task-edit-permissions">Edit permissions</p>
      </div>
    </div>
  );
}

export default TasksTop;
