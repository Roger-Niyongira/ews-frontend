import React from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

interface NavbarProps {
  onInstructionClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onInstructionClick }) => (
  <nav
    className="navbar navbar-expand-lg navbar-dark"
    style={{ backgroundColor: "#2196f3" }}
  >
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
                title: "⚙️ Preferences settings Coming Soon!",
                html: `
          <p>This page is under development. Here's a preview:</p>
          <img 
          src="/preference_mockup.png" 
          alt="Preview" style="height: 160px; object-fit: contain; border-radius: 10px;" />
        `,
                confirmButtonText: "OK",
                width: 400,
              })
            }
          >
            Preference
          </button>
        </li>
        <li className="nav-item">
          <button
            className="nav-link text-white fw-bold btn btn-link"
            style={{ textDecoration: "none" }}
            onClick={onInstructionClick}
          >
            Instruction
          </button>
        </li>
      </ul>

      <button
        className="btn btn-link fw-bold d-flex align-items-center ms-auto"
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
  </nav>
);

export default Navbar;
