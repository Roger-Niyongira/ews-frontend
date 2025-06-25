import React from "react";

interface RiverFeature {
  id: number;
  channel: number;
  flo_out_max: number | null;
  watershed: number;
}

interface WatershedFeature {
  id: number;
  name: string;
  area?: number; // added area
}

interface WatershedInfoPanelProps {
  watershed: WatershedFeature;
  rivers: RiverFeature[];
  onClose: () => void;
}

const WatershedInfoPanel: React.FC<WatershedInfoPanelProps> = ({
  watershed,
  rivers,
  onClose,
}) => {
  const topChannels = rivers
    .filter((r) => r.watershed === watershed.id && r.flo_out_max !== null)
    .sort((a, b) => (b.flo_out_max ?? 0) - (a.flo_out_max ?? 0))
    .slice(0, 5);

  const maxVal = Math.max(...topChannels.map((r) => r.flo_out_max ?? 0));
  const barWidth = 280 / Math.max(topChannels.length, 1);

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        width: 300,
        backgroundColor: "white",
        padding: 10,
        borderRadius: 5,
        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
        zIndex: 1000,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          background: "transparent",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        ❌
      </button>

      <div
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: "#000",
          textAlign: "center",
          marginBottom: 10,
          paddingBottom: 6,
          borderBottom: "1px solid #ccc",
        }}
      >
        Watershed: {watershed.name}
      </div>

      <svg width={280} height={180}>
        <text
          x={-90}
          y={10}
          transform="rotate(-90)"
          textAnchor="middle"
          fontSize="12"
          fill="#333"
        >
          Max Flow (m³/s)
        </text>

        <text x={140} y={175} textAnchor="middle" fontSize="12" fill="#333">
          Channel
        </text>

        {topChannels.map((r, i) => {
          const barHeight = ((r.flo_out_max ?? 0) / maxVal) * 120;
          return (
            <g key={r.channel}>
              <rect
                x={i * barWidth}
                y={150 - barHeight}
                width={barWidth - 2}
                height={barHeight}
                fill="#8031a7"
              />
              <text
                x={i * barWidth + (barWidth - 2) / 2}
                y={150 - barHeight - 5}
                textAnchor="middle"
                fontSize="11"
                fill="#333"
              >
                {r.flo_out_max?.toFixed(3).replace(/\.?0+$/, "")}
              </text>
              <text
                x={i * barWidth + (barWidth - 2) / 2}
                y={160}
                textAnchor="middle"
                fontSize="11"
                fill="#333"
              >
                {r.channel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default WatershedInfoPanel;
