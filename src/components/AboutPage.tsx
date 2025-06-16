import React from "react";

const AboutPage = () => {
  return (
    <div className="container py-3 ">
      {/* Sidebar-style Section */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="bg-light p-5 m border rounded">
            <h4 className="fw-bold text-dark">Did You Know?</h4>
            <ul className="list-unstyled ps-2">
              <li className="mb-2">
                🕐{" "}
                <a
                  href="https://wmo.int/topics/early-warning-system"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Half of all recorded disasters over a 50-year period were
                  weather-related.
                </a>
              </li>
              <li className="mb-2">
                📢{" "}
                <a
                  href="https://wmo.int/topics/early-warning-system"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Disaster damage can be reduced by 30% with a 24-hour early
                  warning.
                </a>
              </li>
              <li className="mb-2">
                🌍{" "}
                <a
                  href="https://wmo.int/topics/early-warning-system"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  An early warning system can help avoid US $3–16 billion per
                  year of losses globally.
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9">
          <h1 className="text-center fw-bold">
            Welcome to the Early Warning System (EWS) Page
          </h1>

          <div className="mt-4">
            <h2 className="text-primary">About the Project</h2>
            <p>
              Natural hazards such as floods, droughts, and hurricanes are
              becoming increasingly frequent and intense due to climate change.
              These hazards cause devastating impacts on lives,
              infrastructure, and economies, especially in developing countries
              and communities, thus resulting in natural disasters. Our goal is to reduce disaster risks
              with an effective <strong>Early Warning System (EWS)</strong>,
              designed based on the United Nations'{" "}
              <a
                href="https://www.un.org/en/climatechange/early-warnings-for-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                Four Pillars of Early Warnings for All
              </a>
              : disaster risk knowledge and management, detection, observation,
              monitoring, analysis, and forecasting, warning dissemination and
              communication, preparedness and response capabilities.
            </p>
          </div>

          {/* Bootstrap Grid for Content */}
          <div className="row mt-4 align-items-start">
            {/* Left Column */}
            <div className="col-md-6">
              <p>
                Our Early Warning System is being developed to empower
                communities with timely alerts and critical information during
                emergencies. By harnessing the power of real-time data, our
                system aims to provide early notifications for natural disasters
                related to flooding and drought.
              </p>
              <p>
                This initiative is not only designed to inform but also to guide
                communities on how to prepare and respond effectively during
                emergencies. With user-friendly dashboards and decision-support
                tools, our EWS serves to enhance community resilience and
                safety.
              </p>

              <div className="text-center">
                <img
                  src={process.env.PUBLIC_URL + "/flood_Tchad.png"}
                  alt="Flood Djamena"
                  className="img-fluid"
                />
                <div className="text-muted mt-2" style={{ fontSize: "16px" }}>
                  2022 Flood Event in Djamena, Tchad (
                  <a
                    href="https://news.un.org/en/story/2022/08/1125562"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source: United Nations
                  </a>
                  )
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-md-6 text-center">
              <img
                src={process.env.PUBLIC_URL + "/UN_pillars_for_ews.png"}
                alt="United Nations' EWS Pillars"
                className="img-fluid"
              />
              <div className="text-muted mt-2" style={{ fontSize: "16px" }}>
                The Four Pillars of an Effective EWS (
                <a
                  href="https://www.un.org/en/climatechange/early-warnings-for-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source: United Nations
                </a>
                )
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
