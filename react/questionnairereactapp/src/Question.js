import React from 'react';

function Question({ question, onAnswer }) {
  const handleResponse = (score) => {
    onAnswer(question.category, score);
  };

  return (
    <div className="question-container">
      <h2>{question.text}</h2>
      {/* Replace these buttons with inputs if you want more complex responses */}
      <button onClick={() => handleResponse(1)}>1</button>
      <button onClick={() => handleResponse(2)}>2</button>
      <button onClick={() => handleResponse(3)}>3</button>
      <button onClick={() => handleResponse(4)}>4</button>
      <button onClick={() => handleResponse(5)}>5</button>
    </div>
  );
}

export default Question;
