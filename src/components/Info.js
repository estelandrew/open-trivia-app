import React from "react";
import "../styles/Info.css";

function Info() {
  return (
    <div className="info-container">
      <h2 className="info-heading">Instructions</h2>
      <div className="info-container-inner">
        <p className="info-instructions">
          Select your game settings from the list on the home screen and start playing!
          <br />
          <br />A maximum of 50 questions may be returned per game. If fewer questions exist than are available for chosen category and difficulty settings, the total number available will be delivered.
        </p>
        <p className="info-note">
          All categories and questions are supplied by the{" "}
          <a className="info-link" href="https://opentdb.com/" target="_blank" rel="noopener noreferrer">
            Open Trivia DB <i class="fa fa-external-link" aria-hidden="true"></i>
          </a>
        </p>
      </div>
    </div>
  );
}

export default Info;
