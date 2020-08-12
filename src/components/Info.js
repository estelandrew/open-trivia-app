import React from "react";
import "../styles/Info.css";

function Info() {
  return (
    <div className="info-container">
      <h2 className="info-heading">Info</h2>
      <div className="info-container-inner">
        <p className="info-instructions">
          <strong>Instructions:</strong> Select your game settings from the list on the home screen and start playing! A maximum of 50 questions may be retrieved per game.
        </p>
        <p className="info-note">
          Note - All categories and questions are supplied by the{" "}
          <a className="info-link" href="https://opentdb.com/" target="_blank" rel="noopener noreferrer">
            Open Trivia DB &rarr;
          </a>
        </p>
      </div>
    </div>
  );
}

export default Info;
