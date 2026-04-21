import React, { useEffect, useState } from "react";
import axios from "axios";
import LeftPanel from "./LeftPanel";
import MapPanel from "./PrecipMap";
import type { City } from "./PrecipMap";
import { ForecastRecord } from "./ForecastChart";
import { motion } from "framer-motion";
import type { ClimateThresholds, ProjectGeoJsonLayer } from "../../App";

interface BodyProps {
  darkMode: boolean;
  showClimateZones: boolean;
  showFloodMap: boolean;
  showPrecipitations: boolean;
  showWatersheds: boolean;
  projectName: string | null;
  projectWatersheds: ProjectGeoJsonLayer[];
  thresholds: ClimateThresholds;
  onPrecipitationAvailabilityChange: (available: boolean) => void;
}
const Body: React.FC<BodyProps> = ({
  darkMode,
  showClimateZones,
  showFloodMap,
  showPrecipitations,
  showWatersheds,
  projectName,
  projectWatersheds,
  thresholds,
  onPrecipitationAvailabilityChange,
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [showMobileDetails, setShowMobileDetails] = useState(false);
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
      .then((res) => {
        setCities(res.data);
        onPrecipitationAvailabilityChange(res.data.length > 0);
      })
      .catch(() => {
        setCities([]);
        onPrecipitationAvailabilityChange(false);
      });
  }, [API_BASE_URL, onPrecipitationAvailabilityChange]);

  const handleCityClick = (cityId: number) => {
    setSelectedCityId(cityId);
    setShowMobileDetails(true);
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
            cities={cities}
            cityId={selectedCityId}
            cityName={selectedCityName}
            cityCountry={selectedCityCountry}
            selectedCity={cities.find((city) => city.id === selectedCityId) ?? null}
            thresholds={thresholds}
            forecastData={forecastData}
            error={forecastError}
            onCityClick={handleCityClick}
          />
        </motion.div>
        <motion.div
          layout
          transition={{ duration: 0.3 }}
          className="col-12 col-lg-8 d-flex flex-column h-100 position-relative"
        >
          <MapPanel
            cities={cities}
            thresholds={thresholds}
            onCityClick={handleCityClick}
            showClimateZones={showClimateZones}
            showFloodMap={showFloodMap}
            showPrecipitations={showPrecipitations}
            showWatersheds={showWatersheds}
            projectName={projectName}
            projectWatersheds={projectWatersheds}
          />
          <button
            type="button"
            className="btn btn-primary fw-bold d-lg-none position-absolute shadow"
            style={{ right: 16, bottom: 16, zIndex: 1001 }}
            onClick={() => setShowMobileDetails(true)}
          >
            Details
          </button>
        </motion.div>
      </div>

      {showMobileDetails && (
        <div
          className={`d-lg-none position-fixed start-0 end-0 bottom-0 shadow-lg ${
            darkMode ? "bg-dark text-light" : "bg-white text-dark"
          }`}
          style={{
            zIndex: 1100,
            height: "72vh",
            borderTopLeftRadius: "18px",
            borderTopRightRadius: "18px",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom"
            style={{ borderColor: darkMode ? "#495057" : undefined }}
          >
            <div className="fw-bold">Precipitation Details</div>
            <button
              type="button"
              className={`btn btn-sm ${
                darkMode ? "btn-outline-light" : "btn-outline-secondary"
              }`}
              onClick={() => setShowMobileDetails(false)}
            >
              Close
            </button>
          </div>
          <div className="p-2 h-100 overflow-auto" style={{ paddingBottom: "4rem" }}>
            <LeftPanel
              cities={cities}
              cityId={selectedCityId}
              cityName={selectedCityName}
              cityCountry={selectedCityCountry}
              selectedCity={cities.find((city) => city.id === selectedCityId) ?? null}
              thresholds={thresholds}
              forecastData={forecastData}
              error={forecastError}
              onCityClick={handleCityClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Body;
