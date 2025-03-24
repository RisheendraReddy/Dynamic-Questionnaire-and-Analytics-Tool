import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, PointElement, LineElement, RadialLinearScale } from "chart.js";
import { Radar } from 'react-chartjs-2';
import './Results.css';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { motion } from 'framer-motion'; // Import Framer Motion

ChartJS.register(PointElement, LineElement, RadialLinearScale);

function Results({ responses }) {
  const [loaded, setLoaded] = useState(false); // State to trigger chart load animation

  // Calculate scores by category
  const categories = {};
  responses.forEach(response => {
    if (!categories[response.category]) categories[response.category] = 0;
    categories[response.category] += response.score;
  });

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Your Assessment',
        data: Object.values(categories),
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Export functionality: Download results as PDF
  const handleDownloadPDF = async () => {
    const element = document.querySelector(".results-container"); // Select the container
    const canvas = await html2canvas(element, { scale: 2 }); // Convert to canvas with higher resolution
    const imgData = canvas.toDataURL("image/png"); // Convert to image data
    const pdf = new jsPDF("p", "mm", "a4"); // Create PDF
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0); // Add image to PDF
    pdf.save("business-venture-results.pdf"); // Save PDF
  };

  // Simulate the component loading with a delay
  useEffect(() => {
    setTimeout(() => setLoaded(true), 500); // Trigger animation after 500ms
  }, []);

  return (
    <motion.div
      className="results-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }} // Apply fade-in transition
    >
      <h2>Your Results</h2>
      <h3>We've sent a copy of your results to your email!</h3>

      <motion.div
        className={`radar-chart ${loaded ? 'loaded' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }} // Delay for the radar chart's fade-in
      >
        <Radar data={data} options={{ maintainAspectRatio: false, responsive: true }} />
      </motion.div>

      {/* Button for exporting the results */}
      <motion.button
        onClick={handleDownloadPDF}
        whileHover={{ scale: 1.1 }} // Slightly increase button size on hover
        transition={{ type: "spring", stiffness: 300 }}
      >
        Download Results as PDF
      </motion.button>

      <h2> Results Meaning</h2>
      <p>Each category tells you a bit about your business and where its strengths and weaknesses lie.</p>

        <h4>Business Method Levels</h4>
      <h4>Business Method Levels</h4>
        <p>This shows how clear and developed your business plan and processes are. It covers your business goals, priorities, and how you plan to create the product. A high score means you have a strong, well-thought-out plan with a unique product and a good chance of finding a niche market. A low score means you may need to work on your business strategy.</p>
      <p>This shows how clear and developed your business plan and processes are...</p>
        <h4>Product/Service Levels</h4>
      <h4>Product/Service Levels</h4>
        <p>This measures how much value your product or service gives to your customers. A high score means your product is new and keeps customers engaged over long periods of time. A low score suggests your product may need improvements to better meet customer needs.</p>
      <p>This measures how much value your product or service gives to your customers...</p>
        <h4>Persona Spectrum Levels</h4>
      <h4>Persona Spectrum Levels</h4>
        <p>This shows how much research you've done on your target customers. A high score means you've done a lot of testing and interviews to understand your audience. A low score means you might need to do more research to better identify your target market.</p>
    </motion.div>
  );
}

export default Results;
