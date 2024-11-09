import React, { useState } from 'react';
import './App.css';
import Question from "./Question";
import {ReactComponent as Logo} from "./logo.svg";
import Results from "./Results";

function App() {
  const [hasEmail, setHasEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  //Questions are here - sample questions for now
  const questions = [
    { text: "Is the primary offering something physical that users or customers will own and interact with directly?",
      answer1: "Full-time",
      points1: "1",
      answer2: "Part-time, alongside other commitments",
      points2: "0",
      category: "Business Method Levels" },
    { text: "Is your goal to create a business that supports your personal lifestyle, or are you aiming for rapid growth and expansion into larger markets?",
      answer1: "Personal Lifestyle",
      points1: "1",
      answer2: "Rapid Growth and expansion into larger markets",
      points2: "0",
      category: "Product/Service Levels" },
    { text: "Are you developing something unique and innovative, potentially requiring significant external investment, or are you building around an existing, proven business model?",
      answer1: "Something unique and innovative, potentially requiring significant external investment",
      points1: "1",
      answer2: "Building around an existing, proven business model",
      points2: "0",
      category: "Business Method Levels" },
    { text: "Are you developing something unique and innovative, potentially requiring significant external investment, or are you building around an existing, proven business model?",
      answer1: "Something unique and innovative, potentially requiring significant external investment",
      points1: "1",
      answer2: "Building around an existing, proven business model",
      points2: "0",
      category: "Persona Spectrum Levels" },
  ];

  const handleEmailSubmit = () => {
    if (email) {
      setHasEmail(true);
    }
  };

  const handleAnswer = (category, score) => {
    const newResponses = [...responses];
    newResponses[currentQuestion] = { category, score };
    setResponses(newResponses);

    // Move to the next question or complete the questionnaire
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsComplete(true);
    }
  };

  return (
      <div className="App">
        {!hasEmail ? (
            <div className="home">
              {/*<Logo/>*/}
              <div className="email-container">
                <h2>Welcome!</h2>
                <p>This quiz will help us learn more about your business and can help you know areas that might need improvment.</p>
                <h3>Please enter your email before starting:</h3>
                <input
                    type="email"
                    value={email}
                    onChange={(userinput) => setEmail(userinput.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button onClick={handleEmailSubmit}>Submit</button>
              </div>
            </div>
        ) : !isComplete ? (
            <Question
                question={questions[currentQuestion]}
                onAnswer={handleAnswer}
            />
        ) : (
            <Results responses={responses} />
        )}
      </div>
  );
}

export default App;
