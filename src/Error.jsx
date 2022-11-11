import React from "react";
import { useNavigate } from "react-router-dom";

import "./Global.scss";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="error">
      <div className="error-heading">
        4<img src="./404.png" alt="404" />4
      </div>
      <div className="error-description">
        <p>
          oops! looks like you are lost <br /> The page you are looking for
          could not be found.
        </p>
        <div className="home-header__btn">
          <button
            onClick={() => navigate("/")}
            className="home-header__btn--btn"
          >
            Back to Home
          </button>
          <img
            className="arrow-circle-icon"
            src="./arrow-left-circle.png"
            alt="circle"
          />
        </div>
      </div>
    </div>
  );
};

export default Error;
