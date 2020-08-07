import React, { useState, useRef } from "react";
import "../styles/Game.css";
import { AllHtmlEntities } from "html-entities";

const entities = new AllHtmlEntities();

function Game(props) {
  const i = useRef(0); // for iterating through questions
  const selectedIndex = useRef(null); // for monitoring current selection during game
  const isCorrect = useRef(false); // for evaluating if correct answer was clicked

  const [game, setGame] = useState({
    category: props.gameData[0].category,
    question: props.gameData[0].question,
    correctAnswer: props.gameData[0].correct_answer,
    choices: makeChoicesArray(props.gameData[0].incorrect_answers, getRandomInt(0, 3), props.gameData[0].correct_answer),
    answerRevealed: false,
    activeIndex: null,
    totalCorrect: 0,
    totalIncorrect: 0,
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
    return result;
  }

  /**
   * Called on click of next button
   * @param {Event} e event handler
   */
  function handleNext(e) {
    i.current++;
    if (i.current < props.gameData.length) {
      setGame(prev => {
        return {
          ...prev,
          question: props.gameData[i.current].question,
          correctAnswer: props.gameData[i.current].correct_answer,
          choices: makeChoicesArray(props.gameData[i.current].incorrect_answers, getRandomInt(0, 3), props.gameData[i.current].correct_answer),
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
    console.log(e.target.dataset.index);
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
      {game.gameInProgress ? (
        <>
          <div className="question-container">
            <h2 className="category-heading">{game.category}</h2>
            <br />
            <h4>{`Question ${i.current + 1} out of ${props.gameData.length}`}</h4>
            <br />
            <p className="question">{entities.decode(game.question)}</p>
            {game.choices.map(choice => (
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
            ))}
          </div>
          <span className={`btn next-btn ${!game.answerRevealed ? "hide" : ""}`} onClick={handleNext}>
            Next &raquo;
          </span>
          {/** END game in progress container */}
        </>
      ) : (
        <>
          {/** BEGIN results screen */}
          <div>
            <h2>Results</h2>
            <p>{`You answered ${game.totalCorrect} out of ${game.totalIncorrect} correct...`}</p>
            <p>{`Final Score: ${formatAsPercent(game.totalCorrect / (game.totalCorrect + game.totalIncorrect))}${game.totalCorrect / (game.totalCorrect + game.totalIncorrect) > 0.7 ? "!" : "."}`}</p>
          </div>
          <div className="flex-container">
            <div className="flex-item item-1">
              <span className="btn play-again">Play Again</span>
            </div>
            <div className="flex-item item-2">
              <span onClick={props.handleOverlay} className="btn select-new">
                Select New Game
              </span>
            </div>
          </div>
          {/** END results screen */}
        </>
      )}
    </div>
  );
}

export default Game;
