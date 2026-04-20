import React, { useState, useRef } from "react";

interface InstructionPanelProps {
  onClose: () => void;
}

const InstructionPanel: React.FC<InstructionPanelProps> = ({ onClose }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    if (panelRef.current) {
      setDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const onMouseUp = () => setDragging(false);

  React.useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <div
      ref={panelRef}
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "100%",
        maxWidth: "400px",
        maxHeight: "90vh",
        overflowY: "auto",
        margin: "0",
        zIndex: 1050,
        border: "3px solid #90ee90",
        backgroundColor: "#4a4a4a",
        padding: "1rem",
        borderRadius: "0.5rem",
        color: "white",
        cursor: "move",
        boxSizing: "border-box",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="text-warning fw-bold mb-0">📘 Instruction</h5>
        <button
          className="btn-close btn-close-white"
          onClick={onClose}
        ></button>
      </div>
      <p className="mb-1">
        <strong style={{ textDecoration: "underline", color: "gold" }}>
          About:
        </strong>
      </p>
      <p className="mb-2 mt-0">
        This is the Home page. It highlights the inspiration and background
        story on the importance of having a good early warning systems.
      </p>
      <p className="mb-1 mt-3">
        <strong style={{ textDecoration: "underline", color: "gold" }}>
          Dashboard:
        </strong>
      </p>
      <p className="mb-2 mt-0">
        This is where the EWS dashboard information is displayed.
      </p>
      <ul className="mb-0 ps-4">
        <li className="mb-2">
          🌙 Dark Mode (Top-Right): Allows you to use a dark background,
          depending on preferences
        </li>
        <li className="mb-2">
          VIEW/HIDE PRECIPITATIONS: Show or remove precipitation points from the map.
        </li>
        <li className="mb-2">
          VIEW/HIDE WATERSHEDS: Reserved for watershed layers when they become available.
        </li>
        <li className="mb-2">
          MAP: Visually represent areas with correspinding risk levels. When a
          user clicks on a circle, its current and forecast is plotted in the
          top-left panel ("HYDROLOGICAL INFO") for visual inspection. You can
          adjust the marker in "Preference" in the navigation bar
        </li>
      </ul>
      <p className="mb-1">
        <strong style={{ textDecoration: "underline", color: "gold" }}>
          Preference:
        </strong>
      </p>
      <p className="mb-2 mt-0">
        Allows to set user preferences. A user can determine what location they
        want by default. A user can also chose if they like to maintain dark
        mode as defaut throghout out the browsing.
      </p>
    </div>
  );
};

export default InstructionPanel;
