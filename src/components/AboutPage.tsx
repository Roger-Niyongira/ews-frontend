import React from "react";
import { Link } from "react-router-dom";

// Move these into public/index.html <head> if you'd rather not load fonts at runtime.
const FontLoader = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500&display=swap"
      rel="stylesheet"
    />
  </>
);

// A single animated flow-line, used sparingly at a few section seams as the
// page's one recurring signature — a live data stream, not decoration.
const FlowDivider = ({ tone = "light" }: { tone?: "light" | "dark" }) => (
  <svg
    viewBox="0 0 1200 32"
    preserveAspectRatio="none"
    aria-hidden="true"
    style={{
      display: "block",
      width: "100%",
      height: "26px",
      color: tone === "dark" ? "rgba(141,217,223,0.55)" : "rgba(16,35,49,0.18)",
    }}
  >
    <polyline
      className="flow-divider-line"
      points="0,22 90,18 180,26 260,10 340,6 420,16 520,21 610,8 700,5 790,14 880,19 970,9 1060,16 1140,21 1200,17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const workflow = [
  {
    title: "Build",
    text: "Develop new engineering models or evaluate existing models to define the best operational solution.",
  },
  {
    title: "Operationalize",
    text: "Transform engineering models into reliable operational forecasting and decision-support systems.",
  },
  {
    title: "Deploy",
    text: "Deploy operational solutions through modern web applications, interactive dashboards, and reporting tools.",
  },
];

