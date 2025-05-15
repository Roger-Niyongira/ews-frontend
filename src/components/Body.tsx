import React from "react";
import LeftPanel from "./LeftPanel";
import MapPanel from "./MapPanel";

const Body = () => (
  <div className="container-fluid h-100 p-2">
    <div className="row h-100 gx-1 gy-1">
      {/* LeftPanel: collapses on small screens */}
      <div className="d-none d-lg-flex col-lg-4 h-100 overflow-auto">
        <LeftPanel />
      </div>

      {/* MapPanel: full width on small screens, no shrinking */}
      <div className="col-12 col-lg-8 d-flex flex-column h-100 flex-grow-1 flex-shrink-0">
        <MapPanel />
      </div>
    </div>
  </div>
);

export default Body;
