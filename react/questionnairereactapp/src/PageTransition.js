import React from 'react';
import { motion } from 'framer-motion';

// This component creates a wrapper for page transitions
const PageTransition = ({ children, keyValue }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      x: -20,
      scale: 0.98
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    out: {
      opacity: 0,
      x: 20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // This creates a radial gradient effect
  const Background = () => {
    return (
      <motion.div
        className="page-transition-background"
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 4, opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
      />
    );
  };

  return (
    <motion.div
      key={keyValue}
      className="page-transition"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      <Background />
      {children}
    </motion.div>
  );
};

export default PageTransition;
