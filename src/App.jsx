// src/App.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MasterDataModal from "./MasterDataModal";

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
  const navigate = useNavigate();

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
  
  function HeaderActions() {
    const navigate = useNavigate();
    return (
      <div className="header-actions">
        <button className="btn btn-ghost" onClick={() => navigate("/sync")}>Synchronize Part List</button>        
      </div>
    );
  }  
  
  function synchronize() {
    // Optional: show loading or log
    console.log("Navigating to Synchronize Part List page...");
    navigate("/sync");
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-left">
          <h1>Data Dashboard</h1>
          <p>Overview of source syncs and master-data tools</p>
        </div>
      </header>

      <main>
        <section>
          <h2 className="section-title">Data Synchronization</h2>

          <div
            className="grid-3"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "16px",
              alignItems: "stretch",
            }}
          >
            {/* CMD / IFAST / SAP cards */}
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
                  <div className="small">
                    Status: <strong style={{ color: "#059669" }}>OK</strong>
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => downloadSource(s)}
                      className="btn btn-primary"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Arrow Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.05 }}
              className="card"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                color: "#94a3b8",
                minHeight: "auto",
                height: "fit-content",
                width: "fit-content",
                justifySelf: "center",
                alignSelf: "center",
                padding: "15px",
                margin: "15px",
              }}
            >
              ➜
            </motion.div>
            
            {/* Synchronize Part List Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.1 }}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div className="title">Synchronize Part List</div>
                <div className="meta">Combine data from CMD, SAP, and IFAST</div>
              </div>
            
              <div className="card-footer">
                <div />
                <div className="card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={synchronize}
                    style={{ minWidth: 120 }}
                  >
                    Synchronize
                  </button>
                </div>
              </div>
            </motion.div>
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
                    onClick={() => navigate("/ppr")}
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
      <MasterDataModal 
        open={isMaintaining} 
        onClose={closeMaintain}
        onSave={(data) => {
          console.log("Master data saved:", data);
          // Handle the saved data here if needed
        }}
      />
    </div>
  );
}
