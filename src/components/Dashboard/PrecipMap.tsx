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

export interface City {
  id: number;
  city: string;
  country: string;
  location: [number, number];
  warning_level: "green" | "orange" | "red";
  population: number | null;
  climate_zone?: string | null;
}

//type ThresholdsMap = Record<string, { green: number; orange: number }>;

interface MapPanelProps {
  cities: City[];
  thresholds: any;
  onCityClick: (cityId: number) => void;
  showClimateZones: boolean;
  showFloodMap: boolean;
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
  thresholds,
  onCityClick,
  showClimateZones,
  showFloodMap,
  small,
  style,
}) => {
  const [climateZones, setClimateZones] = useState<any>(null);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/africa_climate_zones.geojson")
      .then((res) => res.json())
      .then((data) => setClimateZones(data))
      .catch(() => console.error("Failed to load climate zones"));
  }, []);

  const center: [number, number] = small ? [2, 20] : [0, 20];
  const zoom = small ? 3 : 4;

  const getClimateColor = (zone: string) => {
    switch (zone) {
      case "Tropical":
        return "#4daf4a";
      case "Temperate":
        return "#377eb8";
      case "Arid":
        return "#e6ab02";
      case "Semi-Arid":
        return "#f781bf";
      default:
        return "#cccccc";
    }
  };

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

        {showClimateZones && climateZones && (
          <GeoJSON
            data={climateZones}
            style={(feature: any) => ({
              fillColor: getClimateColor(feature?.properties?.zone),
              color: "#111111",
              weight: 1.2,
              opacity: 0.9,
              fillOpacity: 0.38,
              interactive: true,
            })}
            onEachFeature={(feature: any, layer) => {
              const zone = feature?.properties?.zone;
              const t = thresholds[zone];

              if (!zone) return;

              // If backend data exists → show thresholds
              if (t) {
                layer.bindTooltip(`
                  <strong>${zone}</strong><br/>
                  Green: &lt; ${t.green} mm<br/>
                  Orange: ${t.green} - ${t.orange} mm<br/>
                  Red: &ge; ${t.orange} mm
                `, {
                  sticky: true,
                  direction: "top",
                });
              } else {
                // If backend missing → show only zone name
                layer.bindTooltip(zone, {
                  sticky: true,
                  direction: "top",
                });
              }
            }}
          />
        )}

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
    </div>
  );
};

export default React.memo(MapPanel);