import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import Question from "./Question";
import Results from "./Results";
import logo from "./asu_logo.png";

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

  // Animation variants
  const pageTransition = {
    hidden: { opacity: 0, x: -300 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 30, 
        damping: 10,
        mass: 0.75
      }
    },
    exit: { 
      opacity: 0, 
      x: 300,
      transition: { 
        ease: "easeInOut", 
        duration: 0.3 
      }
    }
  };

  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="App">
      <motion.img 
        src={logo} 
        alt="Logo" 
        className="results-logo"
        variants={logoVariants}
        initial="initial"
        animate="animate"
      />
      
      <AnimatePresence mode="wait">
        {!hasEmail ? (
          <motion.div 
            key="email-form"
            className="home"
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className="email-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Welcome! Business Venture Quiz
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                This quiz will help us learn more about your business and can help you know areas that might need improvement.
              </motion.p>
              
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                Please enter your email before starting:
              </motion.h3>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(userinput) => setEmail(userinput.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </motion.div>
              
              <motion.button 
                onClick={handleEmailSubmit}
                whileHover={{ scale: 1.05, backgroundColor: "#a40145" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                Submit
              </motion.button>
            </motion.div>
          </motion.div>
        ) : !isComplete ? (
          <motion.div
            key="questions"
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Question
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
              currentQuestion={currentQuestion}
              totalQuestions={questions.length}
            />
          </motion.div>
        ) : (
          <motion.div
            key="results"
            variants={pageTransition}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Results responses={responses} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
