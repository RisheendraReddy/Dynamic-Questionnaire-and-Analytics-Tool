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
      <h3>We've sent a copy of your results to your email!</h3>
      <Radar data={data} />
      <h2> Results Meaning</h2>
      <p>Each category tells you a bit about your business and where it's strengths and weaknesses lie.</p>
      <h4>Business Method Levels</h4>
        <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Inceptos eu praesent natoque; faucibus lacus lacinia per class. Maximus lectus felis accumsan magna libero amet ac. Justo tortor amet porta sem vehicula conubia laoreet sapien? Finibus posuere mauris, consectetur diam massa vivamus elit consequat. Aenean mattis odio bibendum interdum donec egestas hendrerit dolor ridiculus. Suspendisse condimentum phasellus libero elit praesent luctus.</p>
        <h4>Product/Service Levels</h4>
        <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Inceptos eu praesent natoque; faucibus lacus lacinia per class. Maximus lectus felis accumsan magna libero amet ac. Justo tortor amet porta sem vehicula conubia laoreet sapien? Finibus posuere mauris, consectetur diam massa vivamus elit consequat. Aenean mattis odio bibendum interdum donec egestas hendrerit dolor ridiculus. Suspendisse condimentum phasellus libero elit praesent luctus.</p>
        <h4>Persona Spectrum Levels</h4>
        <p>Lorem ipsum odor amet, consectetuer adipiscing elit. Inceptos eu praesent natoque; faucibus lacus lacinia per class. Maximus lectus felis accumsan magna libero amet ac. Justo tortor amet porta sem vehicula conubia laoreet sapien? Finibus posuere mauris, consectetur diam massa vivamus elit consequat. Aenean mattis odio bibendum interdum donec egestas hendrerit dolor ridiculus. Suspendisse condimentum phasellus libero elit praesent luctus.</p>
    </div>
  );
}

export default Results;
