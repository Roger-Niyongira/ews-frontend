import React from "react";
import Swal from "sweetalert2";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onInstructionClick: () => void;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onInstructionClick, onLoginClick }) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard" || location.pathname === "/";

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#2196f3" }}
    >
      <div className={isDashboard ? "container-fluid px-4" : "container"}>
        <a className="navbar-brand" href="/">
          <img
            src={process.env.PUBLIC_URL + "/ews_icon.png"}
            alt="EWS Logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-white fw-bold" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fw-bold" to="/">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white fw-bold btn btn-link"
                style={{ textDecoration: "none" }}
                onClick={() =>
                  Swal.fire({
                    icon: "info",
                    html: `
                      <p style="font-size: 14px;">This page is under development. See Preview Below:</p>
                      <img 
                        src="${process.env.PUBLIC_URL}/preference_mockup.png"
                        alt="Preview"
                        style="height: 260px; object-fit: contain; border-radius: 10px; margin-top: 10px;" />
                    `,
                    confirmButtonText: "OK",
                    width: 400,
                  })
                }
              >
                Settings
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white fw-bold btn btn-link"
                style={{ textDecoration: "none" }}
                onClick={onInstructionClick}
              >
                Instructions
              </button>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fw-bold" to="/contact">
                Get in Touch
              </Link>
            </li>
          </ul>

          <button
            className="btn btn-link text-white fw-bold me-2 ms-auto"
            style={{ textDecoration: "none", border: "none", boxShadow: "none" }}
            onClick={onLoginClick}
          >
            Login
          </button>

          <button
            className="btn btn-link fw-bold d-flex align-items-center"
            style={{
              color: "#f1c40f",
              marginRight: "20px",
              textDecoration: "none",
            }}
            onClick={() =>
              Swal.fire({
                icon: "warning",
                title: "Avertissement",
                html: "⚠️ L'application en français est en cours de développement. Elle sera disponible bientôt !<br>Appuyez sur <strong>OK</strong> pour continuer la navigation",
                confirmButtonText: "<strong>OK</strong>",
              })
            }
          >
            <i className="bi bi-globe me-1"></i> FR
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
