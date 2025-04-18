import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, PointElement, LineElement, RadialLinearScale } from "chart.js";
import { Radar } from 'react-chartjs-2';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion } from 'framer-motion';
import ConfettiEffect from './ConfettiEffect';
import './Results.css';

ChartJS.register(PointElement, LineElement, RadialLinearScale);

function Results({ responses }) {
  const [chartLoaded, setChartLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  // Calculate scores by category
  const categories = {};
  responses.forEach(response => {
    if (!categories[response.category]) categories[response.category] = 0;
    categories[response.category] += parseInt(response.score);
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Your Assessment',
        data: Object.values(categories),
        backgroundColor: 'rgba(164, 1, 69, 0.2)',
        borderColor: 'rgba(164, 1, 69, 1)',
        borderWidth: 1,
        pointBackgroundColor: 'rgba(255, 195, 36, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(164, 1, 69, 1)',
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          backdropColor: 'rgba(255, 255, 255, 0.8)',
          color: '#333',
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          title: (items) => items[0].label,
          label: (item) => `Score: ${item.raw}`
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 16
        },
        bodyFont: {
          size: 14
        },
        padding: 10
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
      onComplete: () => {
        setChartLoaded(true);
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  // Export functionality: Download results as PDF
  const handleDownloadPDF = async () => {
    const element = document.querySelector(".results-container");
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("business-venture-results.pdf");
  };

  // Simulate loading delay for chart animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartLoaded(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const chartVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.7,
        delay: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 1.5
      }
    },
    hover: { 
      scale: 1.05,
      backgroundColor: "#a40145",
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3
      }
    },
    tap: { 
      scale: 0.95
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  return (
    <motion.div
      className="results-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Add the confetti effect */}
      <ConfettiEffect />
      
      <motion.h2 variants={itemVariants}>Your Results</motion.h2>
      <motion.h3 variants={itemVariants}>We've sent a copy of your results to your email!</motion.h3>

      <motion.div
        className="radar-chart-container"
        variants={chartVariants}
      >
        <div className="radar-chart">
          <Radar data={data} options={chartOptions} />
        </div>
      </motion.div>

      <motion.button
        onClick={handleDownloadPDF}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        Download Results as PDF
      </motion.button>

      <motion.h2 
        variants={itemVariants}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        Results Meaning
      </motion.h2>
      
      <motion.p 
        variants={itemVariants}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        Each category tells you a bit about your business and where its strengths and weaknesses lie.
        Click on any category to learn more.
      </motion.p>

      <div className="category-details">
        {Object.keys(categories).map((category, index) => (
          <motion.div
            key={category}
            className={`category-card ${activeCategory === category ? 'active' : ''}`}
            variants={itemVariants}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 2 + (index * 0.2), duration: 0.5 }
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
            }}
            onClick={() => handleCategoryClick(category)}
          >
            <h4>{category}</h4>
            <p>Score: {categories[category]}</p>
            
            {activeCategory === category && (
              <motion.div
                className="category-description"
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto',
                  transition: { duration: 0.3 }
                }}
              >
                {category === "Business Method Levels" && (
                  <p>This shows how clear and developed your business plan and processes are. It covers your business goals, priorities, and how you plan to create the product. A high score means you have a strong, well-thought-out plan with a unique product and a good chance of finding a niche market.</p>
                )}
                {category === "Product/Service Levels" && (
                  <p>This measures how much value your product or service gives to your customers. A high score means your product is new and keeps customers engaged over long periods of time.</p>
                )}
                {category === "Persona Spectrum Levels" && (
                  <p>This shows how much research you've done on your target customers. A high score means you've done a lot of testing and interviews to understand your audience.</p>
                )}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Results;
