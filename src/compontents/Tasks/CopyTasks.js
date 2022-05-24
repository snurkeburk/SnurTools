import React, { useEffect, useState } from "react";

let arr = [];
let found = false;
export async function test(d, w) {
  // check if d exists in arr array
  if (arr.length === 0) {
    arr.push({ d, w });
  } else {
    arr.forEach((n, i) => {
      if (n.d === d && n.w === w) {
        console.log("found");
        found = true;
        arr.splice(i, 1);
      } else {
        found = false;
      }
    });
    if (!found) {
      arr.push(...[{ d, w }]);
    }
  }

  console.log(arr);
  return arr;
}
