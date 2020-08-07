import React, { useState } from "react";
import "./styles/App.css";

//Components
import Header from "./components/Header";
import Home from "./components/Home";

function App() {
  const [overlayOpen, setOverlayOpen] = useState(false);

  function handleOverlay() {
    setOverlayOpen(prev => !prev);
  }

  return (
    <>
      <Header />
      <Home handleOverlay={handleOverlay} overlayOpen={overlayOpen} />
    </>
  );
}

export default App;
