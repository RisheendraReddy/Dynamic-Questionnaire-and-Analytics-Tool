import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackMessage = ({ show, message, type, onComplete }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={`feedback-message ${type}`}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 500, 
            damping: 30 
          }}
        >
          <div className="feedback-content">
            {type === 'success' && (
              <motion.svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.path 
                  d="M5 13l4 4L19 7" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </motion.svg>
            )}
            {type === 'info' && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                <path d="M12 8v5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="white"/>
              </svg>
            )}
            <p>{message}</p>
          </div>
          <motion.div 
            className="progress-indicator"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 2.5, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function Feedback() {
  const [feedback, setFeedback] = useState({ show: false, message: '', type: 'success' });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
  };

  const hideFeedback = () => {
    setFeedback(prev => ({ ...prev, show: false }));
  };

  return {
    FeedbackComponent: () => (
      <FeedbackMessage 
        show={feedback.show}
        message={feedback.message}
        type={feedback.type}
        onComplete={hideFeedback}
      />
    ),
    showFeedback,
    hideFeedback
  };
}

export default Feedback;
