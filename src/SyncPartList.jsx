// src/SyncPartList.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Synchronize Part List page
 * - CMD column is always true
 * - SAP / IFAST are randomized booleans on first render
 */
export default function SyncPartList() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  // raw part rows (from your list)
  const partRows = [
    ["122810Y11000", "HANGER, ENGINE, NO.1", "SETIA GUNA SEJATI"],
    ["130500Y02000", "GEAR ASSY, CAMSHAFT TIMING", "DENSO INDONESIA CORPORATION (FAJAR)"],
    ["25051BZ15000", "CONVERTER SUB-ASSY, EXHAUST MANIFOLD", "FUTABA INDONESIA"],
    ["25051BZ26000", "CONVERTER SUB-ASSY, EXHAUST MANIFOLD", "FUTABA INDONESIA"],
    ["22030BZ15000", "BODY ASSY, THROTTLE W/MOTOR", "AISAN NASMOCO INDUSTRI"],
    ["90210T000200", "WASHER, SEAL", "ARAI RUBBER SEAL INDONESIA"],
    ["90430T002300", "GASKET", "ARAI RUBBER SEAL INDONESIA"],
    ["111150Y03000", "GASKET, CYLINDER HEAD", "ASTRA NIPPON GASKET INDONESIA"],
    ["11115BZ16000", "GASKET, CYLINDER HEAD", "ASTRA NIPPON GASKET INDONESIA"],
    ["171730Y03000", "GASKET, EXHAUST MANIFOLD", "ASTRA NIPPON GASKET INDONESIA"],
    ["17173BZ13000", "GASKET, EXHAUST MANIFOLD", "ASTRA NIPPON GASKET INDONESIA"],
    ["115110Y04000", "CAP, CRANKSHAFT BEARING, NO.1", "AT INDONESIA"],
    ["115130Y04000", "CAP, CRANKSHAFT BEARING, NO.3", "AT INDONESIA"],
    ["16261BZ75000", "HOSE, WATER BY-PASS, NO.1", "CATURINDO AGUNGJAYA RUBBER"],
    ["16261BZ76000", "HOSE, WATER BY-PASS, NO.1", "CATURINDO AGUNGJAYA RUBBER"],
    ["16264BZ38000", "HOSE, WATER BY-PASS, NO.2", "CATURINDO AGUNGJAYA RUBBER"],
    ["16264BZ39000", "HOSE, WATER BY-PASS, NO.2", "CATURINDO AGUNGJAYA RUBBER"],
    ["16282BZ11000", "HOSE, WATER BY-PASS, NO.5", "CATURINDO AGUNGJAYA RUBBER"],
    ["89467BZ02000", "SENSOR, AIR FUEL RATIO", "DENSO INDONESIA CORPORATION (SIP C)"],
  ];

  // Convert to objects and randomize SAP / IFAST once (useMemo)
  const rows = useMemo(
    () =>
      partRows.map((r) => ({
        partNo: r[0],
        partName: r[1],
        supplier: r[2],
        cmd: true, // all true
        sap: Math.random() > 0.5,
        ifast: Math.random() > 0.5,
      })),
    []
  );

  // Compare / modal state
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareType, setCompareType] = useState("all"); // "ifast" | "sap" | "all"

  // compute compare results based on compareType
  const compareResults = useMemo(() => {
    if (compareType === "ifast") {
      return rows
        .filter((r) => !(r.cmd && r.ifast))
        .map((r) => ({ ...r, reasons: r.ifast ? [] : ["Missing in IFAST"] }));
    }

    if (compareType === "sap") {
      return rows
        .filter((r) => !(r.cmd && r.sap))
        .map((r) => ({ ...r, reasons: r.sap ? [] : ["Missing in SAP"] }));
    }

    // default: all (show rows missing either SAP or IFAST)
    return rows
      .filter((r) => !(r.cmd && r.sap && r.ifast))
      .map((r) => {
        const reasons = [];
        if (!r.sap) reasons.push("Missing in SAP");
        if (!r.ifast) reasons.push("Missing in IFAST");
        return { ...r, reasons };
      });
  }, [rows, compareType]);

  const handleOpenCompare = (type = "all") => {
    setCompareType(type);
    setShowCompareModal(true);
  };

  const handleExportCompareCSV = () => {
    const headers = ["Part No", "Part Name", "Supplier", "CMD", "SAP", "IFAST", "Issues"];
    const csvRows = [
      headers.join(","),
      ...compareResults.map((r) =>
        [
          r.partNo,
          `"${r.partName.replace(/"/g, '""')}"`,
          `"${r.supplier.replace(/"/g, '""')}"`,
          r.cmd ? "TRUE" : "FALSE",
          r.sap ? "TRUE" : "FALSE",
          r.ifast ? "TRUE" : "FALSE",
          `"${r.reasons.join("; ")}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sync-compare-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pagination calculations
  const totalRecords = rows.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = rows.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0 }}>Synchronize Part List</h1>
            <p style={{ margin: "6px 0 0", color: "#6b7280" }}>Shows which part lists exist in CMD / SAP / IFAST.</p>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-ghost"
              style={{ alignSelf: "center" }}
            >
              ← Back
            </button>
            <button
              onClick={() => alert("Sync action (preview)")}
              className="btn btn-ghost"
            >
              Synchronize Selected
            </button>

            {/* Removed: Compare CMD ↔ IFAST and Compare CMD ↔ SAP buttons */}

            {/* New: Explicit Synchronize buttons for IFAST and SAP */}
            <button
              onClick={() => handleOpenCompare("ifast")}
              className="btn btn-primary"
              title="Compare gap between CMD and IFAST"
            >
              Compare Gap CMD vs IFAST
            </button>

            <button
              onClick={() => handleOpenCompare("sap")}
              className="btn btn-primary"
              title="Compare gap between CMD and SAP"
            >
              Compare Gap CMD vs SAP
            </button>

            <button
              onClick={() => handleOpenCompare("all")}
              className="btn btn-primary"
              title="Compare CMD / SAP / IFAST"
            >
              Synchronize (All)
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 950 }}>
            <thead style={{ background: "rgba(15,23,42,0.03)" }}>
              <tr>
                <th style={thStyleCenter}>Record No</th>
                <th style={thStylePartNo}>Part No</th>
                <th style={thStylePartName}>Part Name</th>
                <th style={thStyleCenter}>Supplier Name</th>
                <th style={thStyleCenter}>CMD</th>
                <th style={thStyleCenter}>SAP</th>
                <th style={thStyleCenter}>IFAST</th>
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((r, index) => {
                const recordNo = startIndex + index + 1;
                return (
                  <tr key={r.partNo} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <td style={tdStyleCenter}>{recordNo}</td>
                    <td style={tdStylePartNo}>{r.partNo}</td>
                    <td style={tdStylePartName}>{r.partName}</td>
                    <td style={tdStyle}>{r.supplier}</td>

                    <td style={tdStyleCenter}>
                      <input type="checkbox" checked={r.cmd} readOnly />
                    </td>

                    <td style={tdStyleCenter}>
                      <input type="checkbox" checked={r.sap} readOnly />
                    </td>

                    <td style={tdStyleCenter}>
                      <input type="checkbox" checked={r.ifast} readOnly />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Compare modal */}
        {showCompareModal && (
          <div style={{
            position: "fixed",
            left: 0, top: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}>
            <div style={{ width: 920, maxHeight: "80vh", overflow: "auto", background: "white", borderRadius: 8, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>
                  {compareType === "ifast" ? "Compare: CMD vs IFAST" : compareType === "sap" ? "Compare: CMD vs SAP" : "Compare Results (CMD / SAP / IFAST)"}
                </h3>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setShowCompareModal(false)}>Close</button>
                  <button className="btn btn-primary" onClick={handleExportCompareCSV} disabled={compareResults.length === 0}>Export CSV</button>
                </div>
              </div>

              <div style={{ marginBottom: 8, color: "#374151" }}>
                Mismatched records: <strong>{compareResults.length}</strong>
                {compareType === "ifast" && " (rows where IFAST is missing)"}
                {compareType === "sap" && " (rows where SAP is missing)"}
                {compareType === "all" && " (rows missing SAP or IFAST)"}
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f3f4f6" }}>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 10px" }}>Part No</th>
                    <th style={{ textAlign: "left", padding: "8px 10px" }}>Part Name</th>
                    <th style={{ textAlign: "left", padding: "8px 10px" }}>Supplier</th>
                    <th style={{ textAlign: "center", padding: "8px 10px" }}>SAP</th>
                    <th style={{ textAlign: "center", padding: "8px 10px" }}>IFAST</th>
                    <th style={{ textAlign: "left", padding: "8px 10px" }}>Issues</th>
                  </tr>
                </thead>
                <tbody>
                  {compareResults.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: 12, color: "#6b7280" }}>No mismatches found.</td>
                    </tr>
                  )}
                  {compareResults.map((r) => (
                    <tr key={r.partNo} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                      <td style={{ padding: "8px 10px" }}>{r.partNo}</td>
                      <td style={{ padding: "8px 10px" }}>{r.partName}</td>
                      <td style={{ padding: "8px 10px" }}>{r.supplier}</td>
                      <td style={{ textAlign: "center", padding: "8px 10px" }}>{r.sap ? "✓" : "—"}</td>
                      <td style={{ textAlign: "center", padding: "8px 10px" }}>{r.ifast ? "✓" : "—"}</td>
                      <td style={{ padding: "8px 10px", color: "#b91c1c" }}>{r.reasons.join("; ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={() => alert("Export CSV (preview)")} className="btn btn-ghost">Export CSV</button>
          <button onClick={() => alert("Close (preview)") || navigate(-1)} className="btn btn-primary">Close</button>
        </div>
      </div>
    </div>
  );
}

// small inline styles to keep component self-contained
const thStyle = {
  textAlign: "left",
  padding: "12px 14px",
  fontSize: 13,
  color: "#0b1220",
  fontWeight: 600,
};
const thStyleCenter = { ...thStyle, textAlign: "center" };
const tdStyle = { padding: "12px 14px", fontSize: 13, color: "#374151" };
const tdStyleCenter = { ...tdStyle, textAlign: "center" };

// Additional spacing for PartNo and PartName columns
const thStylePartNo = { ...thStyle, padding: "12px 20px", minWidth: 160, textAlign: "center" };
const tdStylePartNo = { ...tdStyle, padding: "12px 20px", minWidth: 160 };
const thStylePartName = { ...thStyle, padding: "12px 20px", minWidth: 300, textAlign: "center" };
const tdStylePartName = { ...tdStyle, padding: "12px 20px", minWidth: 300 };
