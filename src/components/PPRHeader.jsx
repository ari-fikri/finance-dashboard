import React, { useState } from "react";
import FunnelIcon from "./FunnelIcon";
import FilterDialog from "./FilterDialog";
import xlsIcon from "../assets/xls_icon.png";

export const PPRHeader = ({ selectedPeriod, comparisonPeriod, onPeriodChange, onComparisonPeriodChange, uniquePartNos, uniqueImporters, uniqueCategories, filteredPartNos, setFilteredPartNos, filteredImporters, setFilteredImporters, filteredCategories, setFilteredCategories }) => {
  const [showPartNoFilter, setShowPartNoFilter] = useState(false);
  const [showImporterFilter, setShowImporterFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const availablePeriods = ["2024-09", "2024-08", "2024-07", "2024-06"];

  return (
    <div style={{ padding: "16px", backgroundColor: "#F3F4F6" }}>
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

export default PPRHeader;