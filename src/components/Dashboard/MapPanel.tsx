// MapPanel.tsx

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Extend City to match the JSON (including warning_level and population)
interface City {
  id: number;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  warning_level: "green" | "orange" | "red";
  population: number | null;
}

interface MapPanelProps {
  onCityClick: (cityId: number) => void;
}

const Legend: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const legendControl = (L.control as any)({ position: "topright" });
    legendControl.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.style.backgroundColor = "lightgray";
      div.style.fontWeight = "bold";
      div.style.color = "black";
      div.style.padding = "6px 8px";
      div.style.borderRadius = "4px";
      L.DomEvent.disableClickPropagation(div);
      div.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span
            style="
              display: inline-block;
              width: 12px;
              height: 12px;
              background-color: green;
              border-radius: 50%;
              margin-right: 6px;
            "
          ></span>
          Low Level
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span
            style="
              display: inline-block;
              width: 12px;
              height: 12px;
              background-color: orange;
              border-radius: 50%;
              margin-right: 6px;
            "
          ></span>
          Medium Level
        </div>
        <div style="display: flex; align-items: center;">
          <span
            style="
              display: inline-block;
              width: 12px;
              height: 12px;
              background-color: red;
              border-radius: 50%;
              margin-right: 6px;
            "
          ></span>
          High Level
        </div>
      `;
      return div;
    };
    legendControl.addTo(map);
    return () => {
      map.removeControl(legendControl);
    };
  }, [map]);

  return null;
};

function MapPanel({ onCityClick }: MapPanelProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = () => {
      axios
        .get<City[]>("http://127.0.0.1:8000/api/cities/")
        .then((res) => {
          setCities(res.data);
          setError(null);
        })
        .catch(() => {
          setCities([]);
          setError("⚠️ Unable to fetch city list.");
        });
    };
    fetchCities();
    const intervalId = setInterval(fetchCities, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-100 h-100 border border-primary border-2 rounded position-relative">
      <MapContainer
        center={[0, 20]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Legend />

        {cities.map((city) => {
          const fillColor = city.warning_level;
          return (
            <CircleMarker
              key={city.id}
              center={[city.latitude, city.longitude]}
              radius={4}
              pathOptions={{
                color: fillColor,
                fillColor: fillColor,
                fillOpacity: 0.6,
                stroke: false,
              }}
              eventHandlers={{
                click: () => {
                  onCityClick(city.id);
                },
              }}
            >
              <Tooltip>
                <div>
                  {city.city} [{city.country}]
                  <br />
                  Population: {city.population ?? "N/A"}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {error && (
        <div
          className="position-absolute top-0 start-50 translate-middle-x text-warning bg-dark px-3 py-2 rounded"
          style={{ zIndex: 1000, marginTop: "10px" }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default React.memo(MapPanel);
