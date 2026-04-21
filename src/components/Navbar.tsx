import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Swal from "sweetalert2";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onInstructionClick: () => void;
  onLoginClick: () => void;
  onSettingsClick: () => void;
  onProjectsClick: () => void;
  onLogout: () => void;
  currentUsername: string | null;
  currentProjectName: string | null;
}

const Navbar: React.FC<NavbarProps> = ({
  onInstructionClick,
  onLoginClick,
  onSettingsClick,
  onProjectsClick,
  onLogout,
  currentUsername,
  currentProjectName,
}) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isFullWidthPage =
    location.pathname === "/dashboard" ||
    location.pathname === "/" ||
    location.pathname === "/planning";

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#2196f3" }}
    >
      <div className={isFullWidthPage ? "container-fluid px-4" : "container"}>
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
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-controls="navbarNav"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`navbar-collapse ${isMenuOpen ? "d-block" : "collapse"} d-lg-flex`}
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-white fw-bold" to="/">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-white fw-bold"
                to="/planning"
                onClick={() => setIsMenuOpen(false)}
              >
                Planning Tool
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white fw-bold btn btn-link"
                style={{ textDecoration: "none" }}
                onClick={() => {
                  setIsMenuOpen(false);
                  onSettingsClick();
                }}
              >
                Preferences
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-white fw-bold btn btn-link"
                style={{ textDecoration: "none" }}
                onClick={() => {
                  setIsMenuOpen(false);
                  onInstructionClick();
                }}
              >
                Instructions
              </button>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white fw-bold" to="/about">
                About
              </Link>
            </li>
          </ul>

          <Link
            className="text-white fw-bold ms-lg-auto me-lg-2 mt-3 mt-lg-0"
            to="/contact"
            style={{ textDecoration: "none" }}
            onClick={() => setIsMenuOpen(false)}
          >
            Get in Touch
          </Link>

          {currentUsername ? (
            <Dropdown align="end" className="me-2 mt-3 mt-lg-0">
              <Dropdown.Toggle
                className="btn btn-link text-white fw-bold"
                style={{ textDecoration: "none", border: "none", boxShadow: "none" }}
              >
                {currentUsername}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  as="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onProjectsClick();
                  }}
                >
                  Projects
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                >
                  Disconnect
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <button
              className="btn btn-link text-white fw-bold me-2 mt-3 mt-lg-0"
              style={{ textDecoration: "none", border: "none", boxShadow: "none" }}
              onClick={() => {
                setIsMenuOpen(false);
                onLoginClick();
              }}
            >
              Login
            </button>
          )}

          <button
            className="btn btn-link fw-bold d-flex align-items-center"
            style={{
              color: "#f1c40f",
              marginRight: "20px",
              textDecoration: "none",
            }}
            onClick={() => {
              setIsMenuOpen(false);
              Swal.fire({
                icon: "warning",
                title: "Avertissement",
                html: "⚠️ L'application en français est en cours de développement. Elle sera disponible bientôt !<br>Appuyez sur <strong>OK</strong> pour continuer la navigation",
                confirmButtonText: "<strong>OK</strong>",
              });
            }}
          >
            <i className="bi bi-globe me-1"></i> FR
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
