import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { motion } from 'framer-motion';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // Animation variants
  const toggleVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.9,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div 
      className="theme-toggle"
      variants={toggleVariants}
      initial="initial"
      animate="animate"
      whileTap="tap"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      role="button"
      tabIndex={0}
    >
      <div className="toggle-track">
        <div className="toggle-icon sun">☀️</div>
        <div className="toggle-icon moon">🌙</div>
        <div className="toggle-thumb"></div>
      </div>
    </motion.div>
  );
};

export default ThemeToggle;