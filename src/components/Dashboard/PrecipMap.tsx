import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Feature, MultiPolygon } from "geojson";

export interface City {
  id: number;
  city: string;
  country: string;
  location: [number, number];    // [ longitude, latitude ]
  warning_level: "green" | "orange" | "red";
  population: number | null;
}

interface WatershedFeature {
  id: number;
  name: string;
  warning_level: "green" | "orange" | "red";
  geom: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
}

interface MapPanelProps {
  cities: City[];
  onCityClick: (cityId: number) => void;
  small?: boolean;
  style?: React.CSSProperties;
}

const Legend: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const ctrl = (L.control as any)({ position: "topright" });
    ctrl.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      div.style.cssText = `
        background: lightgray;
        padding: 6px 8px;
        border-radius: 4px;
        font-weight: bold;
        color: black;
      `;
      L.DomEvent.disableClickPropagation(div);
      div.innerHTML = `
        <div><span style="background:green;width:12px;height:12px;display:inline-block;margin-right:6px;border-radius:50%;"></span>Low</div>
        <div><span style="background:orange;width:12px;height:12px;display:inline-block;margin-right:6px;border-radius:50%;"></span>Medium</div>
        <div><span style="background:red;width:12px;height:12px;display:inline-block;margin-right:6px;border-radius:50%;"></span>High</div>
      `;
      return div;
    };

    ctrl.addTo(map);

    return () => {
      map.removeControl(ctrl);
    };
  }, [map]);

  return null;
};

const MapPanel: React.FC<MapPanelProps> = ({
  cities,
  onCityClick,
  small = false,
  style,
}) => {
  const [watersheds, setWatersheds] = useState<WatershedFeature[]>([]);
  const [wsError, setWsError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/watersheds/")
      .then((r) => r.json())
      .then(setWatersheds)
      .catch(() => setWsError("⚠️ Unable to fetch watershed polygons."));
  }, []);

  const center: [number, number] = small ? [2, 20] : [0, 20];
  const zoom = small ? 3 : 4;

  return (
    <div className="w-100 h-100 position-relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={style ?? { width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Legend />

        {watersheds.map((ws) => {
          const feature: Feature<MultiPolygon> = {
            type: "Feature",
            geometry: ws.geom as MultiPolygon,
            properties: {
              name: ws.name,
              warning_level: ws.warning_level,
            },
          };
          return (
            <GeoJSON
              key={ws.id}
              data={feature}
              style={(f) => {
                // guard against undefined
                if (!f || !f.properties) {
                  return {
                    fillColor: "#CCCCCC",
                    color: "#666666",
                    weight: 1,
                    fillOpacity: 0.2,
                  };
                }
                const lvl = (f.properties as any)
                  .warning_level as "green" | "orange" | "red";
                const colors = {
                  green: "#27AE60",
                  orange: "#F39C12",
                  red: "#E74C3C",
                };
                return {
                  fillColor: colors[lvl],
                  color: colors[lvl],
                  weight: 1,
                  fillOpacity: 0.4,
                };
              }}
              onEachFeature={(f, layer) => {
                const name = (f.properties as any)?.name;
                if (name) {
                  layer.bindTooltip(name, { sticky: true });
                }
              }}
            />
          );
        })}

        {cities.map((city) => {
          const [lon, lat] = city.location;
          return (
            <CircleMarker
              key={city.id}
              center={[lat, lon]}
              radius={5}
              pathOptions={{
                color: city.warning_level,
                fillOpacity: 0.6,
                stroke: false,
              }}
              eventHandlers={{
                click: () => onCityClick(city.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -5]}>
                {city.city} [{city.country}]
                <br />
                Pop: {city.population ?? "N/A"}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {wsError && (
        <div
          className="position-absolute top-0 start-50 translate-middle-x text-danger bg-light px-3 py-2 rounded"
          style={{ zIndex: 1000, marginTop: "10px" }}
        >
          {wsError}
        </div>
      )}
    </div>
  );
};

export default React.memo(MapPanel);
