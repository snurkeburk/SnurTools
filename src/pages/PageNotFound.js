import React from "react";
import { Link, Navigate } from "react-router-dom";
import "../styles/PageNotFound.css";
function PageNotFound() {
  return (
    <div className="notFound-container">
      <div className="notFound-inner">
        <p className="notFound-txt-special">404</p>
        <h1 className="notFound-txt-h1">Oops! 404</h1>
        <p className="notFound-txt">
          The page you are looking for doesn't seem to exists.
        </p>
        <p className="notFound-txt">
          Please check the URL for mistakes and try again.
        </p>
        <Link className="notFoundLink" to="/">
          Return to home
        </Link>
      </div>
      <p className="notFound-link">SnurTools.com</p>
    </div>
  );
}

export default PageNotFound;
