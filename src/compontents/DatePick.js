import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import react, { useEffect } from "react";
import { authentication, db } from "../services/firebase-config";
import { days, months, dayNames } from "./Lists";
import Tasks, { FetchTaskDate, _FetchTasks } from "./Tasks/Tasks";
function DatePick() {
  useEffect(() => {});
  return (
    <div>
      <h1>fuck you</h1>
    </div>
  );
}

export async function getCurrentDate() {
  let date = new Date();
  let _date = date.toLocaleDateString();
  let _time = date.toLocaleTimeString();
  let time = _time.split(":")[0] + ":" + _time.split(":")[1];
  let month = _date.split("-")[1];
  let day = _date.split("-")[2];
  if (month.includes("0")) {
    month = month.split("0")[1];
  }
  if (day[0] == "0") {
    day = day.split("0")[1];
  }
  let monthName;
  for (let i = 0; i < months.length; i++) {
    if (month == i) {
      monthName = months[i - 1];
      if (day > 3) {
        day = day + "th";
      } else if (day == 1) {
        day = day + "st";
      } else if (day == 2 || day == 3) {
        day = day + "rd";
      }
      let dateString = " " + monthName + " " + day;
      return dateString;
    }
  }
}
export async function getCurrentDay() {
  let date = new Date();
  let _date = date.toLocaleDateString();
  let _time = date.toLocaleTimeString();
  let time = _time.split(":")[0] + ":" + _time.split(":")[1];
  let month = _date.split("-")[1];
  let day = _date.split("-")[2];
  if (month.includes("0")) {
    month = month.split("0")[1];
  }
  if (day[0] == 0) {
    day = day.split("0")[1];
  }
  return day;
}
export async function getCurrentMonth() {
  let date = new Date();
  let _date = date.toLocaleDateString();
  let _time = date.toLocaleTimeString();
  let time = _time.split(":")[0] + ":" + _time.split(":")[1];
  let month = _date.split("-")[1];
  if (month.includes("0")) {
    month = month.split("0")[1];
  }

  return month;
}

export async function GetTaskDate(uid, opt, day, month) {
  if (day == "not selected") {
    await getCurrentDay().then((re) => (day = re));
  }
  if (month == "loading date...") {
    await getCurrentMonth().then((re) => (month = re));
  }
  let _month = "";
  if (opt == "increment") {
    day = parseInt(day) + 1;
  } else if (opt == "decrement") {
    day = parseInt(day) - 1;
  } else if (opt == "default") {
    day = parseInt(day);
  }
  if (day < 10) {
    day = "0" + day;
  }
  if (parseInt(month)) {
    if (month < 10) {
      _month = "0" + month;
    } else {
      _month = month;
    }
  } else {
    for (let i = 0; i < months.length; i++) {
      if (month == months[i]) {
        if (i < 10) {
          _month = "0" + (i + 1);
        } else {
          _month = i + 1;
        }
      }
    }
  }

  let string = "2022-" + _month + "-" + day;
  const tasklist = [];
  const taskRef = collection(db, "users", uid, "tasks");
  if (day == undefined) {
    // on load, the day will be undefined => go to current day
    let date = new Date();
    let _date = date.toLocaleDateString();
    const q = query(
      taskRef,
      where("date", "==", _date)
      //! REPLACE WITH DATE ON SELECTED PAGE HERE
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((_doc) => {
      // doc.data() is never undefined for query doc snapshots
      tasklist.push(...[_doc.id]);
    });
  } else {
    // if user switches day
    const q = query(
      taskRef,
      where("date", "==", string)
      //! REPLACE WITH DATE ON SELECTED PAGE HERE
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((_doc) => {
      // doc.data() is never undefined for query doc snapshots
      tasklist.push(...[_doc.id]);
    });
  }
  let innerTasklist = [];
  for (let i = 0; i < tasklist.length; i++) {
    const docRef = doc(db, "users", uid, "tasks", tasklist[i]);
    const _doc = await getDoc(docRef);
    innerTasklist.push(...[_doc.data()]);
  }
  return innerTasklist;
}

export async function switchDay(opt, _day, month) {
  // -----------------------------------------------
  // this is for tasks to fetch selected date:
  // create string format: xxxx-yy-zz
  // xxxx = 2022 for now
  // -----------------------------------------------
  if (_day != "not selected") {
    let num = _day[0] + _day[1];
    num = parseInt(num);
    if (num > 0 && num < 10) {
      let num = parseInt(_day[0]);
      if (opt == "increment") {
        num = num + 1;
      } else {
        num = num - 1;
      }
      let ending = "";
      if (num == 0 || num >= 4) {
        ending = "th";
      } else if (num == 1) {
        ending = "st";
      } else if (num == 2) {
        ending = "nd";
      } else if (num == 3) {
        ending = "rd";
      }

      return num + ending;
    } else if (num >= 10 && num <= 31) {
      let num = parseInt(_day[0] + _day[1]);
      let day = _day[0] + _day[1];
      let ending;

      if (opt == "increment") {
        num = num + 1;
      } else {
        num = num - 1;
      }

      if (num == 20 || (num >= 24 && num < 31)) {
        ending = "th";
      } else if (num == 21 || num == 31) {
        ending = "st";
      } else if (num == 22) {
        ending = "nd";
      } else if (num == 23) {
        ending = "rd";
      } else {
        ending = "th";
      }
      return num + ending;
    }
  } else if (_day == "not selected") {
    let date = new Date();
    let _date = date.toLocaleDateString();
    let _time = date.toLocaleTimeString();
    let time = _time.split(":")[0] + ":" + _time.split(":")[1];
    let month = _date.split("-")[1];
    let day = _date.split("-")[2];
    if (month.includes("0")) {
      month = month.split("0")[1];
    }
    if (day.includes("0")) {
      day = day.split("0")[1];
    }
    let ending = "th";
    if (opt == "increment") {
      for (let i = 0; i < days.length; i++) {
        if (day == days[i]) {
          GetTaskDate(days[i + 1], month);
          return days[i + 1] + ending;
        }
      }
    } else {
      for (let i = 0; i < days.length; i++) {
        if (day == days[i]) {
          GetTaskDate(days[i - 1], month);
          return days[i - 1] + ending;
        }
      }
    }
  }
}

export default DatePick;
