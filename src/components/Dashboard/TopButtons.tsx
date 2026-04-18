import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import ScenarioPanel from "./ScenarioPanel";
//import NotesPanel from "./NotesPanel";
import type { ViewMode } from "../../App";


interface TopButtonsProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  mode: ViewMode;
  setMode: React.Dispatch<React.SetStateAction<ViewMode>>;
  showClimateZones: boolean;
  setShowClimateZones: React.Dispatch<React.SetStateAction<boolean>>;

  showFloodMap: boolean;
  setShowFloodMap: React.Dispatch<React.SetStateAction<boolean>>;
  floodMapStatus: "public" | "private" | "none";
  userCanAccessFloodMap: boolean;
}

const TopButtons: React.FC<TopButtonsProps> = ({
  darkMode,
  setDarkMode,
  mode,
  setMode,
  showClimateZones,
  setShowClimateZones,

  showFloodMap,
  setShowFloodMap,
  floodMapStatus,
  userCanAccessFloodMap,
}) => {
  const isMobile = window.innerWidth <= 768;
  const [thresholds, setThresholds] = useState({ medium: 40, high: 80 });
  const [showScenarioPanel, setShowScenarioPanel] = useState(false);
  //const [showNotesPanel, setShowNotesPanel] = useState(false);

  const buttonStyle = {
    minWidth: "150px",
    padding: "0.35rem 0.75rem",
    fontSize: "0.9rem",
    lineHeight: "1.2",
    whiteSpace: "nowrap" as const,
  };

  const renderButtons = () => (
    <>
      <div>
        <button className="btn btn-info fw-bold w-100" style={buttonStyle}>
          LAST UPDATE: Loading...
        </button>
      </div>

      <div>
        <button
          className={`btn ${showClimateZones ? "btn-warning" : "btn-info"} fw-bold w-100`}
          style={buttonStyle}
          onClick={() => setShowClimateZones((v) => !v)}
        >
          {showClimateZones ? "HIDE CLIMATE ZONES" : "SHOW CLIMATE ZONES"}
        </button>
      </div>
      <div>
        <button
          className={`btn ${showFloodMap ? "btn-warning" : "btn-info"} fw-bold w-100`}
          style={buttonStyle}
          onClick={() => {
            if (floodMapStatus === "none") {
              alert("Flood map not available yet. Please contact us for more information.");
              return;
            }

            if (floodMapStatus === "private" && !userCanAccessFloodMap) {
              alert("You do not have access to this flood map");
              return;
            }

            setShowFloodMap((v) => !v);
          }}
        >
          {showFloodMap ? "HIDE FLOOD MAP" : "SHOW FLOOD MAP"}
        </button>
      </div>
      <div style={{ position: "relative" }}>
        <button
          className="btn btn-info fw-bold w-100"
          style={buttonStyle}
          onClick={() => setShowScenarioPanel(!showScenarioPanel)}
        >
          SCENARIOS
        </button>
        {showScenarioPanel && (
          <ScenarioPanel
            onClose={() => setShowScenarioPanel(false)}
            thresholds={thresholds}
            setThresholds={setThresholds}
          />
        )}
      </div>
      <div>
        <Dropdown>
          <Dropdown.Toggle
            className="btn btn-info fw-bold w-100"
            style={buttonStyle}
          >
            FILTER SEARCH
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item href="#">Watershed</Dropdown.Item>
            <Dropdown.Item href="#">Country</Dropdown.Item>
            <Dropdown.Item href="#">Model</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div>
        <button
          className="btn btn-success fw-bold w-100"
          style={buttonStyle}
          onClick={() => setMode(mode === "swat" ? "precip" : "swat")}
        >
          {mode === "swat" ? "VIEW PRECIPITATIONS" : "VIEW SWAT EWS"}
        </button>
      </div>
      <div>
        <button
          className="btn btn-dark fw-bold w-100"
          style={buttonStyle}
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </>
  );

  return (
    <div className="container-fluid mt-3 mb-1">
      <div
        className="d-flex flex-nowrap gap-2 overflow-auto justify-content-lg-center pb-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {isMobile ? (
          <Dropdown>
            <Dropdown.Toggle
              className="btn btn-info fw-bold"
              style={buttonStyle}
            >
              ☰ INFO
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                as="button"
                onClick={() => {
                  setShowScenarioPanel(true);
                }}
              >
                SCENARIOS
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => {
                  setMode(mode === "swat" ? "precip" : "swat");
                }}
              >
                {mode === "swat" ? "VIEW PRECIPITATIONS" : "VIEW SWAT EWS"}
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => setDarkMode((d) => !d)}>
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          renderButtons()
        )}
      </div>
    </div>
  );
};

export default TopButtons;
