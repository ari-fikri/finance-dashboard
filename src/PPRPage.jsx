import React, { useMemo, useState, useEffect } from "react";

const costItems = [
  "Tooling OH",
  "Raw Material",
  "Labor",
  "FOH Fix",
  "FOH Var",
  "Depre Common",
  "Depre Exclusive",
  "Total Cost",
  "MH Cost"
];

const analysisColumns = [
  "Volume",
  "Inflation",
  "CR",
  "Material Price Impact",
  "Gentan-I Impact",
  "Material Change"
];

export default function PPRPage() {
  const [mspData, setMspData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("2025-02");
  const [comparisonPeriod, setComparisonPeriod] = useState("2024-08");
  const [analysisData, setAnalysisData] = useState({});

  useEffect(() => {
    fetch("/msp.json")
      .then((res) => res.json())
      .then((data) => {
        setMspData(data.items || []);
      })
      .catch((err) => console.error("Failed to load msp.json:", err));
  }, []);

  const costItemKeys = {
    "Tooling OH": "tooling_oh",
    "Raw Material": "raw_material",
    "Labor": "labor",
    "FOH Fix": "foh_fixed",
    "FOH Var": "foh_var",
    "Depre Common": "depre_common",
    "Depre Exclusive": "depre_exclusive",
    "Total Cost": "total_cost",
    "MH Cost": "mh_cost"
  };

  const getCostValue = (part, period, costItem) => {
    if (!part.months || !part.months[period]) return null;
    const key = costItemKeys[costItem];
    return part.months[period][key];
  };

  const calculateDiff = (current, previous) => {
    if (!current || !previous) return null;
    return ((current - previous) / previous) * 100;
  };

  const handleAnalysisChange = (partNo, costItem, column, value) => {
    const key = `${partNo}-${costItem}-${column}`;
    setAnalysisData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getAnalysisValue = (partNo, costItem, column) => {
    const key = `${partNo}-${costItem}-${column}`;
    return analysisData[key] || "";
  };

  const availablePeriods = useMemo(() => {
    const periods = new Set();
    mspData.forEach(item => {
      if (item.months) {
        Object.keys(item.months).forEach(month => periods.add(month));
      }
    });
    return Array.from(periods).sort().reverse();
  }, [mspData]);

  return (
    <div style={{ padding: 20, background: "#fff" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: "0 0 12px 0", fontSize: 20, fontWeight: 600 }}>
          Cost Analysis Report
        </h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div>
            <label style={{ fontSize: 12, color: "#666", marginRight: 8 }}>
              Period:
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
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
            <label style={{ fontSize: 12, color: "#666", marginRight: 8 }}>
              Compare with:
            </label>
            <select
              value={comparisonPeriod}
              onChange={(e) => setComparisonPeriod(e.target.value)}
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
      </div>

      <div style={{ overflowX: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#e8f1f7", borderBottom: "2px solid #d1d5db" }}>
              <th style={{ ...thStyle, minWidth: 120, background: "#d9e8f5" }}>Part No</th>
              <th style={{ ...thStyle, minWidth: 150, background: "#d9e8f5" }}>Cost Item</th>
              
              {/* Calculation section */}
              <th colSpan={6} style={{ textAlign: "center", padding: "8px", background: "#a8d8f0", fontWeight: 600, borderBottom: "1px solid #d1d5db" }}>
                Calculation
              </th>
              
              {/* Analysis section */}
              <th colSpan={analysisColumns.length} style={{ textAlign: "center", padding: "8px", background: "#f5d5a8", fontWeight: 600, borderBottom: "1px solid #d1d5db" }}>
                Analysis
              </th>
            </tr>
            <tr style={{ borderBottom: "1px solid #d1d5db" }}>
              <th style={{ ...thStyle, minWidth: 120 }}></th>
              <th style={{ ...thStyle, minWidth: 150 }}></th>
              <th style={{ ...thStyle, minWidth: 100 }}>{selectedPeriod}</th>
              <th style={{ ...thStyle, minWidth: 100 }}>{comparisonPeriod}</th>
              <th style={{ ...thStyle, minWidth: 80 }}>diff %</th>
              <th style={{ ...thStyle, minWidth: 80 }}>PBMD</th>
              <th style={{ ...thStyle, minWidth: 100 }}>Adj Value</th>
              <th style={{ ...thStyle, minWidth: 100 }}>Remark</th>
              {analysisColumns.map(col => (
                <th key={col} style={{ ...thStyle, minWidth: 100 }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mspData.map((part) => (
              costItems.map((costItem, idx) => {
                const currentValue = getCostValue(part, selectedPeriod, costItem);
                const previousValue = getCostValue(part, comparisonPeriod, costItem);
                const diffPercent = calculateDiff(currentValue, previousValue);
                const isLastRow = idx === costItems.length - 1;

                return (
                  <tr
                    key={`${part.part_no}-${costItem}`}
                    style={{
                      borderBottom: isLastRow ? "3px solid #d1d5db" : "1px solid #e5e7eb",
                      background: idx % 2 === 0 ? "#fafafa" : "#fff"
                    }}
                  >
                    {idx === 0 && (
                      <td
                        rowSpan={costItems.length}
                        style={{
                          ...tdStyle,
                          fontWeight: 600,
                          background: "#e8f1f7",
                          verticalAlign: "top",
                          borderRight: "2px solid #d1d5db"
                        }}
                      >
                        {part.part_no}
                      </td>
                    )}
                    <td style={{ ...tdStyle, fontWeight: 500, borderRight: "1px solid #e5e7eb" }}>
                      {costItem}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {currentValue ? currentValue.toLocaleString() : "-"}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right", background: "#f0f0f0" }}>
                      {previousValue ? previousValue.toLocaleString() : "-"}
                    </td>
                    <td style={{
                      ...tdStyle,
                      textAlign: "right",
                      color: diffPercent && Math.abs(diffPercent) > 15 ? "#dc2626" : "inherit",
                      fontWeight: diffPercent && Math.abs(diffPercent) > 15 ? 600 : "normal"
                    }}>
                      {diffPercent ? `${diffPercent.toFixed(2)}%` : "-"}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <input
                        type="text"
                        placeholder="-"
                        style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11 }}
                      />
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <input
                        type="text"
                        placeholder="-"
                        style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11 }}
                      />
                    </td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>
                      <input
                        type="text"
                        placeholder="-"
                        style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11 }}
                      />
                    </td>
                    {analysisColumns.map(col => (
                      <td key={col} style={{ ...tdStyle, textAlign: "center" }}>
                        <input
                          type="text"
                          placeholder="-"
                          value={getAnalysisValue(part.part_no, costItem, col)}
                          onChange={(e) => handleAnalysisChange(part.part_no, costItem, col, e.target.value)}
                          style={{ width: "100%", padding: "4px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 11 }}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "8px 10px",
  textAlign: "center",
  fontWeight: 600,
  color: "#0b1220",
  fontSize: 12,
  borderRight: "1px solid #d1d5db"
};

const tdStyle = {
  padding: "8px 10px",
  fontSize: 12,
  color: "#374151",
  borderRight: "1px solid #e5e7eb"
};