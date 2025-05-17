import React, { useRef, useState, useEffect } from "react";

interface ScenarioPanelProps {
  onClose: () => void;
  thresholds: { medium: number; high: number };
  setThresholds: (thresholds: { medium: number; high: number }) => void;
}

const ScenarioPanel: React.FC<ScenarioPanelProps> = ({
  onClose,
  thresholds,
  setThresholds,
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [medium, setMedium] = useState(thresholds.medium);
  const [high, setHigh] = useState(thresholds.high);

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
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

  useEffect(() => {
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
        backgroundColor: "#4a4a4a",
        border: "3px solid #f39c12",
        borderRadius: "0.5rem",
        padding: "1rem",
        color: "white",
        zIndex: 1050,
        minWidth: "280px",
        maxWidth: "320px",
        cursor: "move",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="text-warning fw-bold mb-0">⚙️ Scenario Settings</h5>
        <button
          className="btn-close btn-close-white"
          onClick={onClose}
        ></button>
      </div>

      <label>⚠ Medium Warning Threshold</label>
      <input
        type="number"
        className="form-control mb-2"
        value={medium}
        onChange={(e) => setMedium(Number(e.target.value))}
      />

      <label>🔥 High Warning Threshold</label>
      <input
        type="number"
        className="form-control mb-3"
        value={high}
        onChange={(e) => setHigh(Number(e.target.value))}
      />

      <div className="mt-3 mb-2">
        <button
          className="btn btn-warning w-100 fw-bold mb-5"
          onClick={() => setThresholds({ medium, high })}
        >
          Apply Thresholds
        </button>

        <button
          className="btn btn-secondary w-100 fw-bold d-flex justify-content-between align-items-center"
          onClick={() => console.log("Open cost impact window")}
        >
          <span>Advance: Cost impact</span>
          <i className="bi bi-box-arrow-up-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ScenarioPanel;
