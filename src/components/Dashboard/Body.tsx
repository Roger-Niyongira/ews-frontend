import React, { useEffect, useState } from "react";
import axios from "axios";
import LeftPanel from "./LeftPanel";
import MapPanel from "./PrecipMap";
import type { City } from "./PrecipMap";
import SwatMap from "./SwatMap";
import { ForecastRecord } from "./ForecastChart";
import type { ViewMode } from "../../App";
import { motion } from "framer-motion";

interface BodyProps {
  mode: ViewMode;
  showClimateZones: boolean;
}
const Body: React.FC<BodyProps> = ({ mode, showClimateZones  }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const [selectedCityCountry, setSelectedCityCountry] = useState<string | null>(
    null
  );
  const [forecastData, setForecastData] = useState<ForecastRecord[]>([]);
  const [forecastError, setForecastError] = useState<string | null>(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

  useEffect(() => {
    axios
      .get<City[]>(`${API_BASE_URL}/api/cities/`)
      .then((res) => setCities(res.data))
      .catch(() => setCities([]));
  }, [API_BASE_URL]);

  const handleCityClick = (cityId: number) => {
    setSelectedCityId(cityId);
    setForecastData([]);
    setForecastError(null);
    const city = cities.find((c) => c.id === cityId);
    setSelectedCityName(city?.city ?? null);
    setSelectedCityCountry(city?.country ?? null);
    axios
      .get<ForecastRecord[]>(
        `${API_BASE_URL}/api/cities/${cityId}/forecast/`
      )
      .then((res) => setForecastData(res.data))
      .catch(() => setForecastError("Unable to load forecast data."));
  };

  return (
    <div className="container-fluid h-100 p-2">
      <div className="row h-100 gx-2">
        <motion.div
          layout
          transition={{ duration: 0.3 }}
          className="d-none d-lg-flex col-lg-4 flex-column h-100"
        >
          <LeftPanel
            mode={mode}
            cities={cities}
            cityId={selectedCityId}
            cityName={selectedCityName}
            cityCountry={selectedCityCountry}
            forecastData={forecastData}
            error={forecastError}
            onCityClick={handleCityClick}
          />
        </motion.div>
        <motion.div
          layout
          transition={{ duration: 0.3 }}
          className="col-12 col-lg-8 d-flex flex-column h-100"
        >
          {mode === "swat" ? (
            <SwatMap />
          ) : (
            <MapPanel
              cities={cities}
              onCityClick={handleCityClick}
              showClimateZones={showClimateZones}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Body;
