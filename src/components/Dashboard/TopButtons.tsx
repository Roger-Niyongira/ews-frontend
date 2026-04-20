import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";

interface TopButtonsProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  currentProjectName: string | null;
  showClimateZones: boolean;
  setShowClimateZones: React.Dispatch<React.SetStateAction<boolean>>;

  showFloodMap: boolean;
  setShowFloodMap: React.Dispatch<React.SetStateAction<boolean>>;
  showPrecipitations: boolean;
  setShowPrecipitations: React.Dispatch<React.SetStateAction<boolean>>;
  showWatersheds: boolean;
  setShowWatersheds: React.Dispatch<React.SetStateAction<boolean>>;
  floodMapStatus: "public" | "private" | "none";
  userCanAccessFloodMap: boolean;
  watershedStatus: "public" | "private" | "none";
  userCanAccessWatersheds: boolean;
  onLoginClick: () => void;
}

const TopButtons: React.FC<TopButtonsProps> = ({
  darkMode,
  setDarkMode,
  currentProjectName,
  showClimateZones,
  setShowClimateZones,

  showFloodMap,
  setShowFloodMap,
  showPrecipitations,
  setShowPrecipitations,
  showWatersheds,
  setShowWatersheds,
  floodMapStatus,
  userCanAccessFloodMap,
  watershedStatus,
  userCanAccessWatersheds,
  onLoginClick,
}) => {
  const isMobile = window.innerWidth <= 768;
  const [showInfoMenu, setShowInfoMenu] = useState(false);

  const buttonStyle = {
    minWidth: "150px",
    padding: "0.35rem 0.75rem",
    fontSize: "0.9rem",
    lineHeight: "1.2",
    whiteSpace: "nowrap" as const,
  };

  const showFloodMapUnavailableMessage = () => {
    Swal.fire({
      icon: "info",
      html: `
        <p>
          Flood maps are not available yet. Please
          <a href="#/contact" id="availability-contact-link">contact us</a>
          for more information or
          <a href="#" id="availability-login-link">login</a>
          for your specific region.
        </p>
      `,
      confirmButtonText: "Close",
      didOpen: () => {
        const contactLink = document.getElementById("availability-contact-link");
        const loginLink = document.getElementById("availability-login-link");

        contactLink?.addEventListener("click", () => {
          Swal.close();
        });

        loginLink?.addEventListener("click", (event) => {
          event.preventDefault();
          Swal.close();
          onLoginClick();
        });
      },
    });
  };

  const showWatershedUnavailableMessage = () => {
    Swal.fire({
      icon: "info",
      html: `
        <p>
          Watershed layers are not available yet. Please
          <a href="#/contact" id="availability-contact-link">contact us</a>
          for more information or
          <a href="#" id="availability-login-link">login</a>
          for your specific region.
        </p>
      `,
      confirmButtonText: "Close",
      didOpen: () => {
        const contactLink = document.getElementById("availability-contact-link");
        const loginLink = document.getElementById("availability-login-link");

        contactLink?.addEventListener("click", () => {
          Swal.close();
        });

        loginLink?.addEventListener("click", (event) => {
          event.preventDefault();
          Swal.close();
          onLoginClick();
        });
      },
    });
  };

  const renderButtons = () => (
    <>
      {currentProjectName && (
        <div>
          <button className="btn btn-outline-light fw-bold w-100" style={buttonStyle}>
            PROJECT: {currentProjectName}
          </button>
        </div>
      )}
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
              showFloodMapUnavailableMessage();
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
      <div>
        <button
          className={`btn ${showPrecipitations ? "btn-warning" : "btn-info"} fw-bold w-100`}
          style={buttonStyle}
          onClick={() => setShowPrecipitations((v) => !v)}
        >
          {showPrecipitations ? "HIDE PRECIPITATIONS" : "VIEW PRECIPITATIONS"}
        </button>
      </div>
      <div>
        <button
          className={`btn ${showWatersheds ? "btn-warning" : "btn-info"} fw-bold w-100`}
          style={buttonStyle}
          onClick={() => {
            if (watershedStatus === "none") {
              showWatershedUnavailableMessage();
              return;
            }

            if (watershedStatus === "private" && !userCanAccessWatersheds) {
              alert("You do not have access to these watershed layers");
              return;
            }

            setShowWatersheds((v) => !v);
          }}
        >
          {showWatersheds ? "HIDE WATERSHEDS" : "VIEW WATERSHEDS"}
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
        className="d-flex flex-nowrap gap-2 overflow-auto overflow-lg-visible justify-content-lg-center pb-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {isMobile ? (
          <Dropdown
            show={showInfoMenu}
            onToggle={(nextShow) => setShowInfoMenu(nextShow)}
          >
            <Dropdown.Toggle
              className="btn btn-info fw-bold"
              style={buttonStyle}
              onClick={() => setShowInfoMenu((open) => !open)}
              onTouchEnd={(e) => {
                e.preventDefault();
                setShowInfoMenu((open) => !open);
              }}
            >
              ☰ INFO
            </Dropdown.Toggle>
            <Dropdown.Menu
              popperConfig={{ strategy: "fixed" }}
              renderOnMount
              style={{ zIndex: 1080 }}
            >
              {currentProjectName && (
                <Dropdown.Item as="span" className="text-muted small">
                  PROJECT: {currentProjectName}
                </Dropdown.Item>
              )}
              <Dropdown.Item as="span" className="text-muted small">
                LAST UPDATE: Loading...
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => {
                  setShowInfoMenu(false);
                  setShowClimateZones((v) => !v);
                }}
              >
                {showClimateZones ? "HIDE CLIMATE ZONES" : "SHOW CLIMATE ZONES"}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => {
                  setShowInfoMenu(false);
                  if (floodMapStatus === "none") {
                    showFloodMapUnavailableMessage();
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
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => {
                  setShowInfoMenu(false);
                  setShowPrecipitations((v) => !v);
                }}
              >
                {showPrecipitations ? "HIDE PRECIPITATIONS" : "VIEW PRECIPITATIONS"}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => {
                  setShowInfoMenu(false);
                  if (watershedStatus === "none") {
                    showWatershedUnavailableMessage();
                    return;
                  }

                  if (watershedStatus === "private" && !userCanAccessWatersheds) {
                    alert("You do not have access to these watershed layers");
                    return;
                  }

                  setShowWatersheds((v) => !v);
                }}
              >
                {showWatersheds ? "HIDE WATERSHEDS" : "VIEW WATERSHEDS"}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => {
                  setShowInfoMenu(false);
                  setDarkMode((d) => !d);
                }}
              >
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
