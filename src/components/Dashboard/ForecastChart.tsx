import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface ForecastRecord {
  date: string;
  precipitation: number;
}

interface ForecastChartProps {
  data: ForecastRecord[];
}

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        No forecast to show.
      </p>
    );
  }

  return (
    // FULLY fill whatever height its parent allocates:
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(iso) => {
              const [, month, day] = iso.split("-").map(Number);
              return `${month}/${day}`;
            }}
          />
          <YAxis
            label={{
              value: "Precip (mm)",
              angle: -90,
              position: "insideLeft",
              offset: 0,
            }}
          />
          <Tooltip
            labelFormatter={(iso) => {
              const d = new Date(iso);
              return d.toDateString();
            }}
            formatter={(value: number) => [value.toFixed(2), "Precip (mm)"]}
          />
          <Line
            type="monotone"
            dataKey="precipitation"
            stroke="#1976d2"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
