// src/components/LeftPanel.tsx
import React from "react";

const LeftPanel = () => {
  return (
    <div className="d-flex flex-column h-100 gap-2">
      {/* top box */}
      <div className="p-3 border border-primary border-2 rounded flex-grow-1">
        <h4 className="hydro-title fw-bold">HYDROLOGICAL INFO</h4>
        <p>
          Cliquer sur une ville afin de créer une courbe des précipitations
        </p>
      </div>

      {/* bottom box */}
      <div className="p-3 border border-primary border-2 rounded flex-grow-1">
        <img
          src="/your_streamflow_graph.png"
          alt="Streamflow Graph"
          className="img-fluid w-100 h-100"
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default LeftPanel;
