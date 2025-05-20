import React from "react";
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

function Trend({ priceHistory }) {
  let { fruitname } = useParams();
  const prices = priceHistory[fruitname.toLowerCase()] || [];

  const data = {
    labels: prices.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: `${fruitname} Price`,
        data: prices, // Price array, e.g., [5, 5.5, 6]
        borderColor: "ff0000", // Red line
        backgroundColor: "rgba(191, 0, 255, 0.2)", // Light blue fill under line
        pointBackgroundColor: "#007bff",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#007bff",
        tension: 0.4, // Smooth line
        fill: false,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${fruitname} Price Trend`,
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Day",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price ($)",
        },
        beginAtZero: true, // Start y-axis at 0
      },
    },
  };

  return (
    <div className="trend">
      <h1>{fruitname}</h1>
      <div className="chart">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default Trend;
