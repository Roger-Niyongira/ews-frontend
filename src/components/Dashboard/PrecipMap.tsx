import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  WMSTileLayer,
  GeoJSON,
  CircleMarker,
  LayersControl,
  Polygon,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type {
  ClimateThresholds,
  ProjectFloodLayer,
  ProjectGeoJsonLayer,
} from "../../App";

export interface City {
  id: number;
  city: string;
  country: string;
  location: [number, number];
  warning_level: "green" | "orange" | "red" | "no_data";
  population: number | null;
  climate_zone?: string | null;
  grib_downloaded_at?: string | null;
  forecast_updated_at?: string | null;
  last_updated?: string | null;
  updated_at?: string | null;
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
  projectFloodLayers: ProjectFloodLayer[];
  small?: boolean;
  style?: React.CSSProperties;
}

interface WatershedFeatureSummary {
  key: string;
  name: string;
  feature: GeoJSON.Feature | null;
}

type PrecipitationScope = "all" | "watersheds" | "polygon";
type LatLngTuple = [number, number];
type LngLatTuple = [number, number];

const FLOOD_DEPTH_RANGES = [
  { color: "#d6f3ff", label: "0.05 - 0.25 m" },
  { color: "#8bd8ff", label: "0.25 - 0.5 m" },
  { color: "#39a9f5", label: "0.5 - 1 m" },
  { color: "#0b6fb3", label: "1 - 2 m" },
  { color: "#08306b", label: "2 - 5 m" },
  { color: "#3f007d", label: "> 5 m" },
];

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

const isPointInRing = (point: LngLatTuple, ring: number[][]): boolean => {
  const [lng, lat] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [lngI, latI] = ring[i];
    const [lngJ, latJ] = ring[j];
    const intersects =
      (latI > lat) !== (latJ > lat) &&
      lng < ((lngJ - lngI) * (lat - latI)) / (latJ - latI) + lngI;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
};

const isPointInPolygonCoordinates = (
  point: LngLatTuple,
  coordinates: number[][][]
): boolean => {
  const [outerRing, ...holes] = coordinates;

  if (!outerRing || !isPointInRing(point, outerRing)) {
    return false;
  }

  return !holes.some((hole) => isPointInRing(point, hole));
};

const isPointInGeoJsonGeometry = (
  point: LngLatTuple,
  geometry: GeoJSON.Geometry | null
): boolean => {
  if (!geometry) {
    return false;
  }

  if (geometry.type === "Polygon") {
    return isPointInPolygonCoordinates(point, geometry.coordinates as number[][][]);
  }

  if (geometry.type === "MultiPolygon") {
    return (geometry.coordinates as number[][][][]).some((polygon) =>
      isPointInPolygonCoordinates(point, polygon)
    );
  }

  if (geometry.type === "GeometryCollection") {
    return geometry.geometries.some((childGeometry) =>
      isPointInGeoJsonGeometry(point, childGeometry)
    );
  }

  return false;
};

const isPointInGeoJsonObject = (
  point: LngLatTuple,
  geojson: GeoJSON.GeoJsonObject | null
): boolean => {
  if (!geojson) {
    return false;
  }

  if (geojson.type === "Feature") {
    return isPointInGeoJsonGeometry(point, (geojson as GeoJSON.Feature).geometry);
  }

  if (geojson.type === "FeatureCollection") {
    return (geojson as GeoJSON.FeatureCollection).features.some((feature) =>
      isPointInGeoJsonGeometry(point, feature.geometry)
    );
  }

  return isPointInGeoJsonGeometry(point, geojson as GeoJSON.Geometry);
};

