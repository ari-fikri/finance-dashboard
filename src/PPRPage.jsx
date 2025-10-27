import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pprDataByPeriod } from "./data/pprSampleData";
import InlineEditableTextarea from "./components/InlineEditableTextarea";

/**
 * PPRPage - Presents a wide multi-row header table similar to the provided screenshot.
 * - Sticky multi-row header
 * - Horizontal scroll for many columns
 * - Example/sample data included
 */
export default function PPRPage() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("Aug-25");
  const [editingRemark, setEditingRemark] = useState(null);
  const [remarkValues, setRemarkValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const threshold = 10; // 10% threshold

  // Exchange rates for different months
  const exchangeRates = {
    "Aug-25": "15,650",
    "Jul-25": "15,420", 
    "Jun-25": "15,890"
  };

  // Sample data (filtered by selected period)
  const rows = useMemo(() => {
    return pprDataByPeriod[selectedMonth] || [];
  }, [selectedMonth]);

  // Pagination calculations
  const totalRecords = rows.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = rows.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Helper function to check if diff is outside threshold
  const isOutsideThreshold = (diff) => {
    return Math.abs(diff) > threshold;
  };

  // Helper function to get remark value (from state or original data)
  const getRemarkValue = (partNo, originalRemark) => {
    return remarkValues[partNo] !== undefined ? remarkValues[partNo] : originalRemark;
  };

  // Handle remark editing
  const handleRemarkSave = (partNo, value) => {
    setRemarkValues(prev => ({ ...prev, [partNo]: value }));
  };

  const handleDetailClick = (partNo) => {
    // Handle detail button click - you can implement navigation or modal here
    alert(`Detail view for Part: ${partNo}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1 style={{ margin: 0 }}>PPR</h1>
            <p style={{ margin: "6px 0 0", color: "#6b7280" }}>Part process & cost report (wide table)</p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select 
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setCurrentPage(1); // Reset to first page when period changes
              }}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)" }}
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
                fontSize: "13px"
              }}
            />

            <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => alert("Export CSV (preview)")}>Export</button>
          </div>
        </div>

        <div style={{ height: 16 }} />

        {/* Table container with horizontal scroll */}
        <div style={{ overflow: "auto", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 8 }}>
          <table style={{ borderCollapse: "collapse", minWidth: 1440, width: "100%" }}>
            <thead style={{ border: "2px solid #059669" }}>
              {/* First header row: colored bands */}
              <tr style={{ border: "1px solid #059669" }}>
                <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>No.</th>
                <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>PartNo.</th>
                <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>PartName</th>
                <th colSpan="2" style={{...headerBandStyle("#dff7e6"), border: "1px solid #059669"}}>Purchase Part</th>
                <th colSpan="1" style={{...headerBandStyle("#dff7e6"), border: "1px solid #059669"}}>Raw Material</th>
                <th colSpan="4" style={{...headerBandStyle("#dff7e6"), border: "1px solid #059669"}}>Processing Cost</th>
                <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Total Process Cost</th>
                <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Exclusive Investment</th>
                <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Prev Period</th>
                <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Total Cost</th>
                <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Diff</th>
                <th rowSpan="2" style={{...headerBandStyle("#dff7e6"), ...thSticky, border: "1px solid #059669"}}>Remark</th>
              </tr>

              {/* Second header row: column group titles */}
              <tr style={{ background: "#dff7e6", border: "1px solid #059669" }}>
                <th style={{...thSticky, border: "1px solid #059669"}}>Local OH</th>
                <th style={{...thSticky, border: "1px solid #059669"}}>ToolingOH</th>

                <th style={{...thSticky, border: "1px solid #059669"}}>IDR/US (Raw)</th>

                <th style={{...thSticky, border: "1px solid #059669"}}>Labor</th>
                <th style={{...thSticky, border: "1px solid #059669"}}>FOH Fixed</th>
                <th style={{...thSticky, border: "1px solid #059669"}}>FOH Var</th>
                <th style={{...thSticky, border: "1px solid #059669"}}>Unfinish Depre.</th>
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((r, index) => {
                const isThresholdExceeded = isOutsideThreshold(r.diff);
                const redStyle = isThresholdExceeded ? { ...td, color: "red", fontWeight: "bold" } : td;
                const currentRemark = getRemarkValue(r.partNo, r.remark);
                const isEvenRow = index % 2 === 0;
                
                return (
                  <tr 
                    key={r.partNo} 
                    style={{ 
                      borderBottom: "1px solid rgba(0,0,0,0.04)",
                      backgroundColor: isEvenRow ? "#f9fafb" : "white"
                    }}
                  >
                    <td style={td}>{startIndex + currentRecords.indexOf(r) + 1}</td>
                    <td style={td}>{r.partNo}</td>
                    <td style={td}>{r.partName}</td>

                    <td style={td}>{r.localOH ?? "-"}</td>
                    <td style={td}>{formatNumber(r.toolingOH)}</td>

                    <td style={td}>{formatNumber(r.rawMaterial)}</td>

                    <td style={td}>{formatNumber(r.labor)}</td>
                    <td style={td}>{formatNumber(r.fohFix)}</td>
                    <td style={td}>{formatNumber(r.fohVar)}</td>
                    <td style={td}>{formatNumber(r.unfinishDepre)}</td>

                    <td style={td}>{formatNumber(r.totalProcessCost)}</td>
                    <td style={td}>{formatNumber(r.exclusiveInvestment)}</td>
                    <td style={td}>{formatNumber(r.prevPeriod)}</td>
                    <td style={redStyle}>{formatNumber(r.totalCost)}</td>
                    <td style={redStyle}>{formatPercentage(r.diff)}</td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          {isThresholdExceeded ? (
                            <InlineEditableTextarea
                              value={currentRemark}
                              onSave={(value) => handleRemarkSave(r.partNo, value)}
                              placeholder="Click to add remark..."
                            />
                          ) : (
                            <span style={{ color: "#999", fontSize: "12px" }}>-</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDetailClick(r.partNo)}
                          style={{
                            padding: "2px 6px",
                            fontSize: 10,
                            border: "1px solid #007bff",
                            borderRadius: 3,
                            background: "#007bff",
                            color: "white",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          }}
                        >
                          Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ 
          marginTop: 16, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of {totalRecords} records
          </div>
          
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn btn-ghost"
              style={{ 
                padding: "4px 8px", 
                fontSize: 12,
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? "not-allowed" : "pointer"
              }}
            >
              Previous
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={page === currentPage ? "btn btn-primary" : "btn btn-ghost"}
                style={{ 
                  padding: "4px 8px", 
                  fontSize: 12,
                  minWidth: 32
                }}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn btn-ghost"
              style={{ 
                padding: "4px 8px", 
                fontSize: 12,
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer"
              }}
            >
              Next
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => alert("Print (preview)")}>Print</button>
            <button className="btn btn-primary" onClick={() => alert("Close (preview)") || navigate(-1)}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* helpers and styles */
const headerBandStyle = (bg) => ({
  background: bg,
  height: 18,
  borderTop: "3px solid rgba(0,0,0,0.08)",
});

const thSticky = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  padding: "8px 10px",
  textAlign: "left",
  fontSize: 12,
  color: "#0b1220",
  fontWeight: 700,
  borderBottom: "1px solid rgba(0,0,0,0.06)"
};

const filterInputStyle = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid rgba(0,0,0,0.06)",
};

const filterSelectStyle = {
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid rgba(0,0,0,0.06)",
};

const filterThStyle = {
  padding: "6px 8px",
  textAlign: "left",
  minWidth: 80
};

const td = { padding: "8px 10px", fontSize: 13, color: "#111827" };

const formatNumber = (v) => {
  if (v == null || v === "") return "-";
  // shows with thousand separators and 3 decimals if float
  if (typeof v === "number") return v.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  return v;
};

const formatPercentage = (v) => {
  if (v == null || v === "") return "-";
  if (typeof v === "number") {
    const formatted = v.toFixed(2);
    return v >= 0 ? `+${formatted}%` : `${formatted}%`;
  }
  return v;
};
