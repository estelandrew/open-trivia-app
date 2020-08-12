import React, { useState, useEffect, useRef } from "react";
import "../styles/Home.css";
import Overlay from "./Overlay";

function Page(props) {
  const handleGameOverlay = props.handleGameOverlay;

  const fieldTerm = useRef(null);

  const [categoryState, setCategoryState] = useState({
    categoriesLoading: true,
    categories: [],
    categoryRequestCount: 0
  });

  const [gameState, setGameState] = useState({
    numberFieldValue: "10",
    categoryFieldValue: "9",
    difficultyFieldValue: "easy",
    gameData: [],
    gameLoading: false,
    gameRequestCount: 0,
    url: "",
    token: "94d4c21f6f6952413e39d85f8ddbc20d1980130643560c7475c4df28dd6c8434"
  });

  useEffect(() => {
    console.log("used effect");
    async function fetchData() {
      const response = await fetch("https://opentdb.com/api_category.php");
      const data = await response.json();
      const categories = data.trivia_categories;
      setCategoryState(prev => {
        return {
          ...prev,
          categories: categories,
          categoriesLoading: false
        };
      });
    }
    fetchData();
  }, []);

  async function initGame(e, isInitialGame = true) {
    setGameState(prev => {
      return {
        ...prev,
        gameLoading: true
      };
    });
    let res = await fetchGameData();
    if (res.code === 0) {
      setGameState(prev => {
        return {
          ...prev,
          gameLoading: false,
          gameData: res.data,
          url: res.url
        };
      });
      handleGameOverlay();
    } else if (res.code === 1 || res.code === 4) {
      // if not enough questions are left on token to fulfill request, reset token and refetch data
      const tokenRes = await resetGameToken();
      console.log(tokenRes, "Token has been reset");
      res = await fetchGameData();
      if (res.code === 0) {
        setGameState(prev => {
          return {
            ...prev,
            gameLoading: false,
            gameData: res.data,
            url: res.url
          };
        });
        handleGameOverlay();
      } else {
        alert("There was an error.");
        return;
      }
    } else if (res.code === 2) {
      console.log("Invalid Parameter");
    } else if (res.code === 3) {
      console.log("Token not found");
    } else {
      alert("There was an error.");
      return;
    }
  }

  async function fetchGameData() {
    const amount = gameState.numberFieldValue;
    const category = gameState.categoryFieldValue;
    const difficulty = gameState.difficultyFieldValue;
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&token=${gameState.token}`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    const gameData = data.results;
    const resCode = data.response_code;
    return { code: resCode, data: gameData, url: url };
  }

  async function resetGameToken() {
    const response = await fetch(`https://opentdb.com/api_token.php?command=reset&token=${gameState.token}`);
    const data = await response.json();
    const resCode = data.response_code;
    if (resCode === 0) {
      console.log("Token reset");
    } else {
      console.log("Error resetting token");
    }
    return data;
  }

  function onNumQsChange(e) {
    fieldTerm.current = e.target.value;
    setGameState(prev => {
      return {
        ...prev,
        numberFieldValue: fieldTerm.current
      };
    });
  }

  function onCatSelectedChange(e) {
    fieldTerm.current = e.target.value;
    setGameState(prev => {
      return {
        ...prev,
        categoryFieldValue: fieldTerm.current
      };
    });
  }

  function onDifficultySelectChange(e) {
    fieldTerm.current = e.target.value;
    setGameState(prev => {
      return {
        ...prev,
        difficultyFieldValue: fieldTerm.current
      };
    });
  }

  return (
    <div className="wrapper">
      <h2 className="page-heading">Let's Play!</h2>
      <br />
      <h3 className="sub-head">Choose your game:</h3>
      {categoryState.categoriesLoading || gameState.gameLoading ? (
        <div className="loader"></div>
      ) : (
        <>
          <div className="selection-container">
            <label htmlFor="number-of-games">Number of Questions:</label>
            <input onChange={onNumQsChange} className="selection-element" type="number" value={gameState.numberFieldValue} name="number-of-games" max="50" />
            <br />
            <br />
            <label htmlFor="category">Category:</label>
            <br />
            <select onChange={onCatSelectedChange} className="selection-element" name="category" value={gameState.categoryFieldValue}>
              {categoryState.categories.map(cat => (
                <option value={cat.id} key={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <br />
            <br />
            <label htmlFor="category">Difficulty:</label>
            <br />
            <select onChange={onDifficultySelectChange} className="selection-element" name="category" value={gameState.difficultyFieldValue}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <span id="game" onClick={initGame} className="btn start-btn">
            Start!
          </span>
        </>
      )}
      {props.overlayOpen && <Overlay handleCloseOverlay={props.handleCloseOverlay} gameData={gameState.gameData} content={props.content} fetchGameData={fetchGameData} resetGameToken={resetGameToken} />}
    </div>
  );
}

export default Page;
