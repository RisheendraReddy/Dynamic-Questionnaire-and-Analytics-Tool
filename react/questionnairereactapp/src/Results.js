import React from 'react';
import { Chart as ChartJS, PointElement, LineElement, RadialLinearScale } from "chart.js";
import { Radar } from 'react-chartjs-2';
import './Results.css'

ChartJS.register(PointElement, LineElement, RadialLinearScale);

function Results({ responses }) {
  const categories = {};

  // Calculate scores by category
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

  return (
      <div>
      <div className="results-container">
      <h2>Your Results</h2>
      <h3>We've sent a copy of your results to your email!</h3>
        <div className="radar-chart">
          <Radar data={data} />
        </div>
      <h2> Results Meaning</h2>
      <p>Each category tells you a bit about your business and where it's strengths and weaknesses lie.</p>
        <h4>Business Method Levels</h4>
        <p>This shows how clear and developed your business plan and processes are. It covers your business goals, priorities, and how you plan to create the product. A high score means you have a strong, well-thought-out plan with a unique product and a good chance of finding a niche market. A low score means you may need to work on your business strategy.</p>
        <h4>Product/Service Levels</h4>
        <p>This measures how much value your product or service gives to your customers. A high score means your product is new and keeps customers engaged over long periods of time. A low score suggests your product may need improvements to better meet customer needs.</p>
        <h4>Persona Spectrum Levels</h4>
        <p>This shows how much research you've done on your target customers. A high score means you've done a lot of testing and interviews to understand your audience. A low score means you might need to do more research to better identify your target market.</p>
    </div>
      </div>
  );
}

export default Results;
