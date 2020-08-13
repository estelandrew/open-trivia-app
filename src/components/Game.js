import React, { useState, useRef } from "react";
import "../styles/Game.css";
import { AllHtmlEntities } from "html-entities";

const entities = new AllHtmlEntities();

function Game(props) {
  const i = useRef(0); // for iterating through questions
  const selectedIndex = useRef(null); // for monitoring current selection during game
  const isCorrect = useRef(false); // for evaluating if correct answer was clicked
  const gameData = useRef(props.gameData);

  const [game, setGame] = useState({
    category: gameData.current[0].category,
    question: gameData.current[0].question,
    correctAnswer: entities.decode(gameData.current[0].correct_answer),
    choices: makeChoicesArray(gameData.current[0].incorrect_answers, getRandomInt(0, 3), gameData.current[0].correct_answer),
    answerRevealed: false,
    activeIndex: null,
    totalCorrect: 0,
    totalIncorrect: 0,
    newGameLoading: false,
    gameInProgress: true
  });

  /**
   * Returns an array of possible answers - correct answer placed at random index
   * @param {Array} incorrectAnswers - The array of incorrect answers
   * @param {number} randomInt - Random index of where to insert correct answer
   * @param {correctAnswer} - Correct answer to be inserted at specified index
   */
  function makeChoicesArray(incorrectAnswers, randomIndex, correctAnswer) {
    let tempArr = incorrectAnswers.slice(0, randomIndex);
    tempArr.push(correctAnswer);
    let tempArr2 = incorrectAnswers.slice(randomIndex);
    let result = tempArr.concat(tempArr2);
    result = result.map(item => entities.decode(item));
    return result;
  }

  /**
   * Called on click of next button
   * @param {Event} e event handler
   */
  function handleNext(e) {
    i.current++;
    if (i.current < gameData.current.length) {
      setGame(prev => {
        return {
          ...prev,
          question: gameData.current[i.current].question,
          correctAnswer: entities.decode(gameData.current[i.current].correct_answer),
          choices: makeChoicesArray(gameData.current[i.current].incorrect_answers, getRandomInt(0, 3), gameData.current[i.current].correct_answer),
          answerRevealed: false,
          activeIndex: null
        };
      });
    } else {
      setGame(prev => {
        return {
          ...prev,
          gameInProgress: false
        };
      });
    }
  }

  /**
   * Called on click of anwering question
   * @param {Event} e
   */
  function evaluateChoice(e) {
    if (game.answerRevealed) {
      return;
    }
    selectedIndex.current = e.target.dataset.index;
    if (e.target.innerText === game.correctAnswer) {
      isCorrect.current = true;
    } else {
      isCorrect.current = false;
    }
    setGame(prev => {
      return {
        ...prev,
        answerRevealed: true,
        activeIndex: parseInt(selectedIndex.current),
        totalCorrect: isCorrect.current ? prev.totalCorrect + 1 : prev.totalCorrect,
        totalIncorrect: !isCorrect.current ? prev.totalIncorrect + 1 : prev.totalIncorrect
      };
    });
  }

  async function handlePlayAgain(e) {
    i.current = 0;
    setGame(prev => {
      return {
        ...prev,
        newGameLoading: true
      };
    });
    let res = await props.fetchGameData();
    if (res.code === 0) {
      gameData.current = res.data;
      setGame(prev => {
        return {
          category: gameData.current[0].category,
          question: gameData.current[0].question,
          correctAnswer: gameData.current[0].correct_answer,
          choices: makeChoicesArray(gameData.current[0].incorrect_answers, getRandomInt(0, 3), gameData.current[0].correct_answer),
          answerRevealed: false,
          activeIndex: null,
          totalCorrect: 0,
          totalIncorrect: 0,
          newGameLoading: false,
          gameInProgress: true
        };
      });
    } else if (res.code === 1 || res.code === 4) {
      // if not enough questions are left on token to fulfill request, reset token and refetch data
      await props.resetGameToken();
      console.log("Token has been reset");
      res = await props.fetchGameData();
      if (res.code === 0) {
        gameData.current = res.data;
        setGame(prev => {
          return {
            category: gameData.current[0].category,
            question: gameData.current[0].question,
            correctAnswer: gameData.current[0].correct_answer,
            choices: makeChoicesArray(gameData.current[0].incorrect_answers, getRandomInt(0, 3), gameData.current[0].correct_answer),
            answerRevealed: false,
            activeIndex: null,
            totalCorrect: 0,
            totalIncorrect: 0,
            newGameLoading: false,
            gameInProgress: true
          };
        });
      } else {
        alert("There was an error.");
        return;
      }
    } else if (res.code === 2) {
      console.log("Invalid Parameter");
      return;
    } else if (res.code === 3) {
      console.log("Token not found");
      return;
    } else {
      alert("There was an error.");
      return;
    }
  }

  /**
   * Returns random number from 0 to 2
   */
  function getRandomInt() {
    let min = 0;
    let max = 3;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Formatter function for results in percentage to two decimal places
   * @param {Number} num - Unformatted number to be formatted
   */
  function formatAsPercent(num) {
    return `${(num * 100).toFixed(2)}%`;
  }

  return (
    <div className="game-container">
      {/** BEGIN game in progress container */}
      {game.gameInProgress && !game.newGameLoading && (
        <>
          <div className="question-container">
            <h2 className="game-container-heading category-heading">{game.category}</h2>
            <br />
            <div className="question-container-inner">
              <h4>{`Question ${i.current + 1} out of ${gameData.current.length}`}</h4>
              <br />
              <p className="question">{entities.decode(game.question)}</p>
              {game.choices.map(choice => (
                <div key={game.choices.indexOf(choice)} className="flex-container choice-container">
                  <span
                    onClick={evaluateChoice}
                    key={game.choices.indexOf(choice)}
                    data-index={game.choices.indexOf(choice)}
                    className={`choice ${game.correctAnswer === choice ? "correct" : "incorrect"} 
              ${game.answerRevealed ? "revealed" : "concealed"}
              ${game.activeIndex === game.choices.indexOf(choice) ? "selected" : ""}`}
                  >
                    {entities.decode(choice)}
                  </span>
                  <i
                    className={`fa ${game.correctAnswer === choice ? "fa-check-circle" : "fa-times-circle-o"} 
                              ${!game.answerRevealed || (game.answerRevealed && game.activeIndex !== game.choices.indexOf(choice) && game.correctAnswer !== choice) ? "hide" : ""} 
                              ${game.activeIndex !== game.choices.indexOf(choice) && game.correctAnswer === choice ? "correctAndNotSelected" : ""}
                              fa-1x eval-icon`}
                    aria-hidden="true"
                  ></i>
                </div>
              ))}
            </div>
          </div>
          <br />
          <span className={`eval-text ${!game.answerRevealed ? "hide" : ""} ${isCorrect.current ? "correct" : "incorrect"}`}>{isCorrect.current ? "Correct!" : "Sorry, that is not correct."}</span>
          <span className={`btn next-btn ${!game.answerRevealed ? "hide" : ""}`} onClick={handleNext}>
            Next &raquo;
          </span>
          {/** END game in progress container */}
        </>
      )}
      {!game.gameInProgress && !game.newGameLoading && (
        <>
          {/** BEGIN results screen */}
          <div className="results-container">
            <h2 className="game-container-heading">Results!</h2>
            <p className="results-total">
              You answered <span className="highlight">{`${game.totalCorrect} out of ${game.totalCorrect + game.totalIncorrect}`}</span> correctly.
            </p>
            <p className="results-percentage">
              Final Score: <span className="highlight">{`${formatAsPercent(game.totalCorrect / (game.totalCorrect + game.totalIncorrect))}${game.totalCorrect / (game.totalCorrect + game.totalIncorrect) > 0.7 ? "!" : "."}`}</span>
            </p>
          </div>
          <div className="results-btns flex-container">
            <div className="flex-item item-1">
              <span onClick={handlePlayAgain} className="btn play-again">
                Play Again
              </span>
            </div>
            <div className="flex-item item-2">
              <span onClick={props.handleCloseOverlay} className="btn select-new">
                Select New Game
              </span>
            </div>
          </div>
          {/** END results screen */}
        </>
      )}
      {/** Show loading spinner while new game is being fetched */}
      {game.newGameLoading && <div className="loader"></div>}
    </div>
  );
}

export default Game;