const DrawPolygonClickHandler: React.FC<{
  enabled: boolean;
  onPointAdd: (point: LatLngTuple) => void;
}> = ({ enabled, onPointAdd }) => {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    container.style.cursor = enabled ? "crosshair" : "";

    return () => {
      container.style.cursor = "";
    };
  }, [enabled, map]);

  useMapEvents({
    click(event) {
      if (!enabled) {
        return;
      }

      onPointAdd([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
};

const FloodFeatureInfoHandler: React.FC<{
  enabled: boolean;
  layer: ProjectFloodLayer | null;
}> = ({ enabled, layer }) => {
  const map = useMap();

  useMapEvents({
    click(event) {
      if (!enabled || !layer) {
        return;
      }

      const size = map.getSize();
      const bounds = map.getBounds();
      const crs = map.options.crs ?? L.CRS.EPSG3857;
      const sw = crs.project(bounds.getSouthWest());
      const ne = crs.project(bounds.getNorthEast());
      const point = map.latLngToContainerPoint(event.latlng);

      const params = new URLSearchParams({
        service: "WMS",
        version: "1.1.1",
        request: "GetFeatureInfo",
        layers: layer.geoserver_layer,
        query_layers: layer.geoserver_layer,
        styles: layer.style || "",
        bbox: `${sw.x},${sw.y},${ne.x},${ne.y}`,
        height: String(size.y),
        width: String(size.x),
        srs: "EPSG:3857",
        info_format: "application/json",
        feature_count: "1",
        x: String(Math.round(point.x)),
        y: String(Math.round(point.y)),
      });

      fetch(`${layer.wms_url}?${params.toString()}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Unable to query flood depth.");
          }

          return res.json();
        })
        .then((data) => {
          const feature = data?.features?.[0];
          const rawValue =
            feature?.properties?.GRAY_INDEX ??
            feature?.properties?.gray_index ??
            feature?.properties?.value;
          const value = Number(rawValue);

          const content =
            Number.isFinite(value) && value > 0
              ? `<strong>${layer.name}</strong><br/>Depth: ${value.toFixed(2)} m`
              : `<strong>${layer.name}</strong><br/>No flood depth value`;

          L.popup()
            .setLatLng(event.latlng)
            .setContent(content)
            .openOn(map);
        })
        .catch(() => {
          L.popup()
            .setLatLng(event.latlng)
            .setContent("Unable to query flood depth at this location.")
            .openOn(map);
        });
    },
  });

  return null;
};

const MapPaneSetup: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    if (!map.getPane("watershedPane")) {
      map.createPane("watershedPane");
    }

    if (!map.getPane("floodPane")) {
      map.createPane("floodPane");
    }

    if (!map.getPane("cityMarkerPane")) {
      map.createPane("cityMarkerPane");
    }

    const watershedPane = map.getPane("watershedPane");
    const floodPane = map.getPane("floodPane");
    const cityMarkerPane = map.getPane("cityMarkerPane");

    if (watershedPane) {
      watershedPane.style.zIndex = "410";
    }

    if (floodPane) {
      floodPane.style.zIndex = "420";
    }

    if (cityMarkerPane) {
      cityMarkerPane.style.zIndex = "620";
    }
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
  projectFloodLayers,
  small,
  style,
}) => {
  const [climateZones, setClimateZones] = useState<any>(null);
  const [isProjectLayersCollapsed, setIsProjectLayersCollapsed] = useState(false);
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [precipitationScope, setPrecipitationScope] =
    useState<PrecipitationScope>("watersheds");
  const [drawnPolygon, setDrawnPolygon] = useState<LatLngTuple[]>([]);
  const [isDrawnPolygonFinished, setIsDrawnPolygonFinished] = useState(false);
  const [usesTouchInput, setUsesTouchInput] = useState(false);
  const lastCityActivationRef = useRef<{
    cityId: number;
    timestamp: number;
  } | null>(null);
  const availableWatersheds = projectWatersheds.filter((layer) => layer.geojsonData);
  const canUseWatershedScope = availableWatersheds.length > 0;
  const [selectedFloodHazard, setSelectedFloodHazard] = useState<string>("");
  const [selectedFloodReturnPeriod, setSelectedFloodReturnPeriod] = useState<string>("");

  const floodHazards = useMemo(
    () =>
      Array.from(
        new Set(projectFloodLayers.map((layer) => layer.hazard).filter(Boolean))
      ),
    [projectFloodLayers]
  );

  const floodReturnPeriods = useMemo(
    () =>
      Array.from(
        new Set(
          projectFloodLayers
            .filter(
              (layer) =>
                !selectedFloodHazard || layer.hazard === selectedFloodHazard
            )
            .map((layer) => layer.return_period)
            .filter(Boolean)
        )
      ),
    [projectFloodLayers, selectedFloodHazard]
  );

  const activeFloodLayer = useMemo(
    () =>
      projectFloodLayers.find(
        (layer) =>
          layer.hazard === selectedFloodHazard &&
          layer.return_period === selectedFloodReturnPeriod
      ) ?? null,
    [projectFloodLayers, selectedFloodHazard, selectedFloodReturnPeriod]
  );

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    const updateInputMode = () => setUsesTouchInput(mediaQuery.matches);

    updateInputMode();
    mediaQuery.addEventListener("change", updateInputMode);

    return () => {
      mediaQuery.removeEventListener("change", updateInputMode);
    };
  }, []);

  useEffect(() => {
    if (projectFloodLayers.length === 0) {
      setSelectedFloodHazard("");
      setSelectedFloodReturnPeriod("");
      return;
    }

    setSelectedFloodHazard((currentHazard) => {
      if (currentHazard && floodHazards.includes(currentHazard)) {
        return currentHazard;
      }

      return floodHazards[0] ?? "";
    });
  }, [floodHazards, projectFloodLayers.length]);

  useEffect(() => {
    setSelectedFloodReturnPeriod((currentReturnPeriod) => {
      if (
        currentReturnPeriod &&
        floodReturnPeriods.includes(currentReturnPeriod)
      ) {
        return currentReturnPeriod;
      }

      return floodReturnPeriods[0] ?? "";
    });
  }, [floodReturnPeriods]);

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

  const visibleCities = useMemo(() => {
    if (precipitationScope === "watersheds") {
      if (!canUseWatershedScope) {
        return cities;
      }

      return cities.filter((city) =>
        availableWatersheds.some((layer) =>
          isPointInGeoJsonObject(city.location, layer.geojsonData)
        )
      );
    }

    if (precipitationScope === "polygon" && drawnPolygon.length >= 3) {
      const polygonRing = drawnPolygon.map(([lat, lng]) => [lng, lat]);

      return cities.filter((city) => isPointInRing(city.location, polygonRing));
    }

    return cities;
  }, [
    availableWatersheds,
    canUseWatershedScope,
    cities,
    drawnPolygon,
    precipitationScope,
  ]);

  const handlePrecipitationScopeChange = (scope: PrecipitationScope) => {
    setPrecipitationScope(scope);

    if (scope !== "polygon") {
      setDrawnPolygon([]);
      setIsDrawnPolygonFinished(false);
    }
  };

  const activateCityMarker = (cityId: number) => {
    const lastActivation = lastCityActivationRef.current;

    if (
      lastActivation?.cityId === cityId &&
      Date.now() - lastActivation.timestamp < 700
    ) {
      return;
    }

    lastCityActivationRef.current = { cityId, timestamp: Date.now() };
    onCityClick(cityId);
  };

  const handleCityMarkerTouch = (cityId: number, event: L.LeafletEvent) => {
    L.DomEvent.stop(event);
    activateCityMarker(cityId);
  };

  return (
    <div className="w-100 h-100 position-relative">
      {projectName && (projectWatersheds.length > 0 || projectFloodLayers.length > 0) && (
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
            backgroundColor: "#2f343a",
            color: "#f8f9fa",
          }}
        >
          <div
            className="d-flex align-items-start justify-content-between gap-3"
            style={{
              backgroundColor: "#3a4047",
              padding: "0.75rem",
            }}
          >
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
            <div style={{ padding: "0.9rem" }}>
              <div className="mb-2 pb-2" style={{ borderBottom: "1px solid #5a646f" }}>
                <div className="fw-semibold mb-2">Precipitations</div>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      precipitationScope === "all"
                        ? "btn-info"
                        : "btn-outline-light"
                    }`}
                    onClick={() => handlePrecipitationScopeChange("all")}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      precipitationScope === "watersheds"
                        ? "btn-info"
                        : "btn-outline-light"
                    }`}
                    disabled={!canUseWatershedScope}
                    onClick={() => handlePrecipitationScopeChange("watersheds")}
                  >
                    Within Watersheds
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${
                      precipitationScope === "polygon"
                        ? "btn-info"
                      : "btn-outline-light"
                    }`}
                    onClick={() => handlePrecipitationScopeChange("polygon")}
                  >
                    Draw on map
                  </button>
                </div>
                {precipitationScope === "polygon" && (
                  <div className="mt-2">
                    <div className="small mb-2" style={{ color: "#c7ced6" }}>
                      Click the map to add polygon points. Markers filter after 3
                      points.
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-info"
                        disabled={drawnPolygon.length < 3}
                        onClick={() => setIsDrawnPolygonFinished(true)}
                      >
                        Finish
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        disabled={drawnPolygon.length === 0}
                        onClick={() => {
                          setIsDrawnPolygonFinished(false);
                          setDrawnPolygon((points) => points.slice(0, -1));
                        }}
                      >
                        Undo point
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        disabled={drawnPolygon.length === 0}
                        onClick={() => {
                          setIsDrawnPolygonFinished(false);
                          setDrawnPolygon([]);
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
                {!canUseWatershedScope && (
                  <div className="small mt-2" style={{ color: "#c7ced6" }}>
                    Project watershed precipitation will be available once a watershed
                    geometry is loaded.
                  </div>
                )}
              </div>

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

              {projectFloodLayers.length > 0 && (
                <div>
                  <div className="fw-semibold mb-2">Flood Maps</div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {floodHazards.map((hazard) => (
                      <button
                        key={hazard}
                        type="button"
                        className={`btn btn-sm ${
                          selectedFloodHazard === hazard
                            ? "btn-info"
                            : "btn-outline-light"
                        }`}
                        onClick={() => setSelectedFloodHazard(hazard)}
                      >
                        {hazard}
                      </button>
                    ))}
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {floodReturnPeriods.map((returnPeriod) => (
                      <button
                        key={returnPeriod}
                        type="button"
                        className={`btn btn-sm ${
                          selectedFloodReturnPeriod === returnPeriod
                            ? "btn-info"
                            : "btn-outline-light"
                        }`}
                        onClick={() => setSelectedFloodReturnPeriod(returnPeriod)}
                      >
                        {returnPeriod}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showFloodMap && activeFloodLayer && (
        <div
          className="shadow-sm"
          style={{
            position: "absolute",
            right: 12,
            bottom: 12,
            zIndex: 1000,
            backgroundColor: "rgba(47, 52, 58, 0.94)",
            color: "#f8f9fa",
            padding: "0.75rem",
            borderRadius: 6,
            minWidth: 170,
          }}
        >
          <div className="fw-semibold mb-2">Depth Ranges</div>
          <div className="small" style={{ color: "#d7dde4" }}>
            {FLOOD_DEPTH_RANGES.map((range) => (
              <div
                key={range.label}
                className="d-flex align-items-center gap-2 mb-1"
              >
                <span
                  style={{
                    background: range.color,
                    display: "inline-block",
                    width: 18,
                    height: 10,
                    borderRadius: 2,
                    flex: "0 0 auto",
                  }}
                />
                <span>{range.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <MapContainer
        className="dashboard-precip-map"
        center={center}
        zoom={zoom}
        style={style ?? { width: "100%", height: "100%" }}
      >
        <MapReadyBridge onReady={setMapInstance} />
        <MapPaneSetup />
        <DrawPolygonClickHandler
          enabled={precipitationScope === "polygon"}
          onPointAdd={(point) => {
            setIsDrawnPolygonFinished(false);
            setDrawnPolygon((currentPoints) => [...currentPoints, point]);
          }}
        />
        <FloodFeatureInfoHandler
          enabled={showFloodMap}
          layer={activeFloodLayer}
        />
        <LayersControl position="topleft">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer name="Google Hybrid">
            <TileLayer
              attribution="Imagery © Google"
              url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Legend />

        {showFloodMap && activeFloodLayer && (
          <WMSTileLayer
            key={`${activeFloodLayer.geoserver_layer}-${activeFloodLayer.style}`}
            url={activeFloodLayer.wms_url}
            layers={activeFloodLayer.geoserver_layer}
            styles={activeFloodLayer.style}
            format="image/png"
            transparent
            opacity={0.75}
            pane="floodPane"
          />
        )}

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
          visibleCities.map((city) => {
            if (city.warning_level === "no_data") {
              return null;
            }

            const [lon, lat] = city.location;
            return (
              <CircleMarker
                key={city.id}
                center={[lat, lon]}
                pane="cityMarkerPane"
                radius={5}
                pathOptions={{
                  color: city.warning_level,
                  fillOpacity: 0.6,
                  stroke: false,
                }}
                eventHandlers={{
                  click: () => activateCityMarker(city.id),
                  touchstart: (event: L.LeafletEvent) =>
                    handleCityMarkerTouch(city.id, event),
                  touchend: (event: L.LeafletEvent) =>
                    handleCityMarkerTouch(city.id, event),
                } as L.LeafletEventHandlerFnMap}
              >
                {!usesTouchInput && (
                  <Tooltip direction="top" offset={[0, -5]}>
                    {city.city} [{city.country}]
                    <br />
                    Pop: {city.population ?? "N/A"}
                  </Tooltip>
                )}
              </CircleMarker>
            );
          })}

        {precipitationScope === "polygon" &&
          drawnPolygon.length > 0 &&
          !isDrawnPolygonFinished && (
          <Polygon
            positions={drawnPolygon}
            pathOptions={{
              color: "#0dcaf0",
              weight: 3,
              opacity: 1,
              fillColor: "#9be7ff",
              fillOpacity: 0.18,
            }}
          />
        )}

        {showWatersheds &&
          availableWatersheds.map(
            (layer) =>
              layer.geojsonData && (
                <GeoJSON
                  key={layer.id}
                  data={layer.geojsonData as GeoJSON.GeoJsonObject}
                  pane="watershedPane"
                  style={() => ({
                    color: "#0d6efd",
                    weight: 3,
                    opacity: 1,
                    fillColor: "#7b2cbf",
                    fillOpacity: 0,
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
                    leafletLayer.on({
                      mouseover: () => {
                        if (
                          "setStyle" in leafletLayer &&
                          typeof leafletLayer.setStyle === "function"
                        ) {
                          leafletLayer.setStyle({
                            color: "#7b2cbf",
                            weight: 3,
                            opacity: 1,
                            fillColor: "#7b2cbf",
                            fillOpacity: 0.16,
                          });
                        }
                      },
                      mouseout: () => {
                        if (
                          "setStyle" in leafletLayer &&
                          typeof leafletLayer.setStyle === "function"
                        ) {
                          leafletLayer.setStyle({
                            color: "#0d6efd",
                            weight: 3,
                            opacity: 1,
                            fillColor: "#7b2cbf",
                            fillOpacity: 0,
                          });
                        }
                      },
                    });
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
