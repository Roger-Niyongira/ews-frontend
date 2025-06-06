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
import axios from "axios";

// Import the GeoJSON types:
import type { Feature, MultiPolygon } from "geojson";

interface City {
  id: number;
  city: string;
  country: string;
  location: [number, number]; // [ longitude, latitude ]
  warning_level: "green" | "orange" | "red";
  population: number | null;
}

interface WatershedFeature {
  id: number;
  name: string;
  warning_level: "green" | "orange" | "red";
  geom: {
    // matches the serializer’s output
    type: "MultiPolygon";
    coordinates: number[][][][]; // an array of polygon‐rings
  };
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
          <span style="display:inline-block;width:12px;height:12px;background-color:green;border-radius:50%;margin-right:6px;"></span>Low Level
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 4px;">
          <span style="display:inline-block;width:12px;height:12px;background-color:orange;border-radius:50%;margin-right:6px;"></span>Medium Level
        </div>
        <div style="display: flex; align-items: center;">
          <span style="display:inline-block;width:12px;height:12px;background-color:red;border-radius:50%;margin-right:6px;"></span>High Level
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

const MapPanel: React.FC<MapPanelProps> = ({ onCityClick }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State for watershed polygons
  const [watersheds, setWatersheds] = useState<WatershedFeature[]>([]);
  const [wsError, setWsError] = useState<string | null>(null);

  // Fetch cities
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

  // Fetch watersheds once
  useEffect(() => {
    axios
      .get<WatershedFeature[]>("http://127.0.0.1:8000/api/watersheds/")
      .then((res) => {
        setWatersheds(res.data);
        setWsError(null);
      })
      .catch(() => {
        setWatersheds([]);
        setWsError("⚠️ Unable to fetch watershed polygons.");
      });
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

        {/**
          A) Draw each watershed as a GeoJSON layer
        */}
        {watersheds.map((ws) => {
          // Build a GeoJSON Feature<MultiPolygon> object:
          const feature: Feature<MultiPolygon> = {
            type: "Feature",
            geometry: ws.geom as MultiPolygon,
            properties: {
              name: ws.name,
              warning_level: ws.warning_level, // pass this into GeoJSON “properties”
            },
          };

          return (
            <GeoJSON
  key={ws.id}
  data={feature}
  style={(feature) => {
    // 1) Guard against “feature” being undefined.
    //    If it is undefined, return a fallback style immediately.
    if (!feature || !feature.properties) {
      return {
        fillColor:   "#CCCCCC", // fallback color
        color:       "#666666",
        weight:        1,
        fillOpacity:  0.2,
      };
    }

    // 2) Now that TypeScript knows “feature” is not undefined,
    //    we can safely read properties.warning_level:
    const props = feature.properties as any;
    const lvl  = props.warning_level as "green" | "orange" | "red";

    let fill: string;
    if (lvl === "red") {
      fill = "#E74C3C";
    } else if (lvl === "orange") {
      fill = "#F39C12";
    } else {
      fill = "#27AE60";
    }

    return {
      fillColor:   fill,
      color:       fill,
      weight:      1,
      fillOpacity: 0.4,
    };
  }}
  onEachFeature={(feature, layer) => {
    if (feature.properties && (feature.properties as any).name) {
      layer.bindTooltip((feature.properties as any).name, { sticky: true });
    }
  }}
/>
          );
        })}

        {/**
          B) Draw each city as a CircleMarker, flipping [lon, lat] → [lat, lon]
        */}
        {cities.map((city) => {
          // Unpack [lon, lat] from city.location
          const [lon, lat] = city.location;

          return (
            <CircleMarker
              key={city.id}
              center={[lat, lon]} // <-- flip to Leaflet’s [lat, lon]
              radius={5}
              pathOptions={{
                color: city.warning_level,
                fillColor: city.warning_level,
                fillOpacity: 0.6,
                stroke: false,
              }}
              eventHandlers={{
                click: () => onCityClick(city.id),
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
      {wsError && (
        <div
          className="position-absolute top-0 start-50 translate-middle-x text-danger bg-light px-3 py-2 rounded"
          style={{ zIndex: 1000, marginTop: "50px" }}
        >
          {wsError}
        </div>
      )}
    </div>
  );
};

export default React.memo(MapPanel);
