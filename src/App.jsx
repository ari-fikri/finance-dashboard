// src/App.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [sources] = useState([
    { id: "cmd", name: "CMD", lastUpdate: "2025-10-22" },
    { id: "ifast", name: "IFAST", lastUpdate: "2025-10-21" },
    { id: "sap", name: "SAP", lastUpdate: "2025-10-20" },
  ]);

  const [masterData] = useState({ lastPeriod: "2025-09" });
  const [isMaintaining, setIsMaintaining] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [ihpResult, setIhpResult] = useState(null);

  function downloadSource(source) {
    const csv = `source,updated\n${source.name},${source.lastUpdate}\n`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${source.name}-metadata.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openMaintain() {
    setIsMaintaining(true);
  }
  function closeMaintain() {
    setIsMaintaining(false);
  }

  function calculateIhp() {
    setIsCalculating(true);
    setIhpResult(null);
    setTimeout(() => {
      const result = {
        timestamp: new Date().toISOString(),
        value: (Math.random() * 100).toFixed(2),
      };
      setIhpResult(result);
      setIsCalculating(false);
    }, 1100);
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-left">
          <h1>Data Dashboard</h1>
          <p>Overview of source syncs and master-data tools</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => alert("Sync All (preview)")}>
            Sync All
          </button>
          <button className="btn btn-primary" onClick={() => alert("New Action (preview)")}>
            New Action
          </button>
        </div>
      </header>

      <main>
        <section>
          <h2 className="section-title">Data Synchronization</h2>

          <div className="grid-3">
            {sources.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="card"
              >
                <div>
                  <div className="title">{s.name}</div>
                  <div className="meta">Last Update: <span>{s.lastUpdate}</span></div>
                </div>

                <div className="card-footer">
                  <div className="small">Status: <strong style={{ color: "#059669" }}>OK</strong></div>

                  <div className="card-actions">
                    <button onClick={() => downloadSource(s)} className="btn btn-primary">
                      {/* small download icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginRight: 6 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v12m0 0l-4-4m4 4l4-4M21 21H3"></path>
                      </svg>
                      Download
                    </button>

                    <button onClick={() => alert("Details (preview)")} className="btn btn-ghost">
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">Master Data & Calculation</h2>

          <div className="grid-2" style={{ alignItems: "start" }}>
            <motion.div
              className="card master-card"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.04 }}
            >
              <div>
                <div className="title">Master Data</div>
                <div className="meta">Last Period: <span>{masterData.lastPeriod}</span></div>
                <div style={{ marginTop: 10 }} className="small">
                  Maintain core reference tables used by the synchronization processes. Use the button below to manage values.
                </div>
              </div>

              <div className="card-footer">
                <div />
                <div className="card-actions">
                  <button className="btn btn-ghost" onClick={() => alert("View master data (preview)")}>
                    View
                  </button>
                  <button className="btn btn-primary" onClick={openMaintain}>
                    Maintain Master Data
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card ihp-area"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.08 }}
            >
              <div>
                <div className="title">IHP</div>
                <div className="meta">Perform calculation for IHP metrics across synced sources.</div>
                {ihpResult && (
                  <div style={{ marginTop: 8, color: "#059669" }} className="small">
                    Last result: {ihpResult.value} (calculated at {new Date(ihpResult.timestamp).toLocaleString()})
                  </div>
                )}
              </div>

              <div className="card-footer ihp-calc-btn">
                <div />
                <div>
                  <button
                    onClick={calculateIhp}
                    disabled={isCalculating}
                    className="btn btn-primary"
                    style={isCalculating ? { opacity: 0.7, cursor: "wait" } : {}}
                  >
                    {isCalculating ? "Calculating..." : "Calculate IHP"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <div className="page-bottom" />

      {/* Maintain Master Data modal */}
      {isMaintaining && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20
        }}>
          <div onClick={closeMaintain} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.18 }} style={{
            background: "#fff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 16px 60px rgba(2,6,23,0.2)",
            maxWidth: 640,
            width: "100%",
            zIndex: 80
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Maintain Master Data</h3>
              <button onClick={closeMaintain} className="btn btn-ghost">✕</button>
            </div>

            <div style={{ marginTop: 12, color: "#374151" }}>
              This is a preview modal. Hook it to your master-data form or page in your app.
            </div>

            <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={closeMaintain} className="btn btn-ghost">Close</button>
              <button onClick={() => { alert("Saving (preview)"); closeMaintain(); }} className="btn btn-primary">Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
