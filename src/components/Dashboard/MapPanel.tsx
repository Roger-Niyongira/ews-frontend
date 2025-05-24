// src/components/MapPanel.tsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type City = {
  id: number;
  city: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  population: number | null;
  precipitation: { date: string; precipitation: number }[];
  color: "green" | "orange" | "red";
};

export default function MapPanel() {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/ews/api/cities/")
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: City[]) => setCities(data))
      .catch(err => console.error("Failed to load cities:", err));
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer center={[0, 20]} zoom={4} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {cities.map(c => (
          <CircleMarker
            key={c.id}
            center={[c.latitude, c.longitude]}
            pathOptions={{ color: c.color, fillColor: c.color, fillOpacity: 0.8 }}
            radius={3}
          >
            <Popup>
              <strong>{c.city}, {c.country} ({c.country_code})</strong><br/>
              Population: {c.population ?? "N/A"}<br/>
              <em>7-day forecast:</em>
              <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                {c.precipitation.map(p => (
                  <li key={p.date}>
                    {p.date}: {p.precipitation} mm
                  </li>
                ))}
              </ul>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
