import React from "react";

const facts = [
  {
    label: "Weather-related risk",
    text: "Half of all recorded disasters over a 50-year period were weather-related.",
    href: "https://wmo.int/topics/early-warning-system",
  },
  {
    label: "Earlier warnings matter",
    text: "Disaster damage can be reduced by 30% with a 24-hour early warning.",
    href: "https://wmo.int/topics/early-warning-system",
  },
  {
    label: "Avoided losses",
    text: "Early warning systems can help avoid US $3-16 billion per year of losses globally.",
    href: "https://wmo.int/topics/early-warning-system",
  },
];

const pillars = [
  "Disaster risk knowledge and management",
  "Detection, observation, monitoring, analysis, and forecasting",
  "Warning dissemination and communication",
  "Preparedness and response capabilities",
];

const AboutPage = () => {
  return (
    <div className="w-100" style={{ backgroundColor: "#f4f7f9", minHeight: "100%" }}>
      <div
        className="container-fluid py-4 py-lg-5 mx-auto"
        style={{ maxWidth: "1180px" }}
      >
        <section
          className="rounded-4 p-4 p-lg-5 mb-4"
          style={{
            background:
              "linear-gradient(135deg, #102332 0%, #174863 55%, #1f7a8c 100%)",
            color: "#ffffff",
          }}
        >
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <div className="text-uppercase fw-semibold small mb-2">
                Early Warning System
              </div>
              <h1 className="fw-bold mb-3">About the Early Warning System</h1>
              <p className="lead mb-0" style={{ maxWidth: "760px" }}>
                The EWS helps communities and decision-makers monitor climate and
                flood risks, understand exposure, and prepare earlier for
                hazardous events.
              </p>
            </div>
            <div className="col-lg-4">
              <div
                className="rounded-4 p-3 h-100"
                style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              >
                <div className="fw-semibold mb-2">Focus areas</div>
                <div className="d-flex flex-nowrap gap-2">
                  <span className="badge text-bg-light">Flooding</span>
                  <span className="badge text-bg-light">Drought</span>
                  <span className="badge text-bg-light">Risk planning</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="row g-3 mb-4">
          {facts.map((fact) => (
            <div className="col-md-4" key={fact.label}>
              <a
                className="d-block h-100 text-decoration-none text-dark"
                href={fact.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="h-100 bg-white border rounded-4 p-3 shadow-sm">
                  <div className="fw-bold mb-2">{fact.label}</div>
                  <p className="mb-0 text-muted">{fact.text}</p>
                </div>
              </a>
            </div>
          ))}
        </section>

        <section className="row g-4 align-items-start mb-4">
          <div className="col-lg-7">
            <div className="bg-white border rounded-4 p-4 shadow-sm h-100">
              <h2 className="h4 fw-bold mb-3">Why this project exists</h2>
              <p>
                Natural hazards such as floods, droughts, and hurricanes are becoming
                more frequent and intense under climate change. These hazards can
                severely affect lives, infrastructure, and local economies, especially
                in developing countries and vulnerable communities.
              </p>
              <p>
                This platform is being developed to support timely alerts,
                risk-informed planning, and practical decision support before and
                during emergency conditions.
              </p>
              <p className="mb-0">
                The work is informed by the United Nations&apos;{" "}
                <a
                  href="https://www.un.org/en/climatechange/early-warnings-for-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Early Warnings for All
                </a>{" "}
                initiative and its four-pillar framework.
              </p>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="bg-white border rounded-4 p-4 shadow-sm h-100">
              <h2 className="h4 fw-bold mb-3">Four pillars</h2>
              <div className="d-flex flex-column gap-2">
                {pillars.map((pillar, index) => (
                  <div
                    className="d-flex gap-3 rounded-3 p-3"
                    style={{ backgroundColor: "#f4f7f9" }}
                    key={pillar}
                  >
                    <div
                      className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: "#1f7a8c",
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>{pillar}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="row g-4">
          <div className="col-lg-6">
            <figure className="bg-white border rounded-4 p-3 shadow-sm h-100 mb-0">
              <img
                src={process.env.PUBLIC_URL + "/flood_Tchad.png"}
                alt="Flood event in Djamena, Chad"
                className="img-fluid rounded-3"
              />
              <figcaption className="text-muted mt-3 mb-0">
                2022 flood event in Djamena, Chad (
                <a
                  href="https://news.un.org/en/story/2022/08/1125562"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source: United Nations
                </a>
                )
              </figcaption>
            </figure>
          </div>

          <div className="col-lg-6">
            <figure className="bg-white border rounded-4 p-3 shadow-sm h-100 mb-0">
              <img
                src={process.env.PUBLIC_URL + "/UN_pillars_for_ews.png"}
                alt="United Nations early warning system pillars"
                className="img-fluid rounded-3"
              />
              <figcaption className="text-muted mt-3 mb-0">
                The four pillars of an effective EWS (
                <a
                  href="https://www.un.org/en/climatechange/early-warnings-for-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source: United Nations
                </a>
                )
              </figcaption>
            </figure>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
