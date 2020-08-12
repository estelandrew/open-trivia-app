import React, { useState } from "react";
import "./styles/App.css";

//Components
import Header from "./components/Header";
import Home from "./components/Home";

function App() {
  const [overlayOpen, setOverlayOpen] = useState({
    open: false,
    content: ""
  });

  function handleInfoOverlay(e) {
    setOverlayOpen(prev => {
      return {
        open: !prev.open,
        content: "info"
      };
    });
  }

  function handleGameOverlay(e) {
    setOverlayOpen(prev => {
      return {
        open: !prev.open,
        content: "game"
      };
    });
  }

  function handleCloseOverlay() {
    setOverlayOpen(prev => {
      return {
        ...prev,
        open: !prev.open
      };
    });
  }

  return (
    <>
      <Header handleInfoOverlay={handleInfoOverlay} handleCloseOverlay={handleCloseOverlay} />
      <Home handleGameOverlay={handleGameOverlay} handleCloseOverlay={handleCloseOverlay} overlayOpen={overlayOpen.open} content={overlayOpen.content} />
    </>
  );
}

export default App;
