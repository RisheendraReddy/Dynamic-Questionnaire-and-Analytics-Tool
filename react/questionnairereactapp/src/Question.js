import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressIndicator from './ProgressIndicator';

function Question({ question, onAnswer, currentQuestion, totalQuestions }) {
  const handleResponse = (score) => {
    onAnswer(question.category, score);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3 
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.3 
      }
    },
    hover: { 
      scale: 1.05,
      backgroundColor: "#a40145",
      transition: { 
        duration: 0.2 
      }
    },
    tap: { 
      scale: 0.95,
      backgroundColor: "#a40145",
      transition: { 
        duration: 0.1 
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentQuestion}
        className="question-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Progress indicator */}
        <motion.div variants={childVariants}>
          <ProgressIndicator 
            currentQuestion={currentQuestion} 
            totalQuestions={totalQuestions} 
          />
        </motion.div>
        
        {/* Category */}
        <motion.h2 
          variants={childVariants}
          className="category-title"
        >
          Category: {question.category}
        </motion.h2>
        
        {/* Question text */}
        <motion.h3 
          variants={childVariants}
          className="question-text"
        >
          {question.text}
        </motion.h3>
        
        {/* Answer buttons */}
        <div className="answer-buttons">
          <motion.button 
            onClick={() => handleResponse(question.points1)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {question.answer1}
          </motion.button>
          
          <motion.button 
            onClick={() => handleResponse(question.points2)}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {question.answer2}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Question;
