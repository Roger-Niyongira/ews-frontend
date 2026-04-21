import React, { useMemo, useState } from "react";
import { GeoJSON, LayersControl, MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { ProjectGeoJsonLayer } from "../App";

interface PlanningPageProps {
  projectName: string | null;
  dashboardWatersheds: ProjectGeoJsonLayer[];
  dashboardFloodRasterAvailable: boolean;
}

type DataSource = "upload" | "dashboard";

const PlanningPage: React.FC<PlanningPageProps> = ({
  projectName,
  dashboardWatersheds,
  dashboardFloodRasterAvailable,
}) => {
  const [watershedSource, setWatershedSource] = useState<DataSource>("upload");
  const [floodRasterSource, setFloodRasterSource] = useState<DataSource>("upload");
  const [watershedFileName, setWatershedFileName] = useState<string | null>(null);
  const [floodRasterFileName, setFloodRasterFileName] = useState<string | null>(null);
  const [buildingFileName, setBuildingFileName] = useState<string | null>(null);
  const [otherInfrastructureName, setOtherInfrastructureName] = useState("");
  const [otherInfrastructureFileName, setOtherInfrastructureFileName] = useState<
    string | null
  >(null);
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

  const mapWatersheds = useMemo(
    () =>
      watershedSource === "dashboard" && canUseDashboardWatersheds
        ? availableDashboardWatersheds
        : [],
    [availableDashboardWatersheds, canUseDashboardWatersheds, watershedSource]
  );

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
                        width: "28px",
                        height: "28px",
                        padding: 0,
                        backgroundColor: "#0d6efd",
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
                        GeoJSON, JSON, and CSV. Flood rasters can be loaded as TIF, TIFF,
                        or IMG files.
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
                      className="form-control"
                      type="file"
                      accept=".gpkg,.geojson,.json"
                      onChange={(event) =>
                        setWatershedFileName(event.target.files?.[0]?.name ?? null)
                      }
                    />
                  ) : (
                    <div className="small text-muted">
                      {canUseDashboardWatersheds
                        ? `${availableDashboardWatersheds.length} watershed layer(s) available from the dashboard.`
                        : "No watershed is available on the dashboard yet."}
                    </div>
                  )}

                  {watershedFileName && (
                    <div className="small mt-2">Selected file: {watershedFileName}</div>
                  )}
                </section>

                <section>
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <div className="fw-semibold">Load Flood Raster</div>
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
                      className="form-control"
                      type="file"
                      accept=".tif,.tiff,.img"
                      onChange={(event) =>
                        setFloodRasterFileName(event.target.files?.[0]?.name ?? null)
                      }
                    />
                  ) : (
                    <div className="small text-muted">
                      {dashboardFloodRasterAvailable
                        ? "Flood raster is available from the dashboard."
                        : "Dashboard flood raster is unavailable, so this option is disabled."}
                    </div>
                  )}

                  {floodRasterFileName && (
                    <div className="small mt-2">Selected file: {floodRasterFileName}</div>
                  )}
                </section>

                <section>
                  <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                    <div className="fw-semibold">Load Building</div>
                  </div>
                  <input
                    className="form-control"
                    type="file"
                    accept=".geojson,.json,.gpkg,.csv"
                    onChange={(event) =>
                      setBuildingFileName(event.target.files?.[0]?.name ?? null)
                    }
                  />
                  {buildingFileName && (
                    <div className="small mt-2">Selected file: {buildingFileName}</div>
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
                    className="form-control"
                    type="file"
                    accept=".geojson,.json,.gpkg,.csv,.tif,.tiff"
                    onChange={(event) =>
                      setOtherInfrastructureFileName(
                        event.target.files?.[0]?.name ?? null
                      )
                    }
                  />
                  {otherInfrastructureFileName && (
                    <div className="small mt-2">
                      Selected
                      {otherInfrastructureName.trim()
                        ? ` ${otherInfrastructureName.trim()}`
                        : " infrastructure"}
                      : {otherInfrastructureFileName}
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

                  {mapWatersheds.map(
                    (layer) =>
                      layer.geojsonData && (
                        <GeoJSON
                          key={layer.id}
                          data={layer.geojsonData as GeoJSON.GeoJsonObject}
                          style={() => ({
                            color: "#0d6efd",
                            weight: 3,
                            opacity: 1,
                            fillColor: "#9be7ff",
                            fillOpacity: 0.3,
                          })}
                        />
                      )
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
