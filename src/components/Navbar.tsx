import React from "react";
import Swal from "sweetalert2";

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
        src="/ews_icon.png"
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
          <a className="nav-link text-white fw-bold" href="#">About</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white fw-bold" href="#">Dashboard</a>
        </li>
        <li className="nav-item">
          <a className="nav-link text-white fw-bold" href="#">Preference</a>
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
