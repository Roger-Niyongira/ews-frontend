import React, { useRef, useState, useEffect } from "react";

interface NotesPanelProps {
  onClose: () => void;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ onClose }) => {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

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
        border: "3px solid #90ee90",
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
        <h5 className="text-warning fw-bold mb-0">📋 General Notes</h5>
        <button className="btn-close btn-close-white" onClick={onClose}></button>
      </div>

      <p className="mb-2">
        Regional Areas with Associted summary:
      </p>
      <ul>
        <li>XYZ region expected to exceed H mm rainfall.</li>
        <li>Coastal areas show initial signs of flooding risk.</li>
        <li>River X levels approaching critical threshold.</li>
        <li>ZYX zone remains stable in the next 5 days.</li>
      </ul>
    </div>
  );
};

export default NotesPanel;
