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
    { text: "Is the primary offering something physical that users or customers will own and interact with directly?", category: "Communication" },
    { text: "Does your offering require ongoing or repeated interactions with the customer to deliver value over time (e.g., consulting, maintenance, or support)?", category: "Problem Solving" },
    { text: "Have you clearly identified distinct customer segments within your target market, based on both demographic and psychographic data (e.g., age, values, lifestyle)?", category: "Time Management" },
    { text: "Have you conducted interviews, surveys, or collected qualitative data directly from potential customers to validate their needs, pain points, and decision-making processes?", category: "Adaptability" },
    { text: "Have you tested or validated your customer personas in a real-world context, such as through pilot programs, focus groups, or market tests?", category: "Adaptability" },
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
