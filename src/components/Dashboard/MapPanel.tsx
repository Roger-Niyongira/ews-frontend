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

function MapPanel() {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    // 1) define the fetch logic
    const fetchCities = () => {
      axios
        .get("http://127.0.0.1:8000/api/cities/")
        .then((res) => setCities(res.data))
        .catch((err) => console.error("Error fetching cities:", err));
    };

    // 2) call it immediately
    fetchCities();

    // 3) set up the hourly interval (60min * 60s * 1000ms)
    const intervalId = setInterval(fetchCities, 60 * 60 * 1000);

    // 4) cleanup on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);  // empty deps → runs once on mount

  return (
    <div className="w-100 h-100 border border-primary border-2 rounded">
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
          >
            <Tooltip>
              {city.city}, {city.country}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default React.memo(MapPanel);
