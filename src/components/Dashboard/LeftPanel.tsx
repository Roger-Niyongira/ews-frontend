// LeftPanel.tsx
import React from "react";
import ForecastChart, { ForecastRecord } from "./ForecastChart";

interface LeftPanelProps {
  cityId: number | null;
  cityName: string | null;
  cityCountry: string | null;
  forecastData: ForecastRecord[];
  error: string | null;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  cityId,
  cityName,
  cityCountry,
  forecastData,
  error,
}) => {
  return (
    <div className="d-flex flex-column h-100 gap-2">
      <div
        className="pt-3 px-3 pb-1 border border-primary border-2 rounded d-flex flex-column"
        style={{ flex: "1 1 50%", maxHeight: "50%", overflow: "auto" }}
      >
        <h4 className="hydro-title fw-bold">
          {cityName && cityCountry
            ? `7-Day Precipitation Forecast for ${cityName}, ${cityCountry}`
            : "7-Day Precipitation Forecast"}
        </h4>
        {error && (
          <p className="text-danger" style={{ fontSize: 16 }}>
            {error}
          </p>
        )}
        {!cityId && !error && (
          <p style={{ fontSize: 16, opacity: 0.6 }}>
            Click on a map marker to load forecast.
          </p>
        )}
        {cityId && !error && forecastData.length === 0 && (
          <p style={{ fontSize: 16, opacity: 0.6 }}>Loading forecast…</p>
        )}
        {forecastData.length > 0 && <ForecastChart data={forecastData} />}
      </div>
      <div
        className="p-0 border border-primary border-2 rounded"
        style={{ flex: "1 1 50%", maxHeight: "50%", overflow: "hidden" }}
      >
        <iframe
          title="Windy Precipitation"
          width="100%"
          height="100%"
          src="https://embed.windy.com/embed2.html?lat=2&lon=20&zoom=3&level=surface&overlay=rain&menu=&message=&marker=&calendar=now"
          style={{ border: "none", borderRadius: "0.5rem", width: "100%", height: "100%" }}
        ></iframe>
      </div>
    </div>
  );
};

export default LeftPanel;
