import React, { useState } from "react";
import FunnelIcon from "./FunnelIcon";
import FilterDialog from "./FilterDialog";
import xlsIcon from "../assets/xls_icon.png";

export const PPRHeader = ({
  selectedPeriod,
  comparisonPeriod,
  availablePeriods,
  onPeriodChange,
  onComparisonPeriodChange,
  onDownload,
  isDirty,
  onSave,
  isDphUser,
}) => {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#1F2937" }}>Cost Analysis Report</h1>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div>
            <label style={{ fontSize: 12, color: "#4B5563" }}>Select Period:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                border: "1px solid #d1d5db",
                fontSize: 12
              }}
            >
              {availablePeriods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#4B5563" }}>Compare with:</label>
            <select
              value={comparisonPeriod}
              onChange={(e) => onComparisonPeriodChange(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: 4,
                border: "1px solid #d1d5db",
                fontSize: 12
              }}
            >
              {availablePeriods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {isDirty && !isDphUser && (
            <button
              onClick={onSave}
              style={{
                padding: "8px 16px",
                borderRadius: 4,
                border: "1px solid #d1d5db",
                backgroundColor: "#FFC107",
                color: "white",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              Save
            </button>
          )}
          <button
            style={{
              padding: "8px 16px",
              borderRadius: 4,
              border: "1px solid #d1d5db",
              backgroundColor: "#4CAF50",
              color: "white",
              fontSize: 12,
              cursor: isDirty ? "not-allowed" : "pointer",
              opacity: isDirty ? 0.5 : 1,
            }}
            disabled={isDirty}
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
              cursor: isDirty ? "not-allowed" : "pointer",
              opacity: isDirty ? 0.5 : 1,
            }}
            disabled={isDirty}
          >
            Download
            <img src={xlsIcon} alt="Download" style={{ marginLeft: 8, height: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PPRHeader;