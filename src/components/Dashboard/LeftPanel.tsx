// src/components/LeftPanel.tsx
import React from "react";

const LeftPanel = () => {
  return (
    <div className="d-flex flex-column h-100 gap-2">
      {/* top box */}
      <div className="p-3 border border-primary border-2 rounded flex-grow-1">
        <h4 className="hydro-title fw-bold">HYDROLOGICAL INFO</h4>
        <p style={{ fontSize: 20, opacity: 0.5, fontWeight: "bold" }}>
          Click on a station marker to plot its precipitation forecast
        </p>
      </div>

      {/* bottom box */}
      <div className="p-0 border border-primary border-2 rounded flex-grow-1">
        <iframe
          title="Windy Precipitation"
          width="100%"
          height="100%"
          src="https://embed.windy.com/embed2.html?lat=2&lon=20&zoom=3&level=surface&overlay=rain&menu=&message=&marker=&calendar=now"
          style={{
            border: "none",
            borderRadius: "0.5rem",
            width: "100%",
            height: "100%",
            flex: 1,
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default LeftPanel;
