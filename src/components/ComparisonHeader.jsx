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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>
            Period-over-Period Comparison
          </h1>
          <p style={{ margin: '6px 0 0', color: '#6b7280', fontSize: 14 }}>
            Select two periods to compare the cost differences.
          </p>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", width: '180px' }}
            >
              <option value="">Select Period 1</option>
              {Object.keys(pprDataByPeriod).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={`USD/IDR: ${exchangeRates[selectedMonth] || 'N/A'}`}
              readOnly
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.12)",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                width: "180px",
                boxSizing: 'border-box',
                fontSize: "13px"
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <select 
              value={selectedMonth2}
              onChange={(e) => setSelectedMonth2(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", width: '180px' }}
            >
              <option value="">Select Period 2</option>
              {Object.keys(pprDataByPeriod).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={`USD/IDR: ${exchangeRates[selectedMonth2] || 'N/A'}`}
              readOnly
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.12)",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                width: "180px",
                boxSizing: 'border-box',
                fontSize: "13px"
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => handleCompare(selectedMonth, selectedMonth2)}
              disabled={!selectedMonth || !selectedMonth2}
              className="btn btn-primary"
            >
              Compare
            </button>
            <button className="btn btn-primary" onClick={() => alert("Export CSV (preview)")}>Export</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonHeader;