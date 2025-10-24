import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validatePartExists, getPartNameByNumber } from "./data/PartSampleData";
import { pairedPartData, isLeftPartPaired, isRightPartPaired } from "./data/PairedPart";

/**
 * PartPairingPage - Manage part number pairings between systems
 * Allows users to match parts from different sources (CMD, SAP, IFAST)
 */
export default function PartPairingPage() {
  const navigate = useNavigate();
  
  // Use PairedPart data as the source for the table
  const [pairings, setPairings] = useState([...pairedPartData]);

  const [editingId, setEditingId] = useState(null);
  const [editLeftPart, setEditLeftPart] = useState("");
  const [editLeftPartName, setEditLeftPartName] = useState("");
  const [editRightPart, setEditRightPart] = useState("");
  const [editRightPartName, setEditRightPartName] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const validatePairing = (leftPart, rightPart, currentId = null) => {
    const errors = {};
    
    // Check if left part exists in PartSampleData (for new part validation)
    if (leftPart && !validatePartExists(leftPart)) {
      errors.leftPart = `Part number "${leftPart}" not found in master data`;
    }
    
    // Check if right part exists in PartSampleData (for new part validation)
    if (rightPart && !validatePartExists(rightPart)) {
      errors.rightPart = `Part number "${rightPart}" not found in master data`;
    }
    
    // Check if left part is already paired (against PairedPart data)
    if (leftPart && isLeftPartPaired(leftPart, currentId)) {
      errors.leftPart = `Part number "${leftPart}" is already used as LEFT part in another pairing`;
    }
    
    // Check if right part is already paired (against PairedPart data)
    if (rightPart && isRightPartPaired(rightPart, currentId)) {
      errors.rightPart = `Part number "${rightPart}" is already used as RIGHT part in another pairing`;
    }
    
    return errors;
  };

  const handleEdit = (id, leftPart, leftPartName, rightPart, rightPartName) => {
    setEditingId(id);
    setEditLeftPart(leftPart);
    setEditLeftPartName(leftPartName);
    setEditRightPart(rightPart);
    setEditRightPartName(rightPartName);
    setValidationErrors({});
  };

  const handleSave = (id) => {
    // Validate before saving
    const errors = validatePairing(editLeftPart, editRightPart, id);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return; // Don't save if there are validation errors
    }
    
    // Auto-populate part names from master data if they exist
    const leftPartName = editLeftPartName || getPartNameByNumber(editLeftPart);
    const rightPartName = editRightPartName || getPartNameByNumber(editRightPart);
    
    setPairings(pairings.map(pair => 
      pair.id === id 
        ? { 
            ...pair, 
            leftPart: editLeftPart,
            leftPartName: leftPartName,
            rightPart: editRightPart,
            rightPartName: rightPartName,
            status: (editLeftPart && editRightPart) ? "Active" : "Pending",
            lastModified: new Date().toISOString().split('T')[0]
          }
        : pair
    ));
    setEditingId(null);
    setEditLeftPart("");
    setEditLeftPartName("");
    setEditRightPart("");
    setEditRightPartName("");
    setValidationErrors({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditLeftPart("");
    setEditLeftPartName("");
    setEditRightPart("");
    setEditRightPartName("");
    setValidationErrors({});
  };

  const handleAddNew = () => {
    // Don't allow adding new record if currently editing
    if (editingId !== null) {
      alert("Please save or cancel the current edit before adding a new record.");
      return;
    }
    
    const newId = Math.max(...pairings.map(p => p.id)) + 1;
    const newPairing = {
      id: newId,
      leftPart: "",
      leftPartName: "",
      rightPart: "",
      rightPartName: "",
      status: "Pending",
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    // Add new row at the top of the list
    setPairings([newPairing, ...pairings]);
    
    // Immediately start editing the new row
    setEditingId(newId);
    setEditLeftPart("");
    setEditLeftPartName("");
    setEditRightPart("");
    setEditRightPartName("");
    setValidationErrors({});
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this pairing?")) {
      setPairings(pairings.filter(pair => pair.id !== id));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>Part Pairing Management</h1>
            <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
              Manage part number mappings between different systems (CMD, SAP, IFAST)
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button 
              onClick={handleAddNew}
              disabled={editingId !== null}
              className="btn btn-ghost"
              style={{
                opacity: editingId !== null ? 0.5 : 1,
                cursor: editingId !== null ? "not-allowed" : "pointer"
              }}
              title={editingId !== null ? "Save or cancel current edit before adding new record" : "Add new part pairing"}
            >
              + Add New
            </button>
            <button className="btn btn-ghost" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => alert("Save changes (preview)")}
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(2, 1fr)", 
          gap: 16, 
          marginBottom: 24 
        }}>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>{pairings.filter(p => p.status === "Active").length}</div>
            <div style={statLabelStyle}>Active Pairings</div>
          </div>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>{pairings.length}</div>
            <div style={statLabelStyle}>Total Parts</div>
          </div>
        </div>

        {/* Main Table */}
        <div style={{ 
          border: "1px solid rgba(0,0,0,0.1)", 
          borderRadius: 8, 
          overflow: "hidden",
          backgroundColor: "white"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={headerStyle}>Rec No</th>
                <th style={headerStyle}>LEFT Part</th>
                <th style={headerStyle}>RIGHT Part</th>
                <th style={headerStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pairings.map((pair, index) => (
                <tr key={pair.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <td style={cellStyle}>
                    <div style={{ 
                      fontWeight: 500, 
                      fontSize: 13,
                      color: "#374151",
                      textAlign: "center"
                    }}>
                      {index + 1}
                    </div>
                  </td>
                  <td style={cellStyle}>
                    {editingId === pair.id ? (
                      <div>
                        <input
                          type="text"
                          value={editLeftPart}
                          onChange={(e) => {
                            setEditLeftPart(e.target.value);
                            // Auto-populate part name when part number changes
                            const partName = getPartNameByNumber(e.target.value);
                            if (partName) {
                              setEditLeftPartName(partName);
                            }
                            // Clear validation errors when user types
                            if (validationErrors.leftPart) {
                              setValidationErrors(prev => ({ ...prev, leftPart: null }));
                            }
                          }}
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: validationErrors.leftPart ? "1px solid #ef4444" : "1px solid #007bff",
                            borderRadius: 4,
                            fontFamily: "monospace",
                            fontSize: 12,
                            marginBottom: 4
                          }}
                          placeholder="Part Number"
                        />
                        {validationErrors.leftPart && (
                          <div style={{ 
                            color: "#ef4444", 
                            fontSize: 10, 
                            marginBottom: 4,
                            lineHeight: 1.2
                          }}>
                            {validationErrors.leftPart}
                          </div>
                        )}
                        <input
                          type="text"
                          value={editLeftPartName}
                          readOnly
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid #d1d5db",
                            borderRadius: 4,
                            fontSize: 11,
                            backgroundColor: "#f9fafb",
                            color: "#6b7280"
                          }}
                          placeholder="Part Name (auto-filled)"
                        />
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontFamily: "monospace", fontWeight: 500, fontSize: 13 }}>
                          {pair.leftPart}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                          {pair.leftPartName}
                        </div>
                      </div>
                    )}
                  </td>
                  <td style={cellStyle}>
                    {editingId === pair.id ? (
                      <div>
                        <input
                          type="text"
                          value={editRightPart}
                          onChange={(e) => {
                            setEditRightPart(e.target.value);
                            // Auto-populate part name when part number changes
                            const partName = getPartNameByNumber(e.target.value);
                            if (partName) {
                              setEditRightPartName(partName);
                            }
                            // Clear validation errors when user types
                            if (validationErrors.rightPart) {
                              setValidationErrors(prev => ({ ...prev, rightPart: null }));
                            }
                          }}
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: validationErrors.rightPart ? "1px solid #ef4444" : "1px solid #007bff",
                            borderRadius: 4,
                            fontFamily: "monospace",
                            fontSize: 12,
                            marginBottom: 4
                          }}
                          placeholder="Part Number"
                        />
                        {validationErrors.rightPart && (
                          <div style={{ 
                            color: "#ef4444", 
                            fontSize: 10, 
                            marginBottom: 4,
                            lineHeight: 1.2
                          }}>
                            {validationErrors.rightPart}
                          </div>
                        )}
                        <input
                          type="text"
                          value={editRightPartName}
                          readOnly
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid #d1d5db",
                            borderRadius: 4,
                            fontSize: 11,
                            backgroundColor: "#f9fafb",
                            color: "#6b7280"
                          }}
                          placeholder="Part Name (auto-filled)"
                        />
                      </div>
                    ) : (
                      <div>
                        <div style={{ 
                          fontFamily: "monospace", 
                          fontWeight: 500,
                          fontSize: 13,
                          color: pair.rightPart ? "#000" : "#999"
                        }}>
                          {pair.rightPart || "Not assigned"}
                        </div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                          {pair.rightPartName || (pair.rightPart ? "Unknown part name" : "Not assigned")}
                        </div>
                      </div>
                    )}
                  </td>
                  <td style={cellStyle}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {editingId === pair.id ? (
                        <>
                          <button
                            onClick={() => handleSave(pair.id)}
                            style={actionButtonStyle("#10b981")}
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            style={actionButtonStyle("#6b7280")}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(pair.id, pair.leftPart, pair.leftPartName, pair.rightPart, pair.rightPartName)}
                            style={actionButtonStyle("#3b82f6")}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(pair.id)}
                            style={actionButtonStyle("#ef4444")}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: 16, 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          fontSize: 13,
          color: "#6b7280"
        }}>
          <div>
            Showing {pairings.length} part pairings
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={() => alert("Export (preview)")}>
              Export
            </button>
            <button className="btn btn-ghost" onClick={() => alert("Import (preview)")}>
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const statCardStyle = {
  padding: 16,
  backgroundColor: "white",
  border: "1px solid rgba(0,0,0,0.1)",
  borderRadius: 8,
  textAlign: "center"
};

const statNumberStyle = {
  fontSize: 24,
  fontWeight: 600,
  color: "#1f2937"
};

const statLabelStyle = {
  fontSize: 12,
  color: "#6b7280",
  marginTop: 4
};

const headerStyle = {
  padding: "12px 16px",
  textAlign: "left",
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  borderBottom: "1px solid rgba(0,0,0,0.1)"
};

const cellStyle = {
  padding: "12px 16px",
  fontSize: 13,
  color: "#1f2937"
};

const actionButtonStyle = (color) => ({
  padding: "4px 8px",
  fontSize: 11,
  border: `1px solid ${color}`,
  borderRadius: 4,
  backgroundColor: "white",
  color: color,
  cursor: "pointer"
});