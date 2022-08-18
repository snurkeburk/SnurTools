import React from "react";
import { useEffect, useState } from "react";

function DayDate(n) {
  let date = new Date();
  let _date = date.toLocaleDateString();
  useEffect(() => {
    console.log(n.w, n.d);
  });
  // get the current week number
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1);
  var days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
  var weekNumber = Math.ceil(days / 7);
  // get current month
  let _month = currentDate.getMonth();
  let montha = _month.toString();
  let wDiff = parseInt(n.w) - weekNumber;
  let totDays;
  // fetch how many days are in the current month
  let month;
  if (n.w > 0 && n.w < 5) {
    month = 1;
  }
  if (n.w > 4 && n.w < 9) {
    month = 2;
  }
  if (n.w > 8 && n.w < 13) {
    month = 3;
  }
  if (n.w > 12 && n.w < 17) {
    month = 4;
  }
  if (n.w > 16 && n.w < 22) {
    month = 5;
  }
  if (n.w > 21 && n.w < 26) {
    month = 6;
  }
  if (n.w > 25 && n.w < 31) {
    month = 7;
  }
  if (n.w > 30 && n.w < 35) {
    month = 8;
  }
  if (n.w > 34 && n.w < 39) {
    month = 9;
  }
  if (n.w > 38 && n.w < 44) {
    month = 10;
  }
  if (n.w > 43 && n.w < 48) {
    month = 11;
  }
  if (n.w > 47 && n.w < 53) {
    month = 12;
  }

  let mDiff = parseInt(parseInt(montha) + 1 - month) * -1;
  if (
    month === 1 ||
    month === 3 ||
    month === 5 ||
    month === 7 ||
    month === 8 ||
    month === 10 ||
    month === 12
  ) {
    totDays = 31;
  }

  if (
    month === 2 ||
    month === 4 ||
    month === 6 ||
    month === 9 ||
    month === 11
  ) {
    totDays = 30;
  }
  let long = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];
  let short = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];
  // get the date day
  let _day = currentDate.getDate();
  let day = _day.toString();
  console.log(day);
}
export default DayDate;
