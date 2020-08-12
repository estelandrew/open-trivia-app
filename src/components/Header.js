import React from "react";
import "../styles/Header.css";

function Header(props) {
  return (
    <header>
      <div className="flex-container header-container">
        <div className="header-flex-item item-1">
          <h2 className="main-heading">A Trivia App</h2>
        </div>
        <div className="header-flex-item item-2">
          <i onClick={props.handleInfoOverlay} id="info" className="fa fa-info fa-1x" aria-hidden="true"></i>
        </div>
      </div>
    </header>
  );
}

export default Header;
