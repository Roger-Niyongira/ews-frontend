// Body.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import LeftPanel from "./LeftPanel";
import MapPanel from "./MapPanel";
import { ForecastRecord } from "./ForecastChart";

interface City {
  id: number;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

const Body: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null);
  const [selectedCityCountry, setSelectedCityCountry] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<ForecastRecord[]>([]);
  const [forecastError, setForecastError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<City[]>("http://127.0.0.1:8000/api/cities/")
      .then((res) => setCities(res.data))
      .catch(() => setCities([]));
  }, []);

  const handleCityClick = (cityId: number) => {
    setSelectedCityId(cityId);
    setForecastData([]);
    setForecastError(null);

    const city = cities.find((c) => c.id === cityId);
    if (city) {
      setSelectedCityName(city.city);
      setSelectedCityCountry(city.country);
    } else {
      setSelectedCityName(null);
      setSelectedCityCountry(null);
    }

    axios
      .get<ForecastRecord[]>(`http://127.0.0.1:8000/api/cities/${cityId}/forecast/`)
      .then((res) => {
        setForecastData(res.data);
        setForecastError(null);
      })
      .catch(() => {
        setForecastData([]);
        setForecastError("Unable to load forecast data.");
      });
  };

  return (
    <div className="container-fluid h-100 p-2">
      <div className="row h-100 gx-2">
        <div className="d-none d-lg-flex col-lg-4 flex-column h-100">
          <LeftPanel
            cityId={selectedCityId}
            cityName={selectedCityName}
            cityCountry={selectedCityCountry}
            forecastData={forecastData}
            error={forecastError}
          />
        </div>
        <div className="col-12 col-lg-8 d-flex flex-column h-100">
          <MapPanel onCityClick={handleCityClick} />
        </div>
      </div>
    </div>
  );
};

export default Body;
