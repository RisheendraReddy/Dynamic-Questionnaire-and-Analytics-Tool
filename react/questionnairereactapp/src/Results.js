import React from 'react';
import { Chart as ChartJS, PointElement, LineElement, RadialLinearScale } from "chart.js";
import { Radar } from 'react-chartjs-2';

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
      <h2>Your Results</h2>
      <Radar data={data} />
    </div>
  );
}

export default Results;
