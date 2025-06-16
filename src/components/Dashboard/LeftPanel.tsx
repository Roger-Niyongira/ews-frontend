import React from "react";
import ForecastChart, { ForecastRecord } from "./ForecastChart";
import MapPanel from "./MapPanel";
import type { City } from "./MapPanel";
import SwatMap from "./SwatMap";
import type { ViewMode } from "../../App";

interface LeftPanelProps {
  mode: ViewMode;
  cities: City[];
  cityId: number | null;
  cityName: string | null;
  cityCountry: string | null;
  forecastData: ForecastRecord[];
  error: string | null;
  onCityClick: (id: number) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  mode,
  cities,
  cityId,
  cityName,
  cityCountry,
  forecastData,
  error,
  onCityClick,
}) => (
  <div className="d-flex flex-column h-100 gap-2">
    <div
      className="pt-3 px-3 pb-1 border border-primary border-2 rounded d-flex flex-column"
      style={{ flex: "1 1 50%", maxHeight: "50%", overflow: "auto" }}
    >
      <h4 className="hydro-title fw-bold">
        {cityName && cityCountry
          ? `10-Day Precipitation for ${cityName}, ${cityCountry}`
          : "10-Day Precipitation"}
      </h4>
      {error && <p className="text-danger" style={{ fontSize: 16 }}>{error}</p>}
      {!cityId && !error && (
        <p style={{ fontSize: 16, opacity: 0.6 }}>
          Click on a map marker to load forecast.
        </p>
      )}
      {forecastData.length > 0 && <ForecastChart data={forecastData} />}
    </div>
    <div
      className="p-0 border border-primary border-2 rounded"
      style={{ flex: "1 1 50%", maxHeight: "50%", overflow: "hidden" }}
    >
      {mode === "swat" ? (
        <MapPanel
          cities={cities}
          onCityClick={onCityClick}
          small
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <SwatMap small style={{ width: "100%", height: "100%" }} />
      )}
    </div>
  </div>
);

export default LeftPanel;
