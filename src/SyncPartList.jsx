// src/SyncPartList.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Synchronize Part List page
 * - CMD column is always true
 * - SAP / IFAST are randomized booleans on first render
 */
export default function SyncPartList() {
  const navigate = useNavigate();

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
              className="btn btn-primary"
            >
              Synchronize Selected
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead style={{ background: "rgba(15,23,42,0.03)" }}>
              <tr>
                <th style={thStyle}>PartNo</th>
                <th style={thStyle}>PartName</th>
                <th style={thStyle}>Supplier Name</th>
                <th style={thStyleCenter}>CMD</th>
                <th style={thStyleCenter}>SAP</th>
                <th style={thStyleCenter}>IFAST</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.partNo} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <td style={tdStyle}>{r.partNo}</td>
                  <td style={tdStyle}>{r.partName}</td>
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
              ))}
            </tbody>
          </table>
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
