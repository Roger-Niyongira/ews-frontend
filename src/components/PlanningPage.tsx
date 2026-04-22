import React, { useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  LayersControl,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ProjectGeoJsonLayer } from "../App";

interface PlanningPageProps {
  projectName: string | null;
  dashboardWatersheds: ProjectGeoJsonLayer[];
  dashboardFloodRasterAvailable: boolean;
}

type DataSource = "upload" | "dashboard";

interface PlanningGeoJsonLayer {
  id: string;
  name: string;
  geojsonData: GeoJSON.GeoJsonObject;
}

const watershedStyle = {
  color: "#0d6efd",
  weight: 3,
  opacity: 1,
  fillColor: "#9be7ff",
  fillOpacity: 0.3,
};

const buildingStyle = {
  color: "#ff6b00",
  weight: 2,
  opacity: 1,
  fillColor: "#ffd8a8",
  fillOpacity: 0.35,
};

const infrastructureStyle = {
  color: "#198754",
  weight: 2,
  opacity: 1,
  fillColor: "#b7f5cf",
  fillOpacity: 0.28,
};

const floodExtentStyle = {
  color: "#0dcaf0",
  weight: 2,
  opacity: 1,
  fillColor: "#0dcaf0",
  fillOpacity: 0.28,
};

const FitToLayers: React.FC<{ layers: PlanningGeoJsonLayer[] }> = ({ layers }) => {
  const map = useMap();

  useEffect(() => {
    if (layers.length === 0) {
      return;
    }

    const group = L.featureGroup(
      layers.map((layer) => L.geoJSON(layer.geojsonData))
    );
    const bounds = group.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [28, 28],
        maxZoom: 12,
      });
    }
  }, [layers, map]);

  return null;
};

