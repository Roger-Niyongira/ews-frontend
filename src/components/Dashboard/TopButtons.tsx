import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import ScenarioPanel from "./ScenarioPanel";
import NotesPanel from "./NotesPanel";

interface TopButtonsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const TopButtons: React.FC<TopButtonsProps> = ({ darkMode, setDarkMode }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [location, setLocation] = useState("Loading...");
  const [thresholds, setThresholds] = useState({ medium: 40, high: 80 });
  const [showScenarioPanel, setShowScenarioPanel] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        setLocation(`${data.city} [${data.country_code}]`);
      })
      .catch(() => {
        setLocation("Unknown [--]");
      });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const buttonStyle = { minWidth: "180px" };

  const renderButtons = () => (
    <>
      <div>
        <button className="btn btn-success fw-bold w-100" style={buttonStyle}>
          WARNING LEVEL: LOW
        </button>
      </div>
      <div>
        <button className="btn btn-info fw-bold w-100" style={buttonStyle}>
          LOCATION: {location}
        </button>
      </div>
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
            <Dropdown.Item href="#">Option 1</Dropdown.Item>
            <Dropdown.Item href="#">Option 2</Dropdown.Item>
            <Dropdown.Item href="#">Option 3</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
              <Dropdown.Item>WARNING LEVEL: LOW</Dropdown.Item>
              <Dropdown.Item>LOCATION: {location}</Dropdown.Item>
              <Dropdown.Item>DATE: 2025-05-14</Dropdown.Item>
              <Dropdown.Item>DISPLAY NOTES</Dropdown.Item>
              <Dropdown.Item>SCENARIOS</Dropdown.Item>
              <Dropdown.Item>FILTER SEARCH</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          renderButtons()
        )}
        <div>
          <button
            className="btn btn-dark fw-bold w-100"
            style={buttonStyle}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopButtons;
