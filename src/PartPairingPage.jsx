import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PartPairingPage - Manage part number pairings between systems
 * Allows users to match parts from different sources (CMD, SAP, IFAST)
 */
export default function PartPairingPage() {
  const navigate = useNavigate();
  
  // Sample data for part pairings
  const [pairings, setPairings] = useState([
    { 
      id: 1, 
      leftPart: "51011-KK050", 
      leftPartName: "RAIL SUB-ASSY, FRAME SIDE, RH",
      rightPart: "CMD-001", 
      rightPartName: "RAIL ASSEMBLY RIGHT SIDE",
      status: "Active" 
    },
    { 
      id: 2, 
      leftPart: "51012-KK050", 
      leftPartName: "RAIL SUB-ASSY, FRAME SIDE, LH",
      rightPart: "CMD-002", 
      rightPartName: "RAIL ASSEMBLY LEFT SIDE",
      status: "Active" 
    },
    { 
      id: 3, 
      leftPart: "51201-KK010", 
      leftPartName: "CROSSMEMBER SUB-ASSY, FRAME, NO.1",
      rightPart: "SAP-A001", 
      rightPartName: "FRAME CROSSMEMBER TYPE A",
      status: "Active" 
    },
    { 
      id: 4, 
      leftPart: "51205-KK010", 
      leftPartName: "AIR CLEANER ASSY",
      rightPart: "IFAST-B123", 
      rightPartName: "AIR FILTER ASSEMBLY",
      status: "Active" 
    },
    { 
      id: 5, 
      leftPart: "51206-KK020", 
      leftPartName: "CROSSMEMBER SUB-ASSY, FRAME, NO.6",
      rightPart: "", 
      rightPartName: "",
      status: "Pending" 
    },
    { 
      id: 6, 
      leftPart: "51230-KK060", 
      leftPartName: "CROSSMEMBER ASSY, FRAME, NO.3",
      rightPart: "", 
      rightPartName: "",
      status: "Pending" 
    },
    { 
      id: 7, 
      leftPart: "53301-0K150", 
      leftPartName: "HOOD SUB-ASSY",
      rightPart: "CMD-007", 
      rightPartName: "HOOD ASSEMBLY",
      status: "Active" 
    },
    { 
      id: 8, 
      leftPart: "53801-0K080", 
      leftPartName: "FENDER SUB-ASSY, FR RH",
      rightPart: "", 
      rightPartName: "",
      status: "Pending" 
    },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editLeftPart, setEditLeftPart] = useState("");
  const [editLeftPartName, setEditLeftPartName] = useState("");
  const [editRightPart, setEditRightPart] = useState("");
  const [editRightPartName, setEditRightPartName] = useState("");

  const handleEdit = (id, leftPart, leftPartName, rightPart, rightPartName) => {
    setEditingId(id);
    setEditLeftPart(leftPart);
    setEditLeftPartName(leftPartName);
    setEditRightPart(rightPart);
    setEditRightPartName(rightPartName);
  };

  const handleSave = (id) => {
    setPairings(pairings.map(pair => 
      pair.id === id 
        ? { 
            ...pair, 
            leftPart: editLeftPart,
            leftPartName: editLeftPartName,
            rightPart: editRightPart,
            rightPartName: editRightPartName,
            status: (editLeftPart && editRightPart) ? "Active" : "Pending" 
          }
        : pair
    ));
    setEditingId(null);
    setEditLeftPart("");
    setEditLeftPartName("");
    setEditRightPart("");
    setEditRightPartName("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditLeftPart("");
    setEditLeftPartName("");
    setEditRightPart("");
    setEditRightPartName("");
  };

  const handleAddNew = () => {
    const newId = Math.max(...pairings.map(p => p.id)) + 1;
    setPairings([...pairings, {
      id: newId,
      leftPart: `NEW-${newId.toString().padStart(3, '0')}`,
      leftPartName: `NEW PART ${newId}`,
      rightPart: "",
      rightPartName: "",
      status: "Pending"
    }]);
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
              className="btn btn-ghost"
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
                <th style={headerStyle}>LEFT Part</th>
                <th style={headerStyle}>RIGHT Part</th>
                <th style={headerStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pairings.map((pair) => (
                <tr key={pair.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <td style={cellStyle}>
                    {editingId === pair.id ? (
                      <div>
                        <input
                          type="text"
                          value={editLeftPart}
                          onChange={(e) => setEditLeftPart(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid #007bff",
                            borderRadius: 4,
                            fontFamily: "monospace",
                            fontSize: 12,
                            marginBottom: 4
                          }}
                          placeholder="Part Number"
                        />
                        <input
                          type="text"
                          value={editLeftPartName}
                          onChange={(e) => setEditLeftPartName(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid #007bff",
                            borderRadius: 4,
                            fontSize: 11
                          }}
                          placeholder="Part Name"
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
                          onChange={(e) => setEditRightPart(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid #007bff",
                            borderRadius: 4,
                            fontFamily: "monospace",
                            fontSize: 12,
                            marginBottom: 4
                          }}
                          placeholder="Part Number"
                        />
                        <input
                          type="text"
                          value={editRightPartName}
                          onChange={(e) => setEditRightPartName(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid #007bff",
                            borderRadius: 4,
                            fontSize: 11
                          }}
                          placeholder="Part Name"
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