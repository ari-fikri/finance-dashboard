import React from "react";
import { useNavigate } from "react-router-dom";

const PPRToolbar = ({
  selectedMonth,
  setSelectedMonth,
  setCurrentPage,
  exchangeRates,
}) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <select
        value={selectedMonth}
        onChange={(e) => {
          setSelectedMonth(e.target.value);
          setCurrentPage(1); // Reset to first page when period changes
        }}
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.12)",
        }}
      >
        <option value="Aug-25">Aug-25</option>
        <option value="Jul-25">Jul-25</option>
        <option value="Jun-25">Jun-25</option>
      </select>

      <input
        type="text"
        value={`USD/IDR: ${exchangeRates[selectedMonth]}`}
        readOnly
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          border: "1px solid rgba(0,0,0,0.12)",
          backgroundColor: "#f8f9fa",
          color: "#495057",
          width: "150px",
          fontSize: "13px",
        }}
      />

      <button
        onClick={() => navigate("/period-comparison")}
        className="btn btn-primary"
        style={{
          marginLeft: "16px",
        }}
      >
        Period Comparison
      </button>

      <button
        className="btn btn-primary"
        onClick={() => alert("Export CSV (preview)")}
      >
        Export
      </button>
    </div>
  );
};

export default PPRToolbar;