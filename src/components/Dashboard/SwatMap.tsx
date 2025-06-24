import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature, MultiPolygon, MultiLineString } from "geojson";

interface WatershedFeature {
  id: number;
  name: string;
  geom: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
}

interface RiverFeature {
  id: number;
  channel: number;
  flo_out: number | null;
  flo_out_max: number | null;
  geom: {
    type: "MultiLineString";
    coordinates: number[][][];
  };
  watershed: number;
}

interface SwatMapProps {
  small?: boolean;
  style?: React.CSSProperties;
}

let cachedWatersheds: WatershedFeature[] | null = null;
let cachedRivers: RiverFeature[] | null = null;

const SwatMap: React.FC<SwatMapProps> = ({ small = false, style }) => {
  const [watersheds, setWatersheds] = useState<WatershedFeature[]>([]);
  const [rivers, setRivers] = useState<RiverFeature[]>([]);
  const [breaks, setBreaks] = useState<number[]>([]);

  const colors = ["#ffffcc", "#c2e699", "#78c679", "#31a354", "#006837"];

  const getColor = (val: number | null): string => {
    if (val === null || breaks.length < 2) return "#cccccc";
    for (let i = 0; i < breaks.length - 1; i++) {
      if (val >= breaks[i] && val <= breaks[i + 1]) return colors[i];
    }
    return colors[colors.length - 1];
  };

  useEffect(() => {
    if (cachedWatersheds) {
      setWatersheds(cachedWatersheds);
    } else {
      fetch("http://127.0.0.1:8000/api/watersheds/")
        .then((res) => res.json())
        .then((data) => {
          cachedWatersheds = data;
          setWatersheds(data);
        })
        .catch(() => setWatersheds([]));
    }

    if (cachedRivers) {
      setRivers(cachedRivers);
      computeBreaks(cachedRivers);
    } else {
      fetch("http://127.0.0.1:8000/api/rivers/")
        .then((res) => res.json())
        .then((data) => {
          cachedRivers = data;
          setRivers(data);
          computeBreaks(data);
        })
        .catch(() => setRivers([]));
    }
  }, []);

  const computeBreaks = (data: RiverFeature[]) => {
    const valid = data
      .map((r) => r.flo_out_max)
      .filter((v): v is number => v !== null);
    if (valid.length < 2) return;

    const min = Math.min(...valid);
    const max = Math.max(...valid);
    const step = (max - min) / colors.length;
    const b = Array.from({ length: colors.length + 1 }, (_, i) =>
      +(min + i * step).toFixed(2)
    );
    setBreaks(b);
  };

  const center: [number, number] = small ? [2, 20] : [0, 20];
  const zoom = small ? 3 : 4;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={style ?? { width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />

        {watersheds.map((ws) => {
          const feature: Feature<MultiPolygon> = {
            type: "Feature",
            geometry: ws.geom as MultiPolygon,
            properties: { name: ws.name },
          };
          return (
            <GeoJSON
              key={`ws-${ws.id}`}
              data={feature}
              style={{ color: "#1a9850", weight: 2, fillOpacity: 0.4 }}
              onEachFeature={(feature, layer) => {
                const name = (feature.properties as any)?.name;
                if (name) layer.bindTooltip(name, { sticky: true });
              }}
            />
          );
        })}

        {rivers.map((rv) => {
          const feature: Feature<MultiLineString> = {
            type: "Feature",
            geometry: rv.geom as MultiLineString,
            properties: {
              channel: rv.channel,
              flo_out: rv.flo_out,
              flo_out_max: rv.flo_out_max,
            },
          };
          return (
            <GeoJSON
              key={`rv-${rv.id}`}
              data={feature}
              style={() => ({
                color: getColor(rv.flo_out_max),
                weight: 4,
                opacity: 1.0,
              })}
              onEachFeature={(feature, layer) => {
                const ch = (feature.properties as any)?.channel;
                const flow = (feature.properties as any)?.flo_out_max;
                const label = `Channel ${ch}${
                  flow !== null ? `\nMax Flow: ${flow}` : ""
                }`;
                layer.bindTooltip(label, { sticky: true });
              }}
            />
          );
        })}
      </MapContainer>

      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          backgroundColor: "white",
          color: "black",
          padding: "10px",
          borderRadius: "5px",
          boxShadow: "0 0 5px rgba(0,0,0,0.3)",
          fontSize: "14px",
          zIndex: 1000,
        }}
      >
        <strong>Max Flow (m³/s)</strong>
        {breaks.length >= 2 &&
          colors.map((c, i) => (
            <div key={i}>
              <span style={{ background: c, padding: "0 10px" }}></span>{" "}
              {breaks[i]} - {breaks[i + 1]}
            </div>
          ))}
        <div>
          <span style={{ background: "#cccccc", padding: "0 10px" }}></span> No
          Data
        </div>
      </div>
    </div>
  );
};

export default React.memo(SwatMap);
