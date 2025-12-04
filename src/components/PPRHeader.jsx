import React from "react";
import { Link } from "react-router-dom";

export function PPRHeader({ selectedPeriod, comparisonPeriod, availablePeriods, onPeriodChange, onComparisonPeriodChange }) {
  return (
    <div style={{ padding: "20px 28px", marginBottom: 20, position: 'relative' }}>
      <Link to="/" style={{ position: 'absolute', top: 20, right: 28, fontSize: 24, textDecoration: 'none', color: '#333', lineHeight: 1 }}>
        &times;
      </Link>
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
          <label style={{ fontSize: 12, color: "#666", marginRight: 8 }}>
            Compare with:
          </label>
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
    </div>
  );
}
