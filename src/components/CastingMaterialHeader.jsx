import React from "react";
import xlsIcon from "../assets/xls_icon.png";

export const CastingMaterialHeader = ({ onDownload }) => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#1F2937" }}>Casting Material Report</h1>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {/* Placeholder for any future left-aligned controls */}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{
              padding: "8px 16px",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              backgroundColor: "#4CAF50",
              color: "white",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            Submit
          </button>
          <button
            onClick={onDownload}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "8px 16px",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              backgroundColor: "#2196F3",
              color: "white",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            Download
            <img src={xlsIcon} alt="Download" style={{ marginLeft: 8, height: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CastingMaterialHeader;