const PlanningPage: React.FC<PlanningPageProps> = ({
  projectName,
  dashboardWatersheds,
  dashboardFloodRasterAvailable,
}) => {
  const [watershedSource, setWatershedSource] = useState<DataSource>("upload");
  const [floodRasterSource, setFloodRasterSource] = useState<DataSource>("upload");
  const [watershedInputKey, setWatershedInputKey] = useState(0);
  const [watershedFileName, setWatershedFileName] = useState<string | null>(null);
  const [uploadedWatershed, setUploadedWatershed] =
    useState<PlanningGeoJsonLayer | null>(null);
  const [watershedUploadError, setWatershedUploadError] = useState<string | null>(null);
  const [floodExtentInputKey, setFloodExtentInputKey] = useState(0);
  const [floodRasterFileName, setFloodRasterFileName] = useState<string | null>(null);
  const [uploadedFloodExtent, setUploadedFloodExtent] =
    useState<PlanningGeoJsonLayer | null>(null);
  const [floodExtentUploadError, setFloodExtentUploadError] = useState<string | null>(
    null
  );
  const [buildingInputKey, setBuildingInputKey] = useState(0);
  const [buildingFileName, setBuildingFileName] = useState<string | null>(null);
  const [uploadedBuilding, setUploadedBuilding] =
    useState<PlanningGeoJsonLayer | null>(null);
  const [buildingUploadError, setBuildingUploadError] = useState<string | null>(null);
  const [otherInfrastructureName, setOtherInfrastructureName] = useState("");
  const [otherInfrastructureInputKey, setOtherInfrastructureInputKey] = useState(0);
  const [otherInfrastructureFileName, setOtherInfrastructureFileName] = useState<
    string | null
  >(null);
  const [uploadedOtherInfrastructure, setUploadedOtherInfrastructure] =
    useState<PlanningGeoJsonLayer | null>(null);
  const [otherInfrastructureUploadError, setOtherInfrastructureUploadError] =
    useState<string | null>(null);
  const [advancedOptions, setAdvancedOptions] = useState({
    delineateInfrastructure: false,
    costAnalysis: false,
    agentBasedModel: false,
  });
  const [advancedDetails, setAdvancedDetails] = useState("");
  const [isAdvancedPlanningOpen, setIsAdvancedPlanningOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const availableDashboardWatersheds = useMemo(
    () => dashboardWatersheds.filter((layer) => layer.geojsonData),
    [dashboardWatersheds]
  );

  const canUseDashboardWatersheds = availableDashboardWatersheds.length > 0;

  const mapWatersheds = useMemo<PlanningGeoJsonLayer[]>(
    () => {
      if (watershedSource === "dashboard" && canUseDashboardWatersheds) {
        return availableDashboardWatersheds.flatMap((layer) =>
          layer.geojsonData
            ? [
                {
                  id: `dashboard-${layer.id}`,
                  name: layer.name,
                  geojsonData: layer.geojsonData,
                },
              ]
            : []
        );
      }

      return uploadedWatershed ? [uploadedWatershed] : [];
    },
    [
      availableDashboardWatersheds,
      canUseDashboardWatersheds,
      uploadedWatershed,
      watershedSource,
    ]
  );

  const handleWatershedFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    setWatershedUploadError(null);
    setUploadedWatershed(null);
    setWatershedFileName(file?.name ?? null);

    if (!file) {
      return;
    }

    const lowerName = file.name.toLowerCase();

    if (!lowerName.endsWith(".geojson") && !lowerName.endsWith(".json")) {
      setWatershedUploadError(
        "Only GeoJSON or JSON watershed files can be previewed on the map right now. GPKG upload will require backend conversion."
      );
      return;
    }

    try {
      const text = await file.text();
      const parsedGeojson = JSON.parse(text) as GeoJSON.GeoJsonObject;
      setUploadedWatershed({
        id: `upload-${file.name}-${file.lastModified}`,
        name: file.name,
        geojsonData: parsedGeojson,
      });
    } catch {
      setWatershedUploadError(
        "This file could not be read as valid GeoJSON. Please check the file and try again."
      );
    }
  };

  const clearUploadedWatershed = () => {
    setWatershedFileName(null);
    setUploadedWatershed(null);
    setWatershedUploadError(null);
    setWatershedInputKey((key) => key + 1);
  };

  const handleFloodExtentFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    setFloodRasterFileName(file?.name ?? null);
    setUploadedFloodExtent(null);
    setFloodExtentUploadError(null);

    if (!file) {
      return;
    }

    const lowerName = file.name.toLowerCase();

    if (
      lowerName.endsWith(".tif") ||
      lowerName.endsWith(".tiff") ||
      lowerName.endsWith(".img")
    ) {
      setFloodExtentUploadError(
        "Raster flood extents can be selected for analysis, but they will not be previewed on the map until backend processing is connected."
      );
      return;
    }

    if (!lowerName.endsWith(".geojson") && !lowerName.endsWith(".json")) {
      setFloodExtentUploadError(
        "Please load a GeoJSON, JSON, TIF, TIFF, or IMG flood extent file."
      );
      return;
    }

    try {
      const text = await file.text();
      const parsedGeojson = JSON.parse(text) as GeoJSON.GeoJsonObject;
      setUploadedFloodExtent({
        id: `flood-extent-${file.name}-${file.lastModified}`,
        name: file.name,
        geojsonData: parsedGeojson,
      });
    } catch {
      setFloodExtentUploadError(
        "This file could not be read as valid GeoJSON."
      );
    }
  };

  const clearUploadedFloodExtent = () => {
    setFloodRasterFileName(null);
    setUploadedFloodExtent(null);
    setFloodExtentUploadError(null);
    setFloodExtentInputKey((key) => key + 1);
  };

  const loadOptionalGeoJsonLayer = async (
    file: File,
    layerKind: "building" | "infrastructure"
  ) => {
    const lowerName = file.name.toLowerCase();

    if (lowerName.endsWith(".gpkg")) {
      return {
        layer: null,
        error:
          "GPKG was selected, but map preview requires backend conversion. The file can still be included in the planning request.",
      };
    }

    if (!lowerName.endsWith(".geojson") && !lowerName.endsWith(".json")) {
      return {
        layer: null,
        error: "Please load a GeoJSON, JSON, or GPKG file.",
      };
    }

    try {
      const text = await file.text();
      const parsedGeojson = JSON.parse(text) as GeoJSON.GeoJsonObject;

      return {
        layer: {
          id: `${layerKind}-${file.name}-${file.lastModified}`,
          name: file.name,
          geojsonData: parsedGeojson,
        },
        error: null,
      };
    } catch {
      return {
        layer: null,
        error: "This file could not be read as valid GeoJSON.",
      };
    }
  };

  const handleBuildingFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    setBuildingFileName(file?.name ?? null);
    setUploadedBuilding(null);
    setBuildingUploadError(null);

    if (!file) {
      return;
    }

    const result = await loadOptionalGeoJsonLayer(file, "building");
    setUploadedBuilding(result.layer);
    setBuildingUploadError(result.error);
  };

  const clearUploadedBuilding = () => {
    setBuildingFileName(null);
    setUploadedBuilding(null);
    setBuildingUploadError(null);
    setBuildingInputKey((key) => key + 1);
  };

  const handleOtherInfrastructureFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    setOtherInfrastructureFileName(file?.name ?? null);
    setUploadedOtherInfrastructure(null);
    setOtherInfrastructureUploadError(null);

    if (!file) {
      return;
    }

    const result = await loadOptionalGeoJsonLayer(file, "infrastructure");
    setUploadedOtherInfrastructure(result.layer);
    setOtherInfrastructureUploadError(result.error);
  };

  const clearUploadedOtherInfrastructure = () => {
    setOtherInfrastructureFileName(null);
    setUploadedOtherInfrastructure(null);
    setOtherInfrastructureUploadError(null);
    setOtherInfrastructureInputKey((key) => key + 1);
  };

  const toggleAdvancedOption = (
    option: "delineateInfrastructure" | "costAnalysis" | "agentBasedModel"
  ) => {
    setAdvancedOptions((current) => ({
      ...current,
      [option]: !current[option],
    }));
  };

  const rowButtonClass = (active: boolean) =>
    `btn btn-sm ${active ? "btn-primary" : "btn-outline-secondary"}`;

  return (
    <div className="flex-grow-1 h-100 w-100">
      <div className="container-fluid h-100 py-3 px-3 px-lg-4">
        <div className="row g-3 h-100 align-items-stretch">
          <div className="col-12 col-lg-4 col-xl-3">
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column gap-4 overflow-auto">
                <div className="position-relative">
                  <div
                    className="d-flex align-items-center justify-content-between gap-2 bg-dark text-white rounded px-3"
                    style={{ minHeight: "48px" }}
                  >
                    <h2 className="h6 mb-0">Spatial analysis</h2>
                    <button
                      type="button"
                      className="btn btn-sm rounded-circle d-inline-flex align-items-center justify-content-center text-white border-0"
                      style={{
                        width: "40px",
                        height: "40px",
                        padding: 0,
                        backgroundColor: "#0d6efd",
                        touchAction: "manipulation",
                      }}
                      aria-label="Planning tool information"
                      aria-expanded={isInfoOpen}
                      aria-controls="spatialAnalysisInfo"
                      onClick={() => setIsInfoOpen((isOpen) => !isOpen)}
                    >
                      i
                    </button>
                  </div>
                  {isInfoOpen && (
                    <div
                      id="spatialAnalysisInfo"
                      className="small text-muted border rounded p-2 shadow-sm"
                      style={{
                        position: "absolute",
                        top: "calc(100% + 6px)",
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                        backgroundColor: "#f1f3f5",
                        borderColor: "#ced4da",
                      }}
                    >
                      <p className="mb-2">
                        You can load your own watershed or import the watershed already
                        available from the dashboard.
                      </p>
                      <p className="mb-2">
                        Accepted watershed and infrastructure formats include GPKG,
                        GeoJSON, JSON, and CSV. Flood extents can be previewed when
                        loaded as GeoJSON or JSON.
                      </p>
                      <p className="mb-2">
                        Get Summary gives an estimate of exposure for your selected
                        analysis inputs.
                      </p>
                      <p className="mb-0">
                        Advanced planning can be available upon request. Select the
                        services you need and use the details box to describe your request,
                        assumptions, location, and expected output.
                      </p>
                    </div>
                  )}
                </div>

                <section>
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <div className="fw-semibold">Load Watershed</div>
                    <div className="btn-group" role="group" aria-label="Watershed source">
                      <button
                        type="button"
                        className={rowButtonClass(watershedSource === "upload")}
                        onClick={() => setWatershedSource("upload")}
                      >
                        New
                      </button>
                      <button
                        type="button"
                        className={rowButtonClass(watershedSource === "dashboard")}
                        onClick={() => setWatershedSource("dashboard")}
                        disabled={!canUseDashboardWatersheds}
                      >
                        Import from Dashboard
                      </button>
                    </div>
                  </div>

                  {watershedSource === "upload" ? (
                    <input
                      key={watershedInputKey}
                      className="form-control"
                      type="file"
                      accept=".gpkg,.geojson,.json"
                      onChange={handleWatershedFileChange}
                    />
                  ) : (
                    <div className="small text-muted">
                      {canUseDashboardWatersheds
                        ? `${availableDashboardWatersheds.length} watershed layer(s) available from the dashboard.`
                        : "No watershed is available on the dashboard yet."}
                    </div>
                  )}

                  {watershedFileName && (
                    <div className="d-flex align-items-center justify-content-between gap-2 small mt-2">
                      <span>Selected file: {watershedFileName}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-0 px-2"
                        aria-label="Remove selected watershed"
                        onClick={clearUploadedWatershed}
                      >
                        x
                      </button>
                    </div>
                  )}
                  {watershedUploadError && (
                    <div className="small text-danger mt-2">{watershedUploadError}</div>
                  )}
                </section>

                <section>
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <div className="fw-semibold">Load Flood Extent</div>
                    <div className="btn-group" role="group" aria-label="Flood raster source">
                      <button
                        type="button"
                        className={rowButtonClass(floodRasterSource === "upload")}
                        onClick={() => setFloodRasterSource("upload")}
                      >
                        New
                      </button>
                      <button
                        type="button"
                        className={rowButtonClass(floodRasterSource === "dashboard")}
                        onClick={() => setFloodRasterSource("dashboard")}
                        disabled={!dashboardFloodRasterAvailable}
                      >
                        Import from Dashboard
                      </button>
                    </div>
                  </div>

                  {floodRasterSource === "upload" ? (
                    <input
                      key={floodExtentInputKey}
                      className="form-control"
                      type="file"
                      accept=".geojson,.json,.tif,.tiff,.img"
                      onChange={handleFloodExtentFileChange}
                    />
                  ) : (
                    <div className="small text-muted">
                      {dashboardFloodRasterAvailable
                        ? "Flood raster is available from the dashboard."
                        : "Dashboard flood raster is unavailable, so this option is disabled."}
                    </div>
                  )}

                  {floodRasterFileName && (
                    <div className="d-flex align-items-center justify-content-between gap-2 small mt-2">
                      <span>Selected file: {floodRasterFileName}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-0 px-2"
                        aria-label="Remove selected flood extent"
                        onClick={clearUploadedFloodExtent}
                      >
                        x
                      </button>
                    </div>
                  )}
                  {floodExtentUploadError && (
                    <div className="small text-danger mt-2">
                      {floodExtentUploadError}
                    </div>
                  )}
                </section>

                <section>
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <div className="fw-semibold">Load Building</div>
                  </div>
                  <input
                    key={buildingInputKey}
                    className="form-control"
                    type="file"
                    accept=".gpkg,.geojson,.json"
                    onChange={handleBuildingFileChange}
                  />
                  {buildingFileName && (
                    <div className="d-flex align-items-center justify-content-between gap-2 small mt-2">
                      <span>Selected file: {buildingFileName}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-0 px-2"
                        aria-label="Remove selected building layer"
                        onClick={clearUploadedBuilding}
                      >
                        x
                      </button>
                    </div>
                  )}
                  {buildingUploadError && (
                    <div className="small text-danger mt-2">{buildingUploadError}</div>
                  )}
                </section>

                <section>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <div className="fw-semibold">Other Infrastructure</div>
                    <input
                      className="form-control form-control-sm"
                      type="text"
                      placeholder="Infrastructure name"
                      style={{ width: "220px", flex: "0 0 220px" }}
                      value={otherInfrastructureName}
                      onChange={(event) => setOtherInfrastructureName(event.target.value)}
                    />
                  </div>
                  <input
                    key={otherInfrastructureInputKey}
                    className="form-control"
                    type="file"
                    accept=".gpkg,.geojson,.json"
                    onChange={handleOtherInfrastructureFileChange}
                  />
                  {otherInfrastructureFileName && (
                    <div className="d-flex align-items-center justify-content-between gap-2 small mt-2">
                      <span>
                        Selected
                        {otherInfrastructureName.trim()
                          ? ` ${otherInfrastructureName.trim()}`
                          : " infrastructure"}
                        : {otherInfrastructureFileName}
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary py-0 px-2"
                        aria-label="Remove selected infrastructure layer"
                        onClick={clearUploadedOtherInfrastructure}
                      >
                        x
                      </button>
                    </div>
                  )}
                  {otherInfrastructureUploadError && (
                    <div className="small text-danger mt-2">
                      {otherInfrastructureUploadError}
                    </div>
                  )}
                </section>

                <div className="d-flex gap-2 pt-2">
                  <button type="button" className="btn btn-primary flex-fill">
                    Get Summary
                  </button>
                  <button type="button" className="btn btn-outline-primary flex-fill">
                    Download GPKG
                  </button>
                </div>

                <section className="pt-2 border-top">
                  <button
                    type="button"
                    className="btn d-flex align-items-center justify-content-between bg-dark text-white rounded px-3 mb-3 w-100 border-0"
                    style={{ minHeight: "48px" }}
                    aria-expanded={isAdvancedPlanningOpen}
                    aria-controls="advancedPlanningContent"
                    onClick={() =>
                      setIsAdvancedPlanningOpen((isOpen) => !isOpen)
                    }
                  >
                    <h3 className="h6 mb-0">Advanced Planning</h3>
                    <span aria-hidden="true" style={{ fontSize: "1rem" }}>
                      {isAdvancedPlanningOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isAdvancedPlanningOpen && (
                    <div id="advancedPlanningContent">
                      <div className="d-flex flex-column gap-2">
                        <label className="form-check border rounded px-3 py-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={advancedOptions.delineateInfrastructure}
                            onChange={() =>
                              toggleAdvancedOption("delineateInfrastructure")
                            }
                          />
                          <span className="form-check-label">
                            Delineate infrastructure with AI model
                          </span>
                        </label>

                        <label className="form-check border rounded px-3 py-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={advancedOptions.costAnalysis}
                            onChange={() => toggleAdvancedOption("costAnalysis")}
                          />
                          <span className="form-check-label">Cost Analysis</span>
                        </label>

                        <label className="form-check border rounded px-3 py-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={advancedOptions.agentBasedModel}
                            onChange={() => toggleAdvancedOption("agentBasedModel")}
                          />
                          <span className="form-check-label">Agent Based Model</span>
                        </label>
                      </div>

                      <div className="mt-3">
                        <label
                          htmlFor="advancedPlanningDetails"
                          className="form-label fw-semibold"
                        >
                          Details
                        </label>
                        <textarea
                          id="advancedPlanningDetails"
                          className="form-control"
                          rows={4}
                          placeholder="Add any extra instructions or planning details here."
                          value={advancedDetails}
                          onChange={(event) => setAdvancedDetails(event.target.value)}
                        />
                      </div>

                      <button type="button" className="btn btn-primary w-100 mt-3">
                        Send Request
                      </button>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8 col-xl-9">
            <div className="card shadow-sm h-100 overflow-hidden">
              <div className="flex-grow-1" style={{ minHeight: "420px" }}>
                <MapContainer
                  center={[0, 20]}
                  zoom={4}
                  style={{ width: "100%", height: "100%" }}
                >
                  <LayersControl position="topright">
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
                  <FitToLayers layers={mapWatersheds} />

                  {mapWatersheds.map(
                    (layer) =>
                      layer.geojsonData && (
                        <GeoJSON
                          key={layer.id}
                          data={layer.geojsonData as GeoJSON.GeoJsonObject}
                          style={() => watershedStyle}
                        />
                      )
                  )}
                  {uploadedBuilding && (
                    <GeoJSON
                      key={uploadedBuilding.id}
                      data={uploadedBuilding.geojsonData}
                      style={() => buildingStyle}
                    />
                  )}
                  {uploadedFloodExtent && (
                    <GeoJSON
                      key={uploadedFloodExtent.id}
                      data={uploadedFloodExtent.geojsonData}
                      style={() => floodExtentStyle}
                    />
                  )}
                  {uploadedOtherInfrastructure && (
                    <GeoJSON
                      key={uploadedOtherInfrastructure.id}
                      data={uploadedOtherInfrastructure.geojsonData}
                      style={() => infrastructureStyle}
                    />
                  )}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningPage;
