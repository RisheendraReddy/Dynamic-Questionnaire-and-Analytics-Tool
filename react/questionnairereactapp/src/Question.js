import React from 'react';
import ProgressIndicator from './ProgressIndicator';

function Question({ question, onAnswer, currentQuestion, totalQuestions }) {
  const handleResponse = (score) => {
    onAnswer(question.category, score);
  };

  return (
    <div className="question-container">
        {/* Add the progress indicator */}
      <ProgressIndicator
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
      />
        <h2>Category: {question.category}</h2>
      <h3>{question.text}</h3>
      {/* Replace these buttons with inputs if you want more complex responses */}
      <button onClick={() => handleResponse(question.points1)}>{question.answer1}</button>
      <button onClick={() => handleResponse(question.points2)}>{question.answer2}</button>
    </div>
  );
}

export default Question;
