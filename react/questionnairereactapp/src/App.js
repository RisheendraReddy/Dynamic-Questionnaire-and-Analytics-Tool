import React, { useState } from 'react';
import './App.css';
import Question from "./Question";
import Results from "./Results";

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  //Questions will be here. random sample ones for now
  const questions = [
    { text: "How would you rate your communication skills?", category: "Communication" },
    { text: "How proficient are you in problem-solving?", category: "Problem Solving" },
    { text: "How well do you handle time management?", category: "Time Management" },
    { text: "How adaptable are you to new situations?", category: "Adaptability" },
  ];

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
      {!isComplete ? (
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
