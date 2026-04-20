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
import type { ClimateThresholds, ProjectGeoJsonLayer } from "../../App";

export interface City {
  id: number;
  city: string;
  country: string;
  location: [number, number];
  warning_level: "green" | "orange" | "red" | "no_data";
  population: number | null;
  climate_zone?: string | null;
}

interface MapPanelProps {
  cities: City[];
  thresholds: ClimateThresholds;
  onCityClick: (cityId: number) => void;
  showClimateZones: boolean;
  showFloodMap: boolean;
  showPrecipitations: boolean;
  showWatersheds: boolean;
  projectName: string | null;
  projectWatersheds: ProjectGeoJsonLayer[];
  small?: boolean;
  style?: React.CSSProperties;
}

interface WatershedFeatureSummary {
  key: string;
  name: string;
  feature: GeoJSON.Feature | null;
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
  showPrecipitations,
  showWatersheds,
  projectName,
  projectWatersheds,
  small,
  style,
}) => {
  const [climateZones, setClimateZones] = useState<any>(null);
  const [isProjectLayersCollapsed, setIsProjectLayersCollapsed] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const availableWatersheds = projectWatersheds.filter((layer) => layer.geojsonData);

  const getWatershedFeatureSummary = (
    feature: GeoJSON.Feature,
    fallbackName: string
  ): { name: string; areaKm2: number | null } => {
    const properties =
      feature.properties && typeof feature.properties === "object"
        ? (feature.properties as Record<string, unknown>)
        : {};

    const rawName =
      properties.watershed_name ??
      properties.name ??
      properties.NAME ??
      properties.basin_name ??
      properties.BASIN_NAME ??
      properties.label;

    const rawArea =
      properties.area_km2 ??
      properties.area ??
      properties.AREA_KM2 ??
      properties.AREA;

    const areaKm2 =
      typeof rawArea === "number"
        ? rawArea
        : typeof rawArea === "string" && !Number.isNaN(Number(rawArea))
          ? Number(rawArea)
          : null;

    return {
      name:
        typeof rawName === "string" && rawName.trim().length > 0
          ? rawName
          : fallbackName,
      areaKm2,
    };
  };

  const watershedFeatureSummaries: WatershedFeatureSummary[] = availableWatersheds.flatMap(
    (layer): WatershedFeatureSummary[] => {
      const geojson = layer.geojsonData;

      if (!geojson || geojson.type !== "FeatureCollection") {
        return [{ key: `layer-${layer.id}`, name: layer.name, feature: null }];
      }

      const featureCollection = geojson as GeoJSON.FeatureCollection;

      return featureCollection.features.map((feature, index) => {
        const { name } = getWatershedFeatureSummary(
          feature,
          `${layer.name} ${index + 1}`
        );

        return {
          key: `${layer.id}-${index}`,
          name,
          feature,
        };
      });
    }
  );

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

  const handleWatershedSelect = (feature: GeoJSON.Feature | null) => {
    if (!feature || !mapInstance) {
      return;
    }

    const featureLayer = L.geoJSON(feature as GeoJSON.GeoJsonObject);
    const bounds = featureLayer.getBounds();

    if (bounds.isValid()) {
      mapInstance.fitBounds(bounds, {
        padding: [24, 24],
        maxZoom: 10,
      });
    }
  };

  return (
    <div className="w-100 h-100 position-relative">
      {projectName && (projectWatersheds.length > 0 || showFloodMap) && (
        <div
          className="rounded shadow-sm"
          style={{
            position: "absolute",
            bottom: 12,
            left: 12,
            zIndex: 1000,
            width: "max-content",
            minWidth: 300,
            maxWidth: "min(440px, calc(100% - 24px))",
            maxHeight: isProjectLayersCollapsed ? "none" : "min(70vh, calc(100% - 24px))",
            overflowY: isProjectLayersCollapsed ? "visible" : "auto",
            padding: "0.9rem",
            backgroundColor: "#2f343a",
            color: "#f8f9fa",
          }}
        >
          <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
            <div>
              <div className="fw-bold">Project Layers</div>
              <div className="small" style={{ color: "#c7ced6" }}>
                {projectName}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-outline-light"
              onClick={() => setIsProjectLayersCollapsed((collapsed) => !collapsed)}
            >
              {isProjectLayersCollapsed ? "Expand" : "Collapse"}
            </button>
          </div>

          {!isProjectLayersCollapsed && (
            <>
              {projectWatersheds.length > 0 && (
                <div className="mb-3">
                  <div className="fw-semibold mb-2">Watersheds</div>
                  <div className="list-group">
                    {availableWatersheds.length > 0
                      ? watershedFeatureSummaries.map((feature) => (
                          <div
                            key={feature.key}
                            className="list-group-item py-2 px-2"
                            style={{
                              backgroundColor: "#3a4047",
                              color: "#f8f9fa",
                              borderColor: "#4b535c",
                              cursor: feature.feature ? "pointer" : "default",
                            }}
                            onClick={() => handleWatershedSelect(feature.feature)}
                          >
                            <div>{feature.name}</div>
                          </div>
                        ))
                      : projectWatersheds.map((layer) => (
                          <div
                            key={layer.id}
                            className="list-group-item py-2 px-2"
                            style={{
                              backgroundColor: "#3a4047",
                              color: "#f8f9fa",
                              borderColor: "#4b535c",
                            }}
                          >
                            <div>{layer.name}</div>
                            {!layer.geojsonData && (
                              <div className="small" style={{ color: "#ffb3b3" }}>
                                Layer file found, but geometry could not be loaded yet.
                              </div>
                            )}
                          </div>
                        ))}
                  </div>
                </div>
              )}

              {showFloodMap && (
                <div>
                  <div className="fw-semibold mb-2">Flood Maps</div>
                  <div className="small" style={{ color: "#c7ced6" }}>
                    Flood map items will appear here when project flood layers are connected.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        style={style ?? { width: "100%", height: "100%" }}
      >
        <MapReadyBridge onReady={setMapInstance} />
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

              if (t) {
                layer.bindTooltip(
                  `
                  <strong>${zone}</strong><br/>
                  Green: &lt; ${t.green} mm<br/>
                  Orange: ${t.green} - ${t.orange} mm<br/>
                  Red: &ge; ${t.orange} mm
                `,
                  {
                    sticky: true,
                    direction: "top",
                  }
                );
              } else {
                layer.bindTooltip(zone, {
                  sticky: true,
                  direction: "top",
                });
              }
            }}
          />
        )}

        {showPrecipitations &&
          cities.map((city) => {
            if (city.warning_level === "no_data") {
              return null;
            }

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

        {showWatersheds &&
          availableWatersheds.map(
            (layer) =>
              layer.geojsonData && (
                <GeoJSON
                  key={layer.id}
                  data={layer.geojsonData as GeoJSON.GeoJsonObject}
                  style={() => ({
                    color: "#f39c12",
                    weight: 2,
                    opacity: 0.9,
                    fillOpacity: 0.08,
                  })}
                  onEachFeature={(feature, leafletLayer) => {
                    const { name, areaKm2 } = getWatershedFeatureSummary(
                      feature,
                      layer.name
                    );

                    leafletLayer.bindTooltip(
                      areaKm2 !== null
                        ? `<strong>${name}</strong><br/>Area: ${areaKm2.toFixed(1)} km²`
                        : `<strong>${name}</strong>`,
                      {
                        sticky: true,
                        direction: "top",
                      }
                    );
                  }}
                />
              )
          )}
      </MapContainer>
    </div>
  );
};

const MapReadyBridge: React.FC<{ onReady: (map: L.Map) => void }> = ({ onReady }) => {
  const map = useMap();

  useEffect(() => {
    onReady(map);
  }, [map, onReady]);

  return null;
};

export default React.memo(MapPanel);
