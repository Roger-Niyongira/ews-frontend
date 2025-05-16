import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";

interface TopButtonsProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const TopButtons: React.FC<TopButtonsProps> = ({ darkMode, setDarkMode }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
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
          LOCATION: Ottawa [CA]
        </button>
      </div>
      <div>
        <button className="btn btn-info fw-bold w-100" style={buttonStyle}>
          DATE: 2025-05-14
        </button>
      </div>
      <div>
        <button className="btn btn-info fw-bold w-100" style={buttonStyle}>
          DISPLAY NOTES
        </button>
      </div>
      <div>
        <button className="btn btn-info fw-bold w-100" style={buttonStyle}>
          SCENARIOS
        </button>
      </div>
      <div>
        <Dropdown>
          <Dropdown.Toggle className="btn btn-info fw-bold w-100" style={buttonStyle}>
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
    <div className="container-fluid my-3">
      <div className="row row-cols-auto g-2 justify-content-center flex-wrap">
        {isMobile ? (
          <Dropdown>
            <Dropdown.Toggle className="btn btn-info fw-bold" style={buttonStyle}>
              ☰ INFO
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>WARNING LEVEL: LOW</Dropdown.Item>
              <Dropdown.Item>LOCATION: Ottawa [CA]</Dropdown.Item>
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
