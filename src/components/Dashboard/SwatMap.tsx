import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature, MultiPolygon } from "geojson";

interface WatershedFeature {
  id: number;
  geom: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
}

interface SwatMapProps {
  small?: boolean;
  style?: React.CSSProperties;
}

const SwatMap: React.FC<SwatMapProps> = ({ small = false, style }) => {
  const [watersheds, setWatersheds] = useState<WatershedFeature[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/watersheds/")
      .then((res) => res.json())
      .then(setWatersheds)
      .catch(() => setWatersheds([]));
  }, []);

  const center: [number, number] = small ? [2, 20] : [0, 20];
  const zoom = small ? 3 : 4;

  return (
    <MapContainer center={center} zoom={zoom} style={style ?? { width: "100%", height: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
      />
      {watersheds.map((ws) => {
        const feature: Feature<MultiPolygon> = {
          type: "Feature",
          geometry: ws.geom as MultiPolygon,
          properties: {},
        };
        return (
          <GeoJSON
            key={ws.id}
            data={feature}
            style={{
              color: "#8e44ad",
              weight: 2,
              fillOpacity: 0,
            }}
          />
        );
      })}
    </MapContainer>
  );
};

export default SwatMap;
