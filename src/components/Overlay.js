import React from "react";
import "../styles/Overlay.css";
import Game from "./Game";

function Overlay(props) {
  return (
    <div className="app-overlay">
      <div className="overlay-container">
        <span onClick={props.handleOverlay} className="overlay-close-btn">
          <i className="fa fa-times-circle fa-3x" aria-hidden="true"></i>
        </span>
        <Game handleOverlay={props.handleOverlay} gameData={props.gameData} />
      </div>
    </div>
  );
}

export default Overlay;
