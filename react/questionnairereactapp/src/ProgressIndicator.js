import React from 'react';
import { motion } from 'framer-motion';

function ProgressIndicator({ currentQuestion, totalQuestions }) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  
  // Create the array of step indicators
  const steps = Array.from({ length: totalQuestions }, (_, i) => i);

  return (
    <div className="progress-indicator">
      <motion.div 
        className="progress-label"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Question {currentQuestion + 1} of {totalQuestions}
      </motion.div>
      
      <div className="progress-container">
        <motion.div 
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      
      <div className="progress-steps">
        {steps.map((step) => (
          <motion.div 
            key={step}
            className={`progress-step ${step <= currentQuestion ? 'active' : ''}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: step === currentQuestion ? 1.2 : 1, 
              opacity: 1,
              backgroundColor: step < currentQuestion 
                ? '#a40145' 
                : step === currentQuestion 
                  ? '#ffc324' 
                  : '#e0e0e0'
            }}
            transition={{ 
              duration: 0.3, 
              delay: step * 0.05,
              type: step === currentQuestion ? "spring" : "tween",
              stiffness: 300,
              damping: 10
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ProgressIndicator;
