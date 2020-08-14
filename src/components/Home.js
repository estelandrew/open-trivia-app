import React, { useState, useEffect, useRef } from "react";
import "../styles/Home.css";
import Overlay from "./Overlay";

function Page(props) {
  const handleGameOverlay = props.handleGameOverlay;

  const fieldTerm = useRef(null);
  const tokenResetCount = useRef(0);
  const numberOfQs = useRef(null);

  const [categoryState, setCategoryState] = useState({
    categoriesLoading: true,
    categories: [],
    categoryRequestCount: 0
  });

  const [gameState, setGameState] = useState({
    numberFieldValue: "10",
    categoryFieldValue: "9",
    difficultyFieldValue: "easy",
    totalCountForCategoryAndDifficulty: 50,
    gameData: [],
    gameLoading: false,
    gameRequestCount: 0,
    url: "",
    token: ""
  });

  const [errorState, setErrorState] = useState({
    error: false,
    message: ""
  });

  // fetch category list on load of application
  useEffect(() => {
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

  // fetch new token on load of application
  useEffect(() => {
    async function fetchToken() {
      const response = await fetch("https://opentdb.com/api_token.php?command=request");
      const data = await response.json();
      console.log(data.response_message);
      if (data.response_code === 0) {
        setGameState(prev => {
          return {
            ...prev,
            token: data.token
          };
        });
      }
    }
    fetchToken();
  }, []);

  /**
   * Handles initializing game - fetches questions, validates API response and opens game overlay
   */
  async function initGame() {
    if (errorState.error) {
      return;
    }
    setGameState(prev => {
      return {
        ...prev,
        gameLoading: true
      };
    });
    let totalCount = await lookUpCount(gameState.categoryFieldValue, gameState.difficultyFieldValue);
    if (totalCount < gameState.numberFieldValue) {
      numberOfQs.current = totalCount;
    } else {
      numberOfQs.current = gameState.numberFieldValue;
    }
    let res = await fetchGameData(numberOfQs.current, gameState.categoryFieldValue, gameState.difficultyFieldValue, gameState.token);
    let success = await handleResponse(res);
    if (success === 0) {
      // initial request successful start game
      setGameState(prev => {
        return {
          ...prev,
          gameLoading: false,
          gameData: res.data,
          url: res.url
        };
      });
      handleGameOverlay();
    } else if (success === 4) {
      // initial request failed due to token needing to be reset
      //need to request data again with refreshed token
      res = await fetchGameData(numberOfQs.current, gameState.categoryFieldValue, gameState.difficultyFieldValue);
      success = await handleResponse(res);
      if (success === 0) {
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
        alert("There was an error resetting token. Please refresh page to start a new session.");
      }
    } else {
      // fatal error, no reponse code received from API
      alert("Request failed. Please refresh page and try again.");
      setGameState(prev => {
        return {
          ...prev,
          gameLoading: false
        };
      });
    }
  }

  /**
   * Handles response code returned by API and handles errors
   * @param {Object} response - response received when fetching questions from API
   */
  async function handleResponse(response) {
    switch (response.code) {
      case 0: // success, start game
        return 0;
      case 1: // the API doesn't have enough questions for query
        alert("Error received. Not enough questions available to fulfill request.");
        return false;
      case 2: // invalid parameter in url
        alert("Error received. Invalid game parameters.");
        return false;
      case 3: // token not found
        alert("Session has ended. Please refresh page to being new session.");
        return false;
      case 4: // session token has returned all possible questions for the specified query or not enough on token
        // api sometimes returns code 4 in scenarios that seems inconsistent with the documentation -- adding reset limit to prevent infinite loop due to recursion.
        tokenResetCount.current++;
        if (tokenResetCount.current > 10) {
          alert("Token reset limit hit. Please refresh page to start new session.");
          return false;
        } else {
          let success = await resetGameToken();
          if (success) {
            return 4;
          } else {
            alert("There was an error resetting session token, please refresh page to continue playing.");
          }
        }
        break;
      default:
        console.log("Error communicating with the API");
        return false;
    }
    return true;
  }

  /**
   * Looks up total number of questions available for selected category and difficulty level
   * @param {String} category - selected category
   * @param {String} difficulty - selected difficutly level
   */
  async function lookUpCount(category, difficulty) {
    let totalCount;
    let url = `https://opentdb.com/api_count.php?category=${category}`;
    let res = await fetch(url);
    let data = await res.json();
    switch (difficulty) {
      case "easy":
        totalCount = data.category_question_count.total_easy_question_count;
        break;
      case "medium":
        totalCount = data.category_question_count.total_medium_question_count;
        break;
      case "hard":
        totalCount = data.category_question_count.total_hard_question_count;
        break;
      default:
        console.log("Error looking up category count");
        return;
    }
    return totalCount;
  }

  /**
   * Fetches data for game based on selected parameters
   * @param {String} amount - amount of questions to be added to url
   * @param {String} category - category to be added to url
   * @param {String} difficulty - difficulty level of questions to be added to url
   */
  async function fetchGameData(amount, category, difficulty) {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&token=${gameState.token}`;
    const response = await fetch(url);
    const data = await response.json();
    const gameData = data.results;
    const resCode = data.response_code;
    return { code: resCode, data: gameData, url: url };
  }

  /**
   * Resets session token
   */
  async function resetGameToken() {
    const response = await fetch(`https://opentdb.com/api_token.php?command=reset&token=${gameState.token}`);
    const data = await response.json();
    const resCode = data.response_code;
    if (resCode === 0) {
      console.log("Token reset");
      return true;
    } else {
      console.log("Error resetting token");
      return false;
    }
  }

  /**
   * Called on change of number input - validates number entered is within boundary and updates errorState accordingly
   * @param {Event} e - onChange event
   */
  function onNumQsChange(e) {
    fieldTerm.current = e.target.value;
    const error = !fieldTerm.current || fieldTerm.current < 1 || fieldTerm.current > 50;
    setErrorState(prev => {
      return {
        error: error,
        message: error ? "Please enter a number betwen 1 and 50" : ""
      };
    });
    setGameState(prev => {
      return {
        ...prev,
        numberFieldValue: fieldTerm.current
      };
    });
  }

  /**
   * Called on change of category selection - updates field value state
   * @param {Event} e - onChange event
   */
  async function onCatSelectedChange(e) {
    fieldTerm.current = e.target.value;
    setGameState(prev => {
      return {
        ...prev,
        categoryFieldValue: fieldTerm.current
      };
    });
  }

  /**
   * Called on change of difficulty selection - updates field value state
   * @param {Event} e - onChange event
   */
  async function onDifficultySelectChange(e) {
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
            <br />
            <br />
            <label htmlFor="number-of-games">Number of Questions:</label>
            <input onChange={onNumQsChange} className="selection-element" type="number" value={gameState.numberFieldValue} name="number-of-games" max={gameState.totalCountForCategoryAndDifficulty < 50 ? gameState.totalCountForCategoryAndDifficulty : "50"} min="1" />
            {errorState.error ? <span className="error-text">{errorState.message}</span> : <br />}
          </div>
          <span id="game" onClick={initGame} className={`btn start-btn ${errorState.error ? "disabled" : ""}`}>
            Start!
          </span>
        </>
      )}
      {props.overlayOpen && <Overlay handleCloseOverlay={props.handleCloseOverlay} gameData={gameState.gameData} content={props.content} fetchGameData={fetchGameData} categoryParam={gameState.categoryFieldValue} difficultyParam={gameState.difficultyFieldValue} numParam={numberOfQs.current} handleResponse={handleResponse} />}
    </div>
  );
}

export default Page;
