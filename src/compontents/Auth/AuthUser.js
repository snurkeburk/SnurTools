import React, { useState } from "react";
import { authentication } from "../../services/firebase-config";

export async function AuthUser() {
  console.log("AUTH USER");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const timer = setTimeout(() => {
    if (authentication.currentUser) {
      console.log("user logged in");
      setIsSignedIn(true);
    } else {
      console.log("user not logged in");
      setIsSignedIn(false);
    }
  }, 500);
  return true;
}
