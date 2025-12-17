// src/App.jsx
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MasterDataModal from "./MasterDataModal";
import DownloadModal from "./DownloadModal";
import templateIcon from './assets/template.png';
import './App.css';

const fileManifest = {
  cmd: [
    { name: "CMD_Report_2023_10_22.csv", uploadDate: "2023-10-22T10:00:00Z" },
    { name: "CMD_Report_2023_10_21.csv", uploadDate: "2023-10-21T10:00:00Z" },
  ],
  ifast: [
    { name: "IFAST_Data_2023_10_22.csv", uploadDate: "2023-10-22T11:00:00Z" },
  ],
  sap: [
    { name: "SAP_Export_2023_10_22.csv", uploadDate: "2023-10-22T12:00:00Z" },
  ],
  process: [
    { name: "Process_Cost_2023_10.csv", uploadDate: "2023-10-22T12:00:00Z" },
    { name: "Process_Cost_2023_12.csv", uploadDate: "2023-12-22T12:00:00Z" },
  ],
  material: [
    { name: "Material_Cost_2023_10.csv", uploadDate: "2023-10-22T12:00:00Z" },
  ],
};

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
  const [currentModalType, setCurrentModalType] = useState("");

  const latestProcessFile = useMemo(() => {
    const allFiles = [...(fileManifest.process || []), ...processFiles];
    if (allFiles.length === 0) return null;
    // Sort by date descending to find the latest
    allFiles.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    return allFiles[0];
  }, [processFiles]);

  const latestMaterialFile = useMemo(() => {
    const allFiles = [...(fileManifest.material || []), ...materialFiles];
    if (allFiles.length === 0) return null;
    // Sort by date descending to find the latest
    allFiles.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    return allFiles[0];
  }, [materialFiles]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  function handleDeleteFile(fileName) {
    // This is a mock deletion. In a real app, you'd also make an API call.
    console.log(`Deleting ${fileName} from ${currentModalType}`);
    if (currentModalType === 'process') {
      setProcessFiles(prevFiles => prevFiles.filter(f => f.name !== fileName));
    } else if (currentModalType === 'material') {
      setMaterialFiles(prevFiles => prevFiles.filter(f => f.name !== fileName));
    }
    // Note: This doesn't delete from fileManifest, only from uploaded files state.
    // To "delete" from the modal, we can filter the downloadableFiles state
    setDownloadableFiles(prevFiles => prevFiles.filter(f => f.name !== fileName));
  }

  function downloadSource(source) {
    const files = fileManifest[source.id] || [];
    openDownloadModal(source.id, files);
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

  function openDownloadModal(type, files) {
    setDownloadableFiles(files);
    setCurrentModalType(type);
    if (type === 'material') {
      setDownloadModalTitle("Download Material Cost Files");
    } else if (type === 'process') {
      setDownloadModalTitle("Download Process Cost Files");
    } else {
      setDownloadModalTitle(`Download ${type.toUpperCase()} Files`);
    }
    setIsDownloadModalOpen(true);
  }

  // download process cost sample or previously uploaded process file
  function downloadProcessCost() {
    const files = [...(fileManifest.process || []), ...processFiles];
    openDownloadModal('process', files);
  }

  function downloadTemplate(type) {
    let fileName = "";
    let csvContent;

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
      <header className="app-header">
        <div className="app-header-left">
          <h1>Dashboard IH Cost</h1>
           <p>Overview of source syncs and master-data tools</p>
         </div>
        <div className="header-actions">
          <button onClick={handleLogout} className="btn btn-ghost" style={{ marginRight: '30px' }}>Logout</button>
        </div>
       </header>

      <main>
        <section>
          <h2 className="section-title">Data Synchronization</h2>

          <div
            className="grid-5"
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
                    Status: <strong className="status-ok">OK</strong>
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
              className="card arrow-card"
            >
              ➜
            </motion.div>
            
            {/* Synchronize Part List Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.1 }}
              className="card sync-card"
            >
              <div>
                <div className="title">Synchronize Part List</div>
                <div className="meta">Combine data from CMD, SAP, and IFAST</div>
              </div>
            
              <div className="card-footer">
                <div />
                <div className="card-actions">
                  <button
                    className="btn btn-primary sync-button"
                    onClick={synchronize}
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
          >
            {/* Process Cost Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.02 }}
              className="card"
            >
              <div>
                <div className="card-title-flex">
                  <div className="title">Process Cost</div>
                  <a href="#" onClick={(e) => { e.preventDefault(); downloadTemplate('process'); }} className="template-link">
                    <img src={templateIcon} alt="Download Template" />
                    <span>Template</span>
                  </a>
                </div>
                <div className="meta">
                  Last Update: <span>{latestProcessFile ? new Date(latestProcessFile.uploadDate).toLocaleDateString('en-CA') : '-'}</span>
                </div>
                <div className="small card-meta-margin">
                  Labor, FOH, depreciation, and other processing costs used in calculations.
                </div>
              </div>
            
              <div className="card-footer">
                <div className="small">
                  {latestProcessFile ? (
                    <strong className="status-ok">Ready</strong>
                  ) : (
                    <strong className="status-warning">Upload required</strong>
                  )}
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
                    className="btn btn-ghost upload-label"
                  >
                    Upload
                  </label>
                  <button
                    onClick={downloadProcessCost}
                    className="btn btn-primary"
                    disabled={!latestProcessFile}
                    style={!latestProcessFile ? { opacity: 0.5, cursor: "not-allowed" } : {}}
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
                <div className="card-title-flex">
                  <div className="title">Material Cost</div>
                  <a href="#" onClick={(e) => { e.preventDefault(); downloadTemplate('material'); }} className="template-link">
                    <img src={templateIcon} alt="Download Template" />
                    <span>Template</span>
                  </a>
                </div>
                <div className="meta">
                  Last Update: <span>{latestMaterialFile ? new Date(latestMaterialFile.uploadDate).toLocaleDateString('en-CA') : '-'}</span>
                </div>
                <div className="small card-meta-margin">
                  Raw material costs, including prices, quantities, and supplier information.
                </div>
              </div>
            
              <div className="card-footer">
                <div className="small">
                  {latestMaterialFile ? (
                    <strong className="status-ok">Ready</strong>
                  ) : (
                    <strong className="status-warning">Upload required</strong>
                  )}
                </div>
                <div className="card-actions">
                  {/* Material Cost: Upload File */}
                  <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    id="material-cost-upload"
                  />
                  <label
                    htmlFor="material-cost-upload"
                    className="btn btn-ghost upload-label"
                  >
                    Upload
                  </label>
                  <button
                    onClick={() => navigate("/casting-material")}
                    className="btn btn-primary"
                    disabled={!latestMaterialFile}
                    style={!latestMaterialFile ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                  >
                    Calculate
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Arrow Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.06 }}
              className="card arrow-card"
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
                  <div className="small ihp-result">
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

          <div className="grid-2">
            <motion.div
              className="card master-card"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.04 }}
            >
              <div>
                <div className="title">Master Assumption</div>
                <div className="meta">Last Period: <span>{masterData.lastPeriod}</span></div>
                <div className="small card-meta-margin">
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
                <div className="small card-meta-margin">
                  Manage part number mappings between CMD, SAP, and IFAST systems. Define equivalency relationships and maintain cross-reference tables.
                </div>
              </div>

              <div className="card-footer">
                <div className="small">
                  Status: <strong className="status-ok">Ready</strong>
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
        onDelete={handleDeleteFile}
      />
    </div>
  );
}