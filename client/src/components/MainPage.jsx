import React from "react";
import "./MainPage.css";

import { useNavigate } from "react-router-dom";
import { LoginContext } from "../Context/LoginContext";
import { useContext } from "react";

function MainPage() {
  const navigate = useNavigate();
  // importing the globl state from context
  const { showProfile, userData } = useContext(LoginContext);
  
  return (
  <div>
    <div className="flex-container-1">
      {showProfile ? (
        <div className="item1-loggedIn">
          <h1>Welcome back, {userData.first_name}!</h1>
        </div>
      ) : (
        <div className="item1">
          <h1>Online Survey System</h1>
        </div>
      )}

      <div className="item2">
        <p>
          Collect valuable insights with our user-friendly online survey
          platform.
        </p>
      </div>

      {showProfile ? undefined : (
        <div className="item3">
          <button
            className="button button1"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="button button2"
            onClick={() => navigate("register")}
          >
            Register
          </button>
        </div>
      )}
    </div>

    {showProfile ? (
      <div className="loggedInContainer"></div>
    ) : (
      <div className="flex-container-2">
        <div className="desc card1">
          <h2>Easy to Use</h2>
          <p>
            Create and manage surveys effortlessly with our intuitive
            interface.
          </p>
        </div>

        <div className="desc card2">
          <h2>Flexible Options</h2>
          <p>
            Customize your surveys with various question types and response
            options.
          </p>
        </div>

        <div className="desc card3">
          <h2>Email Surveys</h2>
          <p>
            Effortlessly send surveys to end users via email and collect
            response.
          </p>
        </div>
      </div>
    )}
  </div>
  );
}

export default MainPage;
