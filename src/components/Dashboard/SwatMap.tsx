import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";

const SwatMap: React.FC = () => (
  <MapContainer
    center={[0, 20]}
    zoom={4}
    style={{ width: "100%", height: "100%" }}
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    />
  </MapContainer>
);

export default SwatMap;