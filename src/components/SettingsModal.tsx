import React, { useEffect, useMemo, useState } from "react";
import type { ClimateThresholds } from "../App";

interface SettingsModalProps {
  onClose: () => void;
  thresholds: ClimateThresholds;
  defaultThresholds: ClimateThresholds;
  onApply: (thresholds: ClimateThresholds) => void;
  onReset: () => void;
}

type EditorMode = "global" | "custom";

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  thresholds,
  defaultThresholds,
  onApply,
  onReset,
}) => {
  const zoneNames = useMemo(
    () =>
      Array.from(
        new Set([
          ...Object.keys(defaultThresholds),
          ...Object.keys(thresholds),
        ])
      ).sort(),
    [defaultThresholds, thresholds]
  );
  const [mode, setMode] = useState<EditorMode>("global");
  const [draftThresholds, setDraftThresholds] = useState<ClimateThresholds>({});
  const [globalThresholds, setGlobalThresholds] = useState({
    green: 0,
    orange: 0,
  });

  useEffect(() => {
    setDraftThresholds(thresholds);
    const firstZone = zoneNames[0];
    const baseThreshold = firstZone
      ? thresholds[firstZone] ?? defaultThresholds[firstZone]
      : { green: 0, orange: 0 };

    setGlobalThresholds({
      green: baseThreshold?.green ?? 0,
      orange: baseThreshold?.orange ?? 0,
    });
  }, [defaultThresholds, thresholds, zoneNames]);

  const handleZoneThresholdChange = (
    zone: string,
    field: "green" | "orange",
    value: string
  ) => {
    const numericValue = Number(value);

    setDraftThresholds((current) => ({
      ...current,
      [zone]: {
        green: current[zone]?.green ?? defaultThresholds[zone]?.green ?? 0,
        orange: current[zone]?.orange ?? defaultThresholds[zone]?.orange ?? 0,
        [field]: Number.isFinite(numericValue) ? numericValue : 0,
      },
    }));
  };

  const handleSave = () => {
    if (mode === "global") {
      const nextThresholds = zoneNames.reduce<ClimateThresholds>((acc, zone) => {
        acc[zone] = {
          green: globalThresholds.green,
          orange: globalThresholds.orange,
        };
        return acc;
      }, {});
      onApply(nextThresholds);
      return;
    }

    onApply(draftThresholds);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.55)", zIndex: 2050 }}
    >
      <div
        className="bg-white rounded shadow-lg w-100"
        style={{ maxWidth: "860px", maxHeight: "90vh", overflow: "auto" }}
      >
        <div className="d-flex justify-content-between align-items-start p-4 border-bottom">
          <div>
            <p className="text-uppercase text-primary fw-semibold small mb-2">
              Settings
            </p>
            <h3 className="mb-2">Climate Threshold Preferences</h3>
            <p className="text-muted mb-0">
              Update thresholds temporarily for scenario visuals. Refreshing the
              page will restore the backend defaults.
            </p>
          </div>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="p-4">
          <div className="d-flex flex-column flex-md-row gap-3 mb-4">
            <button
              type="button"
              className={`btn ${mode === "global" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setMode("global")}
            >
              Apply to All Climate Zones
            </button>
            <button
              type="button"
              className={`btn ${mode === "custom" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setMode("custom")}
            >
              Customize Each Climate Zone
            </button>
          </div>

          {zoneNames.length === 0 ? (
            <div className="alert alert-warning mb-0">
              Threshold data is not available yet, so there is nothing to edit.
            </div>
          ) : mode === "global" ? (
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="global-green" className="form-label fw-semibold">
                  Green Threshold (mm)
                </label>
                <input
                  id="global-green"
                  type="number"
                  className="form-control form-control-lg"
                  value={globalThresholds.green}
                  onChange={(e) =>
                    setGlobalThresholds((current) => ({
                      ...current,
                      green: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="global-orange" className="form-label fw-semibold">
                  Orange Threshold (mm)
                </label>
                <input
                  id="global-orange"
                  type="number"
                  className="form-control form-control-lg"
                  value={globalThresholds.orange}
                  onChange={(e) =>
                    setGlobalThresholds((current) => ({
                      ...current,
                      orange: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="col-12">
                <p className="mb-0" style={{ color: "#dc3545" }}>
                  Saving in this mode applies the same green and orange thresholds
                  to every climate zone.
                </p>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Climate Zone</th>
                    <th>Green Threshold (mm)</th>
                    <th>Orange Threshold (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {zoneNames.map((zone) => (
                    <tr key={zone}>
                      <td className="fw-semibold">{zone}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={draftThresholds[zone]?.green ?? 0}
                          onChange={(e) =>
                            handleZoneThresholdChange(zone, "green", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={draftThresholds[zone]?.orange ?? 0}
                          onChange={(e) =>
                            handleZoneThresholdChange(zone, "orange", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between gap-3 p-4 border-top bg-light">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={onReset}
            disabled={zoneNames.length === 0}
          >
            Reset to Default
          </button>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={zoneNames.length === 0}
            >
              Save Thresholds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