const AboutPage = () => {
  return (
    <main
      className="w-100"
      style={{
        backgroundColor: "#f8faf9",
        color: "#102331",
        overflowX: "hidden",
      }}
    >
      <FontLoader />
      <style>{`
        .ews-display {
          font-family: 'Space Grotesk', system-ui, sans-serif;
        }
        .ews-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        .flow-divider-line {
          stroke-dasharray: 8 10;
          animation: flowmove 7s linear infinite;
        }
        @keyframes flowmove { to { stroke-dashoffset: -180; } }
        @media (prefers-reduced-motion: reduce) {
          .flow-divider-line { animation: none; }
        }
        @media (min-width: 992px) {
          .py-lg-6 { padding-top: 5.5rem !important; padding-bottom: 5.5rem !important; }
        }
      `}</style>

      {/* HERO */}
      <section
        className="position-relative d-flex align-items-center"
        style={{
          minHeight: "72vh",
          background:
            "linear-gradient(125deg, #071721 0%, #0d3040 48%, #145f70 100%)",
          color: "#ffffff",
          overflow: "hidden",
        }}
      >
        {/* Decorative background elements */}
        <div
          aria-hidden="true"
          className="position-absolute rounded-circle"
          style={{
            width: "620px",
            height: "620px",
            right: "-210px",
            top: "-180px",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        />

        <div
          aria-hidden="true"
          className="position-absolute rounded-circle"
          style={{
            width: "420px",
            height: "420px",
            right: "-80px",
            top: "-80px",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        />

        <div
          aria-hidden="true"
          className="position-absolute"
          style={{
            width: "520px",
            height: "520px",
            right: "6%",
            bottom: "-290px",
            background:
              "radial-gradient(circle, rgba(59,183,193,0.28), rgba(59,183,193,0))",
          }}
        />

        <div
          className="container-fluid position-relative py-5"
          style={{ maxWidth: "1240px", zIndex: 2 }}
        >
          <div className="row align-items-center g-5">
            <div className="col-lg-10 col-xl-9">
              <div
                className="ews-mono text-uppercase fw-semibold mb-4"
                style={{
                  color: "#8dd9df",
                  letterSpacing: "0.16em",
                  fontSize: "0.78rem",
                }}
              >
                Hydrology · Flood Mapping · Forecasting & Geospatial
              </div>

              <h1
                className="ews-display fw-bold mb-4"
                style={{
                  maxWidth: "900px",
                  fontSize: "clamp(3rem, 6.5vw, 6.2rem)",
                  lineHeight: 0.97,
                  letterSpacing: "-0.055em",
                }}
              >
                Turning water models into operational intelligence
              </h1>

              <p
                className="mb-5"
                style={{
                  maxWidth: "690px",
                  color: "rgba(255,255,255,0.76)",
                  fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)",
                  lineHeight: 1.75,
                }}
              >
                We turn static water models and disconnected datasets into
                automated forecasting, flood mapping, and geospatial
                decision-support systems
              </p>

              <div className="d-flex flex-wrap gap-3">
                <a
                  href="#services"
                  className="btn btn-light rounded-3 px-4 py-3 fw-semibold"
                >
                  View Live Platform
                </a>

                <Link
                  to="/contact"
                  className="btn rounded-3 px-4 py-3 fw-semibold"
                  style={{
                    color: "#ffffff",
                    border: "1px solid rgba(255,255,255,0.45)",
                  }}
                >
                  Get in touch
                </Link>
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* DIFFERENTIATOR */}
      <section
        id="services"
        style={{
          backgroundColor: "#edf4f3",
          color: "#102331",
          borderBottom: "1px solid #d4e2e0",
        }}
      >
        <div
          className="container-fluid py-5"
          style={{ maxWidth: "1240px" }}
        >
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div
                className="ews-mono text-uppercase fw-semibold mb-3"
                style={{
                  color: "#1b7783",
                  letterSpacing: "0.14em",
                  fontSize: "0.78rem",
                }}
              >
                What we do
              </div>

              <h2
                className="ews-display fw-bold mb-4"
                style={{
                  fontSize: "clamp(2.8rem, 5vw, 5.2rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.05em",
                }}
              >
                Your model should not stop at the final report
              </h2>

              <p
                className="mb-0"
                style={{
                  maxWidth: "620px",
                  color: "#4b626a",
                  fontSize: "1.2rem",
                  lineHeight: 1.8,
                }}
              >
                We develop hydrologic models and transform existing data and models into operational systems with interactive web dashboards
              </p>
            </div>

            <div className="col-lg-5 offset-lg-1">
              <div
                className="rounded-4 p-4 p-lg-5"
                style={{
                  backgroundColor: "#fbfdfc",
                  border: "1px solid #d1e0de",
                  boxShadow: "0 18px 50px rgba(16,35,49,0.08)",
                }}
              >
                <div
                  className="ews-mono text-uppercase fw-semibold mb-4"
                  style={{
                    color: "#1b7783",
                    letterSpacing: "0.1em",
                    fontSize: "0.78rem",
                  }}
                >
                  What we deliver
                </div>

                <div className="d-flex flex-column gap-3">
                  {[
                    "Flood Early Warning Systems",
                    "Operational Forecasting Platforms",
                    "Geospatial Decision Support Systems"
                  ].map((item) => (
                    <div
                      className="d-flex align-items-center gap-3 rounded-3 px-3 py-3"
                      style={{
                        backgroundColor: "#e5f1f0",
                        border: "1px solid #cfe3e1",
                      }}
                      key={item}
                    >
                      <span
                        className="ews-mono fw-bold"
                        style={{ color: "#1b7783" }}
                      >
                        +
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section style={{ backgroundColor: "#f8faf9" }}>
        <div
          className="container-fluid py-4 py-lg-5"
          style={{ maxWidth: "1240px" }}
        >
          <div
            className="py-5"
            style={{ borderBottom: "1px solid #d8e1df" }}
          >
            <div className="row g-4 align-items-end">
              <div className="col-lg-7">
                <div
                  className="ews-mono text-uppercase fw-semibold mb-3"
                  style={{
                    color: "#1b7783",
                    letterSpacing: "0.14em",
                    fontSize: "0.78rem",
                  }}
                >
                  How we work
                </div>

                <h2
                  className="ews-display d-flex flex-nowrap align-items-center gap-2 gap-md-3 fw-bold mb-0"
                  style={{
                    fontSize: "clamp(1.2rem, 4vw, 3.8rem)",
                    letterSpacing: "-0.045em",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>Build</span>
                  <span
                    className="ews-mono fw-normal"
                    style={{
                      color: "#1b7783",
                      fontSize: "0.62em",
                      letterSpacing: 0,
                    }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                  <span>Operationalize</span>
                  <span
                    className="ews-mono fw-normal"
                    style={{
                      color: "#1b7783",
                      fontSize: "0.62em",
                      letterSpacing: 0,
                    }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                  <span>Deploy</span>
                </h2>
              </div>
            </div>
          </div>

          {workflow.map((step) => (
            <div
              className="row py-4 py-lg-5 align-items-start"
              style={{ borderBottom: "1px solid #d8e1df" }}
              key={step.title}
            >
              <div className="col-lg-5">
                <h3
                  className="ews-display fw-bold mb-3 mb-lg-0"
                  style={{ fontSize: "2rem" }}
                >
                  {step.title}
                </h3>
              </div>

              <div className="col-lg-6 offset-lg-1">
                <p
                  className="mb-0"
                  style={{
                    color: "#4b626a",
                    lineHeight: 1.8,
                    fontSize: "1.08rem",
                  }}
                >
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        style={{
          backgroundColor: "#f8faf9",
        }}
      >
        <div
          className="container-fluid py-5 py-lg-6"
          style={{ maxWidth: "1240px" }}
        >
          <div
            className="rounded-4 p-4 p-md-5"
            style={{
              background:
                "linear-gradient(125deg, #071721 0%, #0d3040 62%, #145f70 100%)",
              color: "#ffffff",
            }}
          >
            <FlowDivider tone="dark" />
            <div className="row align-items-center g-4 g-lg-5 mt-1">
              <div className="col-lg-7">
                <h2
                  className="ews-display fw-bold mb-0"
                  style={{
                    fontSize: "clamp(2.8rem, 5vw, 5.3rem)",
                    lineHeight: 0.98,
                    letterSpacing: "-0.05em",
                  }}
                >
                  Engineering solutions built for operation
                </h2>
              </div>

              <div className="col-lg-4 offset-lg-1">
                <p
                  className="mb-4"
                  style={{
                    color: "rgba(255,255,255,0.72)",
                    fontSize: "1.08rem",
                    lineHeight: 1.7,
                  }}
                >
                  Whether you&apos;re starting from scratch or modernizing an
                  existing model, we&apos;re here to help.
                </p>

                <Link
                  to="/contact"
                  className="btn btn-light rounded-3 px-4 py-3 fw-semibold"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
