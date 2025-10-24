import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pprSampleData } from "./data/pprSampleData";

/**
 * PPRPage - Presents a wide multi-row header table similar to the provided screenshot.
 * - Sticky multi-row header
 * - Horizontal scroll for many columns
 * - Example/sample data included
 */
export default function PPRPage() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("Aug-25");

  // Exchange rates for different months
  const exchangeRates = {
    "Aug-25": "15,650",
    "Jul-25": "15,420", 
    "Jun-25": "15,890"
  };

  // Sample data (you should replace with real data or fetch from API)
  const rows = useMemo(() => {
    return pprSampleData;
  }, []);

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
              onChange={(e) => setSelectedMonth(e.target.value)}
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
          <table style={{ borderCollapse: "collapse", minWidth: 1400, width: "100%" }}>
            <thead>
              {/* First header row: colored bands */}
              <tr>
                <th colSpan="3" style={headerBandStyle("#dff7e6")}> </th>
                <th colSpan="4" style={headerBandStyle("#e6fffb")}>Purchase Part</th>
                <th colSpan="1" style={headerBandStyle("#fff7e6")}>Raw Material</th>
                <th colSpan="4" style={headerBandStyle("#f9e6ff")}>Processing Cost</th>
                <th colSpan="1" style={headerBandStyle("#fff0f6")}>Total Process Cost</th>
                <th colSpan="1" style={headerBandStyle("#f5f5f5")}>Exclusive Investment</th>
                <th colSpan="1" style={headerBandStyle("#fff0f0")}>Total Cost</th>
                <th colSpan="1" style={headerBandStyle("#ffffff")}>Remark</th>
              </tr>

              {/* Second header row: column group titles */}
              <tr style={{ background: "#e9eef6" }}>
                <th style={thSticky}>No.</th>
                <th style={thSticky}>PartNo.</th>
                <th style={thSticky}>PartName</th>

                <th style={thSticky}>JSP</th>
                <th style={thSticky}>MSP</th>
                <th style={thSticky}>Local OH</th>
                <th style={thSticky}>ToolingOH</th>

                <th style={thSticky}>IDR/US (Raw)</th>

                <th style={thSticky}>Labor</th>
                <th style={thSticky}>FOH Fixed</th>
                <th style={thSticky}>FOH Var</th>
                <th style={thSticky}>Unfinish Depre.</th>

                <th style={thSticky}>Total Process Cost</th>
                <th style={thSticky}>Exclusive Investment</th>
                <th style={thSticky}>Total Cost</th>
                <th style={thSticky}>Remark</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.partNo} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <td style={td}>{r.no}</td>
                  <td style={td}>{r.partNo}</td>
                  <td style={td}>{r.partName}</td>

                  <td style={td}>{r.jsp ?? "-"}</td>
                  <td style={td}>{r.msp ?? "-"}</td>
                  <td style={td}>{r.localOH ?? "-"}</td>
                  <td style={td}>{formatNumber(r.toolingOH)}</td>

                  <td style={td}>{formatNumber(r.rawMaterial)}</td>

                  <td style={td}>{formatNumber(r.labor)}</td>
                  <td style={td}>{formatNumber(r.fohFix)}</td>
                  <td style={td}>{formatNumber(r.fohVar)}</td>
                  <td style={td}>{formatNumber(r.unfinishDepre)}</td>

                  <td style={td}>{formatNumber(r.totalProcessCost)}</td>
                  <td style={td}>{formatNumber(r.exclusiveInvestment)}</td>
                  <td style={td}>{formatNumber(r.totalCost)}</td>
                  <td style={td}>{r.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#6b7280", fontSize: 13 }}>Showing {rows.length} rows</div>
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
