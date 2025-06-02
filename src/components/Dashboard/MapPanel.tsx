import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

interface City {
  id: number;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface MapPanelProps {
  onCityClick: (cityId: number) => void;
}

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
    const interval = setInterval(fetchCities, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-100 h-100 border border-primary border-2 rounded position-relative">
      <MapContainer
        center={[0, 20]}
        zoom={3}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <CircleMarker
            key={city.id}
            center={[city.latitude, city.longitude]}
            radius={4}
            fillOpacity={0.6}
            color="grey"
            stroke={false}
            eventHandlers={{
              click: () => {
                onCityClick(city.id);
              },
            }}
          >
            <Tooltip>{city.city}, {city.country}</Tooltip>
          </CircleMarker>
        ))}
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
