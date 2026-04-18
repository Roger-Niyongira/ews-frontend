import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface CityChartProps {
  cityName: string;
  data: { date: string; precipitation: number }[];
}

const CityChart: React.FC<CityChartProps> = ({ cityName, data }) => {
  const chartData = {
    labels: data.map((entry) => entry.date),
    datasets: [
      {
        label: "Daily Precipitation (mm)",
        data: data.map((entry) => entry.precipitation),
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h4 className="text-primary">Precipitation for {cityName}</h4>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default CityChart;
