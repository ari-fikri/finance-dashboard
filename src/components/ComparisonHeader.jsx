import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComparisonHeader = ({
  selectedMonth,
  setSelectedMonth,
  selectedMonth2,
  setSelectedMonth2,
  handleCompare,
  comparedMonth1,
  comparedMonth2,
  exchangeRates,
}) => {
  const navigate = useNavigate();
  const pprDataByPeriod = {
    "Aug-25": [],
    "Jul-25": [],
    "Jun-25": [],
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="btn"
              onClick={() => navigate(-1)}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none"
              }}
            >
              ← Back
            </button>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>Period-over-Period Comparison</h1>
          </div>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
            Select two periods to compare the cost differences.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div>
            <label
              htmlFor="month1"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: '#374151',
                display: 'block',
                marginBottom: 4,
              }}
            >
              Period 1 (Previous)
            </label>
            <select
              id="month1"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="select"
              style={{ minWidth: 160, padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
            >
              <option value="">Select Period</option>
              {Object.keys(pprDataByPeriod).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="month2"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: '#374151',
                display: 'block',
                marginBottom: 4,
              }}
            >
              Period 2 (Current)
            </label>
            <select
              id="month2"
              value={selectedMonth2}
              onChange={(e) => setSelectedMonth2(e.target.value)}
              className="select"
              style={{ minWidth: 160, padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
            >
              <option value="">Select Period</option>
              {Object.keys(pprDataByPeriod).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => handleCompare(selectedMonth, selectedMonth2)}
            disabled={!selectedMonth || !selectedMonth2}
            className="btn btn-primary"
          >
            Compare
          </button>
        </div>
        
        {comparedMonth1 && comparedMonth2 && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              value={`USD/IDR: ${exchangeRates[comparedMonth2] || 'N/A'}`}
              readOnly
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.12)",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                width: "150px",
                fontSize: "13px"
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonHeader;