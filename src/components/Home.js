import React, { useState, useEffect, useRef } from "react";
import "../styles/Home.css";
import Overlay from "./Overlay";

function Page(props) {
  const numQsInp = useRef(null);
  const catSelect = useRef(null);
  const difficultySelect = useRef(null);
  const handleOverlay = props.handleOverlay;

  const [categoryState, setCategoryState] = useState({
    categoriesLoading: true,
    categories: [],
    categoryRequestCount: 0
  });

  const [gameState, setGameState] = useState({
    gameData: [],
    gameLoading: false,
    gameRequestCount: 0
  });

  useEffect(() => {
    async function fetchData() {
      //const response = await fetch("https://opentdb.com/api_category.php");
      //const data = await response.json();
      //const categories = data.trivia_categories;
      const categories = [
        { id: 9, name: "General Knowledge" },
        { id: 10, name: "Entertainment: Books" },
        { id: 11, name: "Entertainment: Film" },
        { id: 12, name: "Entertainment: Music" },
        { id: 13, name: "Entertainment: Musicals & Theatres" },
        { id: 14, name: "Entertainment: Television" },
        { id: 15, name: "Entertainment: Video Games" },
        { id: 16, name: "Entertainment: Board Games" },
        { id: 17, name: "Science & Nature" },
        { id: 18, name: "Science: Computers" },
        { id: 19, name: "Science: Mathematics" },
        { id: 20, name: "Mythology" },
        { id: 21, name: "Sports" },
        { id: 22, name: "Geography" },
        { id: 23, name: "History" },
        { id: 24, name: "Politics" },
        { id: 25, name: "Art" },
        { id: 26, name: "Celebrities" },
        { id: 27, name: "Animals" },
        { id: 28, name: "Vehicles" },
        { id: 29, name: "Entertainment: Comics" },
        { id: 30, name: "Science: Gadgets" },
        { id: 31, name: "Entertainment: Japanese Anime & Manga" },
        { id: 32, name: "Entertainment: Cartoon & Animations" }
      ];
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

  function initGame() {
    setGameState(prev => {
      return {
        ...prev,
        gameLoading: true
      };
    });
    fetchGameData();
  }

  async function fetchGameData() {
    //const amount = numQsInp.current.value;
    //const category = catSelect.current.value;
    //const difficulty = difficultySelect.current.value;
    //const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}`;
    //const response = await fetch(url);
    //const data = await response.json();
    //const gameData = data.results;
    const gameData = [
      { category: "General Knowledge", type: "boolean", difficulty: "easy", question: "Video streaming website YouTube was purchased in it&#039;s entirety by Facebook for US$1.65 billion in stock.", correct_answer: "False", incorrect_answers: ["True"] },
      { category: "General Knowledge", type: "multiple", difficulty: "easy", question: "Which sign of the zodiac is represented by the Crab?", correct_answer: "Cancer", incorrect_answers: ["Libra", "Virgo", "Sagittarius"] }
      /*{ category: "General Knowledge", type: "boolean", difficulty: "easy", question: "It is automatically considered entrapment in the United States if the police sell you illegal substances without revealing themselves.", correct_answer: "False", incorrect_answers: ["True"] },
      { category: "General Knowledge", type: "multiple", difficulty: "easy", question: "What type of animal was Harambe, who was shot after a child fell into it&#039;s enclosure at the Cincinnati Zoo?", correct_answer: "Gorilla", incorrect_answers: ["Tiger", "Panda", "Crocodile"] },
      { category: "General Knowledge", type: "multiple", difficulty: "easy", question: "What was the nickname given to the Hughes H-4 Hercules, a heavy transport flying boat which achieved flight in 1947?", correct_answer: "Spruce Goose", incorrect_answers: ["Noah&#039;s Ark", "Fat Man", "Trojan Horse"] },
      { category: "General Knowledge", type: "boolean", difficulty: "easy", question: "In 2010, Twitter and the United States Library of Congress partnered together to archive every tweet by American citizens.", correct_answer: "True", incorrect_answers: ["False"] },
      { category: "General Knowledge", type: "multiple", difficulty: "easy", question: "Who is depicted on the US hundred dollar bill?", correct_answer: "Benjamin Franklin", incorrect_answers: ["George Washington", "Abraham Lincoln", "Thomas Jefferson"] },
      { category: "General Knowledge", type: "boolean", difficulty: "easy", question: "One of Donald Trump&#039;s 2016 Presidential Campaign promises was to build a border wall between the United States and Mexico.", correct_answer: "True", incorrect_answers: ["False"] },
      { category: "General Knowledge", type: "boolean", difficulty: "easy", question: "Romanian belongs to the Romance language family, shared with French, Spanish, Portuguese and Italian. ", correct_answer: "True", incorrect_answers: ["False"] },
      { category: "General Knowledge", type: "multiple", difficulty: "easy", question: "When someone is inexperienced they are said to be what color?", correct_answer: "Green", incorrect_answers: ["Red", "Blue", "Yellow"] }*/
    ];
    setGameState(prev => {
      return {
        gameLoading: false,
        gameData: gameData
      };
    });
    handleOverlay();
  }

  return (
    <div className="wrapper">
      <h2 className="page-heading">Let's Play Some Trivia!</h2>
      <br />
      <h3 className="">Choose your game:</h3>
      {categoryState.categoriesLoading || gameState.gameLoading ? (
        <div className="loader"></div>
      ) : (
        <>
          <div className="selection-container">
            <label htmlFor="number-of-games">Number of Questions:</label>
            <input ref={numQsInp} className="selection-element" type="number" name="number-of-games" defaultValue="10" max="50" />
            <br />
            <br />
            <label htmlFor="category">Category:</label>
            <br />
            <select ref={catSelect} className="selection-element" name="category">
              {categoryState.categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <br />
            <br />
            <label htmlFor="category">Difficulty:</label>
            <br />
            <select ref={difficultySelect} className="selection-element" name="category">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <span onClick={initGame} className="btn start-btn">
            Start!
          </span>
        </>
      )}
      {props.overlayOpen && <Overlay handleOverlay={props.handleOverlay} gameData={gameState.gameData} />}
    </div>
  );
}

export default Page;
