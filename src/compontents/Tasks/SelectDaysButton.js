import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { test } from "./CopyTasks";

function SelectDaysButton(n) {
  const [daysToAdd, setDaysToAdd] = useState("");
  const [foundDay, setFoundDay] = useState(false);
  const [foundWeek, setFoundWeek] = useState(false);
  const addDayButtonStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.252)",
    cursor: "pointer",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  async function addDayToAdd(d, w) {
    console.log(d, w);
    // check if d exists in daysToAdd array

    // if it doesn't, add it
    test(d, w).then((re) => {
      setDaysToAdd(re);
    });
  }
  return (
    <div>
      <div>
        <button
          style={addDayButtonStyle}
          whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.80)" }}
          className="select-day-button"
          onClick={() => addDayToAdd(n.day, n.week)}
        >
          test
        </button>
      </div>
      <div>
        {daysToAdd.length > 0 ? (
          daysToAdd.map((n, i) => {
            return (
              <div key={i}>
                <h1>{n.d}</h1>
                <h1>{n.w}</h1>
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default SelectDaysButton;
