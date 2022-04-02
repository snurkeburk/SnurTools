import React from "react";
import Sidebar from "../compontents/Sidebar";
import "../styles/Home.css";
function Home() {
  return (
    <div className="Home-header">
      <div>
        {" "}
        <Sidebar />
      </div>
      <div>
        <h1>home page</h1>
        <p>woww</p>
      </div>
    </div>
  );
}

export default Home;
