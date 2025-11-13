// src/App.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MasterDataModal from "./MasterDataModal";
import DownloadModal from "./DownloadModal";
import templateIcon from './assets/template.png';

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
  
  // State for uploaded files
  const [materialFiles, setMaterialFiles] = useState([]);
  const [processFiles, setProcessFiles] = useState([]);

  // State for download modal
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadableFiles, setDownloadableFiles] = useState([]);
  const [downloadModalTitle, setDownloadModalTitle] = useState("");

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

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file && (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      const newFile = {
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
      };
      setMaterialFiles(prevFiles => [...prevFiles, newFile]);
      console.log("File uploaded:", file.name);
      // Here you would typically upload the file to your server
    } else {
      alert("Please select a valid Excel file (.xls or .xlsx)");
    }
  }

  // handler for Process Cost upload
  function handleProcessFileUpload(event) {
    const file = event.target.files[0];
    if (file && (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      const newFile = {
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
      };
      setProcessFiles(prevFiles => [...prevFiles, newFile]);
      console.log("Process file uploaded:", file.name);
      // upload logic for process cost file goes here
    } else {
      alert("Please select a valid Excel file (.xls or .xlsx)");
    }
  }

  function openDownloadModal(type) {
    if (type === 'material') {
      setDownloadableFiles(materialFiles);
      setDownloadModalTitle("Download Material Cost Files");
    } else if (type === 'process') {
      setDownloadableFiles(processFiles);
      setDownloadModalTitle("Download Process Cost Files");
    }
    setIsDownloadModalOpen(true);
  }

  // download process cost sample or previously uploaded process file
  function downloadProcessCost() {
    openDownloadModal('process');
  }

  function downloadMaterialData() {
    openDownloadModal('material');
  }

  function downloadTemplate(type) {
    let csvContent, fileName;

    if (type === 'process') {
      csvContent = `Process,CostType,Amount,Currency\nLabor,Direct,0,USD\nFOH,Overhead,0,USD`;
      fileName = 'process-cost-template.csv';
    } else if (type === 'material') {
      csvContent = `Part Number,Material Type,Cost per Unit,Currency\nPART-001,Steel,0,USD`;
      fileName = 'material-cost-template.csv';
    } else {
      return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openPartPairing() {
    navigate("/part-pairing");
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
      <style>{`
        .template-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          color: #6b7280;
        }
        .template-link:hover {
          color: #1d4ed8;
        }
        .template-link img {
          width: 16px;
          height: 16px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }
        .template-link:hover img {
          opacity: 1;
        }
        .template-link span {
          font-size: 10px;
          margin-top: 2px;
          transition: color 0.2s;
        }
      `}</style>
      <header className="app-header">
        <div className="app-header-left">
          <h1>Dashboard IH Cost</h1>
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
          <h2 className="section-title">Calculation</h2>

          <div 
            className="grid-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
              alignItems: "stretch",
            }}
          >
            {/* Process Cost Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.02 }}
              className="card"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="title">Process Cost</div>
                  <a href="#" onClick={(e) => { e.preventDefault(); downloadTemplate('process'); }} className="template-link">
                    <img src={templateIcon} alt="Download Template" />
                    <span>Template</span>
                  </a>
                </div>
                <div className="meta">
                  {processFiles.length > 0 ? (
                    <>Last Update: <span>{new Date(processFiles[processFiles.length - 1].uploadDate).toLocaleDateString('en-CA')}</span></>
                  ) : (
                    <>Last Update: <span>-</span></>
                  )}
                </div>
                <div style={{ marginTop: 10 }} className="small">
                  Labor, FOH, depreciation, and other processing costs used in calculations.
                </div>
              </div>
            
              <div className="card-footer">
                <div className="small">
                  <strong style={{ color: "#059669" }}>Ready</strong>
                </div>
                <div className="card-actions">
                  {/* Process Cost: Upload File */}
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleProcessFileUpload}
                    style={{ display: "none" }}
                    id="process-cost-upload"
                  />
                  <label
                    htmlFor="process-cost-upload"
                    className="btn btn-ghost"
                    style={{ cursor: "pointer" }}
                  >
                    Upload
                  </label>
                  <button
                    onClick={downloadProcessCost}
                    className="btn btn-primary"
                    disabled={processFiles.length === 0}
                    style={processFiles.length === 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  >
                    Download
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Material Cost Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.04 }}
              className="card"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="title">Material Cost</div>
                  <a href="#" onClick={(e) => { e.preventDefault(); downloadTemplate('material'); }} className="template-link">
                    <img src={templateIcon} alt="Download Template" />
                    <span>Template</span>
                  </a>
                </div>
                <div className="meta">
                  {materialFiles.length > 0 ? (
                    <>Last Update: <span>{new Date(materialFiles[materialFiles.length - 1].uploadDate).toLocaleDateString('en-CA')}</span></>
                  ) : (
                    <>Last Update: <span>-</span></>
                  )}
                </div>
                {materialFiles.length > 0 && (
                  <div className="small" style={{ marginTop: 8 }}>
                    File: {materialFiles[materialFiles.length - 1].name}
                  </div>
                )}
              </div>
            
              <div className="card-footer">
                <div className="small">
                  {materialFiles.length > 0 ? (
                    <strong style={{ color: "#059669" }}>Ready</strong>
                  ) : (
                    <strong style={{ color: "#dc2626" }}>Upload Required</strong>
                  )}
                </div>
                <div className="card-actions">
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    id="material-cost-upload"
                  />
                  <label
                    htmlFor="material-cost-upload"
                    className="btn btn-ghost"
                    style={{ cursor: "pointer" }}
                  >
                    Upload
                  </label>
                  <button
                    onClick={downloadMaterialData}
                    className="btn btn-primary"
                    disabled={materialFiles.length === 0}
                    style={materialFiles.length === 0 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  >
                    Download
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Arrow Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.06 }}
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

            {/* IHP Card */}
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

        <section>
          <h2 className="section-title">Master Data</h2>

          <div className="grid-2" style={{ alignItems: "start" }}>
            <motion.div
              className="card master-card"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.04 }}
            >
              <div>
                <div className="title">Master Assumption</div>
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
                    Maintain Master Assumption
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="card"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.08 }}
            >
              <div>
                <div className="title">Part Pairing Management</div>
                <div className="meta">Cross-system part mapping and relationships</div>
                <div style={{ marginTop: 10 }} className="small">
                  Manage part number mappings between CMD, SAP, and IFAST systems. Define equivalency relationships and maintain cross-reference tables.
                </div>
              </div>

              <div className="card-footer">
                <div className="small">
                  Status: <strong style={{ color: "#059669" }}>Ready</strong>
                </div>
                <div className="card-actions">
                  <button className="btn btn-primary" onClick={openPartPairing}>
                    Manage Pairings
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

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        files={downloadableFiles}
        title={downloadModalTitle}
      />
    </div>
  );
}