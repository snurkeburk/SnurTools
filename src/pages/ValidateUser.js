import React, { useEffect } from "react";
import Cookies from "js-cookie";

function ValidateUser() {
  useEffect(() => {
    let cookie = Cookies.get("uid");
    // check cookie
    if (cookie) {
      console.log("cookie exists"); // => compare ids
    } else {
      console.log("cookie does not exist"); // => user has to log in
    }
    // compare cookie to database

    //
  });
  return (
    <div>
      <h1>Valdating...</h1>
    </div>
  );
}

export default ValidateUser;
