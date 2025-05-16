import React from "react";
import LeftPanel from "./DashboardLeftPanel";
import MapPanel from "./DashboardMapPanel";

const Body = () => (
  <div className="container-fluid h-100 p-2">
    <div className="row h-100 gx-2">
      {/* LeftPanel: hidden on small screens, visible on lg+ */}
      <div className="d-none d-lg-flex col-lg-4 flex-column h-100">
        <LeftPanel />
      </div>

      {/* MapPanel: full width on small screens, 2/3 on lg+ */}
      <div className="col-12 col-lg-8 d-flex flex-column h-100">
        <MapPanel />
      </div>
    </div>
  </div>
);

export default Body;
