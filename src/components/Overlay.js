import React, { useEffect } from "react";
import "../styles/Overlay.css";
import Game from "./Game";
import Info from "./Info";

function Overlay(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="app-overlay">
      <div className="overlay-container">
        <span onClick={props.handleCloseOverlay} className="overlay-close-btn">
          <i className="fa fa-times-circle fa-3x" aria-hidden="true"></i>
        </span>
        {props.content === "info" && <Info handleInfoOverlay={props.handleInfoOverlay} />}
        {props.content === "game" && <Game handleCloseOverlay={props.handleCloseOverlay} gameData={props.gameData} fetchGameData={props.fetchGameData} categoryParam={props.categoryParam} difficultyParam={props.difficultyParam} numParam={props.numParam} handleResponse={props.handleResponse} />}
      </div>
    </div>
  );
}

export default Overlay;
