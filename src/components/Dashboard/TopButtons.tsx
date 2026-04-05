import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import ScenarioPanel from "./ScenarioPanel";
import NotesPanel from "./NotesPanel";
import type { ViewMode } from "../../App";

interface TopButtonsProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  mode: ViewMode;
  setMode: React.Dispatch<React.SetStateAction<ViewMode>>;
}

const TopButtons: React.FC<TopButtonsProps> = ({
  darkMode,
  setDarkMode,
  mode,
  setMode,
}) => {
  const isMobile = window.innerWidth <= 768;
  const [thresholds, setThresholds] = useState({ medium: 40, high: 80 });
  const [showScenarioPanel, setShowScenarioPanel] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const currentDate = new Date().toISOString().split("T")[0];

  const buttonStyle = { minWidth: "180px" };

  const renderButtons = () => (
    <>
      <div>
        <button className="btn btn-info fw-bold w-100" style={buttonStyle}>
          DATE: {currentDate}
        </button>
      </div>
      <div style={{ position: "relative" }}>
        <button
          className="btn btn-info fw-bold w-100"
          style={buttonStyle}
          onClick={() => setShowNotesPanel(!showNotesPanel)}
        >
          DISPLAY NOTES
        </button>
        {showNotesPanel && (
          <NotesPanel onClose={() => setShowNotesPanel(false)} />
        )}
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
    <div className="container-fluid mt-3 mb-2">
      <div className="row row-cols-auto g-2 justify-content-center flex-wrap">
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
                  setShowNotesPanel(true);
                }}
              >
                DISPLAY NOTES
              </Dropdown.Item>
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
