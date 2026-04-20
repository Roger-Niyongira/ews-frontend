import React from "react";
import ForecastChart, { ForecastRecord } from "./ForecastChart";
import type { City } from "./PrecipMap";
import type { ClimateThresholds } from "../../App";

interface LeftPanelProps {
  cities: City[];
  cityId: number | null;
  cityName: string | null;
  cityCountry: string | null;
  selectedCity: City | null;
  thresholds: ClimateThresholds;
  forecastData: ForecastRecord[];
  error: string | null;
  onCityClick: (id: number) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  cities,
  cityId,
  cityName,
  cityCountry,
  selectedCity,
  thresholds,
  forecastData,
  error,
  onCityClick,
}) => {
  const thresholdInfo =
    selectedCity?.climate_zone ? thresholds[selectedCity.climate_zone] : undefined;
  const detailLabelStyle = {
    color: "#9fb3c8",
    letterSpacing: "0.04em",
  };

  return (
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
        {error && (
          <p className="text-danger" style={{ fontSize: 16 }}>
            {error}
          </p>
        )}
        {!cityId && !error && (
          <p style={{ fontSize: 16, opacity: 0.6 }}>
            Click on a map marker to load precipitation forecast.
          </p>
        )}
        {forecastData.length > 0 && <ForecastChart data={forecastData} />}
      </div>
      <div
        className="pt-3 px-3 pb-1 border border-primary border-2 rounded d-flex flex-column"
        style={{ flex: "1 1 50%", maxHeight: "50%", overflow: "auto" }}
      >
        <>
          <h4 className="hydro-title fw-bold">Location Details</h4>
          {!selectedCity ? (
            <p style={{ fontSize: 16, opacity: 0.6 }}>
              Click on a map marker to view city, population, and threshold details.
            </p>
          ) : (
            <div className="d-flex flex-column gap-3">
              <div>
                <div
                  className="small text-uppercase"
                  style={detailLabelStyle}
                >
                  City
                </div>
                <div className="fw-semibold">
                  {selectedCity.city}, {selectedCity.country}
                </div>
              </div>
              <div>
                <div
                  className="small text-uppercase"
                  style={detailLabelStyle}
                >
                  Population
                </div>
                <div className="fw-semibold">
                  {selectedCity.population?.toLocaleString() ?? "Not available"}
                </div>
              </div>
              <div>
                <div
                  className="small text-uppercase"
                  style={detailLabelStyle}
                >
                  Climate Zone
                </div>
                <div className="fw-semibold">
                  {selectedCity.climate_zone ?? "Not available"}
                </div>
              </div>
              <div>
                <div
                  className="small text-uppercase"
                  style={detailLabelStyle}
                >
                  Warning Level
                </div>
                <div className="fw-semibold text-capitalize">
                  {selectedCity.warning_level}
                </div>
              </div>
              <div>
                <div
                  className="small text-uppercase"
                  style={detailLabelStyle}
                >
                  Thresholds Used
                </div>
                {thresholdInfo ? (
                  <div className="fw-semibold">
                    Green: below {thresholdInfo.green} mm
                    <br />
                    Orange: {thresholdInfo.green} to {thresholdInfo.orange} mm
                    <br />
                    Red: above {thresholdInfo.orange} mm
                  </div>
                ) : (
                  <div className="fw-semibold">Threshold data not available</div>
                )}
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default LeftPanel;
