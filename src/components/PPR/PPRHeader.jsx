import React from "react";
import { useNavigate } from "react-router-dom";

const PPRHeader = ({
  qualityGates,
  toggleQualityGate,
  partNoFilter,
  setPartNoFilter,
  setAppliedPartNoFilter,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          className="btn"
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
          }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0 }}>PPR</h1>
      </div>
      <p style={{ margin: "6px 0 8px", color: "#6b7280" }}>
        Part process & cost report (wide table)
      </p>

      {/* Quality Gates Buttons */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <button
          onClick={() => toggleQualityGate("rhLhFilter")}
          style={{
            padding: "4px 12px",
            fontSize: "12px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            backgroundColor: qualityGates.rhLhFilter ? "#059669" : "white",
            color: qualityGates.rhLhFilter ? "white" : "#374151",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          RH/LH Filter
        </button>

        <button
          onClick={() => toggleQualityGate("plantMhRate")}
          style={{
            padding: "4px 12px",
            fontSize: "12px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            backgroundColor: qualityGates.plantMhRate ? "#059669" : "white",
            color: qualityGates.plantMhRate ? "white" : "#374151",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Plant & MH Rate
        </button>

        <button
          onClick={() => toggleQualityGate("partNoFilter")}
          style={{
            padding: "4px 12px",
            fontSize: "12px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            backgroundColor: qualityGates.partNoFilter ? "#059669" : "white",
            color: qualityGates.partNoFilter ? "white" : "#374151",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Part No Filter
        </button>
        {qualityGates.partNoFilter && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              value={partNoFilter}
              onChange={(e) => setPartNoFilter(e.target.value)}
              placeholder="Enter Part No"
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
              }}
            />
            <button
              onClick={() => setAppliedPartNoFilter(partNoFilter)}
              style={{
                padding: "4px 12px",
                fontSize: "12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                backgroundColor: "#007bff",
                color: "white",
                cursor: "pointer",
              }}
            >
              Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PPRHeader;