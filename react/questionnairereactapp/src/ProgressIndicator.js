import React from 'react';

function ProgressIndicator({ currentQuestion, totalQuestions }) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  const progressBarStyles = {
    container: {
      width: '100%',
      height: '20px',
      backgroundColor: '#e0e0e0',
      borderRadius: '10px',
      margin: '20px 0',
      overflow: 'hidden'
    },
    filler: {
      height: '100%',
      width: `${progress}%`,
      backgroundColor: '#ffc324',
      borderRadius: 'inherit',
      textAlign: 'right',
      transition: 'width 0.3s ease-in-out'
    },
    label: {
      padding: '5px',
      color: '#333',
      fontWeight: 'bold',
      fontSize: '14px',
      textAlign: 'center',
      marginBottom: '5px'
    }
  };

  return (
    <div>
      <div style={progressBarStyles.label}>
        Question {currentQuestion + 1} of {totalQuestions}
      </div>
      <div style={progressBarStyles.container}>
        <div style={progressBarStyles.filler}></div>
      </div>
    </div>
  );
}

export default ProgressIndicator;
