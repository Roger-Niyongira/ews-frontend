import React, { useState } from "react";
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
  precipitationAvailable: boolean;
  precipitationLastUpdate: string | null;
  precipitationLoading: boolean;
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
  precipitationAvailable,
  precipitationLastUpdate,
  precipitationLoading,
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

  const showPrecipitationUnavailableMessage = () => {
    Swal.fire({
      icon: "info",
      title: "Precipitations unavailable",
      text: "Precipitation data could not be loaded. Our servers might be updating. Please try again later.",
      confirmButtonText: "Close",
    });
  };

  const formatExactLastUpdate = (date: Date) =>
    date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });

  const formatRelativeLastUpdate = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const absDiffMs = Math.abs(diffMs);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (absDiffMs < minute) {
      return "Just now";
    }

    if (absDiffMs < hour) {
      const minutes = Math.round(absDiffMs / minute);
      return `${minutes}m ago`;
    }

    if (absDiffMs < day) {
      const hours = Math.round(absDiffMs / hour);
      return `${hours}h ago`;
    }

    const days = Math.round(absDiffMs / day);
    return `${days}d ago`;
  };

  const getLastUpdateDisplay = () => {
    if (precipitationLoading) {
      return {
        label: "Loading...",
        title: "Precipitation data is loading",
      };
    }

    if (!precipitationLastUpdate) {
      return {
        label: "Unavailable",
        title: "Last update timestamp is not available",
      };
    }

    const parsedDate = new Date(precipitationLastUpdate);

    if (Number.isNaN(parsedDate.getTime())) {
      return {
        label: precipitationLastUpdate,
        title: precipitationLastUpdate,
      };
    }

    const exactDate = formatExactLastUpdate(parsedDate);

    return {
      label: formatRelativeLastUpdate(parsedDate),
      title: exactDate,
    };
  };

  const lastUpdateDisplay = getLastUpdateDisplay();

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
        <button
          className="btn btn-info fw-bold w-100"
          style={buttonStyle}
          title={lastUpdateDisplay.title}
        >
          LAST UPDATE: {lastUpdateDisplay.label}
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
          {showWatersheds ? "HIDE WATERSHEDS" : "SHOW WATERSHEDS"}
        </button>
      </div>
      <div>
        <button
          className={`btn ${showPrecipitations ? "btn-warning" : "btn-info"} fw-bold w-100`}
          style={buttonStyle}
          onClick={() => {
            if (!precipitationAvailable) {
              showPrecipitationUnavailableMessage();
              return;
            }

            setShowPrecipitations((v) => !v);
          }}
        >
          {showPrecipitations ? "HIDE PRECIPITATIONS" : "SHOW PRECIPITATIONS"}
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
    <div className="container-fluid mt-3 mb-1 position-relative">
      <div
        className="d-flex flex-nowrap gap-2 overflow-auto overflow-lg-visible justify-content-lg-center pb-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {isMobile ? (
          <div>
            <button
              type="button"
              className="btn btn-info fw-bold"
              style={{ ...buttonStyle, touchAction: "manipulation" }}
              aria-expanded={showInfoMenu}
              aria-controls="dashboardInfoMenu"
              onPointerUp={() => setShowInfoMenu((open) => !open)}
            >
              ☰ INFO
            </button>
          </div>
        ) : (
          renderButtons()
        )}
      </div>

      {isMobile && showInfoMenu && (
        <div
          id="dashboardInfoMenu"
          className={`position-absolute border rounded shadow-sm py-1 ${
            darkMode ? "bg-dark border-secondary" : "bg-white"
          }`}
          style={{ zIndex: 1080, top: "100%", left: "0.75rem", minWidth: 230 }}
        >
          {currentProjectName && (
            <div className={`px-3 py-2 small ${darkMode ? "text-light" : "text-muted"}`}>
              PROJECT: {currentProjectName}
            </div>
          )}
          <div
            className={`px-3 py-2 small ${darkMode ? "text-light" : "text-muted"}`}
            title={lastUpdateDisplay.title}
          >
            LAST UPDATE: {lastUpdateDisplay.label}
          </div>
          <button
            type="button"
            className={`dropdown-item ${darkMode ? "text-light" : ""}`}
            onClick={() => {
              setShowInfoMenu(false);
              setShowClimateZones((v) => !v);
            }}
          >
            {showClimateZones ? "HIDE CLIMATE ZONES" : "SHOW CLIMATE ZONES"}
          </button>
          <button
            type="button"
            className={`dropdown-item ${darkMode ? "text-light" : ""}`}
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
          </button>
          <button
            type="button"
            className={`dropdown-item ${darkMode ? "text-light" : ""}`}
            onClick={() => {
              setShowInfoMenu(false);
              if (!precipitationAvailable) {
                showPrecipitationUnavailableMessage();
                return;
              }

              setShowPrecipitations((v) => !v);
            }}
          >
            {showPrecipitations ? "HIDE PRECIPITATIONS" : "VIEW PRECIPITATIONS"}
          </button>
          <button
            type="button"
            className={`dropdown-item ${darkMode ? "text-light" : ""}`}
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
          </button>
          <button
            type="button"
            className={`dropdown-item ${darkMode ? "text-light" : ""}`}
            onClick={() => {
              setShowInfoMenu(false);
              setDarkMode((d) => !d);
            }}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TopButtons;
